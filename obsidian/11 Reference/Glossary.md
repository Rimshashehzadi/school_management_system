# Glossary

| Term | Meaning |
|---|---|
| **EduManage** | Working product name shown in the frontend UI |
| **SPA** | Single-page application (React) |
| **localStorage** | Browser storage; current persistence layer |
| **Prisma** | ORM used to talk to MySQL from Node |
| **ORM** | Object-relational mapper |
| **JWT** | JSON Web Token used for authentication |
| **bcrypt** | Password hashing library |
| **RBAC** | Role-based access control |
| **CRUD** | Create, Read, Update, Delete |
| **MOC** | Map of content (Obsidian index note) |
| **Contract** | A shared entity/API definition both contributors rely on |
| **On-premise** | Software installed and run on the school's own computer/server |
| **Receipt** | Fee payment proof (receiptNo, amount, date) |
| **Section** | A division of a class (e.g., 10-A has sections A/B/C) |
| **Academic Year** | School year, e.g., 2025–2026 (Settings page) |

## Codebase terms
| Term | Meaning |
|---|---|
| `getData/saveData` | localStorage helpers in `front-end/src/utils/storage.js` |
| `edumanage_user` | localStorage key for the logged-in demo user |
| `attendance` key pattern | `"CLASS_DATE"` → `{ studentId: status }` |