export interface StudentProfile {
  studentId: number;
  userId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  emailVerified?: boolean;
  schoolStudentId: string;
  yearLevel: string;
  course: string;
  semester?: string;
  schoolYear?: string;
  photoUrl?: string;
  qrCode?: string;
  status: number;
}
