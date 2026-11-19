import api from '@/service/api';
import type {
  Department,
  DepartmentRequest,
  DepartmentMember,
  JoinDepartmentRequest,
  MembershipRequest,
  ReviewMembershipRequest,
} from '../types';

export const departmentService = {
  // ── superadmin ────────────────────────────────────────────────────────────

  /** `GET /api/department` — superadmin only. */
  getDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get<Department[]>('/department');
    return Array.isArray(data) ? data : [];
  },

  /** `GET /api/department/{id}` — superadmin only. */
  getDepartment: async (departmentId: number): Promise<Department> => {
    const { data } = await api.get<Department>(`/department/${departmentId}`);
    return data;
  },

  /** `POST /api/department` — superadmin only. Returns the stored department. */
  createDepartment: async (request: DepartmentRequest): Promise<Department> => {
    const { data } = await api.post<Department>('/department', request);
    return data;
  },

  /** `PUT /api/department/{id}` — superadmin only. Returns the stored department. */
  updateDepartment: async (
    departmentId: number,
    request: DepartmentRequest,
  ): Promise<Department> => {
    const { data } = await api.put<Department>(
      `/department/${departmentId}`,
      request,
    );
    return data;
  },

  /**
   * `DELETE /api/department/{id}` — superadmin only. The backend deactivates
   * the department when it still has students, events or members.
   */
  deleteDepartment: async (departmentId: number): Promise<void> => {
    await api.delete(`/department/${departmentId}`);
  },

  /** `GET /api/department/{id}/users` — superadmin only. */
  getDepartmentMembers: async (
    departmentId: number,
  ): Promise<DepartmentMember[]> => {
    const { data } = await api.get<DepartmentMember[]>(
      `/department/${departmentId}/users`,
    );
    return Array.isArray(data) ? data : [];
  },

  /** `POST /api/department/{id}/users/{userId}` — superadmin only. */
  assignUser: async (departmentId: number, userId: number): Promise<void> => {
    await api.post(`/department/${departmentId}/users/${userId}`);
  },

  /** `DELETE /api/department/{id}/users/{userId}` — superadmin only. */
  removeUser: async (departmentId: number, userId: number): Promise<void> => {
    await api.delete(`/department/${departmentId}/users/${userId}`);
  },

  /** `GET /api/department/{id}/membership-requests` — superadmin only. */
  getPendingRequests: async (
    departmentId: number,
  ): Promise<MembershipRequest[]> => {
    const { data } = await api.get<MembershipRequest[]>(
      `/department/${departmentId}/membership-requests`,
    );
    return Array.isArray(data) ? data : [];
  },

  /** `POST /api/department/membership-requests/{id}/review` — superadmin only. */
  reviewRequest: async (
    requestId: number,
    review: ReviewMembershipRequest,
  ): Promise<void> => {
    await api.post(`/department/membership-requests/${requestId}/review`, review);
  },

  // ── student ──────────────────────────────────────────────────────────────

  /** `GET /api/student/departments` — the signed-in student's departments. */
  getMyDepartments: async (): Promise<Department[]> => {
    const { data } = await api.get<Department[]>('/student/departments');
    return Array.isArray(data) ? data : [];
  },

  /** `POST /api/student/departments/{id}/join` — returns the created request. */
  joinDepartment: async (
    departmentId: number,
    request: JoinDepartmentRequest = {},
  ): Promise<MembershipRequest> => {
    const { data } = await api.post<MembershipRequest>(
      `/student/departments/${departmentId}/join`,
      request,
    );
    return data;
  },

  /** `GET /api/department/my-membership-requests` — the student's own requests. */
  getMyMembershipRequests: async (): Promise<MembershipRequest[]> => {
    const { data } = await api.get<MembershipRequest[]>(
      '/department/my-membership-requests',
    );
    return Array.isArray(data) ? data : [];
  },
};

export default departmentService;
