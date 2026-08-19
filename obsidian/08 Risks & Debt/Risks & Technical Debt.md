# Risks & Technical Debt

## RISK-001 — Frontend auth is insecure demo code
- **Severity:** High
- **Impact:** Anyone can log in; no real users/roles; credentials hardcoded in client bundle.
- **Cause:** `AuthContext.jsx` hardcodes `admin@school.com`/`password` and `teacher@school.com`/`password`; no backend.
- **Recommendation:** Implement backend JWT auth first; seed real users; never keep demo credentials in production.
- **Action:** Backend auth module (see [[04 Backend/Authentication & Authorization]]).

## RISK-002 — Route protection is not actually enforced
- **Severity:** High (when backend arrives, this must be fixed)
- **Impact:** All dashboard pages are reachable without login; sidebar filtering is cosmetic.
- **Cause:** In `App.jsx`, the `<Route element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}></Route>` has **no children**, and the real routes are under an unprotected `<Route element={<DashboardLayout/>}>`.
- **Recommendation:** Nest all page routes under the `ProtectedRoute` element route.
- **Action:** Fix during auth integration.

## RISK-003 — All data is in localStorage
- **Severity:** Medium (by design for demo; blocks multi-user/product use)
- **Impact:** No shared data, no server, data tied to one browser.
- **Recommendation:** Move to MySQL via backend; keep localStorage only during transition.
- **Action:** Backend foundation.

## RISK-004 — Fees reference students by name; IDs are client-generated
- **Severity:** Medium
- **Impact:** Duplicate/renamed students break fee records; `Date.now()` IDs can collide.
- **Recommendation:** Backend auto-increment/UUID IDs; fees link by `studentId`.
- **Action:** During fees API implementation.

## RISK-005 — Receipt numbers generated with Math.random()
- **Severity:** Medium
- **Impact:** Non-unique/inconsistent receipt numbers; audit trail weak.
- **Recommendation:** Server-side sequential/unique receipt numbers.
- **Action:** During fees API implementation.

## TECHNICAL DEBT-001 — Class is free-text everywhere
- **Problem:** `class: '10-A'` stored as a string in students/fees/exams/attendance.
- **Why accepted:** Demo phase; fastest path.
- **Impact:** No referential integrity; reports/timetable need real structure.
- **Future fix:** Class + Section tables; frontend keeps combined display string.

## TECHNICAL DEBT-002 — Pages duplicate modal markup instead of using `Modal.jsx`
- **Problem:** Each page inlines its own modal JSX.
- **Why accepted:** Speed of initial build.
- **Impact:** Inconsistent behavior; more code to maintain.
- **Future fix:** Standardize on `Modal.jsx` during integration.

## TECHNICAL DEBT-003 — `recharts` and `framer-motion` installed but unused
- **Problem:** Dependencies in package.json without usage.
- **Why accepted:** Planned for dashboard charts/animations.
- **Impact:** Slightly larger bundle.
- **Future fix:** Use for dashboard charts or remove.

## TECHNICAL DEBT-004 — Settings page not persisted
- **Problem:** School info/profile changes are lost on refresh (comment in code: "In real app you would save to backend or localStorage").
- **Why accepted:** UI demo only.
- **Impact:** Settings have no effect.
- **Future fix:** `SchoolProfile` + user profile endpoints.