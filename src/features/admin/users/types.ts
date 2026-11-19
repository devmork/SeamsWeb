import type { UserRole } from '@/features/auth/types';

/** Mirrors `SeamsApp.DTOs.User.UserResponse` (camelCase on the wire). */
export interface ManagedUser {
  id: number;
  userName: string | null;
  email: string | null;
  /** 1 = active, 0 = disabled. */
  isActive: number;
  /** The account's single application role, or null when unassigned. */
  role: UserRole | null;
}

/** Roles a superadmin can assign. Order is ascending privilege. */
export const ASSIGNABLE_ROLES: UserRole[] = [
  'student',
  'officer',
  'admin',
  'superadmin',
];

export const NO_ROLE = 'none' as const;

export function displayName(user: ManagedUser): string {
  return user.userName?.trim() || user.email || `User ${user.id}`;
}

export function initialsOf(user: ManagedUser): string {
  const name = displayName(user);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return initials || '?';
}
