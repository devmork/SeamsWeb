import { createFileRoute } from '@tanstack/react-router';
import OfficerList from '@/features/admin/officers/components/OfficerList';

export const Route = createFileRoute('/_authenticated/admin/officers')({
  component: () => <OfficerList />,
});
