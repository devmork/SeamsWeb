import api from '@/service/api';
import type { Event, EventFormData } from '@/features/admin/events/event.type';

export const getAllEvents = async (): Promise<Event[]> => {
  const response = await api.get<Event[]>('/event');
  return response.data;
};

export const createEvent = async (data: EventFormData): Promise<Event> => {
  const response = await api.post<Event>('/event', data);
  return response.data;
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
