import api from '@/service/api';
import type { Event } from '@/features/admin/events/event.type';

export const getMyEvents = async (): Promise<Event[]> => {
  const { data } = await api.get<Event[]>('/event/my-events');
  return Array.isArray(data) ? data : [];
};
