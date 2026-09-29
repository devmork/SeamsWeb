import { MyQR } from '@/features/student/qr';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/student/qr')({
  component: MyQR,
});
