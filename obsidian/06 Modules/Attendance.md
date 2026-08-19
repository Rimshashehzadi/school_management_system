# Module: Attendance

## Current state (frontend)
`pages/attendance/Attendance.jsx`
- localStorage key: `attendance`
- Structure: `{ "10-A_2026-08-19": { studentId: "present"|"absent" } }`
- Class list hardcoded: `['8-A', '8-B', '9-A', '9-B', '10-A', '10-B']`
- Filters: class + date
- Loads active students of that class; defaults to `present` if not recorded
- Save writes the whole sheet for that class+date

## Limitations in current UI
- Class list is hardcoded (must come from DB)
- No per-student late/leave statuses (only present/absent)
- No history view or monthly summary
- No filtering beyond class+date
- Keyed by class string, not classId

## Backend state
None.

## Planned model
- `Attendance(student_id, date, status, recordedBy)` — unique (student_id, date)
- Status enum: `present | absent | late` (extend later)

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/attendance?classId=&date=` | roster + saved statuses |
| POST | `/api/attendance` | bulk save `{ classId, date, records: [{ studentId, status }] }` |
| GET | `/api/attendance/history?studentId=&from=&to=` | history per student (future) |
| GET | `/api/attendance/report?classId=&month=` | monthly summary (future) |

## Verification checklist
- [ ] Mark attendance → rows persist
- [ ] Re-open same class+date → statuses reload
- [ ] Upsert (no duplicate rows per student/date)
- [ ] Only authorized roles (Admin/Teacher) can save
- [ ] Class list comes from DB

## Owner
Mustafa. Rimsha needs attendance data for reports/dashboard/QA.