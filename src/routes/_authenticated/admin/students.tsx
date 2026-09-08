import { createFileRoute } from '@tanstack/react-router';
import StudentList from '@/features/admin/students/components/StudentList';

export const Route = createFileRoute('/_authenticated/admin/students')({
  component: () => <StudentList />,
});
