import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getMenusByRole, type MenuItem } from "../../config/menus"; // Import the menu config
import { getCurrentUserRole } from "@/service/authService";

const AuthenticatedLayout = () => {
  const role = getCurrentUserRole(); // Get role from auth service
  const navigate = useNavigate();
  const menus = getMenusByRole(role); // Get menu items for the role
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  const handleLogout = () => {
    // Implement logout logic (e.g., clear tokens, redirect to /login)
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (only for admin/student) */}
      {role !== "officer" && (
        <aside className={`bg-white shadow-md w-64 ${isSidebarOpen ? "block" : "hidden"} md:block`}>
          <div className="p-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <ul className="mt-4">
              {menus.map((item: MenuItem) => (
                <li key={item.path} className="mb-2">
                  <a href={item.path} className="block p-2 hover:bg-gray-200 rounded">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header bar (for all roles) */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <button
            className="md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
          </button>
          <h1 className="text-lg font-semibold">App Title</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;