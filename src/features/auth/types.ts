export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
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

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: string;
  name?: string;
  avatar?: string;
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
