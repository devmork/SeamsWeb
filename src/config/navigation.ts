import {
  Calendar,
  ClipboardCheck,
  FileUser,
  LayoutDashboard,
  ScanQrCode,
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
    // Admins can browse users; only superadmins may change roles.
    admin: [{ name: 'Users', url: '/admin/users', icon: UserCog }, ...adminItems],
    superadmin: [
      { name: 'Users', url: '/admin/users', icon: UserCog },
      ...adminItems,
    ],
    student: [
      { name: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
      {
        name: 'Attendance',
        url: '/student/attendance-history',
        icon: ClipboardCheck,
      },
      { name: 'My QR', url: '/student/my-qr', icon: ScanQrCode },
    ],
    officer: [
      { name: 'Dashboard', url: '/officer/dashboard', icon: LayoutDashboard },
    ],
  } satisfies NavItemsByRole,
};
