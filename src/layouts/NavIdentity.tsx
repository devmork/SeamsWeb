import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItem } from "./NavItem";

export function NavIdentity({
  app,
}: {
  app: {
    name: string;
    logo: React.ElementType;
    portal: string;
  }[];
}) {
  return (
    <SidebarMenu>
      {app.map((item) => (
        <SidebarMenuItem key={NavItem.name}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <item.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{item.name}</span>
              <span className="truncate text-xs">{item.portal}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
