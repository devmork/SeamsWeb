import { ApplicantList } from '@/features/admin/applicants';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/applicants')({
  component: ApplicantList,
});
