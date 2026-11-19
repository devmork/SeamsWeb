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

export interface AttendanceQrResponse {
  attendanceId: number;
  eventTitle: string | null;
  session: string | null;
  token: string;
  qrCode: string; // base64-encoded PNG bytes from the API
  expiresAt: string;
  refreshInSeconds: number;
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
