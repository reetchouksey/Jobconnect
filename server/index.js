import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import './db/index.js';
import authRouter from './routes/auth.js';
import jobsRouter from './routes/jobs.js';
import savedRouter from './routes/saved.js';
import appliedRouter from './routes/applied.js';
import { optionalAuth } from './middleware/auth.js';

const PORT = Number(process.env.PORT) || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();

const allowedExact = new Set(
  CLIENT_ORIGIN.split(',')
    .map((s) => s.trim())
    .filter(Boolean),
);

const VERCEL_HOST_RE = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
const LOCALHOST_RE = /^http:\/\/localhost(:\d+)?$/i;

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedExact.has(origin)) return true;
  if (VERCEL_HOST_RE.test(origin)) return true;
  if (LOCALHOST_RE.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(optionalAuth);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/saved', savedRouter);
app.use('/api/applications', appliedRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ JobConnect API listening on port ${PORT}`);
  console.log(`   Allowed origin: ${CLIENT_ORIGIN}`);
});
