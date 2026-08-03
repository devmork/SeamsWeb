import api from '@/service/api';
import type { Officer } from '@/features/admin/officers/officer.type';

export const officerService = {
  getAllOfficers: async (): Promise<Officer[]> => {
    const response = await api.get<Officer[]>('/officer');
    return response.data;
  },

  assignOfficer: async (userId: number): Promise<void> => {
    await api.post<Officer>('/officer', { userId });
  },

  removeOfficer: async (officerId: number): Promise<void> => {
    await api.patch(`/officer/${officerId}`);
  },
};

export default officerService;
