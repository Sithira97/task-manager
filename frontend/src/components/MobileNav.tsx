import {
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react";
import Button from "./Button";

import { NavLink } from "react-router-dom";

const MobileNav: React.FC = () => {
  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-6 sm:py-3 py-2 border-b gap-2 border-sidebar-border">
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
            className="w-full md:w-80 pl-10 border-border border-1 rounded-lg px-4 py-2 bg-input "
          />
        </div>

        <div className="flex items-center gap-3">
          <Button className="!rounded-full !px-2 sm:!px-4">
            <User size={16} />
            <span className="hidden sm:block">Admin</span>
          </Button>
        </div>
      </header>

      <footer className="fixed sm:hidden inset-x-0 bottom-0 z-50 w-full bg-sidebar  border-t border-sidebar-border flex flex-col">
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex text-text">
            <li className="flex-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-t-4" : ""}`
                }
              >
                <LayoutDashboard size={20} />
                <span className="text-xs">Dashboard</span>
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-t-4" : ""}`
                }
              >
                <KanbanSquare size={20} />
                <span className="text-xs">My Tasks</span>
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-t-4" : ""}`
                }
              >
                <CalendarRange size={20} />
                <span className="text-xs">Schedule</span>
              </NavLink>
            </li>
            <li className="flex-1">
              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `flex w-full flex-col sm:flex-row items-center gap-2 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-t-4" : ""}`
                }
              >
                <Users size={20} />
                <span className="text-xs">Teams</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="absolute right-6 -top-18">
          <Button className="w-full !rounded-full flex items-center justify-center">
            <Plus className="text-white size-8" />
            New Task
          </Button>
        </div>
      </footer>
    </>
  );
};

export default MobileNav;
