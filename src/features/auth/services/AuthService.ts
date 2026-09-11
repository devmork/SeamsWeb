import api from '@/service/api';
import type {
  AuthResponse,
  LoginData,
  SignupData
} from '../types';

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

export const logOut = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const authService = {
  signUp,
  logIn,
  logOut,
};

export default authService;
