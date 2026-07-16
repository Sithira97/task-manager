import {
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  Plus,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoute } from "../context/RouterContext";

const MobileNav: React.FC<{ setModalOpen: (open: boolean) => void }> = ({
  setModalOpen,
}) => {
  const { currentView, setCurrentView } = useRoute();
  return (
    <>
      <footer className="fixed h-16 sm:hidden inset-x-0 bottom-0 z-50 w-full bg-sidebar border-t border-border flex flex-col">
        <nav>
          <ul className="grid grid-cols-4 text-foreground">
            <li className="flex-1">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "dashboard" ? "text-primary bg-primary/5 border-t-4 border-primary" : ""}`}
              >
                <LayoutDashboard className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Dashboard</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setCurrentView("tasks")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "tasks" ? "text-primary bg-primary/5 border-t-4 border-primary" : ""}`}
              >
                <KanbanSquare className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">My Tasks</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setCurrentView("schedule")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "schedule" ? "text-primary bg-primary/5 border-t-4 border-primary" : ""}`}
              >
                <CalendarRange className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Schedule</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setCurrentView("teams")}
                className={`flex w-full flex-col sm:flex-row items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "teams" ? "text-primary bg-primary/5 border-t-4 border-primary" : ""}`}
              >
                <Users className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Teams</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="absolute right-3 xs:right-6 -top-15 xs:-top-18">
          <Button
            className="w-full !rounded-full flex items-center justify-center h-auto !py-3 !px-3 shadow-lg"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="text-white size-8" />
            <span className="sr-only">New Task</span>
          </Button>
        </div>
      </footer>
    </>
  );
};

export default MobileNav;
