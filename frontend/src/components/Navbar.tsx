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
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

function AppSidebar({
  setModalOpen,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  setModalOpen: (open: boolean) => void;
}) {
  const { logout } = useAuth();
  const { currentView, setCurrentView } = useRoute();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-6 text-primary">
          <CalendarRange size={28} />
          <h1 className="text-lg font-bold">Task Manager</h1>
        </div>
        <div className="flex">
          <Button className="w-full m-4" onClick={() => setModalOpen(true)}>
            <Plus size={18} />
            New Task
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex-1 overflow-y-auto sm:mt-5">
          <ul className="space-y-2 text-foreground">
            <li>
              <Button
                variant="link"
                onClick={() => setCurrentView("dashboard")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "dashboard" ? "text-primary bg-primary/5 border-r-4 border-primary" : ""}`}
              >
                <LayoutDashboard size={20} />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => setCurrentView("tasks")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "tasks" ? "text-primary bg-primary/5 border-r-4 border-primary" : ""}`}
              >
                <KanbanSquare size={20} />
                <span className="text-xs sm:text-sm">My Tasks</span>
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => setCurrentView("schedule")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "schedule" ? "text-primary bg-primary/5 border-r-4 border-primary" : ""}`}
              >
                <CalendarRange size={20} />
                <span className="text-xs sm:text-sm">Schedule</span>
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => setCurrentView("teams")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "teams" ? "text-primary bg-primary/5 border-r-4 border-primary" : ""}`}
              >
                <Users size={20} />
                <span className="text-xs sm:text-sm">Teams</span>
              </Button>
            </li>
          </ul>
        </nav>
        <div className="flex">
          <Button className="w-full m-4" variant="outline" onClick={logout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
