# MedJava Desktop App — Build Instructions

## Prerequisites

You need a computer (Windows, Mac, or Linux) with:
- **Node.js 18+** installed (download from https://nodejs.org)
- **Git** installed

## Step 1: Get the code

```bash
git clone https://github.com/Joysilas389/medjava.git
cd medjava
```

## Step 2: Install dependencies

```bash
# Copy the desktop package.json to root
cp desktop/package.json package.json

# Install Electron and builder
npm install
```

## Step 3: Test the app

```bash
npm start
```
This opens MedJava as a desktop window. Test that everything works.

## Step 4: Build the installer

### For Windows (.exe installer):
```bash
npm run build-win
```
Output: `dist/MedJava-Setup-1.0.0.exe`

### For Mac (.dmg):
```bash
npm run build-mac
```
Output: `dist/MedJava-1.0.0.dmg`

### For Linux (.AppImage + .deb):
```bash
npm run build-linux
```
Output: `dist/MedJava-1.0.0.AppImage` and `dist/medjava-desktop_1.0.0_amd64.deb`

### Build all platforms at once:
```bash
npm run build-all
```

## Step 5: Install and use

- **Windows**: Run `MedJava-Setup-1.0.0.exe`, follow the installer, find MedJava on your desktop
- **Mac**: Open `MedJava-1.0.0.dmg`, drag MedJava to Applications
- **Linux**: Run `chmod +x MedJava-1.0.0.AppImage && ./MedJava-1.0.0.AppImage` or install the .deb

## What you get

- A standalone desktop app that runs MedJava offline (except for AI calls which need internet)
- System menu bar with keyboard shortcuts (Ctrl+D for dark mode, Ctrl+B for sandbox, F12 for dev tools)
- Proper window icon and taskbar presence
- Installable with desktop shortcut

## App Icon

The build needs a `frontend/assets/icon.png` file (256x256 or 512x512 pixels).
You can create one from the SVG favicon:
1. Open `frontend/assets/favicon.svg` in a browser
2. Screenshot and crop to square
3. Save as `frontend/assets/icon.png`

Or use any online SVG-to-PNG converter.

## Notes

- The desktop app loads `frontend/index.html` directly — no Vercel needed
- API calls go directly to Anthropic from the app (same as the web version)
- Your API key stays encrypted in the app's local storage
- The Java sandbox still requires the Render backend for compilation
- All conversations, streaks, flashcards persist between sessions
