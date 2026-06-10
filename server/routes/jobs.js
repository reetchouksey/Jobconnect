import { Router } from 'express';
import { db, mapJob, fromJson } from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, generateId } from '../utils/asyncHandler.js';

const router = Router();

const findJobById = db.prepare('SELECT * FROM jobs WHERE id = ?');
const deleteJobStmt = db.prepare('DELETE FROM jobs WHERE id = ?');

const insertJob = db.prepare(`
  INSERT INTO jobs (
    id, title, company, location, type, experience,
    salary_min, salary_max, description,
    responsibilities, requirements, skills,
    logo, trending, source, apply_url, is_real,
    posted_by, posted_at
  ) VALUES (
    @id, @title, @company, @location, @type, @experience,
    @salary_min, @salary_max, @description,
    @responsibilities, @requirements, @skills,
    @logo, @trending, @source, @apply_url, @is_real,
    @posted_by, datetime('now')
  )
`);

const updateJobStmt = db.prepare(`
  UPDATE jobs SET
    title = @title,
    company = @company,
    location = @location,
    type = @type,
    experience = @experience,
    salary_min = @salary_min,
    salary_max = @salary_max,
    description = @description,
    responsibilities = @responsibilities,
    requirements = @requirements,
    skills = @skills,
    logo = @logo,
    trending = @trending,
    apply_url = @apply_url,
    updated_at = datetime('now')
  WHERE id = @id
`);

const buildPayload = (b, postedBy) => ({
  title: b.title,
  company: b.company,
  location: b.location,
  type: b.type || 'Full Time',
  experience: b.experience || 'Mid Level',
  salary_min: b.salaryMin ? Number(b.salaryMin) : null,
  salary_max: b.salaryMax ? Number(b.salaryMax) : null,
  description: b.description || '',
  responsibilities: fromJson(b.responsibilities || []),
  requirements: fromJson(b.requirements || []),
  skills: fromJson(b.skills || []),
  logo: b.logo || null,
  trending: b.trending ? 1 : 0,
  source: b.source || 'local',
  apply_url: b.applyUrl || null,
  is_real: b.isReal ? 1 : 0,
  posted_by: postedBy,
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const {
      search,
      location,
      company,
      type,
      experience,
      salaryMin,
      salaryMax,
      mine,
      sort = 'recent',
      limit = 200,
      offset = 0,
    } = req.query;

    const conditions = [];
    const params = {};

    if (search) {
      conditions.push(
        '(LOWER(title) LIKE @search OR LOWER(company) LIKE @search OR LOWER(skills) LIKE @search OR LOWER(description) LIKE @search)',
      );
      params.search = `%${String(search).toLowerCase()}%`;
    }
    if (location) {
      conditions.push('LOWER(location) LIKE @location');
      params.location = `%${String(location).toLowerCase()}%`;
    }
    if (company) {
      conditions.push('LOWER(company) LIKE @company');
      params.company = `%${String(company).toLowerCase()}%`;
    }
    if (type) {
      conditions.push('type = @type');
      params.type = type;
    }
    if (experience) {
      conditions.push('experience = @experience');
      params.experience = experience;
    }
    if (salaryMin) {
      conditions.push('(salary_max IS NULL OR salary_max >= @salaryMin)');
      params.salaryMin = Number(salaryMin);
    }
    if (salaryMax) {
      conditions.push('(salary_min IS NULL OR salary_min <= @salaryMax)');
      params.salaryMax = Number(salaryMax);
    }
    if (mine === '1' && req.user) {
      conditions.push('posted_by = @postedBy');
      params.postedBy = req.user.id;
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy =
      sort === 'salary-high'
        ? 'salary_max DESC NULLS LAST'
        : sort === 'salary-low'
          ? 'salary_min ASC NULLS LAST'
          : sort === 'company'
            ? 'company COLLATE NOCASE ASC'
            : 'posted_at DESC';

    params.limit = Math.min(Number(limit) || 200, 500);
    params.offset = Number(offset) || 0;

    const rows = db
      .prepare(
        `SELECT * FROM jobs ${where} ORDER BY ${orderBy} LIMIT @limit OFFSET @offset`,
      )
      .all(params);
    const total = db
      .prepare(`SELECT COUNT(*) as count FROM jobs ${where}`)
      .get(params).count;

    res.json({
      jobs: rows.map(mapJob),
      total,
      limit: params.limit,
      offset: params.offset,
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = findJobById.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Job not found' });
    res.json({ job: mapJob(row) });
  }),
);

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const b = req.body || {};
    if (!b.title || !b.company || !b.location)
      return res.status(400).json({ error: 'Title, company and location are required' });
    const id = generateId('job-');
    insertJob.run({ id, ...buildPayload(b, req.user.id) });
    res.status(201).json({ job: mapJob(findJobById.get(id)) });
  }),
);

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = findJobById.get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Job not found' });
    if (existing.posted_by && existing.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit jobs you posted' });
    }
    const payload = buildPayload(req.body || {}, existing.posted_by || req.user.id);
    updateJobStmt.run({ id: req.params.id, ...payload });
    res.json({ job: mapJob(findJobById.get(req.params.id)) });
  }),
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = findJobById.get(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Job not found' });
    if (existing.posted_by && existing.posted_by !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete jobs you posted' });
    }
    deleteJobStmt.run(req.params.id);
    res.json({ ok: true });
  }),
);

export default router;
