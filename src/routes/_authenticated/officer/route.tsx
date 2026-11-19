import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireRole } from '@/features/auth/guards';

export const Route = createFileRoute('/_authenticated/officer')({
  beforeLoad: () => requireRole('officer'),
  component: () => <Outlet />,
});
