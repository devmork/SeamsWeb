import { createFileRoute } from '@tanstack/react-router';
import MyDepartments from '@/features/student/departments/components/MyDepartments';

export const Route = createFileRoute('/_authenticated/student/departments')({
  component: () => <MyDepartments />,
});
