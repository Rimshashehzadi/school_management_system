# School Management System (EduManage)

School management system for local/on-premise deployment — one React frontend, one Express backend, one MySQL database. **Monolithic architecture** (never microservices/modular monolith).

## Structure

```text
front-end/   # React 19 + Vite + Tailwind 4 (localStorage-only, no API client yet)
back-end/    # Express + Prisma + MySQL (foundation built, auth pending)
obsidian/    # Project knowledge base — read obsidian/00 Home.md first
```

## Prerequisites

- Node.js 18+ (tested on v22)
- MySQL 8 running locally (default port 3306)

## Backend

```bash
cd back-end
npm install

# 1. Configure environment
cp .env.example .env
# edit .env -> set DATABASE_URL with your MySQL credentials, e.g.
#   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/school_management"

# 2. Create the database + tables (migration)
npx prisma migrate dev

# 3. Seed demo users (admin@school.com / teacher@school.com, password: password)
npm run db:seed

# 4. Start the API
npm run dev          # http://localhost:4000
```

Verify it works:

- Health check: `GET http://localhost:4000/api/health` → `{ "success": true, "data": { "status": "ok", ... } }`
- Inspect DB: `npx prisma studio` (opens browser UI)

Other scripts:

| Command | Purpose |
|---|---|
| `npm start` | Start without auto-reload |
| `npm run prisma:migrate` | Apply schema changes |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:studio` | Browse database in browser |

## Frontend

```bash
cd front-end
npm install
npm run dev          # http://localhost:5173
```

Demo login (frontend demo auth): `admin@school.com` / `password` or `teacher@school.com` / `password`.

> Note: the frontend currently runs entirely on localStorage. Backend API integration is in progress — until then the frontend does not talk to the backend.

## Lint / build

```bash
cd front-end && npm run lint   # eslint
cd front-end && npm run build  # production build
```

## Git

- Work on feature branches (e.g. `feature/backend-foundation`), never directly on `main`.
- Meaningful commit messages, never overwrite a teammate's uncommitted work.
- Never commit `.env` — secrets stay in the local `.env` (gitignored); use `.env.example` for documentation.