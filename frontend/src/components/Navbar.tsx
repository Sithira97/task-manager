import {
  UserIcon,
  Search,
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import Button from "./Button";
import { capitalize } from "../utils/words";
import { useState } from "react";
import TaskModal from "./TaskModal";
import { useAuth } from "../context/AuthContext";
import { useRoute } from "../context/RouterContext";
import { useTasks } from "../context/TaskContext";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const { currentView, setCurrentView } = useRoute();
  const { search, setSearch } = useTasks();
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 border-b gap-2 border-sidebar-border">
        <div className="flex items-center gap-2 relative">
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

        <div className="flex items-center gap-3">
          <Button className="!rounded-full">
            <UserIcon size={16} />
            <span>{capitalize(user?.role || "")}</span>
          </Button>
        </div>
      </nav>
      <aside
        className={`fixed inset-y-0 inset-x-0 bottom-0 z-100 w-2/3 sm:w-64 bg-sidebar space-y-2 border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out `}
      >
        <div className="flex items-center gap-3 p-6 text-primary">
          <CalendarRange size={28} />
          <h1 className="text-lg font-bold">Task Manager</h1>
        </div>
        <div className="flex">
          <Button className="w-full m-4" onClick={() => setModalOpen(true)}>
            <Plus />
            New Task
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto sm:mt-5">
          <ul className="space-y-2 text-text">
            <li>
              <Button
                variant="nav"
                onClick={() => setCurrentView("dashboard")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "dashboard" ? "text-primary bg-primary/5 border-r-4" : ""}`}
              >
                <LayoutDashboard size={20} />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </Button>
            </li>
            <li>
              <Button
                variant="nav"
                onClick={() => setCurrentView("tasks")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "tasks" ? "text-primary bg-primary/5 border-r-4" : ""}`}
              >
                <KanbanSquare size={20} />
                <span className="text-xs sm:text-sm">My Tasks</span>
              </Button>
            </li>
            <li>
              <Button
                variant="nav"
                onClick={() => setCurrentView("schedule")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "schedule" ? "text-primary bg-primary/5 border-r-4" : ""}`}
              >
                <CalendarRange size={20} />
                <span className="text-xs sm:text-sm">Schedule</span>
              </Button>
            </li>
            <li>
              <Button
                variant="nav"
                onClick={() => setCurrentView("teams")}
                className={`flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent justify-start ${currentView === "teams" ? "text-primary bg-primary/5 border-r-4" : ""}`}
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
      </aside>
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;
