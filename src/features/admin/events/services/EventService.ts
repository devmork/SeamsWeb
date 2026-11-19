import api from '@/service/api';
import type { Event, EventFormData } from '@/features/admin/events/event.type';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/event');
  return response.data;
};

/**
 * `POST /api/event` responds with the request body, not the stored event, so
 * the response carries no `eventId`. Callers should refetch the list.
 */
export const createEvent = async (data: EventFormData): Promise<void> => {
  await api.post('/event', data);
};

export const updateEvent = async (
  eventId: number,
  data: EventFormData,
): Promise<void> => {
  await api.put(`/event/${eventId}`, data);
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  await api.delete(`/event/${eventId}`);
};
