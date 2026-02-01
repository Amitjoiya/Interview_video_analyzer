const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const upload = multer();

dotenv.config();

const { GoogleGenAI } = require('@google/genai');
const pdfParse = require('pdf-parse');
const IORedis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const aiClient = require('./aiClient');

// Import routes
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const subscriptionRoutes = require('./routes/subscription');
const paymentRoutes = require('./routes/payment');

// Import middleware
const { protect, optionalAuth } = require('./middleware/auth');
const { checkCredits } = require('./middleware/creditCheck');

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));

const PORT = process.env.PORT || 5001;

if (!process.env.GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set in server environment. Set server/.env or environment variables.');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY });

// Rate limiting configuration to avoid hitting provider quotas (per-IP)
const MAX_REQUESTS_PER_MINUTE = Number(process.env.MAX_REQUESTS_PER_MINUTE) || 10;
const rateMap = new Map(); // ip -> { count, windowStart }
const RATE_WINDOW_MS = 60 * 1000;

const rateLimiterMiddleware = (req, res, next) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateMap.get(ip) || { count: 0, windowStart: now };
    if (now - entry.windowStart > RATE_WINDOW_MS) {
      entry.windowStart = now;
      entry.count = 0;
    }
    entry.count += 1;
    rateMap.set(ip, entry);
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_MINUTE);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_MINUTE - entry.count));
    if (entry.count > MAX_REQUESTS_PER_MINUTE) {
      res.setHeader('Retry-After', Math.ceil((RATE_WINDOW_MS - (now - entry.windowStart)) / 1000));
      return res.status(429).json({ error: `Rate limit exceeded: max ${MAX_REQUESTS_PER_MINUTE} requests/minute` });
    }
    next();
  } catch (e) {
    // On error in rate limiter, don't block request
    next();
  }
};

// Apply rate limit middleware to generate endpoint only
app.use('/api/generate', rateLimiterMiddleware);

// Redis + Queue for async heavy analysis
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let redisConnection = null;
let analysisQueue = null;
let worker = null;
let redisAvailable = false;

// Try connecting to Redis once with low-timeout and no auto-reconnect to avoid
// repeated ECONNREFUSED logs when Redis is not available. If connection fails,
// fall back to an in-memory job runner.
async function tryConnectRedis(url, timeoutMs = 2000) {
  const opts = {
    maxRetriesPerRequest: 0,
    retryStrategy: null,
    enableAutoPipelining: false,
    connectTimeout: timeoutMs
  };
  const client = new IORedis(url, opts);
  return await new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      client.removeListener('ready', onReady);
      client.removeListener('error', onError);
      clearTimeout(timer);
    };
    const onReady = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(client);
    };
    const onError = (err) => {
      if (settled) return;
      settled = true;
      cleanup();
      try { client.disconnect(); } catch (e) {}
      resolve(null);
    };
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      try { client.disconnect(); } catch (e) {}
      resolve(null);
    }, timeoutMs);
    client.once('ready', onReady);
    client.once('error', onError);
  });
}

// Because we use an async function, run the connect attempt in an IIFE so the
// module-level code can continue to set up an in-memory fallback synchronously
async function initQueue() {
  console.log('Initializing job queue; attempting Redis connection...');
  try {
    const conn = await tryConnectRedis(REDIS_URL, 2000);
    if (conn) {
      redisConnection = conn;
      analysisQueue = new Queue('analysis', { connection: redisConnection });
      worker = new Worker('analysis', async (job) => {
        try {
          console.log(`Processing job ${job.id}`);
          const { data } = job;
          const response = await aiClient.generateWithRetries({ model: data.model, contents: data.contents, config: data.config });
          job.updateProgress(100);
          return { text: response.text || '' };
        } catch (err) {
          console.error('Job worker error', err);
          throw err;
        }
      }, { connection: redisConnection, concurrency: 1 });
      // Register failure handler for worker so we're notified
      worker.on('failed', (job, err) => {
        console.warn(`Job ${job.id} failed: ${err.message || err}`);
      });
      redisAvailable = true;
      console.log('Redis connected; using Redis-backed job queue');
    } else {
      console.warn('Redis not available; falling back to local in-memory job runner');
      redisAvailable = false;
      // Local fallback handled below
    }
  } catch (e) {
    console.warn('Redis connect attempt failed; falling back to local in-memory job runner', e && e.message ? e.message : e);
    redisAvailable = false;
  }
  // If we didn't get a redis queue, set up local fallback now.
  if (!redisAvailable) {
    const localJobStoreInner = new Map();
    analysisQueue = {
      async add(name, data) {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        try {
          const resp = await aiClient.generateWithRetries({ model: data.model, contents: data.contents, config: data.config });
          localJobStoreInner.set(id, { id, state: 'completed', progress: 100, result: { text: resp.text || '' } });
          return { id, returnvalue: { text: resp.text || '' } };
        } catch (err) {
          localJobStoreInner.set(id, { id, state: 'failed', progress: 0, result: null });
          throw err;
        }
      },
      async getJob(id) {
        const job = localJobStoreInner.get(id);
        if (!job) return null;
        return job;
      },
      async getJobCounts() {
        return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
      }
    };
  }
}

// Check GenAI connectivity on server start; this helps with early diagnostics
const { checkConnectivity } = require('./aiClient');
(async () => {
  try {
    const ok = await checkConnectivity();
    if (!ok) {
      console.warn('Warning: GenAI connectivity check failed. Verify GEMINI_API_KEY and network connectivity.');
    } else {
      console.log('GenAI connectivity test passed.');
    }
  } catch (e) {
    console.warn('GenAI check crashed:', e && e.message ? e.message : e);
  }
})();

// Queue will be set in initQueue(); do not pre-assign fallback here.

// Worker 'failed' handler will be registered when the worker is created.

// Retry helper for transient errors (e.g., model overloaded / 503)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Concurrency limiter to avoid hammering the model (lower default to 1)
const MAX_CONCURRENT = Number(process.env.MAX_CONCURRENT) || 1;
let activeRequests = 0;
const queue = [];
const acquire = () => new Promise((resolve) => {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests += 1;
    return resolve();
  }
  queue.push(resolve);
});
const release = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (queue.length > 0) {
    const next = queue.shift();
    activeRequests += 1;
    next();
  }
};

// Model cooldowns: avoid calling a model that has recently hit quota limits
const modelCooldowns = new Map(); // modelName -> cooldownUntil (ms)

// Mock data sets (for initial implementation). Replace with real API/scrapers later.
// Removed mock search data and helper functions for scholarships/jobs

async function generateWithRetries(params, maxRetries = 4) {
  let attempt = 0;
  let lastErr;
  // Ensure we don't exceed provider concurrency
  // modelUsageCounts removed; skip telemetry increment
  await acquire();
  try {
    // Respect model cooldowns
    const modelName = params && params.model;
    if (modelName && modelCooldowns.has(modelName) && Date.now() < modelCooldowns.get(modelName)) {
      throw new Error(`Model ${modelName} is temporarily on cooldown due to recent quota errors`);
    }
    // Telemetry: record model usage
    // modelUsageCounts removed; skip telemetry increment
    while (attempt < maxRetries) {
      try {
        const resp = await ai.models.generateContent(params);
        return resp;
      } catch (err) {
        lastErr = err;
        attempt += 1;
        const code = err && (err.code || (err.error && err.error.code) || (err.status && err.status.code));
        const message = err && (err.message || (err.error && err.error.message) || JSON.stringify(err));
        // If the error indicates quota/resource exhaustion, it's not retryable — fallback to alternate model instead
        const isQuotaExceeded = /quota|exceeded|RESOURCE_EXHAUSTED|QuotaFailure/i.test(message || '');
        // If it's a transient overload or rate limit (not quota), we can retry
        const isTransient = code === 503 || code === 429 || (message && /overload|unavailable|temporar|rate limit/i.test(message));
        const shouldRetry = !isQuotaExceeded && isTransient && attempt < maxRetries;
        if (!shouldRetry) {
          // If quota exceeded, set a cooldown for this model so we don't hammer it
          if (isQuotaExceeded && params && params.model) {
            try {
              const details = err && err.error && err.error.details;
              const retryInfo = details && details.find && details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
              let cooldownMs = 60 * 1000; // default 1 minute
              if (retryInfo && retryInfo.retryDelay) {
                const parsed = String(retryInfo.retryDelay).match(/(\d+)(s|ms|m)?/);
                if (parsed) {
                  const v = Number(parsed[1]);
                  const unit = parsed[2] || 's';
                  cooldownMs = unit === 'ms' ? v : unit === 'm' ? v * 60000 : v * 1000;
                }
              }
              modelCooldowns.set(params.model, Date.now() + cooldownMs);
              console.warn(`Placing model ${params.model} on cooldown for ${cooldownMs}ms due to quota/RESOURCE_EXHAUSTED`);
            } catch (cErr) {
              // ignore
            }
          }
          break;
        }
        // Exponential backoff with jitter — stronger backoff reduces overload burst
        const base = 1000 * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 500);
        const backoff = base + jitter;
        console.warn(`generateWithRetries attempt ${attempt} failed (retrying in ${backoff}ms):`, message || String(err));
        // If provider returned RetryInfo with delay, respect it
        try {
          const retryInfo = err && err.error && err.error.details && err.error.details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
          if (retryInfo && retryInfo.retryDelay) {
            const rd = retryInfo.retryDelay || retryInfo.RetryInfo || '';
            // retryDelay often is like '22s' — parse and use it
            const parsed = String(rd).match(/(\d+)(s|ms|m)?/);
            if (parsed) {
              const v = Number(parsed[1]);
              const unit = parsed[2] || 's';
              const ms = unit === 'ms' ? v : unit === 'm' ? v * 60000 : v * 1000;
              console.warn(`Provider suggested retry delay: ${ms}ms`);
              await sleep(ms);
              continue; // attempt again after provider suggested delay
            }
          }
        } catch (riErr) {
          // ignore parsing errors
        }
        // If we see persistent 503/overload, add an extra cooldown for this model to avoid hammering
        if ((code === 503 || (message && /overload|unavailable/i.test(message))) && attempt >= 2 && params && params.model) {
          const extraCooldown = 2 * 60 * 1000; // 2 minutes
          const existing = modelCooldowns.get(params.model) || 0;
          modelCooldowns.set(params.model, Math.max(existing, Date.now() + extraCooldown));
          console.warn(`Marking model ${params.model} on extra cooldown (${extraCooldown}ms) due to repeated overload/503`);
        }
        await sleep(backoff);
      }
    }
    throw lastErr;
  } finally {
    release();
  }
}

// Generic generate endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-2.5-flash', config = {}, contents } = req.body;

    if (!prompt && !contents) return res.status(400).json({ error: 'prompt or contents is required' });

    // If caller provided a full `contents` object (may include inlineData), forward it directly.
    if (contents) {
      try {
        // If caller wants async job (deep analysis), enqueue instead of immediate call
        if (req.body.async === true) {
          const job = await analysisQueue.add('analysis', { model, contents, config: Object.assign({ temperature: 0.6, topP: 0.9 }, config) });
          return res.json({ jobId: job.id });
        }
        const response = await generateWithRetries({ model, contents, config: Object.assign({ temperature: 0.6, topP: 0.9 }, config) });
        return res.json({ text: response.text || '' });
      } catch (err) {
        console.warn('Primary model failed, checking alternate model...', err && err.message ? err.message : err);
        const altModel = process.env.ALTERNATE_MODEL;
        if (altModel && altModel !== model && !(modelCooldowns.has(altModel) && Date.now() < modelCooldowns.get(altModel))) {
          try {
            const responseAlt = await generateWithRetries({ model: altModel, contents, config: Object.assign({ temperature: 0.6, topP: 0.9 }, config) }, 2);
            console.log(`Switched to alternate model ${altModel}`);
            return res.json({ text: responseAlt.text || '' });
          } catch (altErr) {
            console.error('Alternate model also failed', altErr);
          }
        }
        // If error includes RetryInfo, respond with Retry-After to the caller
        try {
          const details = err && err.error && err.error.details;
          const retryInfo = details && details.find && details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
          if (retryInfo && retryInfo.retryDelay) {
            const parsed = String(retryInfo.retryDelay).match(/(\d+)(s|ms|m)?/);
            if (parsed) {
              const v = Number(parsed[1]);
              const unit = parsed[2] || 's';
              const seconds = unit === 'ms' ? Math.ceil(v / 1000) : unit === 'm' ? v * 60 : v;
              res.setHeader('Retry-After', String(seconds));
              return res.status(429).json({ error: `Provider suggests retry after ${seconds}s` });
            }
          }
        } catch (infoErr) {
          // ignore
        }
        throw err;
      }
    }

    // Fallback: simple text prompt
    try {
      const response = await generateWithRetries({
        model,
        contents: { parts: [{ text: prompt }] },
        config: Object.assign({ temperature: 0.6, topP: 0.9 }, config)
      });
      return res.json({ text: response.text || '' });
    } catch (err) {
      console.warn('Primary model failed for prompt, checking alternate model...', err && err.message ? err.message : err);
      const altModel = process.env.ALTERNATE_MODEL;
      if (altModel && altModel !== model && !(modelCooldowns.has(altModel) && Date.now() < modelCooldowns.get(altModel))) {
        try {
          const responseAlt = await generateWithRetries({ model: altModel, contents: { parts: [{ text: prompt }] }, config: Object.assign({ temperature: 0.6, topP: 0.9 }, config) }, 2);
          console.log(`Switched to alternate model ${altModel}`);
          return res.json({ text: responseAlt.text || '' });
        } catch (altErr) {
          console.error('Alternate model also failed', altErr);
        }
      }
      // If quota error with RetryInfo, return 429 to client with Retry-After header
      try {
        const details = err && err.error && err.error.details;
        const retryInfo = details && details.find && details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
        if (retryInfo && retryInfo.retryDelay) {
          const parsed = String(retryInfo.retryDelay).match(/(\d+)(s|ms|m)?/);
          if (parsed) {
            const v = Number(parsed[1]);
            const unit = parsed[2] || 's';
            const seconds = unit === 'ms' ? Math.ceil(v / 1000) : unit === 'm' ? v * 60 : v;
            res.setHeader('Retry-After', String(seconds));
            return res.status(429).json({ error: `Provider suggests retry after ${seconds}s` });
          }
        }
      } catch (infoErr) {
        // ignore
      }
      throw err;
    }
  } catch (err) {
    console.error('generate error', err);
    const msg = err && err.message ? err.message : String(err);
    // If this is a model cooldown/quota issue, return 429 to client
    if (/cooldown|quota|RESOURCE_EXHAUSTED|exceeded your current quota/i.test(msg)) {
      return res.status(429).json({ error: msg });
    }
    return res.status(500).json({ error: msg });
  }
});

// Simple text extraction endpoint for uploaded file (base64 or file upload)
app.post('/api/extract-text', upload.single('file'), async (req, res) => {
  try {
    // If file uploaded via multipart
    if (req.file) {
      const fileBuffer = req.file.buffer;
      // If PDF, attempt server-side PDF parsing for more reliable extraction
      if (req.file.mimetype === 'application/pdf') {
        try {
          const data = await pdfParse(fileBuffer);
          if (data && data.text && data.text.trim().length > 0) {
            return res.json({ text: data.text });
          }
        } catch (e) {
          console.warn('pdf-parse multipart failed:', e && e.message ? e.message : e);
        }
      }
      // Fallback: return utf8 text
      return res.json({ text: fileBuffer.toString('utf8') });
    }

    // Or handle base64 content
    const { base64, mimeType } = req.body;
    if (base64) {
      const buf = Buffer.from(base64, 'base64');
      // If caller included mimeType and it's PDF (or buffer looks like PDF), try server PDF parsing
      const looksLikePDF = buf.slice(0, 4).toString() === '%PDF';
      if (mimeType === 'application/pdf' || looksLikePDF) {
        try {
          const data = await pdfParse(buf);
          if (data && data.text && data.text.trim().length > 0) {
            return res.json({ text: data.text });
          }
        } catch (e) {
          console.warn('pdf-parse base64 failed:', e && e.message ? e.message : e);
        }
      }
      return res.json({ text: buf.toString('utf8') });
    }

    return res.status(400).json({ error: 'No file or base64 provided' });
  } catch (err) {
    console.error('extract-text error', err);
    return res.status(500).json({ error: (err && err.message) || String(err) });
  }
});

// Enqueue a job directly (alternate route) - useful for frontends that want an explicit enqueue
app.post('/api/enqueue', async (req, res) => {
  try {
    const { model = 'gemini-2.5-flash', contents, config = {} } = req.body;
    if (!contents) return res.status(400).json({ error: 'contents is required' });
    const job = await analysisQueue.add('analysis', { model, contents, config: Object.assign({ temperature: 0.6, topP: 0.9 }, config) });
    return res.json({ jobId: job.id });
  } catch (err) {
    console.error('enqueue error', err);
    return res.status(500).json({ error: (err && err.message) || String(err) });
  }
});

// Search endpoints removed per user request (Find feature removed).

// Job status endpoint
app.get('/api/job/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await analysisQueue.getJob(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    // For bull Job objects, use methods; for fallback objects, use fields
    if (typeof job.getState === 'function') {
      const state = await job.getState();
      const progress = job._progress || 0;
      const returnValue = job.returnvalue || null;
      return res.json({ id: job.id, state, progress, result: returnValue });
    }
    // fallback local job object
    const state = job.state || 'unknown';
    const progress = job.progress || job._progress || 0;
    const result = job.result || job.returnvalue || null;
    return res.json({ id: job.id, state, progress, result });
  } catch (err) {
    console.error('job status error', err);
    return res.status(500).json({ error: (err && err.message) || String(err) });
  }
});

// /api/metrics endpoint removed per user request

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', maxConcurrent: MAX_CONCURRENT, maxRequestsPerMinute: MAX_REQUESTS_PER_MINUTE, nodeVersion: process.version });
});

// Auth & Wallet Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/payment', paymentRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected successfully');
    } else {
      console.warn('MONGODB_URI not set - running without database (wallet features disabled)');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.warn('Continuing without MongoDB - wallet features will be disabled');
  }
};

// Ensure queue initialization is done first, then start server to avoid any
// race conditions. This ensures we know whether Redis or local fallback is used.
initQueue().then(async () => {
  console.log(`Queue mode: ${redisAvailable ? 'redis' : 'local in-memory'}`);
  
  // Connect to MongoDB
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Backend proxy running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init queue; starting server with local fallback', err);
  redisAvailable = false;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Backend proxy running on port ${PORT} (local fallback)`);
    });
  });
});
