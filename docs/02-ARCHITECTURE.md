# 2. Architecture

## 2.1 High-level shape

SEAMS Web is a single-page React app. There is no server-side rendering and no meta-framework (no Next.js) — it's plain Vite + React Router, deployed as a static bundle to Vercel that talks to a separate ASP.NET Core API over HTTPS/JSON.

```
Browser (React SPA, this repo)
      │  Axios (JWT bearer token in headers)
      ▼
ASP.NET Core Web API (separate repo)
      │
      ▼
SQL Server
```

## 2.2 Folder structure

```
src/
├── App.tsx                # Root component: wraps everything in BrowserRouter
├── main.tsx                # Entry point: StrictMode, ErrorBoundary, TooltipProvider
├── ErrorBoundary.tsx        # Top-level React error boundary
├── index.css / App.css      # Global styles (Tailwind entry point is index.css)
│
├── components/
│   ├── layout/               # App chrome: sidebar, nav header, nav items, user menu
│   └── ui/                   # Reusable primitives (button, dialog, table, sidebar, etc.)
│                              # — mostly shadcn/Radix-based, see 05-ui-and-styling.md
│
├── config/
│   ├── navigation.ts         # Per-role sidebar nav definitions (admin/officer/student)
│   └── filter.ts             # Shared filter option constants (program, year level, status)
│
├── features/                 # ⭐ The core of the app — see below
│   ├── auth/
│   ├── admin/
│   │   ├── applicants/
│   │   ├── attendances/
│   │   ├── events/
│   │   ├── officers/
│   │   └── students/
│   ├── officer/
│   │   └── scan/
│   └── student/
│       ├── attendance/
│       ├── profile/
│       └── qr/
│
├── hooks/                    # Shared React hooks (e.g. use-mobile)
├── layouts/                  # Page shells: AuthLayout (login/signup), AuthenticatedLayout (app chrome)
├── lib/
│   └── utils.ts               # Small shared helpers (e.g. Tailwind class merging)
├── routes/
│   ├── AppRoutes.tsx          # Top-level <Routes> tree, wires guards + layouts + modules together
│   ├── routes.types.ts        # Shared RouteConfig type
│   ├── guards/                # ProtectedRoute, PublicRoute
│   └── modules/                # One route module per role: admin/officer/public/student
├── service/
│   └── api.ts                  # Shared Axios instance (base URL, auth header, 401 handling)
└── types/                    # Cross-cutting TypeScript types not owned by a single feature
```

## 2.3 Feature-based organization

The app is organized **by feature/domain, not by file type**. Instead of one giant `components/` and one giant `services/` folder, each feature owns its own slice:

```
features/admin/students/
├── student.type.ts                    # TypeScript types for this feature
├── index.ts                           # Public exports — what other code is allowed to import
├── components/
│   ├── StudentList.tsx
│   ├── StudentDetailDialog.tsx
│   └── StudentDeactivateDialog.tsx
└── services/
    └── StudentService.ts               # API calls for this feature (uses the shared `api` instance)
```

Every feature under `features/` follows this same skeleton: a `.type.ts` file, an `index.ts` barrel export, a `components/` folder, and a `services/` folder that wraps the relevant backend endpoints. When you build a new feature, copy this shape rather than inventing a new one — see [04-features.md](./04-features.md) for a full walkthrough with real examples and the exact pattern to follow for a new feature.

**Why this matters for you as a new contributor:** to understand or change "how officer QR scanning works," everything you need lives under `features/officer/scan/` — the type, the component, and the service call. You don't need to hunt through a shared `components/` or `services/` folder.

## 2.4 Path aliases

The repo uses `@` as an alias for `src/`, configured in both `vite.config.ts` and `tsconfig.json`:

```ts
import { authService } from '@/features/auth';
import { Button } from '@/components/ui/button';
```

Always use `@/...` imports for anything outside the current feature folder; use relative imports (`./`, `../`) only within the same feature.

## 2.5 Routing

Routing is centralized in `src/routes/`:

- **`routes.types.ts`** defines a minimal `RouteConfig` (`{ path, element }`).
- **`modules/*.routes.tsx`** — one file per role (`admin.routes.tsx`, `officer.routes.tsx`, `student.routes.tsx`) plus `public.routes.tsx` for login/signup — each exports an array of `RouteConfig`. Adding a page to a role is just adding one entry to the matching array.
- **`guards/`** — `ProtectedRoute` and `PublicRoute` gate access based on auth state and role (see [03-authentication.md](./03-authentication.md)).
- **`AppRoutes.tsx`** assembles everything: public routes are wrapped in `PublicRoute`, and each role's routes are wrapped in `ProtectedRoute` (with `allowedRoles`) _and_ `AuthenticatedLayout` (the sidebar/header chrome). Any unmatched path redirects to `/login`.

```tsx
<Route element={<ProtectedRoute allowedRoles={['admin']} />}>
  <Route element={<AuthenticatedLayout />}>
    {adminRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Route>
</Route>
```

## 2.6 Layouts

Two layouts wrap all pages:

- **`AuthLayout`** — the split-screen login/signup shell (form on one side, DMC branding/background image on the other). Used for `/login` and `/signup`.
- **`AuthenticatedLayout`** — the app shell for logged-in users: sidebar (`AppSidebar`, built from `navigationData` per role), a header with a breadcrumb-style title derived from the current route, and an `<Outlet />` for the active page. Also mounts the `Toaster` (toast notifications) so any page can fire toasts without mounting its own.

## 2.7 App bootstrap order

```
main.tsx
  └─ StrictMode
      └─ ErrorBoundary          (catches render errors app-wide)
          └─ TooltipProvider     (Radix tooltip context, app-wide)
              └─ App.tsx
                  └─ BrowserRouter
                      └─ AppRoutes  (see 2.5)
```
