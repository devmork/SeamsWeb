# 1. Getting Started

This guide gets you from a fresh clone to a running dev server.

## 1.1 Prerequisites

| Tool                        | Notes                                                                                                                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Node.js**                 | LTS 18+ recommended (Vite 7 requires a reasonably recent Node). Check with `node -v`.                                                                                                                          |
| **npm**                     | Ships with Node. The repo commits `package-lock.json`, so stick with npm rather than yarn/pnpm to avoid lockfile drift.                                                                                        |
| **Git**                     | To clone and manage branches.                                                                                                                                                                                  |
| **A running SEAMS backend** | This repo is the frontend only. You need the ASP.NET Core Web API (+ SQL Server) running locally or accessible remotely — see [03-authentication.md](./03-authentication.md) for how the frontend talks to it. |
| **Editor**                  | VS Code recommended, with the ESLint and Prettier extensions (the repo ships `.prettierrc` and `eslint.config.ts`).                                                                                            |

## 1.2 Clone and install

```bash
git clone https://github.com/devmork/SeamsWeb.git
cd SeamsWeb
npm install
```

This installs React 19, Vite 7, Tailwind CSS v4, Radix UI/shadcn primitives, React Router 7, Axios, and the QR scanning libraries (`@yudiel/react-qr-scanner`, `html5-qrcode`) — see [05-ui-and-styling.md](./05-ui-and-styling.md) and [04-features.md](./04-features.md) for what each is used for.

## 1.3 Environment variables

The app reads its API base URL from a Vite env variable:

```ts
// src/service/api.ts
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://localhost:7122/api';
```

Create a `.env` file in the project root (it's git-ignored, along with `.env.production`):

```bash
# .env
VITE_API_BASE_URL=https://localhost:7122/api
```

Points to note for new devs:

- **Vite only exposes variables prefixed with `VITE_`** to client code. Adding `API_KEY=foo` instead of `VITE_API_KEY=foo` will silently not work.
- If you don't set `.env` at all, the app falls back to `https://localhost:7122/api`, which matches the default HTTPS port ASP.NET Core dev servers use — so for local development against a locally-running backend, you often don't need a `.env` file at all.
- For a deployed backend (staging/prod), set `VITE_API_BASE_URL` to that API's base URL, both locally (if pointing at a remote API) and in your Vercel project settings for production builds.
- There is currently no `.env.example` committed to the repo. **Recommended first task for a new contributor:** add one (with a placeholder value) so this step is self-documenting for the next person.

## 1.4 Run the dev server

```bash
npm run dev
```

This starts Vite's dev server (default `http://localhost:5173`) with hot module replacement. Because the backend is a separate HTTPS ASP.NET Core project, your browser may need to trust its local dev certificate the first time you hit it (visit the API's base URL directly once and accept the certificate warning if requests fail with a network/SSL error).

## 1.5 Build for production

```bash
npm run build
```

This runs `tsc -b` (a type-check/project-reference build) followed by `vite build`. If there are TypeScript errors, the build fails before Vite even bundles — so `npm run build` doubles as your type-safety gate. Output goes to `dist/`.

To preview the production build locally:

```bash
npm run preview
```

## 1.6 Lint

```bash
npm run lint
```

Runs ESLint using the flat config in `eslint.config.ts` (JS recommended rules + `typescript-eslint` recommended + `eslint-plugin-react` recommended, with `react/react-in-jsx-scope` turned off since React 19's JSX transform doesn't need it). There's no separate `format` script — Prettier is configured via `.prettierrc` and is typically run through your editor's "format on save" or `npx prettier --write .`.

## 1.7 Deployment

The project deploys to **Vercel** (`vercel.json` rewrites all paths to `/index.html`, which is required for a client-side-routed SPA like this one — without it, refreshing on a deep link like `/admin/students` would 404). Set `VITE_API_BASE_URL` as an environment variable in the Vercel project settings so production builds point at the production API.

## 1.8 Where to go next

- New to the codebase layout? Read [02-architecture.md](./02-architecture.md).
- Working on login/signup/permissions? Read [03-authentication.md](./03-authentication.md).
- Building a feature (a new admin page, a new student page, etc.)? Read [04-features.md](./04-features.md) — it documents the pattern every feature follows.
