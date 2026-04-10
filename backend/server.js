const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const chatRoutes = require('./routes/chat');
const scrapeRoutes = require('./routes/scrape');
const sandboxRoutes = require('./routes/sandbox');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// Security
app.use(helmet());
app.use(cors({
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { error: 'Too many requests. Please wait a moment.' }
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '5mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'medjava-backend', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/scrape', scrapeRoutes);
app.use('/api/sandbox', sandboxRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`MedJava backend running on port ${PORT}`);
  console.log(`CORS origin: ${ALLOWED_ORIGIN}`);
});
