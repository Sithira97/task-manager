import {
  CheckCircle2,
  PlayCircle,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Task } from "../types";

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/tasks");
      const data = await response.json();
      if (data && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <main className="flex-1 flex flex-col gap-3 overflow-y-auto mb-16 p-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card flex flex-row items-center gap-3 rounded-lg px-6 py-5">
          <ClipboardList size={22} color="#6366f1" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Tasks</span>
            <h3 className="text-2xl font-bold">{tasks.length}</h3>
          </div>
        </div>

        <div className="bg-card flex flex-row items-center gap-3 rounded-lg px-6 py-5">
          <AlertCircle size={22} color="#3b82f6" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Open</span>
            <h3 className="text-2xl font-bold">
              {tasks.filter((task) => task.status === "open").length}
            </h3>
          </div>
        </div>

        <div className="bg-card flex flex-row items-center gap-3 rounded-lg px-6 py-5">
          <PlayCircle size={22} color="#10b981" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <h3 className="text-2xl font-bold">
              {tasks.filter((task) => task.status === "in_progress").length}
            </h3>
          </div>
        </div>

        <div className="bg-card flex flex-row items-center gap-3 rounded-lg px-6 py-5">
          <CheckCircle2 size={22} color="#f59e0b" />
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Completed</span>
            <h3 className="text-2xl font-bold">
              {tasks.filter((task) => task.status === "done").length}
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
