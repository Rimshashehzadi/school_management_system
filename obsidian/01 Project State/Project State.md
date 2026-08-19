# School Management System — Project State

_Last updated: 2026-08-19_

## Current Objective
Backend foundation is **built and verified**. Next: **Authentication + User Management** (JWT login, roles, permissions) so all later modules build on real auth.

## Current Module
Backend Foundation (completed)

## Current Step
1. Backend foundation (Express, env, Prisma/MySQL). ✅
2. Authentication + User Management (next).
3. Auth middleware + role guards.

## Completed
- Obsidian knowledge base created.
- Backend foundation: `package.json`, Express app, health check, error handler, response envelope.
- Prisma schema implemented from the proposed ERD (all 20 entities) + initial migration applied to local MySQL `school_management`.
- Seed: admin + teacher demo users (bcrypt) + school profile.
- Feature branch `feature/backend-foundation` with 2 meaningful commits.
- `.env.example` committed; `.env` gitignored.

## In Progress
- None right now.

## Pending
- Authentication: register/login → JWT, auth middleware, role guard.
- API layer for existing frontend screens (students, fees, attendance, etc.).
- Rimsha review of the Prisma schema before it is locked as a shared contract.

## Blocked
- Nothing. (Rimsha schema review is a coordination step, not a blocker for auth.)

## Recent Decisions
- Monolithic architecture — one frontend, one backend, one MySQL DB. No microservices framing.
- Role **enum** on User (not RBAC tables) — revisit only if permissions get complex.
- Class/Section **split** into separate models; frontend joins for display.
- Soft-delete via `status` flags for students/teachers/users; fee history preserved.
- `Transaction.date` is DATETIME (not DATE) to satisfy MySQL strict mode.
- Prisma 6.19 (not v7) — v7 upgrade deferred; the `package.json#prisma` seed-config deprecation warning is harmless on v6.

## Dependencies
- Frontend localStorage data model drives DB design (see [[03 Database/Data Model]]).
- [[09 Collaboration/Rimsha Coordination]] must be checked before Prisma schema changes.

## Collaboration

### Mustafa
Backend foundation, auth, users/roles, students, teachers, classes, sections, subjects, attendance, fees, integration/testing.

### Rimsha
Database/backend foundation support, exams, results, timetable, parents, notices, dashboard, reports, import/export, QA, backup/restore, deployment prep.

## Known Issues
- `App.jsx` has dead `ProtectedRoute` code (route protection not applied) — fix during auth integration.
- Frontend auth is hardcoded demo accounts — will be replaced by backend JWT.
- Prisma schema is drafted but **not yet reviewed by Rimsha** (shared contract — do not lock silently).

## Next Actions
1. Auth: User model is seeded; add `/api/auth/login`, `/api/auth/me`, auth middleware, role guard.
2. Coordinate schema review with Rimsha.
3. Start student management module (uses User auth).

## Last Verified
2026-08-19