import {
  CalendarRange,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import Button from "./Button";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 w-64 bg-sidebar space-y-2 border-r border-sidebar-border flex flex-col">
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
      <nav className="flex-1 overflow-y-auto mt-5">
        <ul className="space-y-2 text-text">
          <li className="flex items-center gap-3 px-6 py-2 hover:bg-accent text-primary">
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </li>
          <li className="flex items-center gap-3 px-6 py-2 hover:bg-accent">
            <KanbanSquare size={20} />
            <span className="text-sm">My Tasks</span>
          </li>
          <li className="flex items-center gap-3 px-6 py-2 hover:bg-accent">
            <CalendarRange size={20} />
            <span className="text-sm">Schedule</span>
          </li>
          <li className="flex items-center gap-3 px-6 py-2 hover:bg-accent">
            <Users size={20} />
            <span className="text-sm">Team</span>
          </li>
        </ul>
      </nav>
      <div className="flex">
        <Button className="w-full m-4" variant="outline">
          <LogOut size={18} />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
