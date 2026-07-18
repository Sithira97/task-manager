import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import TeamCard from "../components/TeamCard";
import { useTasks } from "../context/TaskContext";
import { User } from "lucide-react";
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

const FILTER_OPTIONS = [
  { value: "all", label: "All Teams" },
  { value: "my_teams", label: "My Teams" },
  { value: "im_in", label: "Teams I'm In" },
];

const Teams: React.FC = () => {
  const { teams } = useTasks();
  const { user } = useAuth();
  const { open } = useSidebar();

  const [filter, setFilter] = useState<string>("all");

  const displayedTeams = useMemo(() => {
    if (!user || !teams) return [];

    return teams.filter((team) => {
      const leadId = team.team_lead?.id || team.team_lead?.user_id;
      const isLead = leadId === user.id;
      const isMember = team.team_members?.some(
        (member) => (member?.id || member?.user_id) === user.id,
      );

      if (filter === "my_teams") return isLead;
      if (filter === "im_in") return isMember;
      return true; // "all" shows everything returned by the server
    });
  }, [user, teams, filter]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-3 xs:p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-xl md:text-2xl text-primary">Teams</h1>

        {teams && teams.length > 0 && (
          <div>
            <Select
              items={FILTER_OPTIONS}
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="text-sm">
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

      {teams && teams.length > 0 ? (
        <div className="fade-in">
          {displayedTeams.length > 0 ? (
            <div
              className={`grid grid-cols-1 ${open ? "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} 2xl:grid-cols-4 gap-2 max-w-[96rem] mx-auto`}
            >
              {displayedTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
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
              {user && user.role == "admin"
                ? "Create a Task to add a team!"
                : "You will be added to a team when assigned to a task."}
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      )}
    </main>
  );
};

export default Teams;
