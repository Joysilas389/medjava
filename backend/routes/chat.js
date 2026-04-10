const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { model, max_tokens, system, messages, apiKey } = req.body;

  if (!apiKey || !messages) {
    return res.status(400).json({ error: 'apiKey and messages are required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: max_tokens || 4000,
        system: system || '',
        messages,
        stream: true
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }
    } finally {
      res.end();
    }
  } catch (err) {
    console.error('Chat proxy error:', err.message);
    res.status(500).json({ error: 'Failed to reach Anthropic API' });
  }
});

module.exports = router;
