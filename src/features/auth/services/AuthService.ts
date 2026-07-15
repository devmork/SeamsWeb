import api from '../../../service/api';
import type {
  AuthResponse,
  LoginData,
  SignupData,
  User,
} from '@/types/user.type';

export const signUp = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(
    '/student-application/signup',
    data,
  );
  return response.data;
};

export const logIn = async (data: LoginData): Promise<AuthResponse> => {
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

export const logOut = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
