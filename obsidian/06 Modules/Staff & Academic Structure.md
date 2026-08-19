# Module: Staff & Academic Structure

## Staff — current state (frontend)
`pages/staff/Staff.jsx`
- localStorage key: `staff`
- Fields: `id, name, role, subject, phone, email, status ('Active'|'Inactive')`
- Roles offered: `Teacher, Admin, Accountant, Principal, Librarian`
- CRUD + search (name/role/subject)

## Academic structure — current state
- No Classes/Sections/Subjects pages or API.
- Class is free-text everywhere (`10-A`, `9-B`).
- Attendance page hardcodes class list `['8-A','8-B','9-A','9-B','10-A','10-B']`.

## Backend state
None.

## Planned model
- `Class`, `Section` (or combined), `Subject`, `Teacher`
- `TeacherClassSubject` join: teacher ↔ class ↔ subject assignments

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/classes` | classes (name) |
| GET/POST/PUT/DELETE | `/api/sections` | sections per class |
| GET/POST/PUT/DELETE | `/api/subjects` | subjects |
| GET/POST/PUT/DELETE | `/api/staff` | staff CRUD |
| GET/POST | `/api/assignments` | teacher-class-subject assignments |

## Verification checklist
- [ ] Class list for attendance comes from DB
- [ ] Students reference Class/Section properly
- [ ] Teacher assignment validates class/subject existence
- [ ] Staff CRUD works against DB

## Owner
Mustafa (academic structure + staff). Rimsha needs Classes/Subjects/Teachers for Timetable and Exams.