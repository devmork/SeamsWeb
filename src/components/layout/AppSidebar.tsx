import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navigationData } from "@/config/navigation";
import { NavIdentity } from "./NavIdentity";
import { NavItem } from "./NavItem";
import { NavUser } from "./NavUser";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role: "admin" | "student" | "officer";
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const navItems = navigationData.navByRole[role] || [];

  const portalLabels = {
    admin: "Admin Portal",
    student: "Student Portal",
    officer: "Officer Portal",
  };

  const dynamicAppIdentity = navigationData.app.map((appItem) => ({
    ...appItem,
    portal: portalLabels[role] || "",
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavIdentity app={dynamicAppIdentity} />
      </SidebarHeader>
      <SidebarContent>
        <NavItem items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigationData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
