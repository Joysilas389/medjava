const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

// Keep a global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 380,
    minHeight: 600,
    title: 'MedJava — Learn Java. Build Medical Software. Save Lives.',
    icon: path.join(__dirname, '..', 'frontend', 'assets', 'favicon.svg'),
    backgroundColor: '#2B2B2B',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    },
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    show: false // Show after ready-to-show
  });

  // Load the frontend
  mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'index.html'));

  // Show when ready (prevents white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Build menu
function buildMenu() {
  const template = [
    {
      label: 'MedJava',
      submenu: [
        { label: 'About MedJava', click: showAbout },
        { type: 'separator' },
        {
          label: 'Toggle Dark/Light Mode',
          accelerator: 'CmdOrCtrl+D',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              const html = document.documentElement;
              const current = html.getAttribute('data-theme');
              html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
              localStorage.setItem('medjava-theme', current === 'dark' ? 'light' : 'dark');
            `);
          }
        },
        { type: 'separator' },
        { role: 'quit', label: 'Quit MedJava' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', accelerator: 'CmdOrCtrl+R' },
        { role: 'forceReload', accelerator: 'CmdOrCtrl+Shift+R' },
        { type: 'separator' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { role: 'resetZoom' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { type: 'separator' },
        { role: 'toggleDevTools', accelerator: 'F12' }
      ]
    },
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Home',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              document.getElementById('welcomeScreen').classList.remove('d-none');
              document.getElementById('chatContainer').classList.add('d-none');
            `);
          }
        },
        {
          label: 'Open Sandbox',
          accelerator: 'CmdOrCtrl+B',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              if (window.MJApp) MJApp.showSandbox();
            `);
          }
        },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.executeJavaScript(`
              const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
              modal.show();
            `);
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Anthropic Documentation',
          click: () => shell.openExternal('https://docs.anthropic.com')
        },
        {
          label: 'Java Documentation',
          click: () => shell.openExternal('https://docs.oracle.com/en/java/')
        },
        {
          label: 'W3Schools Java',
          click: () => shell.openExternal('https://www.w3schools.com/java/')
        },
        { type: 'separator' },
        { label: 'About', click: showAbout }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function showAbout() {
  dialog.showMessageBox(mainWindow, {
    type: 'info',
    title: 'About MedJava',
    message: 'MedJava v1.0',
    detail: 'Learn Java. Build Medical Software. Save Lives.\n\nBuilt for Dr. Agbesi — a medical doctor learning to build the software that saves lives.\n\nPowered by Anthropic Claude API.\n\n© 2025 MedJava',
    buttons: ['OK']
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();
  buildMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Security: prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event) => {
    event.preventDefault();
  });
});
