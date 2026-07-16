import TeamCard from "../components/TeamCard";
import { useTasks } from "../context/TaskContext";

const Teams: React.FC = () => {
  const { teams } = useTasks();
  console.log("Teams data", teams);
  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-3 xs:p-4 sm:p-5">
      <h1 className="font-bold text-xl text-primary mb-4">Teams</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </main>
  );
};

export default Teams;
