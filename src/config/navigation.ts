import { ShieldCheck, User } from "lucide-react";

export const navigationData = {
  user: {
    name: "John Doe",
    email: "john@gmail.com",
    avatar: "https://github.com/shadcn.png",
  },
  app: [
    {
      name: "SEAMS",
      logo: ShieldCheck,
      portal: "",
    },
  ],
  navByRole: {
    admin: [
      { name: "Dashboard", url: "/admin/dashboard", icon: ShieldCheck },
      { name: "Students", url: "/admin/students", icon: User },
      { name: "Event", url: "/admin/event", icon: User },
      { name: "Reports", url: "/admin/reports", icon: User },
      { name: "Approvals", url: "/admin/approvals", icon: User },
    ],
    student: [
      { name: "Dashboard", url: "/student/dashboard", icon: ShieldCheck },
      { name: "Events", url: "/student/events", icon: User },
      { name: "Attendance History", url: "/student/history", icon: User },
      { name: "Profile", url: "/student/profile", icon: User },
    ],
    officer: [{ name: "Dashboard", url: "/officer/dashboard", icon: User }],
  },
};
