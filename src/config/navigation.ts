import {
  Calendar,
  ClipboardCheck,
  FileUser,
  LayoutDashboard,
  ScanQrCode,
  ShieldUser,
  Users,
} from 'lucide-react';

export const navigationData = {
  navByRole: {
    admin: [
      { name: 'Students', url: '/admin/students', icon: Users },
      { name: 'Officers', url: '/admin/officers', icon: ShieldUser },
      { name: 'Events', url: '/admin/events', icon: Calendar },
      { name: 'Applicants', url: '/admin/applicants', icon: FileUser },
    ],
    student: [
      { name: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Attendance', url: '/student/history', icon: ClipboardCheck },
      { name: 'My QR', url: '/student/qr', icon: ScanQrCode },
    ],
    officer: [
      { name: 'Dashboard', url: '/officer/dashboard', icon: LayoutDashboard },
    ],
  },
};
