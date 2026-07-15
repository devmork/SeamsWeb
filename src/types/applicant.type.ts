export const ApplicationStatus = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
} as const;

export interface Applicant {
  applicationId: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  suffix?: string | null;
  email: string;
  schoolStudentId: string;
  yearLevel: string;
  course: string;
  photoUrl?: string | null;
  status: number;
}
