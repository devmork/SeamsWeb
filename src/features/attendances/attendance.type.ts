export interface Attendance {
  attendanceId: number;
  eventId: number;
  title: string;
  date: string;
  session: string;
  logType: string;
  startTime: string;
  endTime: string;
}

export interface AttendanceFormData {
  title: string;
  date: string;
  session: string;
  logType: string;
  startTime: string;
  endTime: string;
}
