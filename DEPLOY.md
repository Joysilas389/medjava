# MedJava Deployment Guide

## Deploying from Termux (Android)

### Step 1 — Setup Termux

```bash
pkg install git nodejs openssh
```

### Step 2 — Unpack and Initialize

```bash
cd ~/storage/downloads
unzip medjava.zip -d medjava
cd medjava
git init
git add .
git commit -m "Initial MedJava platform"
git branch -M main
```

### Step 3 — Push to GitHub

**Option A — GitHub CLI:**
```bash
gh auth login
gh repo create medjava --private --source=. --push
```

**Option B — Manual:**
1. Create a new private repo on github.com named `medjava`
2. Push:
```bash
git remote add origin git@github.com:<username>/medjava.git
git push -u origin main
```

### Step 4 — Deploy Backend to Render

1. Log into [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Set:
   - **Root directory:** `backend/`
   - **Environment:** Docker
   - **Start command:** `node server.js`
5. Add environment variable:
   - `ALLOWED_ORIGIN` = `https://medjava.vercel.app`
6. Click **Create Web Service**
7. Wait ~4 minutes for first build
8. Copy the Render URL (e.g. `https://medjava-backend.onrender.com`)

### Step 5 — Deploy Frontend to Vercel

1. Log into [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import the GitHub repo
4. Set:
   - **Root directory:** `frontend/`
   - **Framework preset:** Other (static)
5. Click **Deploy** (~1 minute)
6. Copy the Vercel URL (e.g. `https://medjava.vercel.app`)

### Step 6 — Connect Frontend to Backend

Open `frontend/js/app.js` and set the BACKEND_URL:
```javascript
window.BACKEND_URL = 'https://medjava-backend.onrender.com';
```

Commit and push:
```bash
git add .
git commit -m "Set backend URL"
git push
```

Both Vercel and Render will auto-redeploy.

### Step 7 — First Run Checklist

1. Visit the Vercel URL in your browser
2. Open **Settings** (gear icon, top right)
3. Enter your Anthropic API key → click **Save**
4. Confirm the key status shows "Key saved (encrypted)"
5. Select **Java While Loop** from the side nav
6. Type "start" → confirm streaming AI response appears
7. Check that code blocks render with syntax highlighting
8. Click **Medical Projects Sandbox** → select a project → press **Run**
9. Refresh the page → confirm API key is still saved
10. Toggle between Light and Dark mode

### Updating

After making changes locally:
```bash
git add .
git commit -m "Description of changes"
git push
```
Both services will automatically redeploy from the `main` branch.

### Troubleshooting

| Issue | Fix |
|-------|-----|
| "No API key configured" | Open Settings, enter your `sk-ant-...` key |
| Chat not responding | Check that BACKEND_URL is set correctly in app.js |
| Sandbox "Backend not connected" | Ensure Render service is running and URL is correct |
| CORS errors in console | Update ALLOWED_ORIGIN on Render to match your Vercel URL |
| Dark mode not persisting | Clear browser cache and reload |
