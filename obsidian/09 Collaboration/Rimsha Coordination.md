# Rimsha Coordination

Track anything that affects Rimsha's work (database/backend foundation, exams, results, timetable, parents, notices, dashboard, reports, import/export, QA, backup/restore, deployment).

## Active coordination points

### 1. Prisma schema — DRAFTED, AWAITING RIMSHA REVIEW
- **Status:** Schema implemented in `back-end/prisma/schema.prisma` (branch `feature/backend-foundation`, migration applied locally). **Not yet reviewed by Rimsha — do not lock as contract until she confirms.**
- **Decisions taken (revertible before lock):** role **enum** on User (no RBAC tables); Class/Section **split**; **soft-delete** status flags for users/teachers/students; guardian model = `Parent` + `StudentParent` join; `Transaction.date` DATETIME.
- **Ask Rimsha to:** review models (User, Student, Class, Section, Subject, Teacher, Fee*, Exam*, Attendance, Parent, Notice, Timetable, Accounting), confirm or request changes before the schema is treated as a contract.

### 2. Student entity (guardian fields)
- **What:** Parents module needs guardian info linked to students.
- **Proposal:** Add `Parent`/`StudentParent` join rather than embedding fields on Student.
- **Wait for:** Rimsha to confirm before finalizing schema.

### 3. Exams/Results depend on Student/Class/Subject
- **What:** Rimsha's exams module needs stable Student + Subject contracts.
- **Action:** Mustafa defines these first; Rimsha builds against the API.

### 4. Dashboard/Reports depend on Fees/Attendance/Accounting
- **What:** Rimsha's dashboard/reports consume Mustafa's fee & attendance data.
- **Action:** Agree on summary endpoints (`/api/dashboard/stats`, report CSVs) before implementing.

### 5. Backup format
- **What:** Backup must cover all tables from both contributors.
- **Action:** Keep the backup JSON format centralized and versioned (`version: '1.0'` today).

## Message template for Rimsha (if needed)
> Hi Rimsha — the backend foundation is up (Express + Prisma + MySQL on `feature/backend-foundation`). Before we treat the Prisma schema as a locked shared contract, please review `back-end/prisma/schema.prisma`: role enum (no RBAC tables yet), Class/Section split, soft-delete status flags, and `Parent`/`StudentParent` join for guardians. Confirm or suggest changes, and I'll adjust before Day 2 auth/student work starts.