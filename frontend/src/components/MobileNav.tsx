import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoute } from "../context/RouterContext";
import type { Route } from "../types";
import { useAuth } from "@/context/AuthContext";

const MobileNav: React.FC<{
  navItem: { view: Route; icon: LucideIcon; label: string }[];
  setModalOpen: (open: boolean) => void;
}> = ({ navItem, setModalOpen }) => {
  const { currentView, setCurrentView } = useRoute();
  const { isAdmin } = useAuth();

  return (
    <>
      <footer className="fixed h-16 sm:hidden inset-x-0 bottom-0 z-50 w-full bg-sidebar border-t border-border flex flex-col">
        <nav>
          <ul
            className={`grid ${isAdmin ? "grid-cols-4" : "grid-cols-3"} w-full text-foreground`}
          >
            {navItem.map((item) => (
              <li className="flex-1">
                <button
                  onClick={() => setCurrentView(item.view as Route)}
                  className={`flex w-full flex-col items-center gap-2 px-6 py-2 hover:bg-accent ${currentView === item.view ? "text-primary bg-primary/5 border-t-4 border-primary" : ""}`}
                >
                  <item.icon className="size-5 xs:size-6" />
                  <span className="text-[10px] xs:text-xs">{item.label}</span>
                </button>
              </li>
            ))}
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
