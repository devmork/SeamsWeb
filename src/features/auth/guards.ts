import { redirect } from '@tanstack/react-router';
import { normalizeRole, type UserRole } from './types';
import { useAuthStore } from './Stores/AuthStore';

/** Where each role lands after login and when it strays out of its own area. */
export const ROLE_HOME: Record<UserRole, string> = {
  superadmin: '/superadmin/users',
  admin: '/admin/students',
  officer: '/officer/dashboard',
  student: '/student/dashboard',
};

/**
 * Route guard for a role-scoped area. The sidebar defines what each role sees;
 * this makes the URL enforce it, so a role that isn't listed here gets bounced
 * to its own home instead of reaching another role's screens.
 *
 * Throws a TanStack Router redirect — call it from a route's `beforeLoad`.
 */
export function requireRole(...roles: UserRole[]) {
  const user = useAuthStore.getState().user;
  const role = normalizeRole(user?.role);

  if (!user || !roles.includes(role)) {
    throw redirect({ to: user ? ROLE_HOME[role] : '/login' });
  }
}
