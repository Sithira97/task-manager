import { Moon, Monitor, Sun, PaintRoller } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "./sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./dropdown-menu";
import { Button } from "./button";

export function ModeToggle({ tabs = true }: { tabs?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { state, isMobile } = useSidebar();

  return state === "collapsed" && !isMobile && !tabs ? (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="w-full"
        render={
          <Button variant={"outline"}>
            <PaintRoller />
          </Button>
        }
      ></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value)}
        >
          <DropdownMenuRadioItem value="light">
            <Sun />
            <span className="group-data-[state=collapsed]:hidden">Light</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon />
            <span className="group-data-[state=collapsed]:hidden">Dark</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor />
            <span className="group-data-[state=collapsed]:hidden">System</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="px-5">
      <Tabs defaultValue={theme}>
        <TabsList className="w-full">
          <TabsTrigger value="light" onClick={() => setTheme("light")}>
            <Sun />
          </TabsTrigger>
          <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
            <Moon />
          </TabsTrigger>
          <TabsTrigger value="system" onClick={() => setTheme("system")}>
            <Monitor />
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
