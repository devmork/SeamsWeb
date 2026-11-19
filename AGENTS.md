# AGENTS.md

Guidance for AI coding agents working in this repository. Keep changes small, verified, and consistent with existing patterns.

## Project

SeamsWeb: React 19 + TypeScript + Vite 7 single-page frontend for the Seams product (admin / officer / student areas). UI stack: TanStack Router, TanStack Query, Zustand, axios, Tailwind v4 + shadcn/radix. Backend is a separate .NET API repo and is not part of this codebase.

## Commands

- `npm install`
- `npm run dev` — Vite dev server
- `npm run build` — `vite build && tsc -b` (the `tsc -b` step typechecks via project references; must pass)
- `npm run lint` — `eslint .`
- `npm run preview` — serve the production build

There is no test runner or test script in this repo.

Before considering frontend work done, run `npm run lint` and `npm run build`.

Gotcha: `npm run lint` runs ESLint over the whole repo and currently reports errors from stale files in `dist/` (build output). If lint fails only on paths under `dist/`, delete `dist/` (or lint `src` directly while iterating).

## Setup

- `.env` is gitignored. Local development expects the .NET backend at `http://localhost:7122/api`; `VITE_API_BASE_URL` in `.env` points there (the axios client in `src/service/api.ts` falls back to the same default).
- Auth: token + user live in a persisted Zustand store (`src/features/auth/Stores/AuthStore.ts`, storage key `auth-storage`). The axios instance in `src/service/api.ts` attaches the Bearer token and clears auth / redirects to `/login` on 401.

## Architecture

- Entry: `src/main.tsx` → TanStack Router, tree from generated `src/routeTree.gen.ts`.
- Routing: file-based via `@tanstack/router-plugin` in `vite.config.ts` (`target: 'react'`, auto code splitting). Adding route files under `src/routes/` (including `_auth` / `_authenticated` pathless layouts) regenerates the tree — restart the dev server after adding files. `src/routeTree.gen.ts` is generated and gitignored; never hand-edit or commit it.
- Path alias: `@/*` → `src/*` (vite config + both tsconfigs).
- Routes: `/` redirects to `/login`. `_auth` group: `/login`, `/signup`, `/verify`. `_authenticated` group: auth guard in `beforeLoad` redirects to `/login` without token/user; contains `/admin/*`, `/officer/*`, `/student/*`. Layouts in `src/shared/layouts`; nav config in `src/config/navigation.ts` (per-role nav).
- Feature modules: `src/features/<domain>/` with `components/`, `services/`, types, and `index.ts` barrel. Domains: `admin`, `auth`, `officer`, `student`.
- Shared code: `src/components/ui` (shadcn components), `src/shared/`, `src/lib/`, `src/service/api.ts`, `src/config/`, `src/hooks/`.

## Conventions and quirks

- TypeScript strict mode with extra flags: `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax` (use `import type` for type-only imports), `erasableSyntaxOnly` (no enums/namespaces/parameter properties), `moduleResolution: bundler`, `allowImportingTsExtensions`, no emit. Project references via `tsconfig.app.json` + `tsconfig.node.json`; typecheck runs through `tsc -b` (part of `npm run build`).
- ESLint flat config in `eslint.config.ts` (js recommended + typescript-eslint recommended + react flat recommended).
- Prettier config exists (`.prettierrc`, singleQuote) but there is no Prettier script/dependency — formatting is not enforced by tooling here.
- Styling: Tailwind v4 via `@tailwindcss/vite`, design tokens as CSS variables in `src/index.css` (`@theme inline`), shadcn component config in `components.json`.
- Server state: TanStack Query client in `src/lib/query-client.ts` (staleTime 60s, retry 1).

## Design system

- `docs/DESIGN.md` is the design source of truth for visual design decisions.
- Design tokens live in `src/index.css` (CSS variables consumed through `@theme inline`) — this file is the source of truth for token implementation; keep DESIGN.md and `index.css` aligned here and use oklch values (do not reintroduce raw hex).
- Radius tokens (`--radius-*` in `@theme inline`) follow the DESIGN.md scale: sm 5 / md 8 / lg 12 / xl 16, full pill for CTAs.

## References

- Design system notes: `docs/DESIGN.md`.
