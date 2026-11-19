export interface Officer {
  userId: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  email: string;
  schoolStudentId: string;
  yearLevel: string;
  course: string;
  photoUrl?: string | null;
}
