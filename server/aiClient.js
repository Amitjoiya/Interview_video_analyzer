const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY });

// Simple retry/backoff similar to index.js
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

// Countdown cooldowns similar to index.js
const modelCooldowns = new Map();

async function generateWithRetries(params, maxRetries = 4) {
  let attempt = 0;
  let lastErr;
  await acquire();
  try {
    const modelName = params && params.model;
    if (modelName && modelCooldowns.has(modelName) && Date.now() < modelCooldowns.get(modelName)) {
      throw new Error(`Model ${modelName} is temporarily on cooldown`);
    }
    while (attempt < maxRetries) {
      try {
        const resp = await ai.models.generateContent(params);
        return resp;
      } catch (err) {
        lastErr = err;
        attempt += 1;
        const code = err && (err.code || (err.error && err.error.code) || (err.status && err.status.code));
        const message = err && (err.message || (err.error && err.error.message) || JSON.stringify(err));
        const isQuotaExceeded = /quota|exceeded|RESOURCE_EXHAUSTED|QuotaFailure/i.test(message || '');
        const isTransient = code === 503 || code === 429 || (message && /overload|unavailable|temporar|rate limit/i.test(message));
        const shouldRetry = !isQuotaExceeded && isTransient && attempt < maxRetries;
        if (!shouldRetry) {
          if (isQuotaExceeded && params && params.model) {
            try {
              const details = err && err.error && err.error.details;
              const retryInfo = details && details.find && details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
              let cooldownMs = 60 * 1000;
              if (retryInfo && retryInfo.retryDelay) {
                const parsed = String(retryInfo.retryDelay).match(/(\d+)(s|ms|m)?/);
                if (parsed) {
                  const v = Number(parsed[1]);
                  const unit = parsed[2] || 's';
                  cooldownMs = unit === 'ms' ? v : unit === 'm' ? v * 60000 : v * 1000;
                }
              }
              modelCooldowns.set(params.model, Date.now() + cooldownMs);
            } catch (cErr) {}
          }
          break;
        }
        const base = 1000 * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * 500);
        const backoff = base + jitter;
        try {
          const retryInfo = err && err.error && err.error.details && err.error.details.find((d) => d['@type'] && d['@type'].includes('RetryInfo'));
          if (retryInfo && retryInfo.retryDelay) {
            const rd = retryInfo.retryDelay || '';
            const parsed = String(rd).match(/(\d+)(s|ms|m)?/);
            if (parsed) {
              const v = Number(parsed[1]);
              const unit = parsed[2] || 's';
              const ms = unit === 'ms' ? v : unit === 'm' ? v * 60000 : v * 1000;
              await sleep(ms);
              continue;
            }
          }
        } catch (riErr) {}
        if ((code === 503 || (message && /overload|unavailable/i.test(message))) && attempt >= 2 && params && params.model) {
          const extraCooldown = 2 * 60 * 1000;
          const existing = modelCooldowns.get(params.model) || 0;
          modelCooldowns.set(params.model, Math.max(existing, Date.now() + extraCooldown));
        }
        // More explicit logging for network errors
        if (err && err.message && typeof err.message === 'string' && /fetch failed sending request/i.test(err.message)) {
          console.error('Model request failed due to network/transport error. Check internet connectivity and GEMINI_API_KEY environment variable.');
        }
        await sleep(backoff);
      }
    }
    throw lastErr;
  } finally {
    release();
  }
}

// Light connectivity check to fail fast if API key or network is invalid
async function checkConnectivity() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    // Try a very small model call to validate key & network
    await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: { parts: [{ text: 'Hello' }] }, config: { temperature: 0, maxOutputTokens: 1 } });
    return true;
  } catch (err) {
    console.error('GenAI connectivity check failed:', err && err.message ? err.message : err);
    return false;
  }
}

module.exports = { generateWithRetries, ai, checkConnectivity };
