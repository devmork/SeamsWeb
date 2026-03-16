import type {
  AuthResponse,
  LogInData,
  SignUpData,
  User,
} from "@/types/user.type";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://localhost:7122/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/register", data);
  return response.data;
};

export const logIn = async (data: LogInData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/Auth/login", data);

  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response.data;
};

export const logOut = (): void => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
