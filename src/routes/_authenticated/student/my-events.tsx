import { createFileRoute } from '@tanstack/react-router';
import MyEvents from '@/features/student/events/components/MyEvents';

export const Route = createFileRoute('/_authenticated/student/my-events')({
  component: () => <MyEvents />,
});
