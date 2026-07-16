import React from "react";
import {
  CheckCircle2,
  PlayCircle,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { cleanCapitalize } from "../lib/words";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  return (
    <main className="flex-1 flex flex-col gap-3 overflow-y-auto mb-16 sm:mb-0 p-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Workspace Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back,{" "}
            <strong className="text-primary">
              {cleanCapitalize(user?.username || "")}
            </strong>
            . Here is an overview of your team tasks.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border shadow-sm ">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <ClipboardList size={22} color="#6366f1" />
              <span className="text-sm text-muted-foreground">Total Tasks</span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {tasks.length}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <AlertCircle size={22} color="#3b82f6" />
              <span className="text-sm text-muted-foreground">Open Tasks</span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {tasks.filter((task) => task.status === "open").length}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <PlayCircle size={22} color="#10b981" />

              <span className="text-sm text-muted-foreground">
                Tasks In Progress
              </span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {tasks.filter((task) => task.status === "in_progress").length}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <CheckCircle2 size={22} color="#f59e0b" />
              <span className="text-sm text-muted-foreground">
                Completed Tasks
              </span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {tasks.filter((task) => task.status === "done").length}
            </h3>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
