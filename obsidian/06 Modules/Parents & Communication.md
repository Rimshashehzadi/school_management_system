# Module: Parents & Communication (Not Started)

## Status
**Not implemented.** No frontend page, no backend, no model. Belongs to **Rimsha**.

## Product requirements (AGENTS.md)
- Parent/guardian management
- Parent-student relationships
- Notices
- Announcements
- Permissions
- APIs
- Frontend integration

## Planned model
- `Parent` / `Guardian`: name, phone, email, relationship
- `StudentParent` join: student ↔ parent (a student may have multiple guardians)
- `Notice`: title, body, audience (role/class), createdBy, date

## Dependency
- Needs `Student` model (Mustafa) to establish parent-student links
- Needs `User`/roles for audience targeting

## Next step
Coordinate with Mustafa on the Student entity to include guardian fields or a join table.