# Module: Timetable (Not Started)

## Status
**Not implemented.** No frontend page, no backend, no model. Belongs to **Rimsha**.

## Dependency chain
```text
Teachers + Classes + Subjects   (Mustafa)
            ↓
        Timetable               (Rimsha)
```

## Product requirements (AGENTS.md)
- Teacher timetable
- Class timetable
- Subject scheduling

## Planned model
- `Timetable`: classId, subjectId, teacherId, day, period/slot

## Constraints to design for
- No overlapping periods for a teacher
- No overlapping periods for a class
- Optional per-period breaks
- Unique (classId, day, period) and (teacherId, day, period)

## Planned API (proposal)
| Method | Route |
|---|---|
| GET | `/api/timetable?classId=` |
| GET | `/api/timetable/teacher/:teacherId` |
| POST/PUT/DELETE | `/api/timetable` |

## Next step
Wait for Class/Subject/Teacher (assignments) to exist, then design timetable UI + API with Rimsha.