# Authentication & Authorization

## Current state
Frontend-only demo auth in `front-end/src/context/AuthContext.jsx`:
- Hardcoded credentials: `admin@school.com` / `password`, `teacher@school.com` / `password`
- Stores `{ email, name, role }` in localStorage key `edumanage_user`
- Sidebar filters menu by `user.role` ('Admin' or 'Teacher')
- `ProtectedRoute.jsx` is **dead code** — the route it wraps has no children (see [[08 Risks & Debt/Risks & Technical Debt]])

This must move to real backend auth.

## Target design

### Authentication (Who are you?)
- `User` model: email (unique), passwordHash, name, role, status
- bcrypt hash on create/seed
- `POST /api/auth/login` → verify → issue JWT
- Auth middleware verifies `Authorization: Bearer <token>`, loads user into `req.user`
- JWT secret from env; sensible expiry (recommend: 8h–24h for a school day)
- Passwords never returned by API

### Authorization (What can you do?)
- Roles: `Admin`, `Teacher`, `Accountant`, `Principal`, `Librarian` (values already used in frontend staff form and sidebar)
- Role guard middleware applied per route
- Backend MUST enforce authorization — hiding buttons in the frontend is not security

### Role → capability matrix (initial, proposed)

| Capability | Admin | Teacher | Accountant | Principal |
|---|---|---|---|---|
| Manage students | ✅ | ✅ | ❌ | ✅ |
| Mark attendance | ✅ | ✅ | ❌ | ✅ |
| Fees collect/manage | ✅ | ❌ | ✅ | ✅ |
| Exams/results | ✅ | ✅ | ❌ | ✅ |
| Manage staff | ✅ | ❌ | ❌ | ✅ |
| Accounting | ✅ | ❌ | ✅ | ✅ |
| Reports | ✅ | ❌ | ❌ | ✅ |
| Backup/restore | ✅ | ❌ | ❌ | ✅ |
| Settings | ✅ | ❌ | ❌ | ✅ |

> Matrix is a proposal. Confirm with Mustafa before implementing.

## Frontend integration plan
1. Rewrite `AuthContext.login()` to call `POST /api/auth/login`.
2. Store JWT (and user) securely; attach to API requests.
3. Wire `ProtectedRoute` properly (fix dead code).
4. Keep demo account names for seeding (admin/teacher).

## Security checklist
- [ ] bcrypt for passwords (never plaintext)
- [ ] JWT not exposed in logs
- [ ] Backend role checks on every sensitive route
- [ ] Rate limiting on login (recommended)
- [ ] CORS restricted to the frontend origin
- [ ] No secrets in repo (`.env` only; `.env.example` documented)