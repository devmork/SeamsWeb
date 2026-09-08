import { SignupForm } from '@/features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/signup')({
  component: SignupForm,
});
