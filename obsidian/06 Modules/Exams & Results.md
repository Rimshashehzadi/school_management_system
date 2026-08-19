# Module: Exams & Results

## Current state (frontend)
`pages/exams/Exams.jsx`
- localStorage key: `exams`
- Fields: `id, name, class, date (YYYY-MM-DD), totalMarks, status ('Upcoming'|'Completed')`
- CRUD + search + details modal (read-only)
- **No marks entry UI yet** — exam "view" shows only exam-level details

## Backend state
None. This is **Rimsha's area** (exams, results, timetable, parents).

## Product requirements (AGENTS.md)
- Exams, exam subjects, marks entry, result calculation, grades/percentages, result history, report cards

## Planned model
- `Exam`: id, name, classId, date, status
- `ExamSubject`: examId, subjectId, totalMarks, date
- `Mark`: studentId, examSubjectId, obtainedMarks (unique pair)
- `Result`: computed (percentage, grade, rank) — derived or stored

## Planned API (proposal for Rimsha)
| Method | Route | Notes |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/exams` | exam CRUD |
| GET | `/api/exams/:id/subjects` | exam subjects + marks sheet |
| POST | `/api/exams/:id/marks` | bulk marks entry |
| GET | `/api/exams/:id/results` | computed results |
| GET | `/api/results/student/:studentId` | student result history |

## Verification checklist
- [ ] Marks ≤ totalMarks enforced
- [ ] One mark per (student, examSubject)
- [ ] Percentage/grade calculation verified
- [ ] Report card data correct

## Owner
Rimsha. Mustafa coordinates on shared Student/Class/Subject contracts.