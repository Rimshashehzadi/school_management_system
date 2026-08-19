# Pages & Routes

## Route table (`front-end/src/App.jsx`)

| Path | Component | Auth (current) | Data read/write |
|---|---|---|---|
| `/login` | `Login` | Public | writes `edumanage_user` |
| `/` | `Dashboard` | DashboardLayout (unprotected) | reads students, fees, accounting |
| `/students` | `Students` | DashboardLayout (unprotected) | students |
| `/attendance` | `Attendance` | DashboardLayout (unprotected) | students, attendance |
| `/fees` | `Fees` | DashboardLayout (unprotected) | fees |
| `/exams` | `Exams` | DashboardLayout (unprotected) | exams |
| `/staff` | `Staff` | DashboardLayout (unprotected) | staff |
| `/reports` | `Reports` | DashboardLayout (unprotected) | students, fees, staff, accounting |
| `/settings` | `Settings` | DashboardLayout (unprotected) | none (not persisted) |
| `/accounting` | `Accounting` | DashboardLayout (unprotected) | accounting |
| `/backup` | `Backup` | DashboardLayout (unprotected) | all keys |

> **Note:** `App.jsx` defines a `<Route element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}></Route>` that is **empty (no children)** — dead code. The real pages are nested under a plain `<Route element={<DashboardLayout/>}>`. Route protection is effectively not applied. See [[08 Risks & Debt/Risks & Technical Debt]].

## Per-page data requirements (for API design)

### Dashboard (`pages/dashboard/Dashboard.jsx`)
Needs: total students, active students, fees collected (sum of Paid), pending fees (Pending+Overdue), total income (accounting type=income), total expense.
→ API candidates: `GET /api/dashboard/stats`

### Students (`pages/students/Students.jsx`)
Fields: id, name, class, roll, phone, status. CRUD + search by name/class/roll.
→ `GET/POST/PUT/DELETE /api/students`, `GET /api/students?search=`

### Attendance (`pages/attendance/Attendance.jsx`)
Selects class + date; loads students of that class (status Active); toggles present/absent per student; saves whole sheet.
→ `GET /api/attendance?classId=&date=`, `POST /api/attendance` (bulk save)

### Fees (`pages/fees/Fees.jsx`)
Fields: name, class, amount, status, date, receiptNo. Collect → status Paid + auto receipt no. Prints receipt.
→ `GET /api/fees`, `POST /api/fees/collect`, receipt fields server-generated

### Exams (`pages/exams/Exams.jsx`)
Fields: name, class, date, totalMarks, status. CRUD + details modal.
→ `GET/POST/PUT/DELETE /api/exams`

### Staff (`pages/staff/Staff.jsx`)
Fields: name, role, subject, phone, email, status. CRUD + search.
→ `GET/POST/PUT/DELETE /api/staff`

### Accounting (`pages/accounting/Accounting.jsx`)
Fields: type, title, amount, category, date. Add/delete. Totals income/expense/balance.
→ `GET/POST/DELETE /api/accounting`

### Reports (`pages/reports/Reports.jsx`)
CSV downloads for students, fees, staff, accounting.
→ `GET /api/reports/students.csv` etc. or client-side fetch + CSV

### Backup (`pages/backup/Backup.jsx`)
JSON backup of students/fees/staff/exams/accounting/attendance; restore validates.
→ `GET /api/backup` (download), `POST /api/backup/restore`

### Settings (`pages/settings/Settings.jsx`)
School info, profile, notifications, security tabs. Not persisted today.
→ `GET/PUT /api/school-profile`, `PUT /api/auth/me`, password change

### Login (`pages/auth/Login.jsx`)
Demo credentials form. 
→ `POST /api/auth/login`

## Sidebar menu + role visibility (`components/layout/Sidebar.jsx`)

| Item | Path | Roles |
|---|---|---|
| Dashboard | `/` | Admin, Teacher |
| Students | `/students` | Admin, Teacher |
| Attendance | `/attendance` | Admin, Teacher |
| Fees | `/fees` | Admin |
| Exams | `/exams` | Admin, Teacher |
| Staff | `/staff` | Admin |
| Accounting | `/accounting` | Admin |
| Reports | `/reports` | Admin |
| Backup | `/backup` | Admin |
| Settings | `/settings` | Admin |