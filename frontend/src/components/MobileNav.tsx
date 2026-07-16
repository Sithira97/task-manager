import {
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  UserIcon,
  Users,
} from "lucide-react";
import Button from "./Button";

import { useState, useRef } from "react";
import { capitalize, cleanCapitalize } from "../utils/words";
import TaskModal from "./TaskModal";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "../context/RouterContext";
import { useTasks } from "../context/TaskContext";

const MobileNav: React.FC = () => {
  const { logout, user } = useAuth();
  const { currentView, setCurrentView } = useRoute();
  const { search, setSearch } = useTasks();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  document.addEventListener("click", (event) => {
    if (userMenuRef.current?.contains(event.target as Node)) {
      setPopoverOpen((prev) => !prev);
    } else if (!popoverRef.current?.contains(event.target as Node)) {
      setPopoverOpen(false);
    }
  });
  return (
    <>
      <header className="relative sticky top-0 z-50 bg-sidebar flex justify-between items-center px-4 sm:px-6 sm:py-3 py-2 border-b gap-2 border-sidebar-border">
        <div className="flex gap-2 items-center sm:hidden">
          <div className="flex items-center gap-2 text-primary rounded-lg p-2">
            <CalendarRange size={28} />
            <h1 className="text-lg font-bold">Task Manager</h1>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 relative">
          <Search
            className="absolute left-3 text-muted-foreground/50"
            size={20}
          />

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-10 border-border border-1 rounded-lg px-4 py-2 bg-input "
          />
        </div>

        <div className="flex items-center gap-3" ref={userMenuRef}>
          <Button
            className="!rounded-full !px-2 sm:!px-4"
            onClick={() => setPopoverOpen(true)}
          >
            <UserIcon size={16} />
            <span className="hidden sm:block">
              {capitalize(user?.role || "")}
            </span>
          </Button>
        </div>
        <div
          ref={popoverRef}
          className={`absolute fade-in right-2 -bottom-32 min-w-48 ${
            popoverOpen ? "block" : "fade-out"
          }`}
        >
          <div className="flex flex-col bg-card border-border border rounded-md">
            <div className="flex flex-col mx-4 py-2 border-b border-border">
              <h3 className="font-bold text-lg text-wrap">
                {cleanCapitalize(user.username)}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button
              className="w-full my-2 justify-start !rounded-none"
              variant="ghost"
              onClick={logout}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <footer className="fixed sm:hidden inset-x-0 bottom-0 z-50 w-full bg-sidebar  border-t border-sidebar-border flex flex-col">
        <nav className="flex-1 overflow-y-auto">
          <ul className="grid grid-cols-4 text-text">
            <li className="flex-1">
              <Button
                variant="nav"
                onClick={() => setCurrentView("dashboard")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "dashboard" ? "text-primary bg-primary/5 border-t-4" : ""}`}
              >
                <LayoutDashboard className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Dashboard</span>
              </Button>
            </li>
            <li className="flex-1">
              <Button
                variant="nav"
                onClick={() => setCurrentView("tasks")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "tasks" ? "text-primary bg-primary/5 border-t-4" : ""}`}
              >
                <KanbanSquare className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">My Tasks</span>
              </Button>
            </li>
            <li className="flex-1">
              <Button
                variant="nav"
                onClick={() => setCurrentView("schedule")}
                className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "schedule" ? "text-primary bg-primary/5 border-t-4" : ""}`}
              >
                <CalendarRange className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Schedule</span>
              </Button>
            </li>
            <li className="flex-1">
              <Button
                variant="nav"
                onClick={() => setCurrentView("teams")}
                className={`flex w-full flex-col sm:flex-row items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === "teams" ? "text-primary bg-primary/5 border-t-4" : ""}`}
              >
                <Users className="size-5 xs:size-6" />
                <span className="text-[10px] xs:text-xs">Teams</span>
              </Button>
            </li>
          </ul>
        </nav>

        <div className="absolute right-3 xs:right-6 -top-15 xs:-top-18">
          <Button
            className="w-full !rounded-full flex items-center justify-center"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="text-white size-8" />
            <span>New Task</span>
          </Button>
        </div>
      </footer>
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default MobileNav;
