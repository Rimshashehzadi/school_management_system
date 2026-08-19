# Module: Dashboard & Reports

## Dashboard — current state (frontend)
`pages/dashboard/Dashboard.jsx`
- Reads `students`, `fees`, `accounting` from localStorage
- Shows: total students, active students, fees collected, pending fees, income, expense, balance
- `StatCard` component for the 4 main cards

## Reports — current state (frontend)
`pages/reports/Reports.jsx`
- CSV downloads (client-side Blob): students, fees, staff, accounting
- Columns fixed in code

## Backend state
None.

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/dashboard/stats` | totals for dashboard cards |
| GET | `/api/reports/students` | CSV |
| GET | `/api/reports/fees` | CSV |
| GET | `/api/reports/staff` | CSV |
| GET | `/api/reports/accounting` | CSV |
| (future) | attendance / exam reports | Rimsha |

## Verification checklist
- [ ] Dashboard numbers match DB sums (verify against known data)
- [ ] CSV export handles special characters (names with commas, ₹) — use proper CSV escaping
- [ ] Date/class/status filters on reports (product requirement)

## Owner
Dashboard/Reports: Rimsha (with Mustafa for fee/student data).