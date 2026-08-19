# School Management System — Project State

_Last updated: 2026-08-19_

## Current Objective
Establish the **Obsidian knowledge base** so AI agents and contributors can understand the codebase from these notes. Next real objective after this: **scaffold the backend foundation** (Express + Prisma + MySQL) because the backend is currently empty.

## Current Module
Backend Foundation (planned)

## Current Step
1. Obsidian knowledge base created. ✅
2. Backend foundation (Express setup, env config, Prisma/MySQL connection).
3. Backend package.json + dependencies.

## Completed
- Frontend inventory captured (pages, routes, components, data storage).
- Codebase audit documented (see [[05 Frontend/Frontend State]] and [[08 Risks & Debt/Risks & Technical Debt]]).
- Obsidian structure created.

## In Progress
- None right now.

## Pending
- Backend scaffolding: `package.json`, Express app, `index.js`.
- Prisma init + `schema.prisma` (MySQL).
- Environment configuration (`.env.example`, `.env`).
- Authentication (User model, bcrypt, JWT, middleware, roles).
- API layer for existing frontend screens.

## Blocked
- Nothing blocks the next task (backend is greenfield).

## Recent Decisions
- Backend work is primary focus (per AGENTS.md).
- Keep the monolithic architecture — one frontend, one backend, one MySQL DB.
- No microservices / modular-monolith framing.

## Dependencies
- Frontend data model (from localStorage) must drive the DB design — see [[03 Database/Data Model]].
- [[09 Collaboration/Rimsha Coordination]] must be checked before shared contract (Prisma schema) changes.

## Collaboration

### Mustafa
Backend foundation, auth, users/roles, students, teachers, classes, sections, subjects, attendance, fees, integration/testing.

### Rimsha
Database/backend foundation support, exams, results, timetable, parents, notices, dashboard, reports, import/export, QA, backup/restore, deployment prep.

## Known Issues
See [[08 Risks & Debt/Risks & Technical Debt]]:
- Backend directory is empty (no `package.json`).
- `App.jsx` has dead `ProtectedRoute` code (route protection not actually applied).
- Frontend auth is hardcoded demo accounts — must move to backend JWT.
- No Prisma schema exists yet.

## Next Actions
1. Create `back-end/package.json` (Express, Prisma, mysql2, jsonwebtoken, bcryptjs, dotenv, cors).
2. Create Express entrypoint and basic health-check route.
3. Init Prisma with MySQL provider; define initial schema models.
4. Add `.env.example`; confirm MySQL is running locally.

## Last Verified
2026-08-19