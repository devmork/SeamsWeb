import {
  Calendar,
  CheckSquare,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';

export const navigationData = {
  app: [
    {
      name: 'SEAMS',
      logo: ShieldCheck,
      portal: '',
    },
  ],
  navByRole: {
    admin: [
      { name: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Students', url: '/admin/students', icon: Users },
      { name: 'Event', url: '/admin/event', icon: Calendar },
      { name: 'Reports', url: '/admin/reports', icon: FileText },
      { name: 'Approvals', url: '/admin/applicants', icon: CheckSquare },
    ],
    student: [
      { name: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Events', url: '/student/events', icon: Calendar },
      { name: 'Attendance History', url: '/student/history', icon: FileText },
      { name: 'Profile', url: '/student/profile', icon: User },
    ],
    officer: [
      { name: 'Dashboard', url: '/officer/dashboard', icon: LayoutDashboard },
    ],
  },
};
