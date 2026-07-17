import {
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
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

function AppSidebar({
  setModalOpen,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
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
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Dashboard"
              onClick={() => setCurrentView("dashboard")}
              isActive={currentView === "dashboard"}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="My Tasks"
              onClick={() => setCurrentView("tasks")}
              isActive={currentView === "tasks"}
            >
              <KanbanSquare size={20} />
              <span className="text-xs sm:text-sm">My Tasks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Schedule"
              onClick={() => setCurrentView("schedule")}
              isActive={currentView === "schedule"}
            >
              <CalendarRange size={20} />
              <span className="text-xs sm:text-sm">Schedule</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Teams"
              onClick={() => setCurrentView("teams")}
              isActive={currentView === "teams"}
            >
              <Users size={20} />
              <span className="text-xs sm:text-sm">Teams</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mb-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem className=" px-5">
            <ModeToggle className="w-full" />
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
