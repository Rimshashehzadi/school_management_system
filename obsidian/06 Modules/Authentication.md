# Module: Authentication & Users

## Current state (frontend)
- `context/AuthContext.jsx`: hardcoded demo login
  - `admin@school.com` / `password` → `{ email, name: 'Admin', role: 'Admin' }`
  - `teacher@school.com` / `password` → `{ email, name: 'Teacher', role: 'Teacher' }`
- User persisted in localStorage `edumanage_user`
- Sidebar filters menu items by `user.role`
- `ProtectedRoute.jsx` exists but is **not wired correctly** (dead route in `App.jsx`)

## Backend state
None. See [[04 Backend/Authentication & Authorization]].

## Roles used in the codebase
- `Admin`, `Teacher` (auth/sidebar)
- `Accountant`, `Principal`, `Librarian` (staff form role options)

## Planned implementation
1. `User` model (email unique, passwordHash, name, role, status) — see [[03 Database/Data Model]]
2. Seed default admin + teacher (matching demo creds for continuity)
3. `POST /api/auth/login` → JWT
4. Auth middleware + role guard
5. Rewrite `AuthContext` to call API; store token
6. Fix `ProtectedRoute` wiring in `App.jsx`

## Verification checklist
- [ ] Login succeeds with seeded credentials → token returned
- [ ] Wrong password → 401
- [ ] Protected route without token → 401/redirect
- [ ] Teacher cannot access admin-only pages (backend 403)
- [ ] Password never returned in API response
- [ ] Frontend sidebar reflects real role from backend

## Owner
Mustafa (backend foundation + auth). Rimsha depends on this for notices/dashboard/reports.