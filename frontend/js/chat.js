/* ============================================
   MedJava — Chat Interface
   Claude-style streaming chat with markdown,
   code highlighting, and simulation rendering
   ============================================ */

const MJChat = (() => {
  let currentTopicId = null;
  let conversationHistory = {};
  let isStreaming = false;

  const DB_NAME = 'medjava-conversations';
  const DB_VERSION = 2;
  const STORE_NAME = 'threads';
  const HISTORY_STORE = 'history';

  function openConvDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'topicId' });
        }
        if (!db.objectStoreNames.contains(HISTORY_STORE)) {
          const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id', autoIncrement: true });
          store.createIndex('topicId', 'topicId', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveConversation(topicId, messages) {
    try {
      const db = await openConvDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ topicId, messages, updatedAt: Date.now() });
    } catch (e) {
      console.error('Save conversation error:', e);
    }
  }

  async function addHistoryEntry(topicId, topicTitle, sectionTitle, userMessage) {
    try {
      const db = await openConvDB();
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      tx.objectStore(HISTORY_STORE).put({
        topicId,
        topicTitle,
        sectionTitle,
        title: userMessage.substring(0, 80),
        starred: false,
        timestamp: Date.now()
      });
    } catch (e) {
      console.error('Save history error:', e);
    }
  }

  async function updateHistoryEntry(id, updates) {
    try {
      const db = await openConvDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(HISTORY_STORE, 'readwrite');
        const store = tx.objectStore(HISTORY_STORE);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) {
            const entry = { ...req.result, ...updates };
            store.put(entry);
          }
        };
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.error('Update history error:', e);
    }
  }

  async function deleteHistoryEntry(id) {
    try {
      const db = await openConvDB();
      const tx = db.transaction(HISTORY_STORE, 'readwrite');
      tx.objectStore(HISTORY_STORE).delete(id);
    } catch (e) {
      console.error('Delete history error:', e);
    }
  }

  async function getHistoryEntries(filter) {
    try {
      const db = await openConvDB();
      return new Promise((resolve) => {
        const tx = db.transaction(HISTORY_STORE, 'readonly');
        const req = tx.objectStore(HISTORY_STORE).index('timestamp').openCursor(null, 'prev');
        const entries = [];
        req.onsuccess = (e) => {
          const cursor = e.target.result;
          if (cursor && entries.length < 100) {
            const entry = cursor.value;
            if (!filter || filter === 'all' || (filter === 'starred' && entry.starred)) {
              entries.push(entry);
            }
            cursor.continue();
          } else {
            resolve(entries);
          }
        };
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async function loadConversation(topicId) {
    try {
      const db = await openConvDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(topicId);
        req.onsuccess = () => resolve(req.result?.messages || []);
        req.onerror = () => resolve([]);
      });
    } catch {
      return [];
    }
  }

  async function clearAllConversations() {
    try {
      const db = await openConvDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    } catch (e) {
      console.error('Clear conversations error:', e);
    }
  }

  // --- System Prompt ---
  function getSystemPrompt() {
    return `You are the MedJava AI Tutor — an elite medical software engineering professor teaching Dr. Agbesi, a medical doctor transitioning from clinical medicine into medical software systems engineering.

MISSION: Transform Dr. Agbesi from absolute beginner into an expert medical software systems engineer. His primary language is Java. His weakness is Object-Oriented Programming. Your job is to close that gap completely.

LEARNER PROFILE: Complete beginner. Clinical mind, not a coder's mind. Learns best through visual animations, step-by-step simulations, medical analogies, and slow systematic build-up. He needs every line explained, every symbol explained, every concept reduced to a one-line truth before syntax is introduced.

TEACHING RULES (NON-NEGOTIABLE):
1. Always start with: 'What medical problem does this solve?'
2. Give a ONE-LINE TRUTH before any code
3. Use 3-BOX MODELS — never more than 3 ideas at once
4. Explain EVERY symbol the first time it appears
5. Use medical scenarios exclusively — patients, doctors, labs, vitals, drugs, hospitals, wards, prescriptions
6. Provide a LINE-BY-LINE MEANING then a LINE-BY-LINE ACTION
7. Include an EXECUTION SIMULATION for every code example — this is CRITICAL
8. Stop immediately on confusion and REBUILD from zero
9. For OOP: real-world model FIRST, class design SECOND, syntax LAST
10. End every topic with a SATISFACTION CHECK

OUTPUT FORMAT:
- Use markdown with clear headings (##, ###)
- Wrap code in \`\`\`java fenced blocks
- When comparing concepts, use markdown tables
- Bold key terms the first time they appear
- Never use emojis unless the user uses them first

INTERACTIVE EXECUTION SIMULATIONS (MANDATORY FOR EVERY CODE EXAMPLE):
After every code example, you MUST include a <medjava-sim> tag containing a FULLY WORKING interactive step-through simulation styled like a premium learning app.

DESIGN PRINCIPLES FOR SIMULATIONS:
- Dark background (#1a1b2e) with vibrant colored cards
- ALL text must wrap properly — use word-wrap:break-word and overflow-wrap:break-word everywhere
- Rounded corners (12px) on everything
- Color-coded sections: blue for code, green for memory, amber for narration, teal for output
- Dot indicators showing progress
- Back, Play/Pause, and Next buttons
- Speed slider to control auto-play speed
- Each step has a DETAILED beginner explanation — no jargon, explain like talking to a doctor who has never coded

NARRATION RULES FOR DR. AGBESI:
- Never use programming jargon without explaining it in plain English first
- Instead of "initializing a variable", say "We are creating a labeled box in the computer's memory called patientTemp, and storing the number 38.5 inside it"
- Instead of "the condition evaluates to true", say "The computer checks: is 38.5 greater than 37.5? Yes it is! So the answer is TRUE, which means the computer will enter the code block inside the curly braces"
- Instead of "iterating through the loop", say "The computer goes back to the top of the while block and checks the condition again — like a nurse doing another round of vital signs checks"
- Use medical analogies: variables are like patient chart fields, if/else is like triage decisions, loops are like monitoring rounds
- Each narration should be 2-3 sentences minimum explaining WHAT is happening and WHY

HERE IS THE EXACT HTML PATTERN TO USE:

<medjava-sim type="stepper" title="example_name">
<style>
.mjs{font-family:system-ui,-apple-system,sans-serif;background:#1a1b2e;border-radius:14px;padding:16px;color:#e2e8f0;overflow:hidden}
.mjs *{box-sizing:border-box;word-wrap:break-word;overflow-wrap:break-word}
.mjs-title{font-size:15px;font-weight:700;color:#e2e8f0;margin-bottom:12px;text-align:center}
.mjs-code-panel{background:#0f1019;border-radius:10px;padding:12px;margin-bottom:10px;font-family:'Courier New',monospace;font-size:12px;line-height:1.9;overflow-x:auto;-webkit-overflow-scrolling:touch}
.mjs .line{padding:3px 10px;border-radius:6px;color:#8892b0;transition:all 0.3s;white-space:pre;min-height:22px}
.mjs .line.active{background:linear-gradient(90deg,#2E75B6,#1e4d7b);color:#fff;font-weight:600;border-left:3px solid #f9e2af}
.mjs-panels{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}
@media(max-width:600px){.mjs-panels{grid-template-columns:1fr}}
.mjs-mem{background:linear-gradient(135deg,#0d2818,#1a3a2a);border:1px solid #2d6a2e;border-radius:10px;padding:12px;overflow:hidden}
.mjs-mem-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#4ade80;margin-bottom:8px;font-weight:700}
.mjs-var{display:flex;justify-content:space-between;align-items:center;padding:6px 10px;margin:4px 0;background:rgba(74,222,128,0.08);border-radius:8px;border:1px solid rgba(74,222,128,0.15);flex-wrap:wrap;gap:4px}
.mjs-var .vn{font-weight:600;color:#4ade80;font-family:monospace;font-size:12px}
.mjs-var .vv{color:#60a5fa;font-family:monospace;font-weight:700;font-size:12px;background:rgba(96,165,250,0.12);padding:2px 10px;border-radius:12px;max-width:100%;overflow-wrap:break-word}
.mjs-out{background:linear-gradient(135deg,#0c1222,#121a30);border:1px solid #1e3a5f;border-radius:10px;padding:12px;overflow:hidden}
.mjs-out-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#38bdf8;margin-bottom:8px;font-weight:700}
.mjs-out pre{margin:0;color:#7dd3fc;font-family:monospace;font-size:12px;white-space:pre-wrap;word-wrap:break-word}
.mjs-nar{background:linear-gradient(135deg,#2a1f0a,#332810);border:1px solid #a3761a;border-radius:10px;padding:14px;margin:10px 0}
.mjs-nar-title{font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#fbbf24;margin-bottom:6px;font-weight:700}
.mjs-nar-text{color:#fde68a;font-size:13px;line-height:1.6;word-wrap:break-word}
.mjs-explain{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;margin-top:8px;color:#cbd5e1;font-size:12.5px;line-height:1.6}
.mjs-explain strong{color:#f9e2af}
.mjs-dots{display:flex;justify-content:center;gap:5px;margin:12px 0;flex-wrap:wrap}
.mjs-dot{width:8px;height:8px;border-radius:50%;background:#334155;transition:all 0.3s;flex-shrink:0}
.mjs-dot.active{background:#60a5fa;box-shadow:0 0 6px rgba(96,165,250,0.5)}
.mjs-dot.done{background:#4ade80}
.mjs-speed{display:flex;align-items:center;justify-content:center;gap:8px;margin:8px 0;flex-wrap:wrap}
.mjs-speed label{font-size:11px;color:#64748b;font-weight:600}
.mjs-speed input[type=range]{width:100px;accent-color:#60a5fa;cursor:pointer}
.mjs-speed .spd-val{font-size:11px;color:#60a5fa;font-weight:700;min-width:30px}
.mjs-controls{display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
.mjs-btn{padding:8px 20px;border-radius:20px;border:none;font-weight:700;cursor:pointer;font-size:13px;transition:all 0.2s}
.mjs-btn:active{transform:scale(0.96)}
.mjs-back{background:#334155;color:#94a3b8}
.mjs-back:hover{background:#475569;color:#e2e8f0}
.mjs-play{background:linear-gradient(135deg,#16a34a,#15803d);color:#fff}
.mjs-play:hover{background:linear-gradient(135deg,#22c55e,#16a34a)}
.mjs-play.paused{background:linear-gradient(135deg,#dc2626,#b91c1c)}
.mjs-play.paused:hover{background:linear-gradient(135deg,#ef4444,#dc2626)}
.mjs-next{background:linear-gradient(135deg,#2E75B6,#1d5a9e);color:#fff}
.mjs-next:hover{background:linear-gradient(135deg,#3b82f6,#2563eb)}
.mjs-step-label{color:#64748b;font-size:12px;font-weight:600;min-width:70px;text-align:center}
</style>
<div class="mjs">
<div class="mjs-title">Execution Walkthrough</div>
<div class="mjs-code-panel" id="codeP">
<!-- lines here as <div class="line">code text</div> -->
</div>
<div class="mjs-panels">
<div class="mjs-mem" id="memP"><div class="mjs-mem-title">Memory</div></div>
<div class="mjs-out" id="outP"><div class="mjs-out-title">Screen Output</div><pre id="outTxt"></pre></div>
</div>
<div class="mjs-nar" id="narP">
<div class="mjs-nar-title">What's happening</div>
<div class="mjs-nar-text" id="narTxt"></div>
<div class="mjs-explain" id="expTxt"></div>
</div>
<div class="mjs-dots" id="dots"></div>
<div class="mjs-speed">
<label>Speed:</label>
<input type="range" min="1" max="5" value="2" id="speedS">
<span class="spd-val" id="speedV">2x</span>
</div>
<div class="mjs-controls">
<button class="mjs-btn mjs-back" id="backB">← Back</button>
<button class="mjs-btn mjs-play" id="playB">▶ Play</button>
<span class="mjs-step-label" id="stepL">Step 0 of 0</span>
<button class="mjs-btn mjs-next" id="nextB">Next →</button>
</div>
</div>
<script>
// steps: each has { line, memory:{}, output:'', narration:'', explain:'' }
// narration = short what's happening (1 sentence)
// explain = detailed beginner explanation (2-3 sentences, no jargon, medical analogies)
const steps = [];
let cur=0,playing=false,timer=null;
const cP=simBody.querySelector('#codeP'),mP=simBody.querySelector('#memP'),oT=simBody.querySelector('#outTxt'),nT=simBody.querySelector('#narTxt'),eT=simBody.querySelector('#expTxt'),dC=simBody.querySelector('#dots'),sL=simBody.querySelector('#stepL'),pB=simBody.querySelector('#playB'),spS=simBody.querySelector('#speedS'),spV=simBody.querySelector('#speedV');
steps.forEach((_,i)=>{const d=document.createElement('div');d.className='mjs-dot';dC.appendChild(d)});
function getDelay(){return[3000,2000,1200,700,400][parseInt(spS.value)-1]}
spS.oninput=()=>{spV.textContent=spS.value+'x';if(playing){clearInterval(timer);timer=setInterval(advance,getDelay())}};
function r(){
  const s=steps[cur];
  cP.querySelectorAll('.line').forEach((el,i)=>el.classList.toggle('active',i===s.line));
  let mh='<div class="mjs-mem-title">Memory</div>';
  for(const[k,v]of Object.entries(s.memory))mh+='<div class="mjs-var"><span class="vn">'+k+'</span><span class="vv">'+v+'</span></div>';
  mP.innerHTML=mh;
  oT.textContent=s.output||'(nothing printed yet)';
  nT.textContent=s.narration;
  eT.textContent=s.explain||'';
  eT.style.display=s.explain?'block':'none';
  sL.textContent='Step '+(cur+1)+' of '+steps.length;
  dC.querySelectorAll('.mjs-dot').forEach((d,i)=>{d.className='mjs-dot'+(i<cur?' done':'')+(i===cur?' active':'')});
  if(cur>=steps.length-1)stopPlay();
}
function advance(){if(cur<steps.length-1){cur++;r()}else{stopPlay()}}
function stopPlay(){playing=false;clearInterval(timer);timer=null;pB.textContent='▶ Play';pB.classList.remove('paused')}
pB.onclick=()=>{
  if(playing){stopPlay()}
  else{playing=true;pB.textContent='⏸ Pause';pB.classList.add('paused');timer=setInterval(advance,getDelay())}
};
simBody.querySelector('#nextB').onclick=()=>{stopPlay();if(cur<steps.length-1){cur++;r()}};
simBody.querySelector('#backB').onclick=()=>{stopPlay();if(cur>0){cur--;r()}};
r();
</script>
</medjava-sim>

ALSO FOR CONCEPT DIAGRAMS (flow, 3-box, class, comparison), use this pattern — colored cards with connecting arrows:

<medjava-sim type="flow" title="concept_name">
<style>
.mjf{font-family:system-ui,sans-serif;background:#1a1b2e;border-radius:14px;padding:20px;color:#e2e8f0}
.mjf *{box-sizing:border-box;word-wrap:break-word;overflow-wrap:break-word}
.mjf-title{font-size:15px;font-weight:700;margin-bottom:16px;text-align:center}
.mjf-flow{display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin:12px 0}
.mjf-node{padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;text-align:center;min-width:80px;max-width:200px;line-height:1.4;word-wrap:break-word}
.mjf-arrow{color:#64748b;font-size:18px;font-weight:700;flex-shrink:0}
.mjf-blue{background:linear-gradient(135deg,#1e3a5f,#2E75B6);color:#e0f2fe;border:1px solid #3b82f6}
.mjf-green{background:linear-gradient(135deg,#14532d,#166534);color:#bbf7d0;border:1px solid #22c55e}
.mjf-amber{background:linear-gradient(135deg,#451a03,#92400e);color:#fde68a;border:1px solid #f59e0b}
.mjf-red{background:linear-gradient(135deg,#450a0a,#991b1b);color:#fecaca;border:1px solid #ef4444}
.mjf-purple{background:linear-gradient(135deg,#2e1065,#581c87);color:#e9d5ff;border:1px solid #a855f7}
.mjf-teal{background:linear-gradient(135deg,#042f2e,#115e59);color:#99f6e4;border:1px solid #14b8a6}
.mjf-desc{background:rgba(255,255,255,0.05);border-radius:10px;padding:12px;margin-top:12px;font-size:13px;color:#94a3b8;text-align:center;border:1px solid rgba(255,255,255,0.08);line-height:1.5}
.mjf-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:12px 0}
.mjf-card{border-radius:10px;padding:14px;text-align:center;word-wrap:break-word}
.mjf-card h4{margin:0 0 4px;font-size:13px}
.mjf-card p{margin:0;font-size:11.5px;opacity:0.85;line-height:1.5}
</style>
<div class="mjf">
<!-- Use mjf-flow for linear flows, mjf-grid for card grids -->
</div>
</medjava-sim>

IMPORTANT SIMULATION RULES:
- The script uses 'simBody' — this variable is provided by the platform
- Every step must have: line (int), memory (object), output (string), narration (string), explain (string)
- narration = short 1-sentence summary of what happens at this step
- explain = DETAILED 2-4 sentence beginner explanation. No jargon. Use medical analogies. Explain every symbol. Example: "The equals sign (=) here does NOT mean 'equals' like in math. In Java, a single = means 'store this value into that box'. Think of it like writing a number on a patient's chart — you are recording 38.5 into the temperature field."
- ALL text must wrap properly — never overflow cards
- Play button auto-advances through steps; Pause stops it
- Speed slider controls auto-play speed (1x=slow, 5x=fast)
- Back and Next for manual stepping
- Memory shows variables as colored pill badges
- Use medical variable names and scenarios always

CURRICULUM STATE: Dr. Agbesi has completed Topics 0.1 through 5 (values, output, input, operators, conditionals). The OOP section is the most important part of his journey. Slow down significantly when you reach it.

MEDICAL DOMAINS to prepare him for: patient registration systems, EMR/EHR, laboratory systems, prescription systems, ICU monitoring, medical device integration, HL7 and FHIR protocols, DICOM image handling, patient data encryption, machine learning for diagnosis, deep learning for medical imaging.

RESPONSE LENGTH AND DEPTH RULES (CRITICAL):
- NEVER give short or summary responses. Dr. Agbesi needs THOROUGH, DETAILED explanations.
- Every topic response must be LONG and COMPREHENSIVE — at minimum 1500 words for a new topic.
- For every code example, provide ALL of these (never skip any):
  1. THE MEDICAL PROBLEM — at least 3-4 sentences explaining the real-world clinical scenario
  2. ONE-LINE TRUTH — the anchor sentence
  3. SYMBOL-BY-SYMBOL breakdown — explain every single symbol in the code, one by one
  4. LINE-BY-LINE MEANING — what each line means in plain English
  5. LINE-BY-LINE ACTION — what the computer actually does for each line
  6. A FULL INTERACTIVE SIMULATION with the <medjava-sim> tag
  7. At least 2 medical analogies per concept
  8. A "What if?" section — what happens if you change a value? What breaks if you remove a semicolon?
  9. A PRACTICE EXERCISE for Dr. Agbesi to try
  10. A SATISFACTION CHECK asking if he understood
- NEVER say "Let me know if you want me to explain more" — just explain everything NOW.
- NEVER give a bullet point list of topics you COULD teach — just TEACH the topic directly.
- NEVER ask "which one would you like?" — instead, teach the current topic fully.
- If Dr. Agbesi asks "teach me X", you TEACH X immediately. Don't offer a menu.
- Treat every response as if it's a full lecture, not a table of contents.

FORBIDDEN: Generic non-medical examples. Rushing past confusion. Teaching syntax before purpose. Introducing jargon without explanation. Saying 'this is easy.' Treating him like a typical CS student. Using words like 'initialize', 'iterate', 'evaluate', 'invoke', 'instantiate', 'parameter', 'argument', 'parse', 'concatenate', 'boolean', 'operand', 'expression' WITHOUT first explaining them in plain English with a medical analogy. SHORT RESPONSES. SUMMARY RESPONSES. OFFERING MENUS INSTEAD OF TEACHING. ASKING WHICH TOPIC TO COVER INSTEAD OF COVERING THE ONE THAT WAS ASKED.

JARGON TRANSLATION RULE: Every programming term must be introduced with a plain-English explanation FIRST, then the technical term in bold after. Example: "We create a labeled storage box in the computer's memory — programmers call this **declaring a variable**." Never use the jargon word alone until Dr. Agbesi has seen the plain explanation at least once in the current topic.

TONE: Warm, patient, rigorous, beginner-safe, medically grounded. Treat Dr. Agbesi as a brilliant clinician learning a new language — not a novice. Respect his clinical expertise. Build on it. Speak to him the way a kind mentor would speak to a talented colleague learning something entirely new. Never condescend, but never assume he knows any programming term.`;
  }

  // --- Render Messages ---
  function renderMessage(msg, container) {
    const el = document.createElement('div');
    el.className = `mj-msg mj-msg-${msg.role}`;

    if (msg.role === 'user') {
      el.innerHTML = `<div class="mj-msg-bubble">${escapeHtml(msg.content)}</div>`;
    } else {
      const rendered = renderMarkdown(msg.content);
      el.innerHTML = `
        <div class="mj-msg-header">
          <div class="mj-avatar">MJ</div>
          <span class="small fw-semibold" style="color: var(--mj-text-secondary);">MedJava Tutor</span>
        </div>
        <div class="mj-msg-body">${rendered}</div>
      `;
    }

    container.appendChild(el);

    // Process simulations in assistant messages
    if (msg.role === 'assistant') {
      const body = el.querySelector('.mj-msg-body');
      SimRenderer.processMessage(body);
      highlightCode(body);
      addCodeActions(body);
    }

    return el;
  }

  function renderMarkdown(text) {
    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true,
      headerIds: false,
      mangle: false,
    });

    let html = marked.parse(text);
    // Sanitize but preserve medjava-sim tags
    html = DOMPurify.sanitize(html, {
      ADD_TAGS: ['medjava-sim', 'style'],
      ADD_ATTR: ['type', 'title', 'onclick', 'onchange', 'oninput',
                 'data-step', 'data-line'],
      ALLOW_DATA_ATTR: true,
    });
    // Wrap tables in scrollable container for mobile
    html = html.replace(/<table>/g, '<div class="mj-table-wrap"><table>');
    html = html.replace(/<\/table>/g, '</table></div>');
    return html;
  }

  function highlightCode(container) {
    container.querySelectorAll('pre code').forEach(block => {
      if (!block.classList.contains('language-java')) {
        block.classList.add('language-java');
      }
      Prism.highlightElement(block);
    });
  }

  function addCodeActions(container) {
    container.querySelectorAll('pre').forEach(pre => {
      if (pre.querySelector('.mj-code-actions')) return;
      // Don't add actions to code inside simulation cards
      if (pre.closest('.medjava-sim-card')) return;

      const actions = document.createElement('div');
      actions.className = 'mj-code-actions';

      const copyBtn = document.createElement('button');
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pre.querySelector('code')?.textContent;
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
          });
        }
      });

      const runBtn = document.createElement('button');
      runBtn.innerHTML = '<i class="fas fa-play"></i> Run in Sandbox';
      runBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pre.querySelector('code')?.textContent;
        if (code && window.MJApp) {
          window.MJApp.openSandboxWithCode(code);
        }
      });

      const explainBtn = document.createElement('button');
      explainBtn.innerHTML = '<i class="fas fa-magnifying-glass"></i> Explain';
      explainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = pre.querySelector('code')?.textContent;
        if (code) {
          sendMessage('Please explain each line of this code:\n```java\n' + code + '\n```');
        }
      });

      actions.appendChild(copyBtn);
      actions.appendChild(runBtn);
      actions.appendChild(explainBtn);
      pre.appendChild(actions);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Streaming ---
  async function sendMessage(userText) {
    if (isStreaming || !userText.trim()) return;

    const chatMessages = document.getElementById('chatMessages');
    const sendBtn = document.getElementById('sendBtn');

    // Get or init conversation
    if (!conversationHistory[currentTopicId]) {
      conversationHistory[currentTopicId] = [];
    }
    const history = conversationHistory[currentTopicId];

    // Add user message
    history.push({ role: 'user', content: userText });
    renderMessage({ role: 'user', content: userText }, chatMessages);
    scrollToBottom(chatMessages);

    // Save to history index
    const topicTitle = document.getElementById('chatTopicTitle')?.textContent || currentTopicId;
    const sectionTitle = document.getElementById('chatTopicSub')?.textContent || '';
    await addHistoryEntry(currentTopicId, topicTitle, sectionTitle, userText);

    // Show loading
    isStreaming = true;
    sendBtn.disabled = true;
    const loadingEl = createLoadingIndicator();
    chatMessages.appendChild(loadingEl);
    scrollToBottom(chatMessages);

    try {
      const apiKey = await MJCrypto.loadKey();
      if (!apiKey) {
        throw new Error('No API key configured. Open Settings to add your Anthropic API key.');
      }

      const model = document.getElementById('modelSelect')?.value || 'claude-sonnet-4-20250514';
      const maxTokens = parseInt(document.getElementById('maxTokens')?.value || '8000');

      // Build API messages (last 20 messages for context window)
      const apiMessages = history.slice(-20).map(m => ({
        role: m.role,
        content: m.content
      }));

      // Try backend proxy first, fall back to direct API
      const backendUrl = window.BACKEND_URL;
      let response;

      if (backendUrl) {
        response = await fetch(`${backendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model, max_tokens: maxTokens,
            system: getSystemPrompt(),
            messages: apiMessages,
            apiKey
          })
        });
      } else {
        // Direct API call (for development / when backend unavailable)
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: JSON.stringify({
            model, max_tokens: maxTokens,
            system: getSystemPrompt(),
            messages: apiMessages,
            stream: true
          })
        });
      }

      // Remove loading
      loadingEl.remove();

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`API error ${response.status}: ${err}`);
      }

      // Stream response
      const assistantContent = await streamResponse(response, chatMessages);

      // Save to history
      history.push({ role: 'assistant', content: assistantContent });
      await saveConversation(currentTopicId, history);

      // Post-processing: auto-parse flashcards, detect satisfaction checks
      if (typeof MJInnovations !== 'undefined') {
        postProcessResponse(assistantContent);
      }

    } catch (error) {
      loadingEl.remove();
      showError(error.message, chatMessages);
    } finally {
      isStreaming = false;
      sendBtn.disabled = false;
    }
  }

  async function streamResponse(response, container) {
    // Create assistant message element
    const msgEl = document.createElement('div');
    msgEl.className = 'mj-msg mj-msg-assistant';
    msgEl.innerHTML = `
      <div class="mj-msg-header">
        <div class="mj-avatar">MJ</div>
        <span class="small fw-semibold" style="color: var(--mj-text-secondary);">MedJava Tutor</span>
      </div>
      <div class="mj-msg-body"><span class="mj-cursor"></span></div>
    `;
    container.appendChild(msgEl);

    const body = msgEl.querySelector('.mj-msg-body');
    let fullText = '';
    let renderTimer = null;
    let pendingRender = false;

    // Throttled render — updates DOM at most every 80ms for smooth horizontal text flow
    function scheduleRender() {
      if (renderTimer) return;
      pendingRender = true;
      renderTimer = setTimeout(() => {
        renderTimer = null;
        if (pendingRender) {
          body.innerHTML = renderMarkdown(fullText) + '<span class="mj-cursor"></span>';
          scrollToBottom(container);
          pendingRender = false;
        }
      }, 80);
    }

    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Handle streaming events
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                fullText += parsed.delta.text;
                scheduleRender();
              }

              // Handle non-streaming response (from backend proxy)
              if (parsed.content) {
                fullText = parsed.content.map(c => c.text || '').join('');
                body.innerHTML = renderMarkdown(fullText);
              }
            } catch (e) {
              // Not JSON, might be partial
            }
          }
        }
      }
    } catch (e) {
      // Handle non-streaming response
      if (!fullText) {
        try {
          const json = await response.json();
          fullText = json.content?.map(c => c.text || '').join('') || 'No response received.';
        } catch {
          fullText = 'Error reading response.';
        }
      }
    }

    // Clear any pending timer
    if (renderTimer) { clearTimeout(renderTimer); renderTimer = null; }

    // Final render
    body.innerHTML = renderMarkdown(fullText);
    SimRenderer.processMessage(body);
    highlightCode(body);
    addCodeActions(body);
    scrollToBottom(container);

    return fullText;
  }

  function createLoadingIndicator() {
    const el = document.createElement('div');
    el.className = 'mj-msg mj-msg-assistant';
    el.innerHTML = `
      <div class="mj-msg-header">
        <div class="mj-avatar">MJ</div>
        <span class="small fw-semibold" style="color: var(--mj-text-secondary);">MedJava Tutor</span>
      </div>
      <div class="mj-msg-body">
        <div class="mj-loading">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    return el;
  }

  function showError(message, container) {
    const el = document.createElement('div');
    el.className = 'mj-msg mj-msg-assistant';
    el.innerHTML = `
      <div class="mj-msg-header">
        <div class="mj-avatar" style="background: var(--mj-danger);">!</div>
        <span class="small fw-semibold" style="color: var(--mj-danger);">Error</span>
      </div>
      <div class="mj-msg-body">
        <div style="color: var(--mj-danger); background: var(--mj-danger-subtle); padding: 12px; border-radius: var(--mj-radius-sm); font-size: 0.88rem;">
          ${escapeHtml(message)}
        </div>
      </div>
    `;
    container.appendChild(el);
    scrollToBottom(container);
  }

  function scrollToBottom(el) {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }

  // --- Topic Management ---
  async function openTopic(topicId, topicTitle, sectionTitle) {
    currentTopicId = topicId;
    const chatMessages = document.getElementById('chatMessages');
    const chatTopicTitle = document.getElementById('chatTopicTitle');
    const chatTopicSub = document.getElementById('chatTopicSub');

    chatTopicTitle.textContent = topicTitle;
    chatTopicSub.textContent = sectionTitle;
    chatMessages.innerHTML = '';

    // Load persisted conversation
    const messages = await loadConversation(topicId);
    conversationHistory[topicId] = messages;

    if (messages.length > 0) {
      messages.forEach(msg => renderMessage(msg, chatMessages));
      scrollToBottom(chatMessages);
    } else {
      // Only auto-start for curriculum topics, NOT free chat
      if (!topicId.startsWith('free-chat-')) {
        const startMsg = `I just opened the topic "${topicTitle}" (from the ${sectionTitle} section). Please start teaching me this topic from the very beginning using the MedJava teaching method: start with what medical problem this solves, give me a one-line truth, then build up step by step with a medical scenario, code example, and an interactive execution simulation. Remember I am Dr. Agbesi — explain everything from scratch, no jargon without explanation.`;
        setTimeout(() => sendMessage(startMsg), 300);
      }
    }
  }

  // --- Code Actions ---
  function copyCode(btn) {
    const code = btn.closest('pre').querySelector('code')?.textContent;
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
      });
    }
  }

  function runInSandbox(btn) {
    const code = btn.closest('pre').querySelector('code')?.textContent;
    if (code && window.MJApp) {
      window.MJApp.openSandboxWithCode(code);
    }
  }

  function explainCode(btn) {
    const code = btn.closest('pre').querySelector('code')?.textContent;
    if (code) {
      sendMessage(`Please explain each line of this code:\n\`\`\`java\n${code}\n\`\`\``);
    }
  }

  // Post-process AI responses for flashcard extraction and triggers
  function postProcessResponse(text) {
    if (!text) return;

    // Auto-parse flashcards from AI response
    // Pattern: Q: ... A: ... or **Q:** ... **A:** ...
    const qaPairs = [];
    const qaRegex = /(?:Q:|Question:|Front:)\s*(.+?)(?:\n|\r)(?:A:|Answer:|Back:)\s*(.+?)(?:\n|\r|$)/gi;
    let match;
    while ((match = qaRegex.exec(text)) !== null) {
      const front = match[1].replace(/\*\*/g, '').trim();
      const back = match[2].replace(/\*\*/g, '').trim();
      if (front.length > 5 && back.length > 3) {
        qaPairs.push({ front, back });
      }
    }

    if (qaPairs.length > 0) {
      // Save flashcards
      const cards = JSON.parse(localStorage.getItem('medjava-flashcards') || '[]');
      const topicTitle = document.getElementById('chatTopicTitle')?.textContent || 'General';
      qaPairs.forEach(qa => {
        cards.push({
          id: Date.now() + Math.random(),
          front: qa.front,
          back: qa.back,
          category: topicTitle,
          created: new Date().toISOString(),
          lastReviewed: null,
          score: 0
        });
      });
      localStorage.setItem('medjava-flashcards', JSON.stringify(cards));
      if (window.MJApp) window.MJApp.showToast(`📝 ${qaPairs.length} flashcards saved!`, 'success');
    }

    // Detect satisfaction check in AI response
    const lowerText = text.toLowerCase();
    if (lowerText.includes('satisfaction check') || lowerText.includes('how confident') || lowerText.includes('are you satisfied')) {
      const topicTitle = document.getElementById('chatTopicTitle')?.textContent;
      if (topicTitle && typeof MJInnovations !== 'undefined') {
        setTimeout(() => MJInnovations.showConfidenceCheck(topicTitle), 1000);
      }
    }
  }

  return {
    sendMessage, openTopic, copyCode, runInSandbox, explainCode,
    clearAllConversations, getHistoryEntries, updateHistoryEntry, deleteHistoryEntry,
    get isStreaming() { return isStreaming; },
    get currentTopicId() { return currentTopicId; }
  };
})();
