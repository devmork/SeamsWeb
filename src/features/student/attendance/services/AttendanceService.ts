import api from '@/service/api';
import type { EventAttendanceGroup } from '../attendance.type';

export const profileService = {
  getMyAttendanceHistory: async (): Promise<EventAttendanceGroup[]> => {
    const response = await api.get<EventAttendanceGroup[]>(
      '/attendance-record/me',
    );
    return response.data;
  },
};

export default profileService;
