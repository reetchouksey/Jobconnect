# JobConnect Server

Express + SQLite (better-sqlite3) + JWT backend for the JobConnect frontend.

## Quick start

```bash
cd server
npm install
cp .env.example .env       # then edit JWT_SECRET in .env
npm run seed               # one-time: load 10 demo jobs
npm run dev                # http://localhost:4000
```

The database file is created on first run at `server/data/jobconnect.db` (SQLite).

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | - | Health check |
| POST | `/api/auth/register` | - | Create account, returns `{ user, token }` |
| POST | `/api/auth/login` | - | Returns `{ user, token }` |
| GET | `/api/auth/me` | ✓ | Current user |
| PUT | `/api/auth/me` | ✓ | Update profile (skills, experience, education, resume) |
| GET | `/api/jobs` | - | List jobs with filters: `search`, `location`, `company`, `type`, `experience`, `salaryMin`, `salaryMax`, `mine=1`, `sort`, `limit`, `offset` |
| GET | `/api/jobs/:id` | - | Single job |
| POST | `/api/jobs` | ✓ | Create job (recruiter) |
| PUT | `/api/jobs/:id` | ✓ | Update own job |
| DELETE | `/api/jobs/:id` | ✓ | Delete own job |
| GET | `/api/saved` | ✓ | Current user's saved jobs |
| POST | `/api/saved` | ✓ | Save a job (`{ job }` in body) |
| DELETE | `/api/saved/:jobId` | ✓ | Unsave |
| GET | `/api/applications` | ✓ | Current user's applications |
| POST | `/api/applications` | ✓ | Submit an application |
| PUT | `/api/applications/:jobId/status` | ✓ | Update status |
| DELETE | `/api/applications/:jobId` | ✓ | Withdraw |
| GET | `/api/applications/job/:jobId` | ✓ | Applicants for a job (recruiter only) |

Auth: send `Authorization: Bearer <token>`.

## Database

`server/db/schema.sql` defines four tables — `users`, `jobs`, `saved_jobs`, `applications` — with foreign keys, indexes, and JSON-serialized array columns (skills, experience, etc.).

To reset everything:

```bash
rm -rf data/   # or delete the data folder manually on Windows
npm run seed
```

## Switching to PostgreSQL / MySQL later

The schema in `db/schema.sql` is largely portable. Replace `better-sqlite3` with `pg` / `mysql2`, swap `db.prepare(...).all/run/get` calls with the equivalent driver methods, and you're done. JSON columns can stay as `TEXT` or move to native `JSONB`/`JSON` types.
