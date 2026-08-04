import type { RouteConfig } from '../routes.types';
import { ApplicantList } from '@/features/admin/applicants';
import { StudentList } from '@/features/admin/students';
import EventList from '@/features/admin/events/components/EventList';
import OfficerList from '@/features/admin/officers/components/OfficerList';

export const adminRoutes: RouteConfig[] = [
  { path: '/admin/students', element: <StudentList /> },
  { path: '/admin/officers', element: <OfficerList /> },
  { path: '/admin/events', element: <EventList /> },
  { path: '/admin/applicants', element: <ApplicantList /> },
];
