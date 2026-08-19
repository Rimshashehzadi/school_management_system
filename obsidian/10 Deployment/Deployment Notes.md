# Deployment Notes

> **Status: Not started.** Nothing is deployable yet. Backend does not exist; frontend is localStorage-only.

## Target deployment model
```text
School Computer/Server
    ├── Node/Express Backend
    └── MySQL Database
             ↓
        Local Network/Wi-Fi
             ↓
      School Computers (browsers)
```

## Required to document (as discovered, per AGENTS.md)
- Installation
- Environment setup (.env)
- MySQL setup
- Prisma migration
- Backend startup
- Frontend build/startup
- Local network access
- Initial admin setup
- Backup
- Restore
- Maintenance

## Prerequisites assumed
- Node.js installed on school server
- MySQL server installed/running locally
- Frontend built with `npm run build` and served (static) or proxied

## Open questions
- Serve frontend from Express static, or run Vite/nginx separately? (Recommend: Express serves the built `front-end/dist` in production.)
- Which MySQL port/credentials convention? (`DATABASE_URL` in `.env`)
- Backup storage location for on-premise (local folder on the school server?).

Do not claim deployment readiness until local deployment has actually been tested end-to-end.