import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <img
              src="/assets/logos/dmc-logo-white.png"
              alt="DMC College Foundation Logo"
              className="h-22 w-22 drop-shadow-lg"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="text-2xl font-extrabold italic tracking-wide text-white drop-shadow-md">
              SEAMS
            </span>
            <span className="truncate text-xs">DMCCFI</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
