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
import { NavLink } from "react-router-dom";
import type { User } from "../types";
import { capitalize } from "../utils/words";

type NavbarProps = {
  user: User | null;
  onLogout: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
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
            className="w-full md:w-80 pl-10 border-border border-1 rounded-lg px-4 py-2 bg-input "
          />
        </div>

        <div className="flex items-center gap-3">
          <Button className="!rounded-full">
            <UserIcon size={16} />
            <span>{capitalize(user?.role)}</span>
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
          <Button className="w-full m-4">
            <Plus />
            New Task
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto sm:mt-5">
          <ul className="space-y-2 text-text">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-r-4" : ""}`
                }
              >
                <LayoutDashboard size={20} />
                <span className="text-xs sm:text-sm">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-r-4" : ""}`
                }
              >
                <KanbanSquare size={20} />
                <span className="text-xs sm:text-sm">My Tasks</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/schedule"
                className={({ isActive }) =>
                  `flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-r-4" : ""}`
                }
              >
                <CalendarRange size={20} />
                <span className="text-xs sm:text-sm">Schedule</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `flex w-full items-center gap-2 sm:gap-3 px-6 py-2 hover:bg-accent ${isActive ? "text-primary bg-primary/5 border-r-4" : ""}`
                }
              >
                <Users size={20} />
                <span className="text-xs sm:text-sm">Teams</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="flex">
          <Button className="w-full m-4" variant="outline" onClick={onLogout}>
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
