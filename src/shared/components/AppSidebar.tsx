import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { navigationData } from '@/config/navigation';
// import { NavHeader } from './NavHeader';
import { NavItem } from '@/shared/components/NavItem';
import { NavUser } from '@/shared/components/NavUser';
import { useAuthStore } from '@/features/auth/Stores/AuthStore';
import { Separator } from '../../components/ui/separator';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: 'superadmin' | 'admin' | 'student' | 'officer';
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const navItems = navigationData.navByRole[role] || [];
  const user = useAuthStore((state) => state.user);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-start py-1 group-data-[collapsible=icon]:justify-center">
          <img
            src="/assets/logos/app-logo.jpg"
            alt="logo"
            className="size-12 max-w-none shrink-0 object-contain"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavItem items={navItems} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? '',
            email: user?.email ?? '',
            avatar: user?.avatar ?? '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
