import api from '@/service/api';
import type { UserRole } from '@/features/auth/types';
import { ASSIGNABLE_ROLES, type ManagedUser } from '../types';

/** Mirrors `SeamsApp.DTOs.User.UserResponse`. */
type UserDto = {
  id: number;
  userName: string | null;
  email: string | null;
  isActive: number;
  role: string | null;
};

function normalizeRole(role: string | null): UserRole | null {
  const normalized = role?.trim().toLowerCase();
  return ASSIGNABLE_ROLES.find((r) => r === normalized) ?? null;
}

function toManagedUser(dto: UserDto): ManagedUser {
  return {
    id: dto.id,
    userName: dto.userName,
    email: dto.email,
    isActive: dto.isActive,
    role: normalizeRole(dto.role),
  };
}

export const userService = {
  /** `GET /api/user` — superadmin + admin. */
  async getUsers(): Promise<ManagedUser[]> {
    const { data } = await api.get<UserDto[]>('/user');
    return Array.isArray(data) ? data.map(toManagedUser) : [];
  },

  /** `GET /api/user/{userId}` — superadmin + admin. */
  async getUser(userId: number): Promise<ManagedUser> {
    const { data } = await api.get<UserDto>(`/user/${userId}`);
    return toManagedUser(data);
  },

  /**
   * `POST /api/user/{userId}/roles` — makes `role` the account's only role.
   * Superadmin only.
   */
  async assignRole(userId: number, role: UserRole): Promise<ManagedUser> {
    const { data } = await api.post<UserDto>(`/user/${userId}/roles`, { role });
    return toManagedUser(data);
  },

  /** `DELETE /api/user/{userId}/roles/{role}` — superadmin only. */
  async removeRole(userId: number, role: UserRole): Promise<ManagedUser> {
    const { data } = await api.delete<UserDto>(
      `/user/${userId}/roles/${encodeURIComponent(role)}`,
    );
    return toManagedUser(data);
  },
};

export default userService;
