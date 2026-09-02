# 5. UI & Styling

## 5.1 Stack

| Layer                 | Tool                                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Styling               | Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no separate `tailwind.config.js`; config lives in CSS/`components.json`) |
| Component primitives  | Radix UI (`radix-ui` package)                                                                                              |
| Component scaffolding | shadcn/ui (config in `components.json`, style `radix-vega`, base color `zinc`)                                             |
| Icons                 | `lucide-react`                                                                                                             |
| Fonts                 | `@fontsource-variable/geist` and `@fontsource-variable/noto-sans` (self-hosted variable fonts, no external font CDN)       |
| Toasts                | `sonner`                                                                                                                   |
| Class merging         | `clsx` + `tailwind-merge`, wrapped in `src/lib/utils.ts` (the standard shadcn `cn()` helper)                               |

## 5.2 `components/ui/` — primitives

`src/components/ui/` holds shadcn-generated, Radix-backed primitives: `button`, `dialog`, `sheet`, `dropdown-menu`, `select`, `tabs`, `tooltip`, `table`, `pagination`, `card`, `badge`, `avatar`, `breadcrumb`, `field`, `input`, `label`, `separator`, `sidebar`, `skeleton`, `collapsible`, `step-indicator`, `particles`.

**Always reach for one of these before building a new UI primitive from scratch.** They're already wired for theming, accessibility (via Radix), and the app's visual style. If you need a primitive that isn't here, prefer generating it via `shadcn` (the CLI is a project dependency) so it matches `components.json`'s config (`radix-vega` style, `zinc` base color, `@` aliases) rather than hand-writing one that drifts from the rest.

`components.json` aliases (so `shadcn add <component>` drops files in the right place):

```json
"aliases": {
  "components": "@/components",
  "utils": "@/lib/utils",
  "ui": "@/components/ui",
  "lib": "@/lib",
  "hooks": "@/hooks"
}
```

## 5.3 `components/layout/` — app chrome

- **`AppSidebar`** — the role-aware sidebar, built from `navigationData` (see [02-architecture.md](./02-architecture.md)); renders different nav items for admin/officer/student.
- **`NavHeader`**, **`NavItem`**, **`NavUser`** — sidebar sub-pieces (header/brand area, individual nav links, and the user menu at the bottom of the sidebar).

To add a new sidebar item for a role, edit `src/config/navigation.ts` — the sidebar components themselves generally don't need to change.

## 5.4 Layouts and branding

- **`AuthLayout`** (login/signup) — split screen: form on the left, a DMC-branded panel on the right using the background images in `public/assets/backgrounds/` and the logo in `public/assets/logos/`, with the "SEAMS" wordmark and a footer credit ("Powered by College of Computer Studies").
- **`AuthenticatedLayout`** — sidebar + header + content area (see [02-architecture.md](./02-architecture.md#26-layouts)). The header title is derived automatically from matching the current route against `navigationData`, so you generally don't need to hardcode page titles — just make sure new routes have a matching `navigation.ts` entry with the right `name`.
- **`Particles`** (`components/ui/particles.tsx`) — decorative animated background effect used on the auth screen.

## 5.5 Styling conventions

- Utility-first Tailwind classes directly in JSX — there's no CSS-in-JS and minimal custom CSS beyond `index.css`/`App.css` (global resets/Tailwind entry).
- Use the `cn()` helper (`@/lib/utils`) when conditionally combining class names, instead of manual string concatenation — it correctly merges/overrides conflicting Tailwind classes.
- Status colors follow a light convention seen throughout admin/officer views: green = success/present/approved, amber = warning/late/pending, red = error/absent/rejected (see `StatusBadge` in `ScanQR.tsx` for a concrete example).

## 5.6 QR-related UI

Two different libraries show up for QR handling, each for a different job:

- **`@yudiel/react-qr-scanner`** — used in `ScanQR.tsx` to _read/scan_ codes from the device camera.
- **`html5-qrcode`** — an alternate/underlying QR scanning engine dependency in the project (present alongside the above).
- **QR _generation_** (the image a student sees on `MyQR.tsx`) is **not** done client-side — the backend returns a base64-encoded PNG (`profile.qrCode`) which is rendered directly as `<img src="data:image/png;base64,...">`. If you need to change how QR codes look, that's a backend change, not a frontend one.
