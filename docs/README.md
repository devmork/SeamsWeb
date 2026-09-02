# SEAMS Web — Developer Documentation

**SEAMS** (School Event and Attendance Management System) is the frontend web application for DMC College Foundation's Supreme Student Government attendance platform. It lets admins manage students/officers/events, lets officers scan student QR codes to record attendance, and lets students view their profile, QR code, and attendance history.

This folder is the onboarding guide for new developers joining the project. Read the docs in order the first time; after that, use them as reference.

| #   | Doc                                              | What it covers                                                                                       |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| 1   | [01-getting-started.md](./01-getting-started.md) | Prerequisites, cloning, installing, environment variables, running the dev server, building, linting |
| 2   | [02-architecture.md](./02-architecture.md)       | Folder structure, feature-based architecture, path aliases, routing, layouts                         |
| 3   | [03-authentication.md](./03-authentication.md)   | JWT auth flow, role-based access control, route guards, Axios interceptors                           |
| 4   | [04-features.md](./04-features.md)               | Walkthrough of every feature module (auth, admin, officer, student) and the service-layer pattern    |
| 5   | [05-ui-and-styling.md](./05-ui-and-styling.md)   | Tailwind CSS v4, Radix UI, shadcn/ui, fonts, sidebar/navigation system                               |
| 6   | [06-conventions.md](./06-conventions.md)         | Coding conventions, naming, ESLint/Prettier, Git workflow, deployment                                |

## Quick facts

- **Live app:** https://seams-web.vercel.app
- **Repo:** https://github.com/devmork/SeamsWeb
- **Stack:** React 19 + TypeScript + Vite, Tailwind CSS v4, Radix UI / shadcn, React Router 7, Axios, JWT auth
- **Backend:** A separate ASP.NET Core Web API + SQL Server project (not in this repo) — SEAMS Web is the client only
- **Hosting:** Vercel (see `vercel.json`)

## TL;DR — run it locally

```bash
git clone https://github.com/devmork/SeamsWeb.git
cd SeamsWeb
npm install
cp .env.example .env   # then set VITE_API_BASE_URL
npm run dev
```

See [01-getting-started.md](./01-getting-started.md) for the full walkthrough, including what to do if `.env.example` doesn't exist yet.
