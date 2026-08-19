# Components

## Layout components (`front-end/src/components/layout/`)

| Component | Purpose |
|---|---|
| `Sidebar.jsx` | Navigation menu, role-filtered (Admin/Teacher), logout |
| `Navbar.jsx` | Search box, bell, user chip (hardcoded "Admin / Principal") |
| `OfflineBanner.jsx` | Shows banner when `navigator.onLine === false` |

## Common components (`front-end/src/components/common/`)

| Component | Purpose |
|---|---|
| `ProtectedRoute.jsx` | Redirects to `/login` when no user; currently **unused in practice** (dead route in App.jsx) |

## UI components (`front-end/src/components/ui/`)

| Component | Usage |
|---|---|
| `Badge.jsx` | Status pills (Active/Pending/etc.) |
| `Button.jsx` | Reusable button |
| `Input.jsx` | Reusable input |
| `Modal.jsx` | Reusable modal shell |
| `StatCard.jsx` | Dashboard stat cards (icon + title + value + color) |

> Many pages currently inline their own modal markup instead of using `Modal.jsx`. Consider standardizing during backend integration.

## Layout wrapper (`front-end/src/layouts/DashboardLayout.jsx`)
- Renders `OfflineBanner`, `Sidebar`, `Navbar`, and `<Outlet />`.
- Responsive: sidebar collapses on mobile (hamburger).

## Conventions
- Tailwind utility classes, indigo accent color (`indigo-600`)
- Cards: `bg-white rounded-2xl border border-slate-100 shadow-sm`
- Buttons: primary `bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl`
- Status badges use emerald/amber/rose tinted backgrounds
- Currency formatted with ₹ and `toLocaleString()`