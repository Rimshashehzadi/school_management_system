# School Management System — Obsidian Home

This vault is the project's **second brain and persistent knowledge system**. It is the machine-readable context store that AI agents and human collaborators use to understand the codebase without re-reading every file.

> **Rule:** The actual codebase is the source of truth. If a note contradicts the code, update the note — but flag the conflict.

## Map of Content

| Folder | Purpose |
|---|---|
| [[01 Project State/Project State]] | Current objective, completed/in-progress/pending work |
| [[01 Project State/Session Log]] | Chronological session records |
| [[02 Architecture/Architecture Map]] | Actual system flow (React → storage layers) |
| [[02 Architecture/Tech Stack]] | Verified technology inventory |
| [[03 Database/Data Model]] | Entities and field shapes (current + target) |
| [[03 Database/ERD]] | Relationships and cardinality |
| [[03 Database/Contracts]] | Shared entity contracts (who owns what) |
| [[04 Backend/Backend State]] | Backend implementation status |
| [[04 Backend/API Conventions]] | REST API conventions to follow |
| [[04 Backend/Authentication & Authorization]] | AuthN/AuthZ plan |
| [[05 Frontend/Frontend State]] | Frontend implementation status |
| [[05 Frontend/Pages & Routes]] | Route table + per-page data requirements |
| [[05 Frontend/Components]] | UI component inventory |
| [[05 Frontend/Data Storage]] | localStorage keys and shapes |
| [[06 Modules/]] | Per-module state and requirements |
| [[07 Decisions/Decision Log]] | Significant decisions with rationale |
| [[08 Risks & Debt/Risks & Technical Debt]] | Risks and accepted compromises |
| [[09 Collaboration/Rimsha Coordination]] | Shared-contract coordination |
| [[10 Deployment/Deployment Notes]] | Deployment/installation notes |
| [[11 Reference/Glossary]] | Common terminology |

## Quick Context (for AI agents)

- **Repo:** `school_management_system/` with `front-end/` and `back-end/`
- **Frontend:** React 19 + Vite + Tailwind 4, fully built, **localStorage-only** (no API)
- **Backend:** **Empty** — `back-end/index.js` is 0 bytes, no `package.json`, no Prisma, no DB
- **Auth:** Hardcoded demo accounts in frontend (`admin@school.com` / `password`)
- **Target:** Express + Prisma + MySQL + JWT backend, local/on-premise deployment

## Last Verified
- 2026-08-19 — Full codebase inventory captured in this vault.