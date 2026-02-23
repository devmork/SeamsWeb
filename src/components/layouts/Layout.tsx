import { Link, Outlet } from "react-router-dom"
import Sidebar from "@/components/sidebars/Sidebar"
import { roleMenus } from "@/config/menus"
import { getCurrentUserRole } from "@/service/authService"

  
const Layout = () => {
  const role = getCurrentUserRole()
  const menu = roleMenus[role] ?? roleMenus.student

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar menu={menu} />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-lg font-bold">
              SEAMS
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Role:</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-1">
          <Outlet />
        </main>

        <footer className="bg-gray-800 text-white text-center py-4 mt-6">
          <p className="text-sm">SEAMS © 2025</p>
        </footer>
      </div>
    </div>
  )
}

export default Layout