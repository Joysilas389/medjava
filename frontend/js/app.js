/* ============================================
   MedJava — Main Application Controller
   ============================================ */

(function () {
  // Backend URL — set during deployment
  window.BACKEND_URL = 'https://medjava-backend.onrender.com'; // Will be set from env or settings

  // --- Logo SVG (M + Java Cup) ---
  const LOGO_SVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mj-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#2E75B6"/>
        <stop offset="100%" style="stop-color:#F89820"/>
      </linearGradient>
    </defs>
    <!-- Cup body -->
    <path d="M12 20 h28 v24 q0 12 -14 12 q-14 0 -14 -12 z" fill="url(#mj-grad)" rx="2"/>
    <!-- Cup handle -->
    <path d="M40 26 h6 q6 0 6 8 q0 8 -6 8 h-6" fill="none" stroke="#2E75B6" stroke-width="3" stroke-linecap="round"/>
    <!-- Steam lines -->
    <path d="M20 16 q2 -6 0 -12" fill="none" stroke="#F89820" stroke-width="2" stroke-linecap="round" opacity="0.7">
      <animate attributeName="d" values="M20 16 q2 -6 0 -12;M20 16 q-2 -6 0 -12;M20 16 q2 -6 0 -12" dur="2s" repeatCount="indefinite"/>
    </path>
    <path d="M28 14 q2 -6 0 -12" fill="none" stroke="#F89820" stroke-width="2" stroke-linecap="round" opacity="0.5">
      <animate attributeName="d" values="M28 14 q-2 -6 0 -12;M28 14 q2 -6 0 -12;M28 14 q-2 -6 0 -12" dur="2.5s" repeatCount="indefinite"/>
    </path>
    <path d="M36 16 q2 -6 0 -12" fill="none" stroke="#F89820" stroke-width="2" stroke-linecap="round" opacity="0.6">
      <animate attributeName="d" values="M36 16 q2 -6 0 -12;M36 16 q-2 -6 0 -12;M36 16 q2 -6 0 -12" dur="1.8s" repeatCount="indefinite"/>
    </path>
    <!-- M letter -->
    <text x="15" y="42" font-family="system-ui" font-weight="900" font-size="20" fill="white">M</text>
  </svg>`;

  // --- Initialize ---
  document.addEventListener('DOMContentLoaded', async () => {
    // Inject logos
    document.querySelectorAll('.mj-logo, #welcomeLogo').forEach(el => {
      el.innerHTML = LOGO_SVG;
    });

    // Load saved settings
    loadSettings();

    // Render curriculum
    const currTree = document.getElementById('curriculumTree');
    renderCurriculum(currTree);

    // Render sandbox projects
    const projList = document.getElementById('projectList');
    MJSandbox.renderProjectList(projList);

    // Update progress
    updateProgress();

    // Check API key status
    await updateKeyStatus();

    // --- Event Listeners ---
    setupEventListeners();
  });

  function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);

    // History panel
    document.getElementById('historyToggle')?.addEventListener('click', openHistoryPanel);
    document.getElementById('closeHistory')?.addEventListener('click', () => {
      document.getElementById('historyPanel')?.classList.remove('open');
      hideContextMenu();
    });
    document.getElementById('historySearch')?.addEventListener('input', (e) => {
      renderHistoryList(e.target.value);
    });

    // History tabs (All / Starred)
    document.querySelectorAll('.mj-htab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.mj-htab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentHistoryFilter = tab.dataset.filter;
        const searchVal = document.getElementById('historySearch')?.value || '';
        renderHistoryList(searchVal);
      });
    });

    // History context menu actions
    document.querySelectorAll('.mj-hmenu-item').forEach(btn => {
      btn.addEventListener('click', async () => {
        const action = btn.dataset.action;
        const menu = document.getElementById('historyMenu');
        hideContextMenu();

        if (action === 'star') {
          const isStarred = menu.dataset.starred === 'true';
          await MJChat.updateHistoryEntry(activeMenuEntryId, { starred: !isStarred });
          showToast(isStarred ? 'Removed from starred.' : 'Starred!', 'success');
          renderHistoryList(document.getElementById('historySearch')?.value || '');
        }

        if (action === 'delete') {
          await MJChat.deleteHistoryEntry(activeMenuEntryId);
          showToast('Conversation deleted.', 'danger');
          renderHistoryList(document.getElementById('historySearch')?.value || '');
        }

        if (action === 'rename') {
          const renameInput = document.getElementById('renameInput');
          if (renameInput) renameInput.value = menu.dataset.currentTitle || '';
          new bootstrap.Modal(document.getElementById('renameModal')).show();
        }
      });
    });

    // Rename confirm
    document.getElementById('confirmRename')?.addEventListener('click', async () => {
      const newName = document.getElementById('renameInput')?.value?.trim();
      if (newName && activeMenuEntryId) {
        await MJChat.updateHistoryEntry(activeMenuEntryId, { title: newName });
        bootstrap.Modal.getInstance(document.getElementById('renameModal'))?.hide();
        showToast('Renamed.', 'success');
        renderHistoryList(document.getElementById('historySearch')?.value || '');
      }
    });

    // Close context menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.mj-history-menu') && !e.target.closest('.history-dots')) {
        hideContextMenu();
      }
    });

    // Sidenav toggle (mobile)
    const sideNav = document.getElementById('sideNav');
    const overlay = createOverlay();

    document.getElementById('sidenavToggle')?.addEventListener('click', () => {
      sideNav.classList.add('open');
      overlay.classList.add('active');
    });

    overlay.addEventListener('click', () => {
      sideNav.classList.remove('open');
      overlay.classList.remove('active');
    });

    document.getElementById('backToNav')?.addEventListener('click', () => {
      sideNav.classList.add('open');
      overlay.classList.add('active');
    });

    // Chat input
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    userInput?.addEventListener('input', () => {
      sendBtn.disabled = !userInput.value.trim();
      autoResize(userInput);
    });

    userInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (userInput.value.trim()) {
          ensureChatOpen();
          sendWithFiles(userInput);
        }
      }
    });

    sendBtn?.addEventListener('click', () => {
      if (userInput.value.trim()) {
        ensureChatOpen();
        sendWithFiles(userInput);
      }
    });

    // Welcome screen free chat
    const welcomeInput = document.getElementById('welcomeInput');
    const welcomeSendBtn = document.getElementById('welcomeSendBtn');

    welcomeInput?.addEventListener('input', () => {
      welcomeSendBtn.disabled = !welcomeInput.value.trim();
      autoResize(welcomeInput);
    });
    welcomeInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (welcomeInput.value.trim()) {
          startFreeChat(welcomeInput.value.trim());
          welcomeInput.value = '';
          welcomeSendBtn.disabled = true;
          autoResize(welcomeInput);
        }
      }
    });
    welcomeSendBtn?.addEventListener('click', () => {
      if (welcomeInput.value.trim()) {
        startFreeChat(welcomeInput.value.trim());
        welcomeInput.value = '';
        welcomeSendBtn.disabled = true;
      }
    });

    // File upload handling
    const fileUploadWelcome = document.getElementById('fileUpload');
    const fileUploadChat = document.getElementById('chatFileUpload');
    
    fileUploadWelcome?.addEventListener('change', (e) => handleFileSelect(e, 'filePreview', true));
    fileUploadChat?.addEventListener('change', (e) => handleFileSelect(e, 'chatFilePreview', false));

    // Quick chips
    document.querySelectorAll('.mj-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const msg = chip.dataset.msg;
        if (msg) MJChat.sendMessage(msg);
      });
    });

    // Scroll to bottom button
    const chatMessages = document.getElementById('chatMessages');
    const scrollBtn = document.getElementById('scrollBottomBtn');
    if (chatMessages && scrollBtn) {
      chatMessages.addEventListener('scroll', () => {
        const distFromBottom = chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight;
        scrollBtn.style.display = distFromBottom > 200 ? 'flex' : 'none';
      });
      scrollBtn.addEventListener('click', () => {
        chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });
      });
    }

    // Notes panel
    document.getElementById('notesToggle')?.addEventListener('click', () => {
      const panel = document.getElementById('notesPanel');
      if (panel.style.display === 'none') {
        panel.style.display = 'flex';
        loadNotes();
      } else {
        panel.style.display = 'none';
      }
    });
    document.getElementById('closeNotes')?.addEventListener('click', () => {
      document.getElementById('notesPanel').style.display = 'none';
    });
    document.getElementById('saveNotes')?.addEventListener('click', saveCurrentNotes);

    // Topic complete button
    document.getElementById('topicCompleteBtn')?.addEventListener('click', () => {
      const btn = document.getElementById('topicCompleteBtn');
      const topicId = MJChat.currentTopicId;
      if (!topicId) return;
      const isCompleted = btn.classList.contains('completed');
      if (isCompleted) {
        btn.classList.remove('completed');
        updateTopicStatus(topicId, 'in-progress');
        showToast('Topic marked as in progress.', 'info');
      } else {
        btn.classList.add('completed');
        updateTopicStatus(topicId, 'completed');
        showToast('Topic marked as complete!', 'success');
      }
      updateProgress();
      const tree = document.getElementById('curriculumTree');
      renderCurriculum(tree);
    });

    // Welcome cards
    document.querySelectorAll('.mj-quick-card').forEach(card => {
      card.addEventListener('click', () => {
        const action = card.dataset.action;
        if (action === 'settings') {
          new bootstrap.Modal(document.getElementById('settingsModal')).show();
        } else if (action === 'sandbox') {
          showSandbox();
        } else if (action === 'topic6') {
          openTopicById('java-while', 'Java While Loop', 'Java Foundations');
        } else if (action === 'continue') {
          openTopicById('java-while', 'Java While Loop', 'Java Foundations');
        }
      });
    });

    // Sandbox buttons
    document.getElementById('openSandbox')?.addEventListener('click', showSandbox);
    document.getElementById('closeSandbox')?.addEventListener('click', hideSandbox);
    document.getElementById('runCode')?.addEventListener('click', MJSandbox.runCode);
    document.getElementById('resetCode')?.addEventListener('click', MJSandbox.resetCode);
    document.getElementById('clearConsole')?.addEventListener('click', () => {
      document.getElementById('consoleOutput').innerHTML = '<span class="text-muted">Console cleared.</span>';
    });
    document.getElementById('copyLog')?.addEventListener('click', () => {
      const log = document.getElementById('consoleOutput')?.textContent || '';
      navigator.clipboard.writeText(log).then(() => {
        showToast('Console log copied.', 'success');
      });
    });
    document.getElementById('askTutor')?.addEventListener('click', () => {
      const code = document.getElementById('codeEditor')?.value;
      if (code) {
        hideSandbox();
        MJChat.sendMessage(`Help me with this code:\n\`\`\`java\n${code}\n\`\`\``);
      }
    });

    // Draggable divider between code editor and console
    const divider = document.getElementById('sandboxDivider');
    if (divider) {
      let startY = 0, startEditorH = 0, startConsoleH = 0;
      const sandboxBody = document.querySelector('.mj-sandbox-body');
      const editorArea = document.querySelector('.mj-sandbox-editor');
      const consoleArea = document.querySelector('.mj-sandbox-console');

      function onDragStart(e) {
        e.preventDefault();
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        startY = y;
        startEditorH = editorArea.getBoundingClientRect().height;
        startConsoleH = consoleArea.getBoundingClientRect().height;
        divider.classList.add('dragging');
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', onDragEnd);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', onDragEnd);
      }

      function onDrag(e) {
        e.preventDefault();
        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const diff = y - startY;
        const newEditorH = Math.max(100, startEditorH + diff);
        const newConsoleH = Math.max(80, startConsoleH - diff);
        if (sandboxBody) {
          sandboxBody.style.gridTemplateRows = `auto ${newEditorH}px ${newConsoleH}px`;
        }
      }

      function onDragEnd() {
        divider.classList.remove('dragging');
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', onDragEnd);
      }

      divider.addEventListener('mousedown', onDragStart);
      divider.addEventListener('touchstart', onDragStart, { passive: false });
    }

    // Settings
    document.getElementById('saveKeyBtn')?.addEventListener('click', saveApiKey);
    document.getElementById('rotateKeyBtn')?.addEventListener('click', () => {
      document.getElementById('apiKeyInput').value = '';
      document.getElementById('apiKeyInput').focus();
    });
    document.getElementById('deleteKeyBtn')?.addEventListener('click', async () => {
      await MJCrypto.deleteKey();
      await updateKeyStatus();
      showToast('API key deleted.', 'warning');
    });

    document.getElementById('maxTokens')?.addEventListener('input', (e) => {
      document.getElementById('tokenDisplay').textContent = e.target.value;
    });

    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
      setTheme(e.target.value);
      saveSettings();
    });

    document.getElementById('fontSizeSelect')?.addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-font', e.target.value);
      saveSettings();
    });

    document.getElementById('exportProgress')?.addEventListener('click', exportProgress);

    document.getElementById('clearAllData')?.addEventListener('click', () => {
      new bootstrap.Modal(document.getElementById('clearConfirmModal')).show();
    });

    document.getElementById('confirmClear')?.addEventListener('click', async () => {
      await MJCrypto.clearAll();
      await MJChat.clearAllConversations();
      localStorage.clear();
      bootstrap.Modal.getInstance(document.getElementById('clearConfirmModal'))?.hide();
      bootstrap.Modal.getInstance(document.getElementById('settingsModal'))?.hide();
      showToast('All data cleared.', 'danger');
      setTimeout(() => location.reload(), 1000);
    });

    // Curriculum search
    document.getElementById('curriculumSearch')?.addEventListener('input', (e) => {
      const tree = document.getElementById('curriculumTree');
      renderCurriculum(tree, e.target.value);
    });

    // Ask the Web button
    document.getElementById('askWebBtn')?.addEventListener('click', () => {
      const input = document.getElementById('userInput');
      if (input) {
        input.placeholder = 'Type a factual Java question to search the web...';
        input.focus();
      }
    });
  }

  // --- Navigation ---
  function openTopicById(topicId, title, section) {
    document.getElementById('welcomeScreen')?.classList.add('d-none');
    document.getElementById('sandboxContainer')?.classList.add('d-none');
    document.getElementById('chatContainer')?.classList.remove('d-none');

    // Close mobile nav
    document.getElementById('sideNav')?.classList.remove('open');
    document.querySelector('.mj-sidenav-overlay')?.classList.remove('active');

    // Highlight in nav
    document.querySelectorAll('.mj-topic-item').forEach(item => {
      item.classList.toggle('active', item.dataset.topicId === topicId);
    });

    MJChat.openTopic(topicId, title, section);

    // Update context panel
    document.getElementById('topicMeta').innerHTML = `
      <p class="fw-semibold mb-1" style="color: var(--mj-text);">${title}</p>
      <p class="small mb-2" style="color: var(--mj-muted);">${section}</p>
      <div class="progress" style="height: 4px;">
        <div class="progress-bar" style="width: ${getProgress()}%; background: var(--mj-primary);"></div>
      </div>
    `;
  }

  function showSandbox() {
    document.getElementById('welcomeScreen')?.classList.add('d-none');
    document.getElementById('chatContainer')?.classList.add('d-none');
    document.getElementById('sandboxContainer')?.classList.remove('d-none');
    document.getElementById('sideNav')?.classList.remove('open');
    document.querySelector('.mj-sidenav-overlay')?.classList.remove('active');

    // Load first project if none selected
    if (!document.querySelector('.mj-project-item.active')) {
      MJSandbox.loadProject('proj-triage');
    }
  }

  function hideSandbox() {
    document.getElementById('sandboxContainer')?.classList.add('d-none');
    if (MJChat.currentTopicId) {
      document.getElementById('chatContainer')?.classList.remove('d-none');
    } else {
      document.getElementById('welcomeScreen')?.classList.remove('d-none');
    }
  }

  // --- Theme ---
  function setTheme(theme) {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.getElementById('themeSelect').value = next;
    updateThemeIcon();
    saveSettings();
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const icon = document.getElementById('themeIcon');
    if (icon) {
      icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  // --- Settings Persistence ---
  function saveSettings() {
    const settings = {
      theme: document.getElementById('themeSelect')?.value || 'light',
      fontSize: document.getElementById('fontSizeSelect')?.value || 'medium',
      model: document.getElementById('modelSelect')?.value || 'claude-sonnet-4-20250514',
      maxTokens: document.getElementById('maxTokens')?.value || '4000',
      webScrape: document.getElementById('webScrapeToggle')?.checked ?? true,
    };
    localStorage.setItem('medjava-settings', JSON.stringify(settings));
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem('medjava-settings');
      if (!raw) return;
      const s = JSON.parse(raw);

      if (s.theme) {
        setTheme(s.theme);
        const sel = document.getElementById('themeSelect');
        if (sel) sel.value = s.theme;
      }
      if (s.fontSize) {
        document.documentElement.setAttribute('data-font', s.fontSize);
        const sel = document.getElementById('fontSizeSelect');
        if (sel) sel.value = s.fontSize;
      }
      if (s.model) {
        const sel = document.getElementById('modelSelect');
        if (sel) sel.value = s.model;
      }
      if (s.maxTokens) {
        const sl = document.getElementById('maxTokens');
        if (sl) sl.value = s.maxTokens;
        const disp = document.getElementById('tokenDisplay');
        if (disp) disp.textContent = s.maxTokens;
      }
      if (typeof s.webScrape === 'boolean') {
        const tog = document.getElementById('webScrapeToggle');
        if (tog) tog.checked = s.webScrape;
      }
    } catch {
      // ignore
    }
  }

  // --- API Key ---
  async function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input?.value?.trim();
    if (!key) {
      showToast('Please enter an API key.', 'warning');
      return;
    }
    if (!key.startsWith('sk-')) {
      showToast('Invalid API key format. Should start with sk-', 'danger');
      return;
    }

    try {
      await MJCrypto.saveKey(key);
      input.value = '';
      await updateKeyStatus();
      showToast('API key encrypted and saved securely.', 'success');
      saveSettings();
    } catch (e) {
      showToast('Failed to save key: ' + e.message, 'danger');
    }
  }

  async function updateKeyStatus() {
    const hasKey = await MJCrypto.hasKey();
    const statusEl = document.getElementById('keyStatus');
    const rotateBtn = document.getElementById('rotateKeyBtn');
    const deleteBtn = document.getElementById('deleteKeyBtn');

    if (hasKey) {
      statusEl.innerHTML = '<i class="fas fa-check-circle text-success"></i> Key saved (encrypted)';
      statusEl.style.color = 'var(--mj-success)';
      if (rotateBtn) rotateBtn.style.display = 'block';
      if (deleteBtn) deleteBtn.style.display = 'block';
    } else {
      statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> No key saved.';
      statusEl.style.color = 'var(--mj-warning)';
      if (rotateBtn) rotateBtn.style.display = 'none';
      if (deleteBtn) deleteBtn.style.display = 'none';
    }
  }

  // --- Progress ---
  function updateProgress() {
    const pct = getProgress();
    const el = document.getElementById('globalProgress');
    if (el) el.textContent = pct + '%';
  }

  function exportProgress() {
    const data = {
      exportedAt: new Date().toISOString(),
      progress: getProgress(),
      curriculum: CURRICULUM.map(s => ({
        section: s.title,
        topics: s.topics.map(t => ({ title: t.title, status: t.status }))
      }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medjava-progress-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Progress exported.', 'success');
  }

  // --- Helpers ---
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'mj-sidenav-overlay';
    document.body.appendChild(overlay);
    return overlay;
  }

  function autoResize(textarea) {
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const colors = {
      success: 'var(--mj-success)',
      danger: 'var(--mj-danger)',
      warning: 'var(--mj-warning)',
      info: 'var(--mj-primary)',
    };
    const icons = {
      success: 'fa-check-circle',
      danger: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
    };

    const toast = document.createElement('div');
    toast.className = 'toast mj-toast show';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <div class="toast-body d-flex align-items-center gap-2" style="padding: 12px 16px;">
        <i class="fas ${icons[type]}" style="color: ${colors[type]};"></i>
        <span style="font-size: 0.88rem;">${message}</span>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // --- Free Chat (no topic selected) ---
  let pendingFiles = []; // { name, type, dataUrl }

  function startFreeChat(text) {
    const chatId = 'free-chat-' + Date.now();
    const title = text.substring(0, 40) + (text.length > 40 ? '...' : '');
    openTopicById(chatId, title, 'Free Chat');
    
    let msgToSend = text;
    if (pendingFiles.length > 0) {
      const fileDesc = pendingFiles.map(f => `[Uploaded: ${f.name}]`).join('\n');
      msgToSend = text + '\n\n' + fileDesc;
      clearFilePreview('filePreview');
    }
    // Wait for topic to open, then send
    setTimeout(() => MJChat.sendMessage(msgToSend), 400);
  }

  function ensureChatOpen() {
    if (!MJChat.currentTopicId) {
      const chatId = 'free-chat-' + Date.now();
      openTopicById(chatId, 'Quick Question', 'Free Chat');
    }
  }

  function sendWithFiles(inputEl) {
    let text = inputEl.value.trim();
    const previewId = inputEl.id === 'userInput' ? 'chatFilePreview' : 'filePreview';
    
    if (pendingFiles.length > 0) {
      // For images, send as base64 description
      const fileDescs = pendingFiles.map(f => {
        if (f.type.startsWith('image/')) {
          return `[Image uploaded: ${f.name}]\n(I've uploaded an image. Please analyze it and explain what you see using the MedJava teaching method.)`;
        } else {
          return `[File: ${f.name}]\n\`\`\`\n${f.content || '(binary file)'}\n\`\`\``;
        }
      }).join('\n\n');
      text = text + '\n\n' + fileDescs;
      clearFilePreview(previewId);
    }

    MJChat.sendMessage(text);
    inputEl.value = '';
    document.getElementById('sendBtn').disabled = true;
    autoResize(inputEl);
  }

  function handleFileSelect(event, previewId, isWelcome) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const previewEl = document.getElementById(previewId);
    previewEl.style.display = 'flex';
    previewEl.className = 'mj-file-preview';

    files.forEach(file => {
      const reader = new FileReader();
      
      if (file.type.startsWith('image/')) {
        reader.onload = (e) => {
          pendingFiles.push({ name: file.name, type: file.type, dataUrl: e.target.result, content: null });
          addFileChip(previewEl, file.name, e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        reader.onload = (e) => {
          const content = e.target.result;
          pendingFiles.push({ name: file.name, type: file.type, dataUrl: null, content });
          addFileChip(previewEl, file.name, null);
        };
        reader.readAsText(file);
      }
    });

    // Enable send button
    if (isWelcome) {
      document.getElementById('welcomeSendBtn').disabled = false;
    } else {
      document.getElementById('sendBtn').disabled = false;
    }

    // Reset file input
    event.target.value = '';
  }

  function addFileChip(container, name, imgUrl) {
    const chip = document.createElement('div');
    chip.className = 'mj-file-chip';
    chip.innerHTML = `
      ${imgUrl ? `<img src="${imgUrl}" alt="${name}">` : '<i class="fas fa-file-code" style="color:var(--mj-primary)"></i>'}
      <span>${name}</span>
      <span class="remove-file" onclick="this.closest('.mj-file-chip').remove()"><i class="fas fa-xmark"></i></span>
    `;
    container.appendChild(chip);
  }

  function clearFilePreview(previewId) {
    pendingFiles = [];
    const el = document.getElementById(previewId);
    if (el) { el.innerHTML = ''; el.style.display = 'none'; }
  }

  // --- Notes ---
  function loadNotes() {
    const topicId = MJChat.currentTopicId;
    if (!topicId) return;
    const notes = localStorage.getItem('medjava-notes-' + topicId) || '';
    document.getElementById('notesEditor').value = notes;
    document.getElementById('notesSaved').textContent = '';
  }

  function saveCurrentNotes() {
    const topicId = MJChat.currentTopicId;
    if (!topicId) return;
    const notes = document.getElementById('notesEditor')?.value || '';
    localStorage.setItem('medjava-notes-' + topicId, notes);
    document.getElementById('notesSaved').textContent = 'Saved ✓';
    showToast('Notes saved.', 'success');
  }

  // --- History Panel ---
  let currentHistoryFilter = 'all';
  let activeMenuEntryId = null;

  async function openHistoryPanel() {
    document.getElementById('historyPanel')?.classList.add('open');
    await renderHistoryList();
  }

  async function renderHistoryList(searchText = '') {
    const list = document.getElementById('historyList');
    if (!list) return;

    const entries = await MJChat.getHistoryEntries(currentHistoryFilter);
    const lower = searchText.toLowerCase();
    const filtered = searchText
      ? entries.filter(e => e.title.toLowerCase().includes(lower) || e.topicTitle.toLowerCase().includes(lower))
      : entries;

    if (filtered.length === 0) {
      list.innerHTML = `<div class="mj-history-empty">${currentHistoryFilter === 'starred' ? 'No starred conversations.' : 'No conversations yet.'}</div>`;
      return;
    }

    list.innerHTML = filtered.map(entry => {
      const date = new Date(entry.timestamp);
      const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const starIcon = entry.starred ? '<i class="fas fa-star history-star"></i>' : '';
      return `
        <div class="mj-history-item" data-entry-id="${entry.id}" data-topic-id="${entry.topicId}" data-topic-title="${escapeHtmlSimple(entry.topicTitle)}" data-section-title="${escapeHtmlSimple(entry.sectionTitle)}">
          ${starIcon}
          <div class="history-content">
            <span class="history-title">${escapeHtmlSimple(entry.title)}</span>
            <span class="history-topic">${escapeHtmlSimple(entry.topicTitle)} — ${escapeHtmlSimple(entry.sectionTitle)}</span>
            <span class="history-time">${timeStr}</span>
          </div>
          <button class="history-dots" data-entry-id="${entry.id}" data-starred="${entry.starred ? 'true' : 'false'}" data-title="${escapeHtmlSimple(entry.title)}">
            <i class="fas fa-ellipsis-vertical"></i>
          </button>
        </div>
      `;
    }).join('');

    // Click on item content to open
    list.querySelectorAll('.history-content').forEach(content => {
      content.addEventListener('click', () => {
        const item = content.closest('.mj-history-item');
        document.getElementById('historyPanel')?.classList.remove('open');
        hideContextMenu();
        openTopicById(item.dataset.topicId, item.dataset.topicTitle, item.dataset.sectionTitle);
      });
    });

    // Click on 3-dot button to show menu
    list.querySelectorAll('.history-dots').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        activeMenuEntryId = parseInt(btn.dataset.entryId);
        const isStarred = btn.dataset.starred === 'true';
        showContextMenu(e, isStarred, btn.dataset.title);
      });
    });
  }

  function showContextMenu(e, isStarred, currentTitle) {
    const menu = document.getElementById('historyMenu');
    if (!menu) return;

    // Update star button text
    const starBtn = menu.querySelector('[data-action="star"]');
    if (starBtn) {
      starBtn.innerHTML = isStarred
        ? '<i class="fas fa-star-half-stroke"></i> Unstar'
        : '<i class="fas fa-star"></i> Star';
    }

    // Position near the button
    const rect = e.target.closest('.history-dots').getBoundingClientRect();
    menu.style.display = 'block';
    menu.style.top = rect.bottom + 4 + 'px';
    menu.style.right = (window.innerWidth - rect.right) + 'px';
    menu.style.left = 'auto';

    // Store current title for rename
    menu.dataset.currentTitle = currentTitle || '';
    menu.dataset.starred = isStarred ? 'true' : 'false';
  }

  function hideContextMenu() {
    const menu = document.getElementById('historyMenu');
    if (menu) menu.style.display = 'none';
  }

  function escapeHtmlSimple(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Public API ---
  window.MJApp = {
    openTopic: openTopicById,
    showSandbox,
    hideSandbox,
    showToast,
    openSandboxWithCode(code) {
      showSandbox();
      // If the code is NOT a complete class, wrap it in one
      const trimmed = code.trim();
      let fullCode = trimmed;
      if (!trimmed.includes('public class ') && !trimmed.includes('class ')) {
        // Extract class name from the code or use default
        const className = 'MedJavaSnippet';
        // Check if it already has a main method
        if (!trimmed.includes('public static void main')) {
          fullCode = `public class ${className} {\n    public static void main(String[] args) {\n        ${trimmed.split('\n').join('\n        ')}\n    }\n}`;
        } else {
          fullCode = `public class ${className} {\n    ${trimmed.split('\n').join('\n    ')}\n}`;
        }
      }
      MJSandbox.loadCodeIntoSandbox(fullCode);
    }
  };
})();
