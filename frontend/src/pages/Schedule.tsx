import Calendar from "../components/Calendar";
import { useTasks } from "../context/TaskContext";

const Schedule: React.FC = () => {
  const { tasks } = useTasks();

  return (
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-5">
      <Calendar tasks={tasks} />
    </main>
  );
};

export default Schedule;
