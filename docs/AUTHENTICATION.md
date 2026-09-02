# 3. Authentication & Authorization

SEAMS Web uses **JWT-based authentication** with three roles: `admin`, `officer`, `student`. There is no session/cookie auth — the token is stored client-side and attached to every request.

## 3.1 Where things live

| Concern                                               | File                                                           |
| ----------------------------------------------------- | -------------------------------------------------------------- |
| Login / signup API calls, token storage               | `src/features/auth/services/AuthService.ts`                    |
| Shared Axios instance, token attachment, 401 handling | `src/service/api.ts`                                           |
| Login / signup forms                                  | `src/features/auth/components/LoginForm.tsx`, `SignupForm.tsx` |
| Role-based route protection                           | `src/routes/guards/ProtectedRoute.tsx`, `PublicRoute.tsx`      |
| User type                                             | `src/types/user.type.ts`                                       |

## 3.2 Login flow

1. User submits `LoginForm` → calls `authService.logIn({ email, password })`.
2. `logIn()` posts to `POST /auth/login` via the shared `api` Axios instance.
3. On success, the response's `token` is saved to `localStorage.auth_token`, and a minimal user object (`userId`, `email`, `role`) is saved to `localStorage.user` as JSON.
4. The app re-renders; route guards read `localStorage.user` to decide where to send the user next (see 3.4).

```ts
// src/features/auth/services/AuthService.ts (simplified)
export const logIn = async (data: LoginData) => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  if (response.data.token) {
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({
        userId: response.data.userId,
        email: response.data.email,
        role: response.data.role,
      }),
    );
  }
  return response.data;
};
```

**Signup is a two-step concept**: `signUp()` posts to `/student-application/signup` — this is an _applicant_ application flow (new students apply and show up under Admin → Applicants for approval), not an instant account-creation flow. Don't assume `signUp()` logs the user in.

## 3.3 Token usage — Axios interceptors

`src/service/api.ts` is the single shared Axios instance every service in the app imports. It:

- Sets the base URL from `VITE_API_BASE_URL` (see [01-getting-started.md](./01-getting-started.md)).
- **Request interceptor:** reads `auth_token` from `localStorage` and attaches it as `Authorization: Bearer <token>` on every outgoing request, so individual services never manually set the header.
- **Response interceptor:** on any `401` response, clears `auth_token` and `user` from `localStorage` and hard-redirects to `/login`. This is the app's auto-logout-on-expired-token behavior.

**Rule of thumb for new features:** always call the backend through `api` (imported from `@/service/api`), never `fetch`/raw `axios` directly — otherwise you lose both the auth header and the 401 handling for free.

## 3.4 Role-based route guards

Two guard components wrap route trees in `AppRoutes.tsx` (see [02-architecture.md](./02-architecture.md#25-routing)):

- **`PublicRoute`** — for `/login` and `/signup`. If a user is already logged in (i.e. `getCurrentUser()` returns non-null), it redirects them straight to `/{role}/dashboard` instead of showing the login form again.
- **`ProtectedRoute`** — takes an `allowedRoles` prop. If there's no logged-in user, it redirects to `/login` (preserving the attempted location in router state as `from`, for a future "redirect back after login" feature). If the user's role isn't in `allowedRoles`, it redirects them to _their own_ dashboard rather than showing a 403 — an admin hitting a student-only URL lands on `/admin/students`-style safety, not an error page.

```ts
// simplified
if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
if (!allowedRoles.includes(role)) return <Navigate to={`/${role}/dashboard`} replace />;
return <Outlet />;
```

Both guards derive the current user via `authService.getCurrentUser()`, which just reads and parses `localStorage.user` — there is no server round-trip to validate the session on every navigation. This means:

- Route access checks are **client-side only** and instantaneous — but they are not a security boundary. **The backend must independently enforce role checks on every endpoint.** The frontend guard is a UX convenience (don't show admin pages to a student), not the source of truth.
- If the token expires, the guard still thinks the user is "logged in" until the next API call returns a `401` (which then triggers the interceptor's forced logout/redirect described in 3.3).

## 3.5 Logout

`authService.logOut()` simply clears both `localStorage` keys (`auth_token`, `user`). Call this from a nav/user-menu action; there's no server-side token invalidation call currently — logout is purely client-side.

## 3.6 Adding a new protected page

1. Add the page's route to the correct role's file under `src/routes/modules/` (see [02-architecture.md](./02-architecture.md#25-routing)).
2. It automatically inherits `ProtectedRoute` + `AuthenticatedLayout` from `AppRoutes.tsx` — no per-page auth code needed.
3. If the page needs the current user's info (name, role, id), call `authService.getCurrentUser()` inside the component.
