# Contracts

Shared entities are **contracts**. Changes ripple across modules and across contributors. Never change these silently.

## Core shared entities

| Entity | Primary owner | Other consumers |
|---|---|---|
| `User` / auth | Mustafa | Rimsha (notices, dashboard, reports, QA) |
| `Student` | Mustafa | Rimsha (exams, results, reports, backup) |
| `Class` / `Section` | Mustafa | Rimsha (timetable, exams, reports) |
| `Teacher` | Mustafa | Rimsha (timetable) |
| `Subject` | Mustafa | Rimsha (timetable, exams) |
| `Attendance` | Mustafa | Rimsha (reports, dashboard, QA) |
| `Fees` | Mustafa | Rimsha (dashboard, reports) |
| `Exam` / `Result` | Rimsha | Mustafa (integration/testing) |
| `Timetable` | Rimsha | — |
| `Parent` / `Notice` | Rimsha | Mustafa (students reference parents) |
| `Accounting` | Mustafa | Rimsha (dashboard, reports) |
| `Backup/Restore` | Rimsha | Mustafa (verification) |

## Rules

1. **Prisma schema changes** affecting these entities → coordinate with the other contributor first (see [[09 Collaboration/Rimsha Coordination]]).
2. **API contracts** (routes, request/response shapes) → define once, then both sides implement against the definition.
3. **Shared utilities** → announce before modifying.
4. **Shared frontend state/auth** → coordinate (auth context will be rewritten for JWT).

## Contract change checklist
- [ ] Identify affected modules/contributors
- [ ] Document the change here + in the relevant module note
- [ ] Coordinate with the other contributor
- [ ] Update API/DB references consistently
- [ ] Test cross-feature behavior