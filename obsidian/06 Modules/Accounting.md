# Module: Accounting

## Current state (frontend)
`pages/accounting/Accounting.jsx`
- localStorage key: `accounting`
- Fields: `id, type ('income'|'expense'), title, amount, category, date`
- Categories: `Fees, Salary, Maintenance, Utilities, Transport, Other`
- Add/delete transactions; totals income/expense/balance

## Backend state
None.

## Planned model
- `Transaction`: type, title, amount, category, date
- Optional link to `FeePayment` (fee collection auto-creates an income transaction)

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/accounting` | list + `?type=&category=&from=&to=` |
| POST | `/api/accounting` | add transaction |
| DELETE | `/api/accounting/:id` | delete |
| GET | `/api/accounting/summary` | income/expense/balance |

## Verification checklist
- [ ] Income/expense totals correct
- [ ] Category validated against enum
- [ ] Deleting a fee-linked transaction handled (prevent or cascade with care)
- [ ] Balance calculation verified

## Owner
Mustafa. Dashboard (Rimsha) reads accounting totals.