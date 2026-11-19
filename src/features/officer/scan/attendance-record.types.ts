/**
 * Attendance records are 0 = absent, 1 = present. The history projection also
 * uses 2 for "session still open", but that value never appears on a record.
 */
export const ATTENDANCE_STATUS = {
  Absent: 0,
  Present: 1,
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
