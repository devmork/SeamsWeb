import { createFileRoute, redirect } from '@tanstack/react-router';
import AuthenticatedLayout from '@/shared/layouts/AuthenticatedLayout';
import { useAuthStore } from '@/features/auth/Stores/AuthStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      throw redirect({ to: '/login' });
    }
  },
  component: AuthenticatedLayout,
});
