# Architecture Map

## Current Actual Flow (verified 2026-08-19)

```text
React (Vite SPA)
   ↓
AuthContext + ProtectedRoute (client-side only)
   ↓
Pages read/write
   ↓
localStorage (browser)  ←—— data lives HERE today
   ↓
NO backend, NO database
```

The system today is a **pure client-side SPA**. All persistence is `localStorage` via `front-end/src/utils/storage.js`. There is no API, no Express server, no MySQL, no Prisma.

## Target Flow (per AGENTS.md)

```text
React
   ↓
REST API (fetch/axios)
   ↓
Express (Routes → Middleware → Controllers → Business Logic)
   ↓
Prisma
   ↓
MySQL

School computer/server hosts backend + DB
   ↓
Local network/Wi-Fi
   ↓
School computers (browser)
```

## Repository Layout

```text
school_management_system/
├── back-end/
│   └── index.js          # EMPTY (0 bytes)
├── front-end/
│   ├── src/
│   │   ├── components/   # common, layout, ui
│   │   ├── context/      # AuthContext.jsx
│   │   ├── layouts/      # DashboardLayout.jsx
│   │   ├── pages/        # 10 page modules
│   │   ├── utils/        # storage.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
├── obsidian/             # This knowledge base
├── AGENTS.md
└── .gitignore
```

## Architecture Notes

- Monolithic application. One frontend, one backend, one MySQL DB. **Not** microservices or modular monolith.
- Backend organization may still use folders (routes, controllers, services) for maintainability — that is normal monolith structure, not modular-monolith.
- Preserve existing frontend work; do not rebuild it. Convert data layer from localStorage to API as screens are integrated.

## Key Files (frontend)

- `front-end/src/App.jsx` — route definitions
- `front-end/src/main.jsx` — entry, wraps `AuthProvider`
- `front-end/src/context/AuthContext.jsx` — demo auth
- `front-end/src/utils/storage.js` — localStorage get/set
- `front-end/src/pages/*/` — feature pages
- `front-end/src/components/` — reusable UI/layout components