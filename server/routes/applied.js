import { Router } from 'express';
import { db, mapApplication, fromJson } from '../db/index.js';
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
    title: job.title || job.jobTitle || 'Untitled',
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

const insertApplication = db.prepare(`
  INSERT OR IGNORE INTO applications (
    user_id, job_id, applicant_name, applicant_email,
    applicant_phone, cover_letter, resume_name,
    apply_url, external, status
  ) VALUES (
    @user_id, @job_id, @applicant_name, @applicant_email,
    @applicant_phone, @cover_letter, @resume_name,
    @apply_url, @external, 'Submitted'
  )
`);

const updateStatus = db.prepare(`
  UPDATE applications SET status = ? WHERE user_id = ? AND job_id = ?
`);

const deleteApp = db.prepare(
  'DELETE FROM applications WHERE user_id = ? AND job_id = ?',
);

const listForUser = db.prepare(`
  SELECT a.*, j.title as job_title, j.company, j.location, j.logo, j.apply_url
  FROM applications a
  JOIN jobs j ON j.id = a.job_id
  WHERE a.user_id = ?
  ORDER BY a.applied_at DESC
`);

const listApplicantsForJob = db.prepare(`
  SELECT a.*, u.name as user_name, u.email as user_email,
         j.title as job_title, j.company, j.location, j.logo, j.apply_url
  FROM applications a
  JOIN users u ON u.id = a.user_id
  JOIN jobs j ON j.id = a.job_id
  WHERE a.job_id = ?
  ORDER BY a.applied_at DESC
`);

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = listForUser.all(req.user.id);
    res.json({ applications: rows.map(mapApplication) });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    const job = b.job || {
      id: b.jobId,
      title: b.jobTitle,
      company: b.company,
      logo: b.logo,
      location: b.location,
      applyUrl: b.applyUrl,
      isReal: b.isReal,
    };
    if (!job?.id) return res.status(400).json({ error: 'job.id is required' });
    upsertExternalJob(job);
    const applicant = b.applicant || {};
    insertApplication.run({
      user_id: req.user.id,
      job_id: job.id,
      applicant_name: applicant.name || '',
      applicant_email: applicant.email || '',
      applicant_phone: applicant.phone || null,
      cover_letter: applicant.coverLetter || null,
      resume_name: applicant.resumeName || null,
      apply_url: job.applyUrl || null,
      external: applicant.external ? 1 : 0,
    });
    res.status(201).json({ ok: true });
  }),
);

router.put(
  '/:jobId/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { status } = req.body || {};
    if (!status) return res.status(400).json({ error: 'status is required' });
    updateStatus.run(status, req.user.id, req.params.jobId);
    res.json({ ok: true });
  }),
);

router.delete(
  '/:jobId',
  requireAuth,
  asyncHandler(async (req, res) => {
    deleteApp.run(req.user.id, req.params.jobId);
    res.json({ ok: true });
  }),
);

router.get(
  '/job/:jobId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const job = findJob.get(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.posted_by && job.posted_by !== req.user.id)
      return res.status(403).json({ error: 'Forbidden' });
    const rows = listApplicantsForJob.all(req.params.jobId);
    res.json({
      applicants: rows.map((r) => ({
        ...mapApplication(r),
        userName: r.user_name,
        userEmail: r.user_email,
      })),
    });
  }),
);

export default router;
