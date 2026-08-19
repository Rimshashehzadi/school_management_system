# API Conventions

These conventions apply to all backend routes. Adopt them from the start so Mustafa and Rimsha build consistent endpoints.

## General

- Base URL prefix: `/api`
- Resource-based, plural nouns: `/api/students`, `/api/attendance`
- HTTP verbs: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove)
- JSON request/response bodies only
- `express.json()` + CORS enabled

## Status codes

| Code | Meaning |
|---|---|
| 200 | OK (read/update success) |
| 201 | Created |
| 204 | No content (delete success) |
| 400 | Bad request / validation error |
| 401 | Unauthenticated (missing/invalid token) |
| 403 | Forbidden (authenticated but not allowed) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

## Response envelope (recommended)

```json
// Success
{ "success": true, "data": { ... } }

// List
{ "success": true, "data": [ ... ], "meta": { "total": 42, "page": 1, "limit": 20 } }

// Error
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "name is required", "details": [...] } }
```

## Error format

- `code` — machine-readable string (e.g., `STUDENT_NOT_FOUND`)
- `message` — human-readable
- `details` — optional field-level errors array
- Never leak stack traces or DB errors to the client in production.

## Validation

- Validate on the backend for every mutating request
- Check: required fields, types, lengths, enums, referential existence
- Return 400 with `details` listing each invalid field

## Auth conventions

- Protected routes require `Authorization: Bearer <token>`
- `req.user` populated by auth middleware (id, role)
- Role-restricted routes return 403 when the role is insufficient

## Pagination / filtering

- `GET /api/students?page=1&limit=20&search=ra&class=10-A`
- `meta` block returned for paginated lists
- Default limit 20, max 100

## Route naming examples

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Login → token |
| GET | `/api/auth/me` | Current user |
| GET | `/api/students` | List students |
| POST | `/api/students` | Create student |
| GET | `/api/students/:id` | Get one |
| PUT | `/api/students/:id` | Update |
| DELETE | `/api/students/:id` | Delete |
| GET | `/api/classes` | List classes |
| GET | `/api/attendance?classId=&date=` | Attendance by class+date |
| POST | `/api/attendance` | Save attendance for class+date |