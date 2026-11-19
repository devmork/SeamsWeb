/**
 * Mirrors `SeamsApp.DTOs.Department.*` (camelCase on the wire). Shared by the
 * superadmin management screen and the student membership screen.
 */

export interface Department {
  departmentId: number;
  name: string;
  description: string | null;
  /** 1 = active, 0 = deactivated. */
  status: number;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

/** Mirrors `SeamsApp.DTOs.Department.DepartmentRequest`. */
export interface DepartmentRequest {
  name: string;
  description?: string;
  status?: number;
}

export const DEPARTMENT_STATUS = {
  Inactive: 0,
  Active: 1,
} as const;

/** Membership request status: 0 pending, 1 approved, 2 rejected. */
export const MEMBERSHIP_STATUS = {
  Pending: 0,
  Approved: 1,
  Rejected: 2,
} as const;

export interface MembershipRequest {
  requestId: number;
  userId: number;
  userEmail: string | null;
  departmentId: number;
  departmentName: string | null;
  status: number;
  reason: string | null;
  requestedAt: string;
  reviewedAt: string | null;
}

/** Mirrors `SeamsApp.DTOs.Department.JoinDepartmentRequest`. */
export interface JoinDepartmentRequest {
  reason?: string;
}

/** Mirrors `SeamsApp.DTOs.Department.ReviewMembershipRequest` (1 approve, 2 reject). */
export interface ReviewMembershipRequest {
  status: number;
  reason?: string;
}

/** `GET /api/department/{id}/users` returns `UserResponse` rows. */
export interface DepartmentMember {
  id: number;
  userName: string | null;
  email: string | null;
  isActive: number;
  role: string | null;
  departmentId: number | null;
  departmentName: string | null;
}

export function membershipStatusLabel(status: number): string {
  if (status === MEMBERSHIP_STATUS.Approved) return 'Approved';
  if (status === MEMBERSHIP_STATUS.Rejected) return 'Rejected';
  return 'Pending';
}
