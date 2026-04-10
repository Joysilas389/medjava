/* ============================================
   MedJava — INNOVATIONS MODULE
   Features that have never existed in any
   Java learning platform before.
   ============================================ */

const MJInnovations = (() => {

  // ===== 1. CODE X-RAY — Hover any token to see what it does =====
  function enableCodeXRay() {
    document.addEventListener('mouseover', (e) => {
      const codeEl = e.target.closest('code');
      if (!codeEl || codeEl.closest('.medjava-sim-card')) return;
      // Add tooltip on hover for code tokens
    });
  }

  // ===== 2. CONFIDENCE TRACKER — After each topic, rate understanding =====
  function showConfidenceCheck(topicTitle) {
    const existing = document.querySelector('.mj-confidence');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'mj-confidence';
    el.innerHTML = `
      <div style="background:var(--mj-surface);border:1px solid var(--mj-border);border-radius:16px;padding:16px 20px;margin:16px auto;max-width:600px;box-shadow:var(--mj-shadow-lg)">
        <div style="font-weight:700;font-size:0.9rem;margin-bottom:8px;color:var(--mj-text)">
          <i class="fas fa-brain" style="color:var(--mj-primary)"></i> How well do you understand "${topicTitle}"?
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['😕 Not at all', '🤔 A little', '😊 Mostly', '🎯 Completely', '🔥 Could teach it'].map((label, i) =>
            `<button class="conf-btn" data-level="${i+1}" style="padding:6px 14px;border-radius:20px;border:1px solid var(--mj-border);background:var(--mj-surface-alt);color:var(--mj-text);font-size:0.78rem;cursor:pointer;transition:all 0.2s">${label}</button>`
          ).join('')}
        </div>
        <div id="confFeedback" style="margin-top:8px;font-size:0.82rem;color:var(--mj-muted);display:none"></div>
      </div>
    `;

    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    el.querySelectorAll('.conf-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const level = parseInt(btn.dataset.level);
        const topicId = MJChat.currentTopicId;

        // Save confidence
        const data = JSON.parse(localStorage.getItem('medjava-confidence') || '{}');
        data[topicId] = { level, topicTitle, date: new Date().toISOString() };
        localStorage.setItem('medjava-confidence', JSON.stringify(data));

        // Visual feedback
        el.querySelectorAll('.conf-btn').forEach(b => {
          b.style.opacity = b === btn ? '1' : '0.4';
          if (b === btn) {
            b.style.background = 'var(--mj-primary)';
            b.style.color = 'white';
            b.style.borderColor = 'var(--mj-primary)';
          }
        });

        const feedback = document.getElementById('confFeedback');
        const messages = [
          "No worries! Let's rebuild this from zero. Say 'Rebuild' to start over.",
          "Good start! Try asking for more examples or analogies.",
          "Great progress! Practice with a drill exercise to solidify it.",
          "Excellent! You've got this. Ready for the next topic!",
          "Outstanding, Dr. Agbesi! You've mastered this concept!"
        ];
        feedback.textContent = messages[level - 1];
        feedback.style.display = 'block';

        // If low confidence, auto-suggest rebuild
        if (level <= 2) {
          setTimeout(() => {
            MJChat.sendMessage("I rated my understanding as low. Please rebuild this topic from zero with a different approach — maybe a new analogy or a simpler example.");
          }, 1500);
        }
      });
    });
  }

  // ===== 3. LEARNING STREAK TRACKER =====
  function updateStreak() {
    const streakData = JSON.parse(localStorage.getItem('medjava-streak') || '{"days":0,"lastDate":""}');
    const today = new Date().toISOString().slice(0, 10);

    if (streakData.lastDate === today) return streakData; // Already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (streakData.lastDate === yesterday) {
      streakData.days += 1;
    } else if (streakData.lastDate !== today) {
      streakData.days = 1; // Reset streak
    }
    streakData.lastDate = today;
    localStorage.setItem('medjava-streak', JSON.stringify(streakData));
    return streakData;
  }

  function getStreakHTML() {
    const streak = updateStreak();
    const fire = streak.days >= 7 ? '🔥🔥🔥' : streak.days >= 3 ? '🔥🔥' : streak.days >= 1 ? '🔥' : '';
    return `<span style="font-size:0.78rem;font-weight:600">${fire} ${streak.days} day streak</span>`;
  }

  // ===== 4. SPACED REPETITION REVIEW QUEUE =====
  function addToReviewQueue(topicId, topicTitle) {
    const queue = JSON.parse(localStorage.getItem('medjava-review') || '[]');
    // Spaced repetition intervals: 1 day, 3 days, 7 days, 14 days, 30 days
    const intervals = [1, 3, 7, 14, 30];
    const existing = queue.find(q => q.topicId === topicId);

    if (existing) {
      existing.reviewCount = (existing.reviewCount || 0) + 1;
      const intervalIdx = Math.min(existing.reviewCount, intervals.length - 1);
      existing.nextReview = new Date(Date.now() + intervals[intervalIdx] * 86400000).toISOString();
    } else {
      queue.push({
        topicId, topicTitle,
        addedAt: new Date().toISOString(),
        nextReview: new Date(Date.now() + 86400000).toISOString(),
        reviewCount: 0
      });
    }
    localStorage.setItem('medjava-review', JSON.stringify(queue));
  }

  function getDueReviews() {
    const queue = JSON.parse(localStorage.getItem('medjava-review') || '[]');
    const now = new Date().toISOString();
    return queue.filter(q => q.nextReview <= now);
  }

  // ===== 5. MEDICAL JAVA FLASHCARDS =====
  function generateFlashcard(front, back, category) {
    const cards = JSON.parse(localStorage.getItem('medjava-flashcards') || '[]');
    cards.push({ id: Date.now(), front, back, category, created: new Date().toISOString(), lastReviewed: null, score: 0 });
    localStorage.setItem('medjava-flashcards', JSON.stringify(cards));
    return cards.length;
  }

  function showFlashcardDeck() {
    const cards = JSON.parse(localStorage.getItem('medjava-flashcards') || '[]');
    if (cards.length === 0) {
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:var(--mj-overlay);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML = `
        <div style="background:var(--mj-surface);border-radius:20px;padding:28px;max-width:380px;width:100%;box-shadow:var(--mj-shadow-xl);text-align:center">
          <div style="font-size:2.5rem;margin-bottom:12px">🃏</div>
          <h5 style="margin:0 0 8px;color:var(--mj-text);font-weight:700">No Flashcards Yet</h5>
          <p style="color:var(--mj-muted);font-size:0.88rem;line-height:1.5;margin-bottom:16px">
            After learning a topic, tap <strong>"📝 Make Cards"</strong> in the quick chips, or type:<br>
            <em>"Create 5 flashcards for this topic"</em><br>
            The AI will generate Q&A pairs that are automatically saved here.
          </p>
          <button onclick="this.closest('[style*=fixed]').remove()" style="padding:8px 24px;border-radius:16px;border:none;background:var(--mj-primary);color:white;cursor:pointer;font-weight:600;font-size:0.88rem">Got it</button>
        </div>
      `;
      document.body.appendChild(overlay);
      return;
    }

    // Shuffle
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    let idx = 0;
    let flipped = false;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:var(--mj-overlay);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px';

    function renderCard() {
      const card = shuffled[idx];
      overlay.innerHTML = `
        <div style="background:var(--mj-surface);border-radius:20px;padding:24px;max-width:400px;width:100%;box-shadow:var(--mj-shadow-xl);text-align:center">
          <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--mj-muted);margin-bottom:12px">${card.category || 'Java'} — Card ${idx + 1}/${shuffled.length}</div>
          <div id="fcContent" style="min-height:100px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;line-height:1.5;padding:16px;cursor:pointer;color:var(--mj-text)">
            ${flipped ? card.back : card.front}
          </div>
          <div style="font-size:0.75rem;color:var(--mj-muted);margin:8px 0">${flipped ? '' : 'Tap to reveal answer'}</div>
          <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
            <button id="fcPrev" style="padding:8px 18px;border-radius:16px;border:1px solid var(--mj-border);background:var(--mj-surface-alt);color:var(--mj-text);cursor:pointer;font-weight:600;font-size:0.82rem">← Prev</button>
            <button id="fcFlip" style="padding:8px 18px;border-radius:16px;border:none;background:var(--mj-primary);color:white;cursor:pointer;font-weight:600;font-size:0.82rem">${flipped ? 'Show Question' : 'Flip'}</button>
            <button id="fcNext" style="padding:8px 18px;border-radius:16px;border:none;background:linear-gradient(135deg,#16a34a,#15803d);color:white;cursor:pointer;font-weight:600;font-size:0.82rem">Next →</button>
          </div>
          <button id="fcClose" style="margin-top:12px;padding:6px 14px;border-radius:12px;border:1px solid var(--mj-border);background:transparent;color:var(--mj-muted);cursor:pointer;font-size:0.78rem">Close Deck</button>
        </div>
      `;

      overlay.querySelector('#fcContent').onclick = () => { flipped = !flipped; renderCard(); };
      overlay.querySelector('#fcFlip').onclick = () => { flipped = !flipped; renderCard(); };
      overlay.querySelector('#fcNext').onclick = () => { idx = (idx + 1) % shuffled.length; flipped = false; renderCard(); };
      overlay.querySelector('#fcPrev').onclick = () => { idx = (idx - 1 + shuffled.length) % shuffled.length; flipped = false; renderCard(); };
      overlay.querySelector('#fcClose').onclick = () => overlay.remove();
    }

    document.body.appendChild(overlay);
    renderCard();
  }

  // ===== 6. CODE CHALLENGE MODE =====
  function startCodeChallenge(difficulty) {
    if (!difficulty) {
      // Show difficulty picker
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:var(--mj-overlay);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px';
      overlay.innerHTML = `
        <div style="background:var(--mj-surface);border-radius:20px;padding:24px;max-width:350px;width:100%;box-shadow:var(--mj-shadow-xl);text-align:center">
          <div style="font-size:2rem;margin-bottom:8px">🎯</div>
          <h5 style="margin:0 0 12px;color:var(--mj-text);font-weight:700">Code Challenge</h5>
          <p style="color:var(--mj-muted);font-size:0.85rem;margin-bottom:16px">Choose your difficulty:</p>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="chDiff" data-d="easy" style="padding:12px;border-radius:12px;border:1px solid var(--mj-border);background:var(--mj-surface-alt);cursor:pointer;text-align:left">
              <span style="font-weight:700;color:#10b981">🟢 Easy</span>
              <span style="display:block;font-size:0.78rem;color:var(--mj-muted);margin-top:2px">Variables, printing, basic if/else</span>
            </button>
            <button class="chDiff" data-d="medium" style="padding:12px;border-radius:12px;border:1px solid var(--mj-border);background:var(--mj-surface-alt);cursor:pointer;text-align:left">
              <span style="font-weight:700;color:#f59e0b">🟡 Medium</span>
              <span style="display:block;font-size:0.78rem;color:var(--mj-muted);margin-top:2px">Loops, arrays, methods</span>
            </button>
            <button class="chDiff" data-d="hard" style="padding:12px;border-radius:12px;border:1px solid var(--mj-border);background:var(--mj-surface-alt);cursor:pointer;text-align:left">
              <span style="font-weight:700;color:#ef4444">🔴 Hard</span>
              <span style="display:block;font-size:0.78rem;color:var(--mj-muted);margin-top:2px">Classes, OOP, data structures</span>
            </button>
          </div>
          <button onclick="this.closest('[style*=fixed]').remove()" style="margin-top:12px;padding:6px 16px;border-radius:10px;border:1px solid var(--mj-border);background:transparent;color:var(--mj-muted);cursor:pointer;font-size:0.8rem">Cancel</button>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.querySelectorAll('.chDiff').forEach(btn => {
        btn.addEventListener('click', () => {
          overlay.remove();
          startCodeChallenge(btn.dataset.d);
        });
      });
      return;
    }

    const challenges = {
      easy: [
        { q: "Write a Java line that creates a variable called 'patientAge' and stores the number 45.", a: "int patientAge = 45;" },
        { q: "Write a println statement that outputs: Hello, Dr. Agbesi!", a: 'System.out.println("Hello, Dr. Agbesi!");' },
        { q: "Write an if statement that checks if temperature is greater than 38.0", a: "if (temperature > 38.0) {" },
      ],
      medium: [
        { q: "Write a while loop that runs while heartRate is above 100 and decreases it by 5 each time.", a: "while (heartRate > 100) {\n    heartRate = heartRate - 5;\n}" },
        { q: "Create a String array called 'wards' with 3 hospital ward names.", a: 'String[] wards = {"ICU", "Pediatrics", "Maternity"};' },
        { q: "Write a for loop that prints 'Checking bed' followed by numbers 1 to 10.", a: 'for (int i = 1; i <= 10; i++) {\n    System.out.println("Checking bed " + i);\n}' },
      ],
      hard: [
        { q: "Create a Patient class with name (String), age (int), and a constructor.", a: "public class Patient {\n    String name;\n    int age;\n    public Patient(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n}" },
        { q: "Write a method that takes a double[] of vital signs and returns the average.", a: "public static double average(double[] vitals) {\n    double sum = 0;\n    for (double v : vitals) sum += v;\n    return sum / vitals.length;\n}" },
      ]
    };

    const pool = challenges[difficulty] || challenges.easy;
    const challenge = pool[Math.floor(Math.random() * pool.length)];

    MJChat.sendMessage(
      `🎯 CODE CHALLENGE (${difficulty.toUpperCase()}):\n\n${challenge.q}\n\nI'll try to write the code, then you check my answer and explain what's right or wrong.`
    );
  }

  // ===== 7. DAILY LEARNING GOAL =====
  function getDailyGoal() {
    const data = JSON.parse(localStorage.getItem('medjava-daily-goal') || '{"target":3,"completed":0,"date":""}');
    const today = new Date().toISOString().slice(0, 10);
    if (data.date !== today) {
      data.completed = 0;
      data.date = today;
      localStorage.setItem('medjava-daily-goal', JSON.stringify(data));
    }
    return data;
  }

  function incrementDailyGoal() {
    const data = getDailyGoal();
    data.completed += 1;
    localStorage.setItem('medjava-daily-goal', JSON.stringify(data));

    if (data.completed >= data.target) {
      if (window.MJApp) window.MJApp.showToast('🎉 Daily goal reached! Great work, Dr. Agbesi!', 'success');
    }
    return data;
  }

  // ===== 8. LEARNING ANALYTICS DASHBOARD =====
  function showAnalytics() {
    const confidence = JSON.parse(localStorage.getItem('medjava-confidence') || '{}');
    const streak = JSON.parse(localStorage.getItem('medjava-streak') || '{"days":0}');
    const daily = getDailyGoal();
    const cards = JSON.parse(localStorage.getItem('medjava-flashcards') || '[]');
    const reviews = JSON.parse(localStorage.getItem('medjava-review') || '[]');

    // Count topics by confidence level
    const confCounts = [0, 0, 0, 0, 0];
    Object.values(confidence).forEach(c => { if (c.level >= 1 && c.level <= 5) confCounts[c.level - 1]++; });

    const totalTopics = Object.keys(confidence).length;
    const avgConfidence = totalTopics > 0 ? (Object.values(confidence).reduce((s, c) => s + c.level, 0) / totalTopics).toFixed(1) : '—';
    const dueReviews = getDueReviews().length;

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:var(--mj-overlay);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto';
    overlay.innerHTML = `
      <div style="background:var(--mj-surface);border-radius:20px;padding:24px;max-width:500px;width:100%;box-shadow:var(--mj-shadow-xl)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h5 style="margin:0;font-weight:800;color:var(--mj-text)"><i class="fas fa-chart-line" style="color:var(--mj-primary)"></i> Learning Analytics</h5>
          <button onclick="this.closest('[style*=fixed]').remove()" style="border:none;background:transparent;font-size:1.2rem;cursor:pointer;color:var(--mj-muted)">✕</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
          <div style="background:var(--mj-primary-subtle);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.8rem;font-weight:800;color:var(--mj-primary)">${streak.days}</div>
            <div style="font-size:0.75rem;color:var(--mj-muted);font-weight:600">Day Streak 🔥</div>
          </div>
          <div style="background:var(--mj-java-subtle);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.8rem;font-weight:800;color:var(--mj-java)">${daily.completed}/${daily.target}</div>
            <div style="font-size:0.75rem;color:var(--mj-muted);font-weight:600">Today's Topics</div>
          </div>
          <div style="background:var(--mj-success-subtle);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.8rem;font-weight:800;color:var(--mj-success)">${avgConfidence}</div>
            <div style="font-size:0.75rem;color:var(--mj-muted);font-weight:600">Avg Confidence /5</div>
          </div>
          <div style="background:var(--mj-danger-subtle);border-radius:12px;padding:14px;text-align:center">
            <div style="font-size:1.8rem;font-weight:800;color:var(--mj-danger)">${dueReviews}</div>
            <div style="font-size:0.75rem;color:var(--mj-muted);font-weight:600">Due Reviews</div>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <div style="font-size:0.78rem;font-weight:700;color:var(--mj-text);margin-bottom:6px">Confidence Distribution</div>
          <div style="display:flex;gap:4px;align-items:end;height:60px">
            ${confCounts.map((c, i) => {
              const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
              const labels = ['😕', '🤔', '😊', '🎯', '🔥'];
              const h = c > 0 ? Math.max(15, (c / Math.max(...confCounts, 1)) * 55) : 5;
              return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
                <div style="font-size:0.65rem;color:var(--mj-muted)">${c}</div>
                <div style="width:100%;height:${h}px;background:${colors[i]};border-radius:4px;transition:height 0.3s"></div>
                <div style="font-size:0.7rem">${labels[i]}</div>
              </div>`;
            }).join('')}
          </div>
        </div>

        <div style="font-size:0.78rem;color:var(--mj-muted);margin-top:8px">
          <i class="fas fa-clone"></i> ${cards.length} flashcards created &nbsp;
          <i class="fas fa-rotate"></i> ${reviews.length} topics in review queue
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // ===== 9. VOICE INPUT (Speech-to-Text) =====
  function startVoiceInput(targetInput) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (window.MJApp) window.MJApp.showToast('Voice input not supported on this browser.', 'warning');
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-GH'; // English (Ghana)
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (e) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      targetInput.value = transcript;
      targetInput.dispatchEvent(new Event('input'));
    };

    recognition.onerror = (e) => {
      if (window.MJApp) window.MJApp.showToast('Voice error: ' + e.error, 'danger');
    };

    recognition.onend = () => {
      const voiceBtn = document.querySelector('.mj-voice-active');
      if (voiceBtn) voiceBtn.classList.remove('mj-voice-active');
    };

    recognition.start();
    if (window.MJApp) window.MJApp.showToast('🎤 Listening... speak now.', 'info');
  }

  // ===== 10. CONCEPT MAP BUILDER =====
  function getConceptMap() {
    const confidence = JSON.parse(localStorage.getItem('medjava-confidence') || '{}');
    const topics = Object.entries(confidence).map(([id, data]) => ({
      id, title: data.topicTitle, level: data.level, date: data.date
    }));
    return topics;
  }

  // ===== INIT: Add UI elements for innovations =====
  function init() {
    // Update streak on load
    updateStreak();

    // Add streak and analytics to navbar
    const progressPill = document.querySelector('.mj-progress-pill');
    if (progressPill) {
      const streak = JSON.parse(localStorage.getItem('medjava-streak') || '{"days":0}');
      if (streak.days > 0) {
        progressPill.innerHTML += ` &nbsp;|&nbsp; 🔥${streak.days}`;
      }
    }

    // Add analytics button to navbar (after history button)
    const historyBtn = document.getElementById('historyToggle');
    if (historyBtn) {
      const analyticsBtn = document.createElement('button');
      analyticsBtn.className = 'btn mj-btn-icon';
      analyticsBtn.title = 'Learning Analytics';
      analyticsBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
      analyticsBtn.addEventListener('click', showAnalytics);
      historyBtn.parentNode.insertBefore(analyticsBtn, historyBtn.nextSibling);
    }

    // Add flashcard and challenge chips to quick chips
    const quickChips = document.getElementById('quickChips');
    if (quickChips) {
      const extraChips = [
        { msg: null, label: '🃏 Flashcards', action: 'flashcards' },
        { msg: null, label: '🎯 Challenge', action: 'challenge' },
        { msg: "Create 5 flashcards for what we just covered. Format each as Q: (question) A: (answer)", label: '📝 Make Cards' },
        { msg: "Give me a real-world medical scenario where I would use this concept in a hospital.", label: '🏥 Real-world' },
      ];

      extraChips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = 'mj-chip';
        btn.textContent = chip.label;
        btn.addEventListener('click', () => {
          if (chip.action === 'flashcards') {
            showFlashcardDeck();
          } else if (chip.action === 'challenge') {
            startCodeChallenge(null);
          } else if (chip.msg) {
            MJChat.sendMessage(chip.msg);
          }
        });
        quickChips.appendChild(btn);
      });
    }

    // Add voice input button next to chat input
    const inputRow = document.querySelector('.mj-chat-input-area .mj-input-row');
    if (inputRow) {
      const voiceBtn = document.createElement('button');
      voiceBtn.className = 'btn mj-btn-icon';
      voiceBtn.title = 'Voice input';
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
      voiceBtn.style.cssText = 'flex-shrink:0;width:42px;height:42px;border-radius:var(--mj-radius);color:var(--mj-muted);border:1px solid var(--mj-border)';
      voiceBtn.addEventListener('click', () => {
        voiceBtn.classList.toggle('mj-voice-active');
        const input = document.getElementById('userInput');
        if (input) startVoiceInput(input);
      });
      inputRow.insertBefore(voiceBtn, inputRow.querySelector('.mj-btn-send'));
    }

    // Listen for confidence check triggers
    // When AI says "Satisfaction Check" or user clicks "Mark complete"
    document.getElementById('topicCompleteBtn')?.addEventListener('click', () => {
      const topicTitle = document.getElementById('chatTopicTitle')?.textContent;
      if (topicTitle) {
        setTimeout(() => showConfidenceCheck(topicTitle), 500);
        incrementDailyGoal();
        addToReviewQueue(MJChat.currentTopicId, topicTitle);
      }
    });
  }

  return {
    init, showConfidenceCheck, showFlashcardDeck, showAnalytics,
    startCodeChallenge, startVoiceInput, generateFlashcard,
    getDueReviews, updateStreak, getStreakHTML, getDailyGoal, incrementDailyGoal
  };
})();

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => MJInnovations.init(), 500);
});
