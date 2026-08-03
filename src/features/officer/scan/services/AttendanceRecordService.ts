import api from '@/service/api';
import type {
  AttendanceRecordRequest,
  AttendanceRecordResponse,
} from '../attendance-record.types';

export const attendanceRecordService = {
  getAll: async (): Promise<AttendanceRecordResponse[]> => {
    const response =
      await api.get<AttendanceRecordResponse[]>('/attendance-record');
    return response.data;
  },

  getByAttendanceId: async (
    attendanceId: number,
  ): Promise<AttendanceRecordResponse[]> => {
    const response = await api.get<AttendanceRecordResponse[]>(
      `/attendance-record/attendance/${attendanceId}`,
    );
    return response.data;
  },

  create: async (
    data: AttendanceRecordRequest,
  ): Promise<AttendanceRecordResponse> => {
    const response = await api.post<AttendanceRecordResponse>(
      '/attendance-record',
      data,
    );
    return response.data;
  },
};

export default attendanceRecordService;
