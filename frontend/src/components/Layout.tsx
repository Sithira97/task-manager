import React, { useState } from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import TaskModal from "./TaskModal";
import { Input } from "./ui/input";
import { useTasks } from "@/context/TaskContext";
import { Avatar } from "./ui/avatar";
import { useAuth } from "../context/AuthContext";
import { CalendarRange } from "lucide-react";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setModalOpen] = useState(false);
  const { search, setSearch } = useTasks();
  const { user } = useAuth();
  return (
    <SidebarProvider>
      <Navbar setModalOpen={setModalOpen} />
      <SidebarInset>
        <header className="sticky top-0 z-30 justify-between flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex gap-2 items-center sm:hidden">
            <div className="flex items-center gap-2 text-primary rounded-lg p-2">
              <CalendarRange size={28} />
              <h1 className="text-lg font-bold">Task Manager</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 relative">
            <SidebarTrigger className="-ml-1" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 bg-input/40 h-9"
            />
          </div>

          <div className="flex items-center gap-3">{user && <Avatar />}</div>
        </header>
        {children}
        {isMobile && <MobileNav setModalOpen={setModalOpen} />}
      </SidebarInset>
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </SidebarProvider>
  );
};

export default Layout;
