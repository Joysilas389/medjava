const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

const SANDBOX_ROOT = '/tmp/sandbox';
const COMPILE_TIMEOUT_MS = 15000;
const RUN_TIMEOUT_MS = 30000;
const MAX_OUTPUT_BYTES = 10 * 1024 * 1024; // 10 MB
const HEAP_SIZE = '128m';

// Forbidden API patterns
const FORBIDDEN_PATTERNS = [
  'Runtime.getRuntime', 'ProcessBuilder', 'System.exit',
  'sun.misc.Unsafe', 'java.lang.reflect',
  'java.net.Socket', 'java.net.ServerSocket',
  'java.net.URL', 'java.net.HttpURLConnection',
];

function scanForForbidden(code) {
  const lower = code.toLowerCase();
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (code.includes(pattern)) {
      return pattern;
    }
  }
  return null;
}

function runProcess(cmd, args, cwd, timeoutMs, onOutput) {
  return new Promise((resolve) => {
    const start = Date.now();
    const proc = spawn(cmd, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { PATH: process.env.PATH, LANG: 'C.UTF-8', JAVA_HOME: process.env.JAVA_HOME || '' }
    });

    let stdout = '', stderr = '', bytes = 0;

    proc.stdout.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > MAX_OUTPUT_BYTES) { proc.kill('SIGKILL'); return; }
      stdout += chunk.toString();
      onOutput({ type: 'stdout', data: chunk.toString() });
    });

    proc.stderr.on('data', chunk => {
      bytes += chunk.length;
      stderr += chunk.toString();
      onOutput({ type: 'stderr', data: chunk.toString() });
    });

    const timer = setTimeout(() => proc.kill('SIGKILL'), timeoutMs);

    proc.on('close', (exitCode, signal) => {
      clearTimeout(timer);
      resolve({
        stdout, stderr, exitCode,
        killed: signal === 'SIGKILL',
        durationMs: Date.now() - start
      });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        stdout, stderr: stderr + '\n' + err.message,
        exitCode: 1, killed: false,
        durationMs: Date.now() - start
      });
    });
  });
}

async function compileAndRun(files, mainClass, onOutput) {
  const workDir = path.join(SANDBOX_ROOT, randomUUID());
  await fs.mkdir(workDir, { recursive: true });

  try {
    // Write files
    for (const file of files) {
      const fullPath = path.join(workDir, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.content);
    }

    // Compile
    const javaFiles = files.filter(f => f.path.endsWith('.java')).map(f => f.path);
    const compileResult = await runProcess(
      'javac', ['-d', '.', '-Xlint:all', ...javaFiles],
      workDir, COMPILE_TIMEOUT_MS, onOutput
    );

    if (compileResult.exitCode !== 0) {
      return { phase: 'compile', ...compileResult };
    }

    // Run
    const runResult = await runProcess(
      'java', [`-Xmx${HEAP_SIZE}`, '-XX:+UseSerialGC', mainClass],
      workDir, RUN_TIMEOUT_MS, onOutput
    );

    return { phase: 'run', ...runResult };
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// Rate limit for sandbox
const sandboxLimiter = require('express-rate-limit')({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many sandbox runs. Please wait.' }
});

router.post('/run', sandboxLimiter, async (req, res) => {
  const { files, mainClass } = req.body;

  if (!Array.isArray(files) || !mainClass) {
    return res.status(400).json({ error: 'files and mainClass required' });
  }

  // Security scan
  for (const file of files) {
    const forbidden = scanForForbidden(file.content);
    if (forbidden) {
      return res.status(403).json({
        error: `Forbidden API usage detected: ${forbidden}. This API is blocked for sandbox security.`
      });
    }
  }

  // Ensure sandbox root exists
  await fs.mkdir(SANDBOX_ROOT, { recursive: true }).catch(() => {});

  // Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  try {
    const result = await compileAndRun(files, mainClass, send);
    send({ type: 'complete', result });
  } catch (err) {
    send({ type: 'error', message: err.message });
  } finally {
    res.end();
  }
});

router.post('/test', sandboxLimiter, async (req, res) => {
  // Simplified test runner - compiles and looks for JUnit tests
  const { files } = req.body;
  if (!Array.isArray(files)) {
    return res.status(400).json({ error: 'files required' });
  }
  res.json({ passed: 0, failed: 0, total: 0, details: [], message: 'JUnit test runner not yet configured' });
});

module.exports = router;
