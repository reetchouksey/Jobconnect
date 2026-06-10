import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, mapUser, fromJson } from '../db/index.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler, generateId } from '../utils/asyncHandler.js';

const router = Router();

const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT * FROM users WHERE id = ?');

const insertUser = db.prepare(`
  INSERT INTO users (id, name, email, password_hash)
  VALUES (?, ?, ?, ?)
`);

const updateUser = db.prepare(`
  UPDATE users SET
    name = @name,
    phone = @phone,
    location = @location,
    headline = @headline,
    bio = @bio,
    skills = @skills,
    experience = @experience,
    education = @education,
    resume_name = @resume_name,
    updated_at = datetime('now')
  WHERE id = @id
`);

const insertLoginEvent = db.prepare(`
  INSERT INTO login_events (user_id, email, event, success, reason, ip, user_agent)
  VALUES (@user_id, @email, @event, @success, @reason, @ip, @user_agent)
`);

const listLoginEvents = db.prepare(`
  SELECT id, event, success, reason, ip, user_agent, created_at
  FROM login_events
  WHERE user_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`);

const getClientIp = (req) => {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || null;
};

const recordLoginEvent = ({ req, userId, email, event, success, reason }) => {
  try {
    insertLoginEvent.run({
      user_id: userId || null,
      email: String(email || '').toLowerCase(),
      event,
      success: success ? 1 : 0,
      reason: reason || null,
      ip: getClientIp(req),
      user_agent: req.headers['user-agent']?.slice(0, 500) || null,
    });
  } catch (err) {
    console.warn('[auth] failed to record login event:', err.message);
  }
};

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (String(password).length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (findUserByEmail.get(email))
      return res.status(409).json({ error: 'An account with this email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const id = generateId('user-');
    insertUser.run(id, name, String(email).toLowerCase(), hash);

    const user = mapUser(findUserById.get(id));
    const token = signToken({ id: user.id, email: user.email });
    recordLoginEvent({
      req,
      userId: user.id,
      email: user.email,
      event: 'register',
      success: true,
    });
    res.status(201).json({ user, token });
  }),
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      recordLoginEvent({
        req,
        email,
        event: 'login',
        success: false,
        reason: 'missing_credentials',
      });
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const row = findUserByEmail.get(String(email).toLowerCase());
    if (!row) {
      recordLoginEvent({
        req,
        email,
        event: 'login',
        success: false,
        reason: 'unknown_email',
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(String(password), row.password_hash);
    if (!ok) {
      recordLoginEvent({
        req,
        userId: row.id,
        email,
        event: 'login',
        success: false,
        reason: 'bad_password',
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = mapUser(row);
    const token = signToken({ id: user.id, email: user.email });
    recordLoginEvent({
      req,
      userId: user.id,
      email: user.email,
      event: 'login',
      success: true,
    });
    res.json({ user, token });
  }),
);

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const row = findUserById.get(req.user.id);
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ user: mapUser(row) });
  }),
);

router.get(
  '/activity',
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const events = listLoginEvents.all(req.user.id, limit).map((e) => ({
      id: e.id,
      event: e.event,
      success: Boolean(e.success),
      reason: e.reason,
      ip: e.ip,
      userAgent: e.user_agent,
      createdAt: e.created_at,
    }));
    res.json({ events });
  }),
);

router.put(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const row = findUserById.get(req.user.id);
    if (!row) return res.status(404).json({ error: 'User not found' });
    const b = req.body || {};
    updateUser.run({
      id: req.user.id,
      name: b.name ?? row.name,
      phone: b.phone ?? row.phone,
      location: b.location ?? row.location,
      headline: b.headline ?? row.headline,
      bio: b.bio ?? row.bio,
      skills: b.skills ? fromJson(b.skills) : row.skills,
      experience: b.experience ? fromJson(b.experience) : row.experience,
      education: b.education ? fromJson(b.education) : row.education,
      resume_name: b.resumeName ?? row.resume_name,
    });
    const updated = mapUser(findUserById.get(req.user.id));
    res.json({ user: updated });
  }),
);

export default router;
