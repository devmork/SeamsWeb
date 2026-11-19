import { createFileRoute } from '@tanstack/react-router';
import UserManagement from '@/features/admin/users/components/UserManagement';

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: () => <UserManagement />,
});
