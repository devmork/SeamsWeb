import { createFileRoute } from '@tanstack/react-router';
import EventList from '@/features/admin/events/components/EventList';

export const Route = createFileRoute('/_authenticated/admin/events')({
  component: () => <EventList />,
});
