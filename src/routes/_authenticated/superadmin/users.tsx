import { createFileRoute } from '@tanstack/react-router';
import UserManagement from '@/features/superadmin/users/components/UserManagement';

export const Route = createFileRoute('/_authenticated/superadmin/users')({
  component: () => <UserManagement />,
});
