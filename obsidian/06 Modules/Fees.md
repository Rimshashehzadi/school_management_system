# Module: Fees

## Current state (frontend)
`pages/fees/Fees.jsx`
- localStorage key: `fees`
- Fields: `id, name, class, amount, status ('Paid'|'Pending'|'Overdue'), date, receiptNo`
- Collect fee: enter name/class/amount → status Paid, date today, auto receipt `RCP-XXXX` (client-side Math.random)
- Receipt modal + print (`window.print()`)
- Totals: collected, pending, overdue

## Issues in current design (to fix in backend)
- Fees link to students by **name**, not ID — must use `studentId`
- Receipt number generated client-side — must be server-side and unique
- No fee structure (per-class amounts) — amount is free-entered
- No payment history / installments per fee record
- No outstanding-fees report

## Backend state
None.

## Planned model
- `FeeStructure`: fee type/amount per class (e.g., monthly tuition 4500 for 10th)
- `FeeRecord`: student, structure/month, amount, status, dueDate
- `FeePayment`: student, amount, receiptNo (unique), date, method, collectedBy

## Planned API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/fees` | list with student names |
| GET | `/api/fees/outstanding` | outstanding report |
| POST | `/api/fees/collect` | `{ studentId, amount, method }` → creates payment + receiptNo |
| GET | `/api/fees/receipts/:id` | receipt data |

## Verification checklist
- [ ] Collect fee → payment row + receipt number stored server-side
- [ ] Receipt numbers unique and sequential
- [ ] Outstanding calculation correct (due − paid)
- [ ] Student reference validated
- [ ] Frontend shows real student list to select

## Owner
Mustafa. Dashboard/Reports (Rimsha) consume fee data.