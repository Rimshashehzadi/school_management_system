# AGENTS.md — School Management System

Two-person project (Mustafa + Rimsha) building a **simple monolithic** school management system. One React frontend, one Express backend, one MySQL DB. **Never** describe or design it as microservices or a modular monolith.

## Current state (verified 2026-08-19)

- `front-end/` — built React 19 + Vite + Tailwind 4 app. **localStorage-only**, no API client yet. `npm run dev` / `npm run build` / `npm run lint`. No tests, no typecheck.
- `back-end/` — **empty** (0-byte `index.js`, no `package.json`, no Prisma, no DB). Backend foundation is the next priority.
- Target stack: Express + Prisma + MySQL + JWT + bcrypt + dotenv + cors. API: REST. Local/on-premise deployment; don't block future cloud migration.
- No `opencode.json`, no CI, no test runner. All git history commits are literally named `add`.

## Obsidian second brain (do not skip)

`obsidian/` is the project knowledge base and the machine-readable context store.
- **Read `obsidian/00 Home.md` first** for the Map of Content, then load relevant notes before assuming anything.
- Keep `obsidian/01 Project State/Project State.md` accurate after meaningful work.
- Source of truth hierarchy: codebase > Prisma schema > verified behavior > git history > Obsidian > requirements > assumptions. If sources conflict, flag it — don't silently pick one.
- Record decisions, risks, Rimsha coordination, and blockers in Obsidian, not by duplicating code.

## Architecture & integration rules

- Do **not** rebuild the frontend. Inspect existing screens/pages to derive the API and DB the backend must serve. The localStorage data model (see `obsidian/03 Database/Data Model` and `front-end/src/utils/storage.js`) drives DB design.
- Frontend quirks that matter: auth is **hardcoded demo accounts** (`admin@school.com`/`password`, `teacher@school.com`/`password`) in `AuthContext.jsx`; `ProtectedRoute.jsx` is dead code (route protection not applied). Backend must replace the demo auth with real JWT. Sensitive authorization must be enforced on the backend, never only by hiding UI.
- Layering to follow: Routes → Middleware → Controllers → Business Logic → Prisma → MySQL.

## Rimsha coordination

Mustafa owns: backend foundation, auth, users/roles, students, teachers, classes, sections, subjects, attendance, fees, integration/testing.
Rimsha owns: exams, results, timetable, parents, notices, dashboard, reports, import/export, QA, backup/restore, deployment prep.

**COORDINATION REQUIRED WITH RIMSHA** before changing any shared contract: Prisma schema, shared models, auth/permissions, API contracts, shared utilities/frontend state, cross-feature relationships. Never silently modify these.

## Workflow

- Inspect → understand → plan → smallest logical step → execute → test → verify → document → continue. Work dependency-driven (DB foundation → auth → academic structure → students → attendance/fees), not checklist-driven.
- **Definition of done:** Implemented ≠ Tested ≠ Verified ≠ Integrated ≠ Complete. Never claim an action you didn't actually perform (use `MANUAL ACTION REQUIRED` if Mustafa must do it, with exact steps).
- Ask Mustafa before: destructive DB ops / data reset, major architectural rewrites, tech-stack changes, force-push, irreversible deploys, security-sensitive decisions, major business-rule assumptions, anything touching secrets or risking data loss.
- Work on feature branches; never overwrite uncommitted work (inspect `git status` first).

## Security

Never commit `.env` or hardcode credentials/secrets. Use `.env.example`. Always consider authN vs authZ separation, input validation, CORS, error leakage, privilege escalation, and unsafe uploads.

## Commands

```bash
cd front-end && npm run dev      # dev server
cd front-end && npm run build    # production build
cd front-end && npm run lint     # eslint
```

Backend has no commands yet — scaffold `back-end/package.json` (express, prisma, mysql2, jsonwebtoken, bcryptjs, dotenv, cors) and a health-check route first, then init Prisma (MySQL) and add `.env.example` + local `.env`.