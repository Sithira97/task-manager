import { Moon, Monitor, Sun } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle({
  className,
  ...props
}: React.ComponentProps<typeof Tabs>) {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs defaultValue={theme} {...props}>
      <TabsList className={className}>
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
  );
}
