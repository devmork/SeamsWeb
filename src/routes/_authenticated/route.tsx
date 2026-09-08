import { createFileRoute, redirect } from '@tanstack/react-router';
import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';
import { getCurrentUser } from '@/features/auth/services/AuthService';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const user = getCurrentUser();
    if (!user) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});
