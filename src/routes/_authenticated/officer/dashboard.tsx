import { createFileRoute } from '@tanstack/react-router';
import ScanQR from '@/features/officer/scan/components/ScanQR';

export const Route = createFileRoute('/_authenticated/officer/dashboard')({
  component: ScanQR,
});
