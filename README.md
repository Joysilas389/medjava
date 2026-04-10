# MedJava

**Learn Java. Build Medical Software. Save Lives.**

A private, AI-powered Java learning platform built exclusively for Dr. Agbesi — a medical doctor transitioning into medical software systems engineering.

---

## What is MedJava?

MedJava is a single-user, deeply adaptive tutoring system that teaches Java through medical problems, visual simulations, and interactive execution. It is NOT a generic programming tutorial. Every example is medical. Every analogy is clinical. Every project builds something a hospital would actually use.

The AI tutor is powered by Anthropic's Claude API, operating under a strict teaching philosophy forged in Dr. Agbesi's actual learning sessions.

---

## Features

### Core Learning
- Claude-powered AI tutor with strict medical-first teaching philosophy
- 100+ curriculum topics from absolute beginner to expert medical software engineer
- 13 curriculum sections: Java Foundations, Methods, OOP, Errors, File I/O, Data Structures, Advanced Java, Medical Software Engineering, Security, ML, Deep Learning, Medical Projects, Settings
- Per-topic conversation persistence
- Free chat mode — ask any question without selecting a topic
- Auto-start teaching — click any topic and the AI begins immediately
- File and image upload — attach code files or screenshots for the AI to explain

### Interactive Simulations
- Every code block gets an automatic interactive simulation
- Step-by-step execution with Back, Play/Pause, Next controls
- Memory panel — watch variables created and updated in real-time
- Screen Output panel — see println output at each step
- What's Happening narration — plain English explanation of every line
- Condition evaluation — shows YES/NO with actual computed values
- Math evaluation — shows computed results for expressions
- Speed control — 1x to 5x playback

### 75 Medical Java Projects
- P1-P10: Starter (Triage, BMI, Patient Records, ICU Monitor, Prescription Calculator, EMR, HL7, Lab Analyzer, Drug Interactions, ML Diagnosis)
- P11-P30: Hardcore medical (ECG, GCS, sepsis, chemotherapy, growth charts, APGAR, immunization, blood bank, Westgard QC, ABG, NHIS, PHQ-9, outbreak detection, NEWS2, APACHE II)
- P31-P50: Advanced (HL7 builder, FHIR, AES encryption, ventilator, insulin, surgical checklist, malaria, pregnancy risk, ward beds, billing, TB screening, capstone HIS)
- P51-P75: Innovation tier (DHIS2, genomics, drug screening, clinical trials, syndromic surveillance, Bayesian triage, patient digital twin, clinical NLP, readmission predictor, wearable fusion, blockchain records, health equity, AMR tracker, social prescribing, climate-health, supply chain AI, teledermatology, voice-to-EHR, community health worker, rare disease matcher, pandemic model, smart triage, Ghana health atlas)

### 10 Innovative Features
1. Voice Input — speak questions (Web Speech API, English-Ghana)
2. Confidence Tracker — rate understanding 1-5, auto-rebuild on low scores
3. Learning Streak — consecutive daily usage in navbar
4. Analytics Dashboard — streak, goals, confidence chart, flashcards, reviews
5. Flashcard Deck — auto-parsed from AI, flip/prev/next viewer
6. Code Challenges — 3 difficulty levels, medical Java problems
7. Spaced Repetition — review queue with 1/3/7/14/30 day intervals
8. Daily Learning Goal — configurable target
9. Make Cards — AI generates Q&A, auto-saved to deck
10. Real-world — ask for hospital application scenarios

### UI Design
- Claude-style chat box (attachment bottom-left, send bottom-right)
- Dark theme matching Claude's warm gray palette
- Light theme with Figma-quality glassmorphism and glow effects
- DM Sans + JetBrains Mono typography
- Responsive mobile/tablet/desktop
- History panel with rename/star/delete
- Draggable divider in sandbox
- Copy log button in console

---

## Architecture

| Layer | Technology | Hosted On |
|-------|-----------|-----------|
| Frontend | HTML/CSS/JS + Bootstrap 5.3 | Vercel |
| Chat | Marked.js, Prism.js, DOMPurify | Vercel |
| AI Tutor | Anthropic Claude API | Anthropic |
| Backend | Node.js 20 + Express | Render |
| Java Sandbox | OpenJDK 21 in Docker | Render |
| Encryption | Web Crypto API (AES-256-GCM) | Client |
| Storage | IndexedDB + localStorage | Client |

---

## Quick Deploy

```bash
# 1. Push to GitHub
cd medjava
git init && git add . && git commit -m "MedJava platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medjava.git
git push -u origin main

# 2. Vercel: Import repo → Root: frontend/ → Deploy
# 3. Render: New Web Service → Root: backend/ → Docker → Deploy
# 4. Open app, set API key in Settings, start learning
```

---

## Converting to Desktop App

### Electron (Easiest)

1. Install Node.js on your computer
2. Create a new folder and run:
```bash
npm init -y
npm install electron --save-dev
```

3. Create `main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: false }
  });
  // Load from Vercel (online) or local files (offline)
  win.loadURL('https://medjava.vercel.app');
  // OR for offline: win.loadFile('frontend/index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
```

4. Add to `package.json`:
```json
{
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build-win": "electron-builder --win",
    "build-mac": "electron-builder --mac",
    "build-linux": "electron-builder --linux"
  }
}
```

5. Run: `npm start`
6. Build installer: `npm run build-win` (or build-mac/build-linux)

### Tauri (Lighter — 5MB vs Electron's 150MB)

Requires Rust installed. Produces native apps for Windows, Mac, Linux.

```bash
npm create tauri-app@latest medjava-desktop
```

### PWA (No packaging needed)

Add a `manifest.json` and service worker to make MedJava installable from Chrome on any device. Users click "Install" in the browser and it becomes a standalone app.

---

## Web Scraping

When enabled in Settings, the scraping feature saves API tokens:

- Factual questions ("what does String.length() return?") are scraped from W3Schools, Oracle docs, Baeldung, GeeksforGeeks
- Pedagogical questions ("I don't understand the dot operator") always go to the AI
- Requires the Render backend to be running
- If Render is down, scraping won't work but the AI tutor continues normally via direct browser API calls

---

## Security

- API key encrypted with AES-256-GCM (PBKDF2, 250,000 iterations)
- Stored in IndexedDB, never in plaintext
- All HTML sanitized with DOMPurify
- Sandbox: no network, 128MB heap, 30s timeout, unprivileged user

---

## Teaching Philosophy

7 non-negotiable commandments:

1. Medical First, Syntax Second
2. One-Line Truth before any code
3. Three-Box Model — max 3 ideas at once
4. Explain Every Symbol
5. Visual Execution Simulation for every example
6. Stop and Rebuild on Confusion
7. OOP Gets Extra Care

---

**Built for Dr. Agbesi** — a medical doctor learning to build the software that saves lives.

*MedJava v1.0*
