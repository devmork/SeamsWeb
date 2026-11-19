export interface Student {
  userId: number;
  studentId: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  schoolStudentId: string;
  /** Backend `YearLevel` is a free string (`"1"` … `"4"`). */
  yearLevel: string;
  course: string;
  photoUrl?: string;
  status: number;
}

/** Mirrors `SeamsApp.DTOs.Student.StudentRequest` (no email on updates). */
export interface StudentRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  schoolStudentId: string;
  yearLevel: string;
  course: string;
  photoUrl?: string;
  status?: number;
}
