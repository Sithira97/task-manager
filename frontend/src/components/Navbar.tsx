import { CalendarRange, LogOut, Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "../context/RouterContext";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { ModeToggle } from "./ui/mode-toggle";
import type { Route } from "../types";

function AppSidebar({
  navItem,
  setModalOpen,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navItem: { view: Route; icon: LucideIcon; label: string }[];
  setModalOpen: (open: boolean) => void;
}) {
  const { logout } = useAuth();
  const { currentView, setCurrentView } = useRoute();

  return (
    <Sidebar collapsible="icon" {...props} className="sm:block">
      <SidebarHeader>
        <SidebarMenuItem className="my-4 flex items-center justify-center gap-x-2 group-data-[state=open]:px-2">
          <CalendarRange size={28} />
          <h1 className="text-lg font-bold group-data-[state=collapsed]:hidden [&_svg]:shrink-0 [&>span:last-child]:truncate whitespace-nowrap">
            Task Manager
          </h1>
        </SidebarMenuItem>

        <SidebarMenuItem className="my-4">
          <Tooltip>
            <TooltipTrigger
              className="w-full"
              onClick={() => setModalOpen(true)}
              render={
                <Button className="w-full [&_svg]:shrink-0 [&>span:last-child]:truncate">
                  <Plus size={18} />
                  <span className="group-data-[state=collapsed]:hidden">
                    New Task
                  </span>
                </Button>
              }
            />
            <TooltipContent side="right" align="center">
              New Task
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItem.map((item) => (
            <SidebarMenuItem key={item.view}>
              <SidebarMenuButton
                tooltip={item.label}
                onClick={() => setCurrentView(item.view)}
                isActive={currentView === item.view}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mb-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <ModeToggle tabs={false} />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger
                className="w-full"
                onClick={() => setModalOpen(true)}
                render={
                  <Button
                    variant="outline"
                    className="w-full [&_svg]:shrink-0 [&>span:last-child]:truncate"
                    onClick={logout}
                  >
                    <LogOut size={20} />
                    <span className="group-data-[state=collapsed]:hidden">
                      Sign Out
                    </span>
                  </Button>
                }
              />
              <TooltipContent side="right" align="center">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
