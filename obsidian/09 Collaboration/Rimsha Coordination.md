# Rimsha Coordination

Track anything that affects Rimsha's work (database/backend foundation, exams, results, timetable, parents, notices, dashboard, reports, import/export, QA, backup/restore, deployment).

## Active coordination points

### 1. Prisma schema — NOT YET CREATED
- **Status:** Pending. Backend is empty.
- **What:** Before we define `schema.prisma`, agree on shared entities (User, Student, Class, Section, Subject, Teacher, Fee, Attendance).
- **Decision required:** Role enum vs RBAC tables; Class/Section split; soft-delete.
- **Wait for:** Mustafa scaffolds schema; Rimsha reviews before it becomes a contract.

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
> Hi Rimsha — coordinating on the School Management System schema before it becomes a contract. Please confirm: (1) role enum vs RBAC tables, (2) Class/Section split, (3) soft-delete for students, (4) guardian model (join table vs fields). Reply so we can lock the Prisma schema and APIs.