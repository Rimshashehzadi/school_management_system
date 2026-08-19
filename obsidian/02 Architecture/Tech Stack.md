# Tech Stack

## Frontend (verified from `front-end/package.json`)

| Area | Tech |
|---|---|
| Framework | React 19 (react-dom 19) |
| Build | Vite 8 (`vite.config.js`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Routing | react-router-dom 7 |
| Icons | lucide-react |
| Charts | recharts 3 (not yet used in pages) |
| Motion | framer-motion (not yet used in pages) |
| Utils | clsx |
| Linting | ESLint 10 + react-hooks + react-refresh |
| Persistence | localStorage (browser) — `utils/storage.js` |

## Backend (target, NOT yet installed)

| Area | Tech (target) |
|---|---|
| Runtime | Node.js + Express.js |
| ORM | Prisma |
| Database | MySQL |
| Auth | JWT + bcrypt |
| Testing | Postman / Thunder Client |

Current backend: **empty** — no `package.json`, no dependencies, `index.js` is 0 bytes.

## Scripts (frontend)

- `npm run dev` — Vite dev server
- `npm run build` — production build
- `npm run preview` — preview build
- `npm run lint` — ESLint

## Notes

- Do not introduce unnecessary dependencies. Any major new tech requires justification + Mustafa's sign-off.
- `recharts` and `framer-motion` are already dependencies but currently unused in page code.