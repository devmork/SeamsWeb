import { MyProfile } from '@/features/student/profile';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/student/dashboard')({
  component: MyProfile,
});
