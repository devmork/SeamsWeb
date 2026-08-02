import * as React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { navigationData } from '@/config/navigation';
import { NavHeader } from './NavHeader';
import { NavItem } from './NavItem';
import { NavUser } from './NavUser';
import { getCurrentUser } from '@/features/auth/services/AuthService';
import { Separator } from '../ui/separator';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: 'admin' | 'student' | 'officer';
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const navItems = navigationData.navByRole[role] || [];
  const user = getCurrentUser();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
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
