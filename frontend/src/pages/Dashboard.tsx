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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();

  // Helper to generate last 7 days (including today) in local timezone
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const parseTaskDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    // Replace space between date and time with T if present, to parse correctly in Safari/mobile browsers
    const normalized = dateStr.includes("T")
      ? dateStr
      : dateStr.replace(" ", "T");
    return new Date(normalized);
  };

  // 1. Process Doughnut Chart Data (Task Status Distribution)
  const openCount = tasks.filter((task) => task.status === "open").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  const doughnutData = [
    { name: "open", value: openCount, fill: "var(--color-open)" },
    {
      name: "in_progress",
      value: inProgressCount,
      fill: "var(--color-in_progress)",
    },
    { name: "done", value: doneCount, fill: "var(--color-done)" },
  ];

  const statusChartConfig = {
    open: {
      label: "Open",
      color: "#3b82f6", // blue
    },
    in_progress: {
      label: "In Progress",
      color: "#10b981", // emerald
    },
    done: {
      label: "Done",
      color: "#f59e0b", // amber
    },
  } satisfies ChartConfig;

  // 2. Process Bar Chart Data (Productivity - Completed Tasks in Last 7 Days)
  const last7Days = getLast7Days();
  const barChartData = last7Days.map((day) => {
    const dayLabel = day.toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Mon"
    const dateLabel = day.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }); // e.g. "Jul 17"

    const completedCount = tasks.filter((task) => {
      if (task.status !== "done" || !task.updated_at) return false;
      const completedDate = parseTaskDate(task.updated_at);
      return isSameDay(completedDate, day);
    }).length;

    return {
      day: dayLabel,
      date: dateLabel,
      completed: completedCount,
    };
  });

  const productivityChartConfig = {
    completed: {
      label: "Completed Tasks",
      color: "#6366f1", // indigo
    },
  } satisfies ChartConfig;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        {/* Doughnut Chart Card */}
        <Card className="border border-border shadow-sm flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>
              Proportion of Open vs. In Progress vs. Done tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4 flex flex-col items-center justify-center">
            {tasks.length > 0 ? (
              <div className="relative w-full flex flex-col items-center justify-center min-h-[320px]">
                <ChartContainer
                  config={statusChartConfig}
                  className="mx-auto aspect-square w-full max-w-[300px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={doughnutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={85}
                      outerRadius={110}
                      strokeWidth={4}
                      stroke="var(--card)"
                    >
                      {doughnutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="flex-wrap gap-2 justify-center mt-4"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
                  <span className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                    {tasks.length}
                  </span>
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-muted-foreground mt-1">
                    Total Tasks
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground text-sm">
                No tasks available in this workspace.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productivity Bar Chart Card */}
        <Card className="border border-border shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Productivity</CardTitle>
            <CardDescription>
              Tasks completed over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4">
            {tasks.length > 0 ? (
              <ChartContainer
                config={productivityChartConfig}
                className="w-full min-h-[320px]"
              >
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-border/50"
                  />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-muted-foreground font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                    className="text-muted-foreground font-medium"
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="completed"
                    fill="var(--color-completed)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[320px] text-muted-foreground text-sm">
                No tasks available in this workspace.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
