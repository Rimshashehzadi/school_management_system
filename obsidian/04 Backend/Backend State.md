# Backend State

## Current Status (verified 2026-08-19)

**Backend foundation is built and running.**

- `back-end/package.json` — express, cors, dotenv, @prisma/client, mysql2, jsonwebtoken, bcryptjs. Dev: nodemon, prisma.
- Express app boots on port 4000 and connects to MySQL (`school_management` DB at localhost:3306).
- `/api/health` verified working.
- Prisma schema with 20 models + migration `20260819133018_init` applied.
- Seed creates admin/teacher users + school profile.
- `scripts`: `dev`, `start`, `prisma:generate`, `prisma:migrate`, `prisma:studio`, `db:seed`.

## Folder layout

```text
back-end/
├── src/
│   ├── server.js          # entrypoint — connects DB, starts listener
│   ├── app.js             # express app + middleware + routes
│   ├── config/
│   │   ├── env.js         # env parsing
│   │   └── prisma.js      # PrismaClient singleton
│   ├── middleware/
│   │   └── errorHandler.js# AppError + notFound + error handler
│   ├── routes/
│   │   └── index.js       # /api router (health + future modules)
│   └── utils/
│       ├── apiResponse.js # success/created/noContent/failure envelope
│       └── asyncHandler.js
├── prisma/
│   ├── schema.prisma
│   ├── migrations/20260819133018_init/
│   └── seed.js
├── package.json
└── .env.example
```

## Missing / Next

- Auth: `/api/auth/login`, `/api/auth/me`, JWT sign/verify, auth middleware, role guard. (Day 2)
- Module routes/controllers/services: students, classes, sections, subjects, teachers, attendance, fees, exams, results, timetable, parents, notices, accounting, reports, backup.
- Frontend API client + integration.
- Tests (none yet — Postman/Thunder Client per manager plan).
- Rimsha review of schema before it is locked as a shared contract.

## Conventions in place
- Base path `/api`, JSON envelope `{ success, data|meta|error }`.
- Centralized error handling via `AppError(status, code, message, details)`.
- Every mutating route must validate on the backend.
- Backend-enforced authorization (never trust frontend only).