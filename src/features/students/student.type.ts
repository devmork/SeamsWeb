export interface Student {
  userId: number;
  studentId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  schoolStudentId: string;
  yearLevel: number;
  course: string;
  photoUrl?: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  schoolStudentId: string;
  yearLevel: number;
  course: string;
  photoUrl?: string;
}
