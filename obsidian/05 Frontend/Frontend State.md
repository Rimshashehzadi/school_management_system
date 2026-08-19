# Frontend State

## Summary (verified 2026-08-19)

The frontend is a **complete, working client-side SPA** (React 19 + Vite + Tailwind 4). All data lives in `localStorage`. There is **no API integration yet** — every page reads/writes via `front-end/src/utils/storage.js`.

**Do not rebuild the frontend.** Integrate the backend into the existing screens.

## File inventory

```text
front-end/src/
├── App.jsx                      # Routes
├── main.jsx                     # Entry, AuthProvider wrapper
├── index.css
├── components/
│   ├── common/ProtectedRoute.jsx
│   ├── layout/Navbar.jsx, Sidebar.jsx, OfflineBanner.jsx
│   └── ui/Badge.jsx, Button.jsx, Input.jsx, Modal.jsx, StatCard.jsx
├── context/AuthContext.jsx      # Demo auth (hardcoded)
├── layouts/DashboardLayout.jsx
├── pages/
│   ├── accounting/Accounting.jsx
│   ├── attendance/Attendance.jsx
│   ├── auth/Login.jsx
│   ├── backup/Backup.jsx
│   ├── dashboard/Dashboard.jsx
│   ├── exams/Exams.jsx
│   ├── fees/Fees.jsx
│   ├── reports/Reports.jsx
│   ├── settings/Settings.jsx
│   ├── staff/Staff.jsx
│   └── students/Students.jsx
└── utils/storage.js             # getData / saveData
```

## What works today
- Login (demo accounts), sidebar role filtering
- Students CRUD (add/edit/delete/search)
- Attendance marking per class+date (saved to localStorage)
- Fee collection + receipt print
- Exams CRUD + view details
- Staff CRUD + search
- Accounting income/expense tracking
- Dashboard statistics from students/fees/accounting
- Reports CSV download (students, fees, staff, accounting)
- Backup/restore JSON
- Offline banner
- Settings UI (not persisted)

## What is missing / gaps
- No backend/API/DB (all localStorage)
- Real authentication (hardcoded demo accounts)
- `ProtectedRoute` is dead code in `App.jsx`
- Settings not persisted
- No marks/results entry UI (exam detail is read-only)
- No timetable, parents/notices UI yet
- No attendance history/filters beyond class+date
- No import (CSV/Excel)
- `recharts`/`framer-motion` unused so far

## Integration approach (per screen)
For each page: replace `getData/saveData` calls with an API client, keep the UI identical, add loading/error states, and handle auth headers. See [[05 Frontend/Data Storage]] for the mapping.