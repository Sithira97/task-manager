import { UserIcon, Search } from "lucide-react";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b gap-2 border-sidebar-border">
      <div className="flex items-center gap-2 relative">
        <Search
          className="absolute left-3 text-muted-foreground/50"
          size={20}
        />

        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-80 pl-10 border-1 border-input rounded-lg px-4 py-2 "
        />
      </div>

      <div className="flex items-center gap-3">
        <Button className="!rounded-full">
          <UserIcon size={16} />
          <span>Admin</span>
        </Button>
      </div>
    </nav>
  );
}
