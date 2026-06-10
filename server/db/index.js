import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = process.env.DATABASE_FILE
  ? path.resolve(process.cwd(), process.env.DATABASE_FILE)
  : path.resolve(process.cwd(), 'data', 'jobconnect.db');

fs.mkdirSync(path.dirname(dbFile), { recursive: true });

export const db = new Database(dbFile);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

export const toJson = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};

export const fromJson = (value) => JSON.stringify(value || []);

export const mapJob = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    type: row.type,
    experience: row.experience,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    description: row.description,
    responsibilities: toJson(row.responsibilities),
    requirements: toJson(row.requirements),
    skills: toJson(row.skills),
    logo: row.logo,
    trending: Boolean(row.trending),
    source: row.source,
    applyUrl: row.apply_url,
    isReal: Boolean(row.is_real),
    postedBy: row.posted_by,
    postedAt: row.posted_at,
    updatedAt: row.updated_at,
  };
};

export const mapUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    headline: row.headline,
    bio: row.bio,
    skills: toJson(row.skills),
    experience: toJson(row.experience),
    education: toJson(row.education),
    resumeName: row.resume_name,
    createdAt: row.created_at,
  };
};

export const mapApplication = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    jobId: row.job_id,
    jobTitle: row.job_title,
    company: row.company,
    location: row.location,
    logo: row.logo,
    applyUrl: row.apply_url,
    status: row.status,
    appliedAt: row.applied_at,
    applicant: {
      name: row.applicant_name,
      email: row.applicant_email,
      phone: row.applicant_phone,
      coverLetter: row.cover_letter,
      resumeName: row.resume_name,
      external: Boolean(row.external),
    },
  };
};
