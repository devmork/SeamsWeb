import {
  Building2,
  Calendar,
  ClipboardCheck,
  FileUser,
  LayoutDashboard,
  ShieldUser,
  UserCog,
  Users,
} from 'lucide-react';
import type { UserRole } from '@/features/auth/types';

interface NavItem {
  name: string;
  url: string;
  icon: typeof Users;
}

type NavItemsByRole = {
  [role in UserRole]: NavItem[];
};

const adminItems: NavItem[] = [
  { name: 'Students', url: '/admin/students', icon: Users },
  { name: 'Officers', url: '/admin/officers', icon: ShieldUser },
  { name: 'Events', url: '/admin/events', icon: Calendar },
  { name: 'Applicants', url: '/admin/applicants', icon: FileUser },
];

export const navigationData = {
  navByRole: {
    admin: [...adminItems],
    // The superadmin console is Users-only; the admin screens live in the
    // /admin area and are guarded to the admin role.
    superadmin: [
      { name: 'Users', url: '/superadmin/users', icon: UserCog },
      { name: 'Departments', url: '/superadmin/departments', icon: Building2 },
    ],
    student: [
      { name: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
      {
        name: 'My Departments',
        url: '/student/departments',
        icon: Building2,
      },
      {
        name: 'Attendance',
        url: '/student/attendance-history',
        icon: ClipboardCheck,
      },
    ],
    officer: [
      { name: 'Dashboard', url: '/officer/dashboard', icon: LayoutDashboard },
    ],
  } satisfies NavItemsByRole,
};
