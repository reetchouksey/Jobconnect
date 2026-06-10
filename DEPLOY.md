# Deployment Guide — Vercel (frontend) + Fly.io (backend)

This project is split into:

- **Frontend** — React + Vite (root folder) → deployed to **Vercel**
- **Backend** — Express + SQLite (`server/`) → deployed to **Fly.io** with a 1 GB persistent volume

Both fit comfortably in the free tier.

---

## 0. One-time prerequisites

1. **GitHub account** with this repo pushed (Vercel deploys from GitHub).
2. **Fly.io account** — sign up at https://fly.io/app/sign-up (no credit card needed for the free tier).
3. **Vercel account** — sign up at https://vercel.com (use "Continue with GitHub").
4. **Install the Fly CLI** locally:

   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex

   # macOS / Linux
   curl -L https://fly.io/install.sh | sh
   ```

   Then log in:

   ```bash
   fly auth login
   ```

5. **Generate a strong JWT secret** (you'll paste this into Fly.io):

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   Copy the output — you'll need it in step 2.

---

## 1. Deploy the backend to Fly.io

From the **`server/`** folder:

```bash
cd server
fly launch --no-deploy
```

When prompted:

- **App name**: e.g. `jobconnect-api` (must be globally unique — try `jobconnect-api-<yourname>` if taken)
- **Region**: pick the closest to your users (e.g. `bom` for Mumbai, `sin` for Singapore, `iad` for US East)
- **Postgres / Redis / Tigris**: **No** to all (we use SQLite on a volume)
- **Deploy now**: **No** (we need to create the volume + set secrets first)

This generates a `fly.toml` — open it and make sure the `app = "..."` matches what Fly assigned you.

> If `fly launch` overwrites your existing `fly.toml`, the file in this repo has the correct mount and health-check settings — restore the `[[mounts]]`, `[http_service.checks]`, and `DATABASE_FILE=/data/jobconnect.db` blocks if they're missing.

### 1a. Create the persistent volume (SQLite lives here)

```bash
fly volumes create jobconnect_data --size 1 --region bom
```

Replace `bom` with whatever region you picked. The volume name **must match** `[[mounts]].source` in `fly.toml` (already set to `jobconnect_data`).

### 1b. Set secrets

```bash
fly secrets set JWT_SECRET="<paste-the-secret-you-generated>"
fly secrets set CLIENT_ORIGIN="http://localhost:5173"
# We'll update CLIENT_ORIGIN to the real Vercel URL in step 3.
```

### 1c. Deploy

```bash
fly deploy
```

When it finishes you'll get a URL like `https://jobconnect-api.fly.dev`.

Verify it's up:

```bash
curl https://jobconnect-api.fly.dev/api/health
# → {"ok":true,"ts":1234567890}
```

### 1d. Seed the database (one-time)

```bash
fly ssh console -C "node db/seed.js"
```

You should see `✅ Seeded 10 jobs into the database.`

---

## 2. Deploy the frontend to Vercel

### 2a. Push to GitHub

```bash
git add .
git commit -m "Add deployment config"
git push
```

### 2b. Import on Vercel

1. Go to https://vercel.com/new
2. Select the GitHub repo
3. Vercel auto-detects **Vite** — no overrides needed (the `vercel.json` in this repo handles SPA rewrites).
4. Under **Environment Variables**, add:

   | Name | Value |
   |---|---|
   | `VITE_API_URL` | `https://jobconnect-api.fly.dev/api` (your Fly URL + `/api`) |

5. Click **Deploy**.

When it finishes you'll get a URL like `https://your-project.vercel.app`.

---

## 3. Wire them together (CORS)

The backend rejects requests from unknown origins. Update the Fly.io secret so it allows your Vercel domain:

```bash
cd server
fly secrets set CLIENT_ORIGIN="https://your-project.vercel.app"
```

Fly restarts the app automatically after a secrets change. Done — log in / register on your live Vercel URL and you should see new rows in the backend's `users` and `login_events` tables.

---

## Daily operations

### Check backend logs

```bash
cd server
fly logs
```

### SSH into the running backend

```bash
fly ssh console
# inside:
node db/inspect-users.js
node db/inspect-logins.js
sqlite3 /data/jobconnect.db ".tables"
```

### Backup the SQLite database

```bash
fly ssh console -C "sqlite3 /data/jobconnect.db .dump" > backup.sql
```

### Redeploy backend after code changes

```bash
cd server
fly deploy
```

### Frontend redeploys automatically

Any push to your GitHub default branch → Vercel rebuilds and deploys.

---

## Cost estimate (free tier)

| Service | Usage | Cost |
|---|---|---|
| Vercel Hobby (frontend) | unlimited static deploys | **$0** |
| Fly.io machines | 3 × `shared-cpu-1x` 256 MB | **$0** (free allowance) |
| Fly.io volume | 1 GB SQLite storage | **$0** (3 GB free) |
| Fly.io outbound bandwidth | up to 160 GB/mo free | **$0** |
| **Total** | | **$0/month** |

If your backend goes idle, Fly's `auto_stop_machines = "stop"` (set in `fly.toml`) saves your free hours. First request after idle wakes it in ~2 seconds.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `fly deploy` fails with `better-sqlite3` build error | The Dockerfile installs `python3 make g++` — make sure you didn't edit it out. Run `fly deploy --no-cache` to force a clean build. |
| Frontend shows "Could not reach server" | Check `VITE_API_URL` env var in Vercel matches your Fly URL **including `/api`**. Redeploy frontend after changing it. |
| CORS error in browser console | `CLIENT_ORIGIN` on Fly doesn't match your Vercel URL exactly. No trailing slash, include `https://`. |
| Data disappeared after redeploy | Volume wasn't mounted — check `fly volumes list` shows `jobconnect_data` and `fly.toml` `[[mounts]]` block exists. |
| Health check failing | `fly logs` will show what's wrong. Usually a missing env var. |

---

## Files involved (already created)

- `server/Dockerfile` — multi-stage build with better-sqlite3 native binding
- `server/.dockerignore` — excludes `data/` (so local DB isn't shipped)
- `server/fly.toml` — Fly app config with mount + health check
- `vercel.json` — SPA rewrite + Vite build settings
- `.env.production.example` — template for `VITE_API_URL`

Don't commit your real `.env.production` to git (it should already be in `.gitignore`).
