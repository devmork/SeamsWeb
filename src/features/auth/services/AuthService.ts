import api from '@/service/api';
import type { AuthResponse, LoginData, SignupData } from '../types';
import { useAuthStore } from '../Stores/AuthStore';

export const signUp = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    '/student-application/signup',
    data,
  );
  return response.data;
};

export const logIn = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/** Read the current user from the Zustand store (works outside React). */
export const getCurrentUser = () => useAuthStore.getState().user;

export const logOut = (): void => {
  useAuthStore.getState().clearAuth();
};

export const authService = {
  signUp,
  logIn,
  logOut,
  getCurrentUser,
};

export default authService;
