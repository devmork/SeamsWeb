import { createFileRoute } from '@tanstack/react-router';
import DepartmentManagement from '@/features/superadmin/departments/components/DepartmentManagement';

export const Route = createFileRoute('/_authenticated/superadmin/departments')({
  component: () => <DepartmentManagement />,
});
