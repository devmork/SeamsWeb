import { MyProfile } from '@/features/student/profile';
import type { RouteConfig } from '../routes.types';
import { Attendance } from '@/features/student/attendance';
import { MyQR } from '@/features/student/qr';

export const studentRoutes: RouteConfig[] = [
  { path: '/student/dashboard', element: <MyProfile /> },
  { path: '/student/attendance-history', element: <Attendance /> },
  { path: '/student/my-qr', element: <MyQR /> },
];
