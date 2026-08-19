# Data Storage

## Current layer
`front-end/src/utils/storage.js`:

```js
getData(key, defaultValue = [])  // JSON.parse(localStorage.getItem(key))
saveData(key, data)              // localStorage.setItem(key, JSON.stringify(data))
```

All pages use these two helpers. **Replacing this layer is the core of backend integration** — swap localStorage for API calls page by page, keeping the UI identical.

## localStorage keys → target API endpoints

| localStorage key | Shape (summary) | Target API |
|---|---|---|
| `edumanage_user` | `{ email, name, role }` | `POST /api/auth/login` → JWT |
| `students` | array of Student | `/api/students` |
| `fees` | array of Fee | `/api/fees` |
| `staff` | array of Staff | `/api/staff` |
| `exams` | array of Exam | `/api/exams` |
| `accounting` | array of Transaction | `/api/accounting` |
| `attendance` | `{ "CLASS_DATE": { studentId: "present"\|"absent" } }` | `/api/attendance?classId=&date=` |

## Detailed shapes

See [[03 Database/Data Model]] for exact field lists per entity (Student, Fee, Staff, Exam, Transaction, Attendance).

Key structural notes for API design:
- **IDs** are generated client-side as `Date.now()` — backend should generate server-side (auto-increment or UUID).
- **`class`** is a free-text string like `"10-A"` everywhere — backend should normalize to Class/Section relations; frontend can keep displaying the combined string.
- **Fees** link to students by name (not ID) today — backend must link by `studentId` and resolve name for display.
- **Attendance** is keyed by `"CLASS_DATE"` in a single object — backend should store per-student rows (`studentId`, `date`, `status`), and the page filters by class+date.
- **Receipt numbers** (`RCP-XXXX`) are generated with `Math.random()` client-side — move server-side for uniqueness.

## Migration strategy
1. Build backend endpoints for each resource.
2. Create an API client module (`src/api/client.js`) with token handling.
3. Replace `getData/saveData` per page (smallest unit: one page at a time).
4. Keep a fallback to localStorage during transition if desired (offline support).
5. Remove `utils/storage.js` only after all pages are migrated and verified.