/**
 * Layout Component
 *
 * This component provides a consistent layout with a sidebar navigation.
 * It renders different navigation based on user role (Admin, Student, Officer).
 */

import { Link, Outlet } from "react-router-dom";

interface AuthenticatedLayoutProps {
  role: "admin" | "student" | "officer";
}

const AuthenticatedLayout = ({ role }: AuthenticatedLayoutProps) => {
  // Navigation items by role
  const navigationItems = {
    admin: [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/students", label: "Students", icon: "👥" },
      { path: "/attendance", label: "Attendance", icon: "📅" },
      { path: "/reports", label: "Reports", icon: "📋" },
      { path: "/approvals", label: "Approvals", icon: "✓" },
    ],
    student: [
      { path: "/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/qr-code", label: "My QR Code", icon: "🔲" },
      { path: "/events", label: "Events", icon: "📅" },
      { path: "/attendance-history", label: "Attendance History", icon: "📋" },
      { path: "/profile", label: "Profile", icon: "👤" },
    ],
    officer: [{ path: "/dashboard", label: "Dashboard", icon: "📊" }],
  };

  const portalLabel = {
    admin: "Admin Portal",
    student: "Student Portal",
    officer: "Officer Portal",
  };

  const currentNavItems = navigationItems[role];
  const currentPortalLabel = portalLabel[role];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-700">SEAMS</h1>
          <p className="text-sm text-gray-500">{currentPortalLabel}</p>
        </div>

        <nav className="space-y-2 px-4 py-6 flex-1">
          {currentNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition first:bg-green-700 first:text-white">
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-8 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to SEAMS
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white text-center py-4">
          <p className="text-sm">SEAMS © 2026 - Educational Demo</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
