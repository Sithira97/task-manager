import { useEffect, useState } from "react";
import type { Task } from "../types";
import TaskCard from "../components/TaskCard.js";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch(`http://localhost:3001/api/tasks`);
        const data = await response.json();
        if (data && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    }
    fetchTasks();
  }, []);

  return (
    <main className="flex-1 flex flex-col gap-3 overflow-y-auto mb-16 p-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {tasks.map((value) => (
          <TaskCard key={value.id} task={value} />
        ))}
      </div>
    </main>
  );
};

export default Tasks;
