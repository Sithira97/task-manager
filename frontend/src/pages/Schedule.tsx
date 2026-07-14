import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import type { Task } from "../types";

const Schedule: React.FC = () => {
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
    <main className="flex-1 flex flex-col overflow-y-auto mb-16 sm:mb-0 p-5">
      <Calendar tasks={tasks} />
    </main>
  );
};

export default Schedule;
