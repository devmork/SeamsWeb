export const ATTENDANCE_STATUS = {
  Present: 1,
  Late: 2,
  Absent: 3,
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export interface AttendanceRecordRequest {
  attendanceID: number;
  schoolStudentID: string;
  status: AttendanceStatus;
}

export interface AttendanceRecordResponse {
  recordID: number;
  attendanceID: number;
  schoolStudentID: string;
  fullName: string;
  yearLevel: string | null;
  course: string | null;
  status: AttendanceStatus;
  timestamp: string;
}
