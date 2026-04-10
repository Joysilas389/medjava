/* ============================================
   MedJava — Client-Side Key Encryption
   Web Crypto API (AES-GCM + PBKDF2)
   ============================================ */

const MJCrypto = (() => {
  const DB_NAME = 'medjava-secure';
  const DB_VERSION = 1;
  const STORE_NAME = 'keys';
  const KEY_ID = 'anthropic-api-key';
  const ITERATIONS = 250000;

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  function getPassphrase() {
    // Use a device-bound passphrase. In production, derive from
    // hardware identifiers or a user-chosen passphrase.
    const ua = navigator.userAgent;
    const lang = navigator.language;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `medjava::${ua}::${lang}::${tz}`;
  }

  async function encryptKey(apiKey) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const passphrase = getPassphrase();
    const aesKey = await deriveKey(passphrase, salt);
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      enc.encode(apiKey)
    );
    return {
      ct: Array.from(new Uint8Array(ciphertext)),
      iv: Array.from(iv),
      salt: Array.from(salt)
    };
  }

  async function decryptKey(stored) {
    const passphrase = getPassphrase();
    const salt = new Uint8Array(stored.salt);
    const iv = new Uint8Array(stored.iv);
    const ct = new Uint8Array(stored.ct);
    const aesKey = await deriveKey(passphrase, salt);
    const plainBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, aesKey, ct
    );
    return new TextDecoder().decode(plainBuffer);
  }

  async function saveKey(apiKey) {
    const encrypted = await encryptKey(apiKey);
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put({ id: KEY_ID, ...encrypted, savedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function loadKey() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(KEY_ID);
      req.onsuccess = async () => {
        if (!req.result) return resolve(null);
        try {
          const key = await decryptKey(req.result);
          resolve(key);
        } catch (e) {
          console.error('Decryption failed:', e);
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  }

  async function hasKey() {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(KEY_ID);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  }

  async function deleteKey() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(KEY_ID);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  async function clearAll() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }

  return { saveKey, loadKey, hasKey, deleteKey, clearAll };
})();
