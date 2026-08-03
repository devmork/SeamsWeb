export const AttendanceMarkStatus = {
  Absent: 0,
  Present: 1,
} as const;

export type AttendanceMarkStatus =
  (typeof AttendanceMarkStatus)[keyof typeof AttendanceMarkStatus];

export interface AttendanceSessionMark {
  recordId: number;
  attendanceId: number;
  session: string;
  startTime: string;
  endTime: string;
  status: AttendanceMarkStatus;
}

export interface EventAttendanceGroup {
  eventId: number;
  eventTitle: string;
  date: string;
  sessions: AttendanceSessionMark[];
}

export interface AttendanceHistorySummary {
  totalPresent: number;
  totalAbsent: number;
}
