import { ScanQR } from '@/features/officer/scan';
import type { RouteConfig } from '../routes.types';

export const officerRoutes: RouteConfig[] = [
  { path: '/officer/dashboard', element: <ScanQR /> },
];
