const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const ALLOWED_SOURCES = [
  { domain: 'w3schools.com', name: 'W3Schools', baseUrl: 'https://www.w3schools.com/java/' },
  { domain: 'docs.oracle.com', name: 'Oracle Docs', baseUrl: 'https://docs.oracle.com/en/java/' },
  { domain: 'baeldung.com', name: 'Baeldung', baseUrl: 'https://www.baeldung.com/' },
  { domain: 'geeksforgeeks.org', name: 'GeeksforGeeks', baseUrl: 'https://www.geeksforgeeks.org/java/' },
];

router.post('/', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'query is required' });
  }

  try {
    // Try W3Schools first (most beginner-friendly)
    const searchTerm = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const w3Url = `https://www.w3schools.com/java/java_${searchTerm.replace(/\s+/g, '_')}.asp`;

    const response = await fetch(w3Url, {
      headers: { 'User-Agent': 'MedJava/1.0 (Educational)' },
      timeout: 5000
    });

    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract main content
      const mainContent = $('#main .w3-main, .w3-col').first();
      const title = $('h1').first().text().trim();
      const paragraphs = [];

      mainContent.find('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 20 && paragraphs.length < 3) {
          paragraphs.push(text);
        }
      });

      if (paragraphs.length > 0) {
        return res.json({
          source: 'W3Schools',
          url: w3Url,
          title: title || searchTerm,
          excerpt: paragraphs.join('\n\n')
        });
      }
    }

    // Fallback: return no result
    res.json({
      source: 'Web',
      url: '',
      title: query,
      excerpt: 'No web results found for this query. Try asking the AI tutor directly.'
    });

  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

module.exports = router;
