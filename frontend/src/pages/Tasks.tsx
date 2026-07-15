import { useEffect, useState } from "react";
import type { Task } from "../types";
import TaskCard from "../components/TaskCard.js";
import { useAuth } from "../context/AuthContext";

const Tasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    <main className="flex-1 flex flex-col gap-3 overflow-y-auto mb-16 sm:mb-0 py-5 lg:px-5">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-3 lg:gap-2">
          <div className="grid lg:block">
            <p className="font-semibold px-5 lg:text-center">Open Tasks</p>
            <div className="flex px-5 lg:px-2 lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto py-2">
              {tasks
                .filter((task) => task.status === "open")
                .map((value) => (
                  <TaskCard key={value.id} task={value} />
                ))}
            </div>
          </div>
          <div className="grid lg:block">
            <p className="font-semibold px-5 lg:text-center">
              In Progress Tasks
            </p>
            <div className="flex px-5 lg:px-2 lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto p-2">
              {tasks
                .filter((task) => task.status === "in_progress")
                .map((value) => (
                  <TaskCard key={value.id} task={value} />
                ))}
            </div>
          </div>
          <div className="grid lg:block">
            <p className="font-semibold px-5 lg:text-center">Done Tasks</p>
            <div className="flex px-5 lg:px-2 lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto p-2">
              {tasks
                .filter((task) => task.status === "done")
                .map((value) => (
                  <TaskCard key={value.id} task={value} />
                ))}
            </div>
          </div>
        </div>
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Tasks;
