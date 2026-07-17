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

const Teams: React.FC = () => {
  const { teams } = useTasks();
  const { user } = useAuth();
  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-3 xs:p-4 sm:p-5">
      <h1 className="font-bold text-xl md:text-2xl text-primary mb-4">Teams</h1>
      {teams && teams.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
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
