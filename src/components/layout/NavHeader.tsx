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
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-[#2C5530] shrink-0">
            <img
              src="/assets/logos/dmc-logo-white.png"
              alt="DMC College Foundation Logo"
              className="size-8 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-lg font-extrabold italic tracking-wide text-[#2C5530]">
              SEAMS
            </span>
            <span className="truncate text-xs text-muted-foreground">
              DMCCFI
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
