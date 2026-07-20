import api from '@/service/api';
import type { Attendance, AttendanceFormData } from '@/features/attendances';

function toIsoDateTime(date: string, time: string): string {
  if (!date || !time) return '';
  return `${date}T${time}:00`;
}

function toRequestPayload(data: AttendanceFormData) {
  return {
    title: data.title,
    date: data.date,
    session: data.session,
    logType: data.logType,
    startTime: toIsoDateTime(data.date, data.startTime),
    endTime: toIsoDateTime(data.date, data.endTime),
  };
}

export const attendanceService = {
  getAllAttendance: async (eventId?: number): Promise<Attendance[]> => {
    const response = await api.get<Attendance[]>('/attendance', {
      params: eventId ? { eventId } : {},
    });
    return response.data;
  },

  getAttendanceByEventId: async (eventId: number): Promise<Attendance[]> => {
    if (!eventId || eventId <= 0) {
      throw new Error('Invalid event ID');
    }
    const response = await api.get<Attendance[]>(
      `/attendance/event/${eventId}`,
    );
    return response.data;
  },

  createAttendance: async (
    eventId: number,
    data: AttendanceFormData,
  ): Promise<Attendance> => {
    const response = await api.post<Attendance>(
      `/attendance/${eventId}`,
      toRequestPayload(data),
    );
    return response.data;
  },

  updateAttendance: async (
    attendanceId: number,
    data: AttendanceFormData,
  ): Promise<void> => {
    await api.put(`/attendance/${attendanceId}`, toRequestPayload(data));
  },

  deleteAttendance: async (attendanceId: number): Promise<void> => {
    await api.delete(`/attendance/${attendanceId}`);
  },
};

export default attendanceService;
