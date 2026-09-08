import { LoginForm } from '@/features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LoginForm,
});
