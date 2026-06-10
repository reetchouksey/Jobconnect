import { Router } from 'express';
import { db, mapJob, fromJson } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

const findJob = db.prepare('SELECT * FROM jobs WHERE id = ?');
const insertJobIfMissing = db.prepare(`
  INSERT OR IGNORE INTO jobs (
    id, title, company, location, type, experience,
    salary_min, salary_max, description,
    responsibilities, requirements, skills,
    logo, source, apply_url, is_real, posted_at
  ) VALUES (
    @id, @title, @company, @location, @type, @experience,
    @salary_min, @salary_max, @description,
    @responsibilities, @requirements, @skills,
    @logo, @source, @apply_url, @is_real, datetime('now')
  )
`);

const upsertExternalJob = (job) => {
  if (!job?.id) return;
  if (findJob.get(job.id)) return;
  insertJobIfMissing.run({
    id: job.id,
    title: job.title || 'Untitled',
    company: job.company || 'Unknown',
    location: job.location || '',
    type: job.type || 'Full Time',
    experience: job.experience || 'Mid Level',
    salary_min: job.salaryMin || null,
    salary_max: job.salaryMax || null,
    description: job.description || '',
    responsibilities: fromJson(job.responsibilities || []),
    requirements: fromJson(job.requirements || []),
    skills: fromJson(job.skills || []),
    logo: job.logo || null,
    source: job.source || 'external',
    apply_url: job.applyUrl || null,
    is_real: job.isReal ? 1 : 0,
  });
};

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = db
      .prepare(
        `SELECT j.*, s.saved_at
         FROM saved_jobs s
         JOIN jobs j ON j.id = s.job_id
         WHERE s.user_id = ?
         ORDER BY s.saved_at DESC`,
      )
      .all(req.user.id);
    res.json({
      saved: rows.map((r) => ({ ...mapJob(r), savedAt: r.saved_at })),
    });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const job = req.body?.job || req.body;
    if (!job?.id) return res.status(400).json({ error: 'job.id is required' });
    upsertExternalJob(job);
    db.prepare(
      'INSERT OR IGNORE INTO saved_jobs (user_id, job_id) VALUES (?, ?)',
    ).run(req.user.id, job.id);
    res.status(201).json({ ok: true });
  }),
);

router.delete(
  '/:jobId',
  requireAuth,
  asyncHandler(async (req, res) => {
    db.prepare('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?').run(
      req.user.id,
      req.params.jobId,
    );
    res.json({ ok: true });
  }),
);

export default router;
