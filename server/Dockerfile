# syntax = docker/dockerfile:1
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# --- deps stage: install all deps and build better-sqlite3 native binding ---
FROM base AS deps
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund \
 && npm rebuild better-sqlite3 --build-from-source

# --- final runtime stage ---
FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Mount point for the persistent volume (Fly.io volume will be mounted here)
RUN mkdir -p /data
ENV DATABASE_FILE=/data/jobconnect.db
EXPOSE 4000

CMD ["node", "index.js"]
