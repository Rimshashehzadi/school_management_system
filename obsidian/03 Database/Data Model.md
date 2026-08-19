# Data Model

Two views:
1. **Current** — the actual shapes stored in localStorage (source of truth for what the frontend consumes).
2. **Target** — the proposed MySQL/Prisma entities that satisfy the frontend.

> No Prisma schema exists yet. `back-end/` has no schema, no migration, no database connection.

---

## 1. Current Data (localStorage)

Storage helper: `front-end/src/utils/storage.js` → `getData(key, default)` / `saveData(key, data)`.

| localStorage key | Shape | Consumed by |
|---|---|---|
| `edumanage_user` | `{ email, name, role }` | AuthContext, Sidebar |
| `students` | array of Student | Students, Attendance, Dashboard, Reports, Backup |
| `fees` | array of Fee | Fees, Dashboard, Reports, Backup |
| `staff` | array of Staff | Staff, Reports, Backup |
| `exams` | array of Exam | Exams, Backup |
| `accounting` | array of Transaction | Accounting, Dashboard, Reports, Backup |
| `attendance` | object: `"CLASS_DATE"` → `{ studentId: "present"\|"absent" }` | Attendance, Backup |

### Student (localStorage)
```js
{ id: number, name: string, class: string, roll: string, phone: string, status: 'Active' | 'Inactive' }
```

### Fee (localStorage)
```js
{ id: number, name: string, class: string, amount: number, status: 'Paid' | 'Pending' | 'Overdue', date: string, receiptNo: string }
```

### Staff (localStorage)
```js
{ id: number, name: string, role: 'Teacher'|'Admin'|'Accountant'|'Principal'|'Librarian', subject: string, phone: string, email: string, status: 'Active'|'Inactive' }
```

### Exam (localStorage)
```js
{ id: number, name: string, class: string, date: string (YYYY-MM-DD), totalMarks: number, status: 'Upcoming'|'Completed' }
```

### Transaction (localStorage)
```js
{ id: number, type: 'income'|'expense', title: string, amount: number, category: 'Fees'|'Salary'|'Maintenance'|'Utilities'|'Transport'|'Other', date: string (YYYY-MM-DD) }
```

### Attendance (localStorage)
```js
{
  "10-A_2026-08-19": { "12345": "present", "12346": "absent" }
}
```

### Backup file (JSON)
```js
{ students, fees, staff, exams, accounting, attendance, backupDate: ISO string, version: '1.0' }
```

---

> **Implemented 2026-08-19:** The target entities below are now in `back-end/prisma/schema.prisma` and migrated to MySQL. ERD questions 1–3 resolved: role **enum**, Class/Section **split**, **soft-delete** status flags. Awaiting Rimsha review before the schema is locked as a contract.

## 2. Target Entities (MySQL / Prisma) — implemented

Design constraints: must serve the existing frontend screens, keep relationships sane, and match the product requirements in AGENTS.md. **This is a proposal for discussion, not yet implemented.**

| Entity | Notes |
|---|---|
| `User` | id, email, passwordHash, name, role, status. Auth + login. |
| `Role` / `Permission` | Optional RBAC — or keep simple `role` enum initially. |
| `Class` | id, name, section (or combined). Frontend currently treats class as string like `10-A`. |
| `Section` | Belongs to class (e.g., A, B, C). |
| `Subject` | id, name, code. |
| `Teacher` | id, user_id?, name, phone, email, subject(s). |
| `TeacherClassSubject` | Join table: teacher ↔ class ↔ subject assignments. |
| `Student` | id, admissionNo, name, class_id, section_id, roll, phone, guardian info, status, admissionDate. |
| `Parent` / `Guardian` | name, phone, email, relationship; many-to-many with students. |
| `Attendance` | id, student_id, date, status ('present'/'absent'/'late'), recordedBy. Unique (student_id, date). |
| `FeeStructure` | fee type/amount per class (e.g., tuition 4500 for 10th). |
| `FeeRecord` | student_id, month/term, amount, status, dueDate. |
| `FeePayment` | student_id, amount, receiptNo, date, paymentMethod, collectedBy. |
| `Exam` | id, name, class_id, date, status. |
| `ExamSubject` | exam_id, subject_id, totalMarks, date. |
| `Mark` | student_id, exam_subject_id, obtainedMarks. Unique (student_id, exam_subject_id). |
| `Result` | Computed per exam+student (percentage, grade, rank). |
| `Transaction` | type, title, category, amount, date, reference (fee payment link). |
| `Timetable` | class_id, subject_id, teacher_id, day, period/slot. |
| `Notice` | title, body, audience (role/class), createdBy, date. |
| `SchoolProfile` | school name, address, phone, email, academic year. (Settings page today) |

## Shared contracts
See [[03 Database/Contracts]] for ownership of entities that span both contributors' work.