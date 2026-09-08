import { AppSidebar } from '../../components/layout/AppSidebar';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { navigationData } from '@/config/navigation';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentUser } from '@/features/auth/services/AuthService';

export default function AuthenticatedLayout() {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.role.toLowerCase() as 'admin' | 'officer' | 'student';
  const navItems = navigationData.navByRole[role] || [];

  let currentTitle = 'Dashboard';
  for (const item of navItems) {
    if (item.url === location.pathname) {
      currentTitle = item.name;
      break;
    }
    if ('items' in item && Array.isArray(item.items)) {
      const subItem = item.items.find(
        (sub: { name: string; url: string }) => sub.url === location.pathname,
      );
      if (subItem) {
        currentTitle = subItem.name;
        break;
      }
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-[1.5px] bg-gray-300 mx-2 rounded-full" />
          <span className="text-sm font-semibold">{currentTitle}</span>
        </header>
        <main className="p-4">
          <Outlet />
          <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
