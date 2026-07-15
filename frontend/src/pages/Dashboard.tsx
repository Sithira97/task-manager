import {
  CheckCircle2,
  PlayCircle,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Task } from "../types";
import { cleanCapitalize } from "../utils/words";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
    <main className="flex-1 flex flex-col gap-3 overflow-y-auto mb-16 sm:mb-0 p-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back,{" "}
            <strong className="text-primary">
              {cleanCapitalize(user?.username)}
            </strong>
            . Here is an overview of your team tasks.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
