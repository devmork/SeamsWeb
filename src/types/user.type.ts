export interface User {
  name: string;
  email: string;
  avatar: string;
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
  photoUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: string;
}
