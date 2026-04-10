/* ============================================
   MedJava — Web Scraper Client
   Token-saving layer for factual lookups
   ============================================ */

const MJScraper = (() => {
  const FACTUAL_MARKERS = [
    'what does', 'what is the return type', 'what is the syntax',
    'how do i import', 'which package', 'list of methods',
    'documentation for', 'official docs', 'what method',
    'what class', 'api reference'
  ];

  const PEDAGOGICAL_MARKERS = [
    "i don't understand", "i'm confused", 'explain again',
    'rebuild', 'show me visually', 'simulate', 'why',
    "i'm not satisfied", 'deeper', 'analogy',
    'step by step', 'break it down', 'confused'
  ];

  function classifyQuestion(text) {
    const lower = text.toLowerCase();
    if (PEDAGOGICAL_MARKERS.some(m => lower.includes(m))) return 'pedagogical';
    if (FACTUAL_MARKERS.some(m => lower.includes(m))) return 'factual';
    return 'pedagogical'; // default to tutor
  }

  async function scrapeWeb(query) {
    const backendUrl = window.BACKEND_URL;
    if (!backendUrl) return null;

    try {
      const response = await fetch(`${backendUrl}/api/scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  function renderWebCard(data, container) {
    const card = document.createElement('div');
    card.className = 'mj-web-card';
    card.innerHTML = `
      <div class="d-flex align-items-center gap-2 mb-1">
        <i class="fas fa-globe" style="color: var(--mj-primary); font-size: 0.8rem;"></i>
        <a href="${data.url}" target="_blank" class="source-url">${data.source}</a>
      </div>
      <div class="excerpt">${data.excerpt}</div>
      <button class="btn btn-sm mj-btn-secondary" onclick="MJScraper.expandWithAI(this, '${encodeURIComponent(data.excerpt)}')">
        <i class="fas fa-wand-magic-sparkles"></i> Expand with AI
      </button>
    `;
    container.appendChild(card);
  }

  function expandWithAI(btn, encodedExcerpt) {
    const excerpt = decodeURIComponent(encodedExcerpt);
    const msg = `Based on this documentation excerpt, explain it to me using the MedJava teaching method:\n\n"${excerpt}"`;
    if (window.MJChat) {
      MJChat.sendMessage(msg);
    }
  }

  function isWebScrapeEnabled() {
    const toggle = document.getElementById('webScrapeToggle');
    return toggle ? toggle.checked : true;
  }

  return { classifyQuestion, scrapeWeb, renderWebCard, expandWithAI, isWebScrapeEnabled };
})();
