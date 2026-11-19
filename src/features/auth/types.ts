export type UserRole = 'superadmin' | 'admin' | 'officer' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupResponse {
  applicationId: number;
  email: string;
  status: number;
}

/**
 * Mirrors `SeamsApp.DTOs.Auth.LoginResponse` (camelCase on the wire).
 * Auth is cookie-based, so there is no token — the session lives in the
 * HttpOnly "seams.auth" cookie.
 */
export interface AuthResponse {
  userId: number;
  email: string;
  role: string;
}

export interface SignupData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  suffix?: string;
  schoolStudentId: string;
  yearLevel: string;
  course: string;
}

export type PersonalInfoData = {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  email: string;
};

export type SchoolInfoData = {
  studentId: string;
  yearLevel: string;
  department: string;
};

const ROLES: UserRole[] = ['superadmin', 'admin', 'officer', 'student'];

/** Backend roles are lowercase; anything unknown falls back to `student`. */
export function normalizeRole(role: string | null | undefined): UserRole {
  const normalized = role?.trim().toLowerCase() as UserRole | undefined;
  return normalized && ROLES.includes(normalized) ? normalized : 'student';
}
