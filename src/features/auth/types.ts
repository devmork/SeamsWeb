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

export type PhotoData = {
  file: File | null;
  previewUrl: string;
  base64: string;
};

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
