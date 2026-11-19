import api from '@/service/api';
import type {
  LoginData,
  SignupData,
  SignupResponse,
  AuthResponse,
} from '../types';
import { useAuthStore } from '../Stores/AuthStore';

export const signUp = async (data: SignupData): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>(
    '/student-application/signup',
    data,
  );
  return response.data;
};

export const verifyEmail = async (
  email: string,
  code: string,
): Promise<void> => {
  await api.post('/auth/verify-email', { email, code });
};

export const resendVerification = async (email: string): Promise<void> => {
  await api.post('/auth/resend-verification', { email });
};

export const logIn = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data, {
    // Bad credentials return 401 — that must not bounce the login form.
    skipAuthRedirect: true,
  });
  return response.data;
};

/** Read the current user from the Zustand store (works outside React). */
export const getCurrentUser = () => useAuthStore.getState().user;

/**
 * Ends the server-side cookie session, then clears the local user. The local
 * clear happens even if the request fails (the cookie may already be gone).
 */
export const logOut = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore — clear locally regardless
  } finally {
    useAuthStore.getState().clearAuth();
  }
};

export const authService = {
  signUp,
  logIn,
  logOut,
  getCurrentUser,
};

export default authService;
