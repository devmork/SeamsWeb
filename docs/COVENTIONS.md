# 6. Conventions & Workflow

## 6.1 Naming

- **Components:** `PascalCase.tsx` (`StudentList.tsx`, `ScanQR.tsx`).
- **Services:** `PascalCase` + `Service.ts` (`StudentService.ts`, `EventService.ts`, `AttendanceRecordService.ts`).
- **Types:** `lowercase.type.ts` inside the owning feature (`student.type.ts`, `event.type.ts`, `attendance-record.types.ts`). Cross-cutting types that don't belong to one feature live in `src/types/`.
- **Route modules:** `<role>.routes.tsx` under `src/routes/modules/`.
- **Feature index files:** every feature exposes a flat `index.ts` barrel — re-export types, the service, and public components from there; that's what other features/routes should import from.

## 6.2 TypeScript

- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts` — keep them in sync if you ever change it).
- `npm run build` runs `tsc -b` before bundling — treat TypeScript errors as build-breaking, not just editor warnings.
- Type every service function's return type and Axios generic explicitly (see [04-features.md §4.1](./04-features.md#41-the-service-layer-pattern)); avoid `any`.

## 6.3 Linting & formatting

- **ESLint:** flat config in `eslint.config.ts` — `@eslint/js` recommended + `typescript-eslint` recommended + `eslint-plugin-react` recommended, with `react/react-in-jsx-scope` disabled (not needed with React 19's automatic JSX runtime). Run `npm run lint` before opening a PR.
- **Prettier:** configured via `.prettierrc`. Run through your editor's format-on-save, or `npx prettier --write .` if you don't have that set up. There's no `npm run format` script currently — a reasonable small improvement to propose.

## 6.4 Git & PR workflow

The team uses **Azure DevOps** for collaboration (boards/repos) alongside GitHub. General expectations for a student/capstone team project:

- Branch off `main` per feature/fix; open a PR/PR-equivalent rather than pushing directly to `main`.
- Run `npm run lint` and `npm run build` locally before requesting review — a red build should never land.
- Keep PRs scoped to one feature or fix, mirroring the feature-folder boundaries in [02-architecture.md](./02-architecture.md) — e.g. a PR touching `features/admin/events/` shouldn't casually also refactor `features/student/qr/`.

## 6.5 Environment & secrets

- Never commit `.env` or `.env.production` — they're already git-ignored.
- The only current env var is `VITE_API_BASE_URL` (see [01-getting-started.md](./01-getting-started.md#13-environment-variables)). If you add more, remember the `VITE_` prefix requirement and document them in this file and in a `.env.example`.

## 6.6 Deployment

- Hosted on **Vercel**; `vercel.json` rewrites all routes to `index.html` (required for client-side routing to survive page refreshes/deep links).
- Set `VITE_API_BASE_URL` in the Vercel project's environment variables for production, staging, and preview deployments as applicable, pointing at the correct backend for each.
- `npm run build` is what Vercel runs — if it fails locally, it will fail on Vercel too.

## 6.7 Known gaps / good first tasks for new contributors

These are honest gaps in current project polish — good onboarding tasks to get familiar with the codebase:

- No `.env.example` committed — add one.
- No `npm run format` script for Prettier.
- No automated tests currently set up (no test runner in `devDependencies`) — consider introducing one (e.g. Vitest, since the project already uses Vite) starting with the service layer, which is pure and easy to unit test.
- `ProtectedRoute` preserves the attempted location (`state={{ from: location }}`) on redirect to `/login`, but nothing currently reads it back to redirect the user to their original destination after logging in — a nice small UX improvement.
