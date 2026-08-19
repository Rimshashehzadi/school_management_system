# Decision Log

Format: Problem → Context → Constraints → Options → Trade-offs → Recommendation → Decision → Action.

## D-001 — Place Obsidian vault inside the repository
- **Problem:** Where should the knowledge base live?
- **Context:** AI agents and both contributors need access; AGENTS.md treats Obsidian as the project second brain.
- **Constraints:** Must be readable by agents and humans; must version well.
- **Options:** (a) repo folder `obsidian/`, (b) external vault.
- **Trade-offs:** (a) in-repo: shared via Git, versioned, but grows repo; (b) external: separate, not automatically shared.
- **Decision (2026-08-19):** In-repo `obsidian/` folder.
- **Action:** Created full vault. Share the folder in Obsidian as a vault root.

## D-002 — Backend foundation is the next priority
- **Context:** Backend is empty; frontend is complete but localStorage-only.
- **Decision:** Build backend first (Express → Prisma → MySQL → Auth), then integrate pages.
- **Action:** Recorded in [[01 Project State/Project State]].

## Pending decisions (need Mustafa)
1. **RBAC scope:** role enum vs. full Role/Permission tables (see [[03 Database/ERD]]).
2. **Class/Section:** split tables vs. single class string (recommend split).
3. **Student delete:** hard delete vs. soft-delete/status (recommend soft-delete to preserve history).
4. **JWT expiry:** 8h vs. 24h.
5. **Login rate limiting:** yes/no (recommend yes for security).