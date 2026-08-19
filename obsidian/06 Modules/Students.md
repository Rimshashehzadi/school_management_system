# Module: Students

## Current state (frontend)
`pages/students/Students.jsx`
- localStorage key: `students`
- Fields: `id, name, class, roll, phone, status ('Active'|'Inactive')`
- Features: list, search (name/class/roll), add, edit, delete (confirm)
- Sample seed data: 5 students

## Dependencies
- Needs `Class`/`Section` structure (currently free-text `class` string)
- Needs `Parent/Guardian` info (product requirement; not in UI yet)

## Backend state
None.

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/students` | list + `?search=&class=&status=&page=&limit=` |
| GET | `/api/students/:id` | detail incl. guardian, class |
| POST | `/api/students` | create (validate name, classId, roll) |
| PUT | `/api/students/:id` | update |
| DELETE | `/api/students/:id` | delete or soft-delete (decision pending) |

## Data model changes to plan
- Replace free-text `class` with `classId` (+ optionally `sectionId`)
- Add admission info: admissionNo, admissionDate, dob, gender (product requirement)
- Add parent/guardian info
- Keep `roll` unique per class/section
- Decide delete vs soft-delete (fee/attendance history preservation)

## Verification checklist
- [ ] CRUD works against DB
- [ ] Duplicate roll within class rejected
- [ ] Search works server-side
- [ ] Referential integrity to Class/Section
- [ ] Frontend integrated without UI redesign

## Owner
Mustafa. Shared contract with Rimsha (exams/results/reports depend on Student).