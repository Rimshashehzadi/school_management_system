# Backend State

## Current Status (verified 2026-08-19)

**The backend does not exist yet.**

- `back-end/index.js` — 0 bytes (empty file)
- No `package.json`
- No `node_modules`
- No Prisma schema / migrations
- No `.env` / `.env.example`
- No routes, controllers, services, or middleware

## What Must Be Built (foundation first)

1. `back-end/package.json` — Express, Prisma, mysql2, jsonwebtoken, bcryptjs, dotenv, cors. Dev: nodemon.
2. Express entry (`index.js` or `src/server.js`) with JSON parsing, CORS, error handler, health-check route.
3. Prisma init with MySQL provider; define initial schema (see [[03 Database/Data Model]]).
4. `.env.example` with `DATABASE_URL`, `JWT_SECRET`, `PORT`.
5. Auth: register/seed admin, login → JWT, auth middleware, role guard.

## Target folder layout (proposed)

```text
back-end/
├── src/
│   ├── server.js          # entrypoint
│   ├── app.js             # express app + middleware
│   ├── config/            # env, prisma client singleton
│   ├── middleware/        # auth, role guard, error handler, validation
│   ├── routes/            # /api/auth, /api/students, ...
│   ├── controllers/       # request handling
│   ├── services/          # business logic
│   └── utils/             # response helpers, async wrapper
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
└── .env.example
```

> This is a normal monolithic structure (routes → middleware → controllers → services → prisma → MySQL), NOT a modular monolith or microservices.

## Conventions to establish early
- Base path: `/api`
- JSON responses with consistent envelope (see [[04 Backend/API Conventions]])
- Centralized error handling
- Validation on every mutating route
- Backend-enforced authorization (never trust frontend only)