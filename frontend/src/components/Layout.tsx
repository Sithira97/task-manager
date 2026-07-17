import React, { useState } from "react";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import { useIsMobile } from "../hooks/use-mobile";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import TaskModal from "./TaskModal";
import { Input } from "./ui/input";
import { useTasks } from "@/context/TaskContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "../context/AuthContext";
import { CalendarRange } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  PopoverDescription,
} from "./ui/popover";
import { Button } from "./ui/button";
import { cleanCapitalize } from "@/lib/words";
import { ModeToggle } from "./ui/mode-toggle";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isModalOpen, setModalOpen] = useState(false);
  const { search, setSearch } = useTasks();
  const { user, logout } = useAuth();
  return (
    <SidebarProvider>
      <Navbar setModalOpen={setModalOpen} />
      <SidebarInset>
        <header className="sticky bg-background top-0 z-30 justify-between flex h-16 shrink-0 items-center gap-2 border-b px-4">
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

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger>
                {user && (
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm">
                        {cleanCapitalize(user?.username)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <Avatar>
                      <AvatarFallback className="bg-primary text-background">
                        {user?.username[0].toLocaleUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </PopoverTrigger>
              <PopoverContent align="end">
                {user && (
                  <PopoverHeader>
                    <PopoverTitle>
                      {cleanCapitalize(user?.username)}
                    </PopoverTitle>
                    <PopoverDescription>{user?.email}</PopoverDescription>
                  </PopoverHeader>
                )}
                <ModeToggle className="w-full" />
                <Button variant="outline" className="w-full" onClick={logout}>
                  Sign Out
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        {children}
        {isMobile && <MobileNav setModalOpen={setModalOpen} />}
      </SidebarInset>
      <TaskModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </SidebarProvider>
  );
};

export default Layout;
