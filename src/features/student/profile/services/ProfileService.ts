import api from '@/service/api';
import type { StudentProfile } from '../profile.type';

export const profileService = {
  getMyProfile: async (): Promise<StudentProfile> => {
    const response = await api.get<StudentProfile>('/student/me');
    return response.data;
  },
};

export default profileService;
