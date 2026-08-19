# Module: Backup & Restore

## Current state (frontend)
`pages/backup/Backup.jsx`
- Backup: downloads JSON `{ students, fees, staff, exams, accounting, attendance, backupDate, version: '1.0' }`
- Restore: uploads JSON, validates `data.students && data.fees`, writes all keys to localStorage
- No server involved

## Product requirement
Backup/restore must survive the move to a MySQL backend. A backup feature is **not complete until restoration has actually been tested**.

## Planned design (backend)
| Method | Route | Notes |
|---|---|---|
| GET | `/api/backup` | returns full JSON dump (all tables) |
| POST | `/api/backup/restore` | upload JSON → restore inside a transaction |

## Considerations
- Use a **database transaction** for restore (all-or-nothing)
- Validate structure + referential integrity before writing
- Backup must include ALL data (users? settings? new modules)
- Version field for future migration of backup format
- Restore is destructive → require confirmation + make a safety copy first
- Consider a scheduled/on-demand server-side backup file (local folder) for on-premise

## Verification checklist
- [ ] Backup → delete/alter data → restore → data matches exactly
- [ ] Invalid/partial backup file rejected cleanly
- [ ] Restore failure rolls back (transaction)
- [ ] Frontend Backup page wired to API

## Owner
Rimsha (backup/restore). Mustafa verifies integration with new modules.