import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useTasks } from "@/context/TaskContext";
import { User } from "lucide-react";
import { filterValidTasks } from "@/lib/tasks";
import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import UserCard from "@/components/TeamUserCard";
import UserModal from "@/components/UserModal";

const FILTER_OPTIONS = [
  { value: "all", label: "All Teams" },
  { value: "lead", label: "Users I Lead" },
  { value: "collaborate", label: "Users I Work With" },
];

const Teams: React.FC = () => {
  const { userTeam } = useTasks();
  const { user } = useAuth();
  const { open } = useSidebar();
  const [modalView, setModalView] = useState<{ open: boolean; userId: number }>(
    {
      open: false,
      userId: 0,
    },
  );

  const [filter, setFilter] = useState<string>("all");

  const displayedTeams = useMemo(() => {
    if (!user || !userTeam) return [];

    return userTeam.filter((teamUser) => {
      const Lead = filterValidTasks(teamUser.tasks?.lead);
      const Collab = filterValidTasks(teamUser.tasks?.collaborate);

      if (filter === "lead") return Lead.length > 0;
      if (filter === "collaborate") return Collab.length > 0;
      return true; // "all" shows everything returned by the server
    });
  }, [user, userTeam, filter]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-3 xs:p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-xl md:text-2xl text-primary">Teams</h1>

        {userTeam && userTeam.length > 0 && (
          <div>
            <Select
              items={FILTER_OPTIONS}
              value={filter}
              onValueChange={(value) => value && setFilter(value)}
            >
              <SelectTrigger className="text-sm min-w-48">
                <SelectValue placeholder="Filter teams" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {FILTER_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {userTeam && userTeam.length > 0 ? (
        <div className="fade-in">
          {displayedTeams.length > 0 ? (
            <div
              className={`grid grid-cols-1 ${open ? "sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} 2xl:grid-cols-4 gap-2 max-w-[96rem] mx-auto`}
            >
              {displayedTeams.map((teamUser) => (
                <UserCard
                  key={teamUser.id}
                  user={teamUser}
                  setModalView={setModalView}
                />
              ))}
            </div>
          ) : (
            <Empty className="gap-0 mt-8">
              <EmptyContent className="gap-0">
                <EmptyTitle>No teams match your filter</EmptyTitle>
                <EmptyDescription>
                  Try changing the filter to see other teams.
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </div>
      ) : (
        <Empty className="gap-0">
          <EmptyMedia variant="icon">
            <User />
          </EmptyMedia>
          <EmptyContent className="gap-0">
            <EmptyTitle>No teams found</EmptyTitle>
            <EmptyDescription>
              {user && user.role === "admin"
                ? "Create a Task to add a team!"
                : "You will be added to a team when assigned to a task."}
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      )}
      <UserModal
        isOpen={modalView.open}
        onClose={() => setModalView({ open: false, userId: 0 })}
        user={displayedTeams.find((t) => t.id === modalView.userId)}
      />
    </main>
  );
};

export default Teams;
