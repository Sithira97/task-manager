import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  PlayCircle,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import { cleanCapitalize } from "@/lib/words";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";
import { getLast7Days, isSameDay, parseTaskDate } from "@/lib/calendar";
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
import { formatDate } from "date-fns";
import { statusChartConfig } from "@/lib/colors";

type StatsType = {
  total: number;
  byStatus: {
    open: number;
    in_progress: number;
    done: number;
  };
  overdue: number;
};

const Dashboard: React.FC = () => {
  const { user, token, isAdmin } = useAuth();
  const { tasks } = useTasks();
  const [stats, setStats] = useState<StatsType>({
    total: 0,
    byStatus: {
      open: 0,
      in_progress: 0,
      done: 0,
    },
    overdue: 0,
  });

  const openCount = tasks.filter((task) => task.status === "open").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in_progress",
  ).length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  useEffect(() => {
    if (!token) return;

    async function fetchStats() {
      try {
        const response = await fetch(`/api/auth/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        if (data && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    if (isAdmin) {
      fetchStats();
    }
  }, [token, isAdmin]);

  const doughnutData = [
    { name: "open", value: openCount, fill: "var(--color-open)" },
    {
      name: "in_progress",
      value: inProgressCount,
      fill: "var(--color-in_progress)",
    },
    { name: "done", value: doneCount, fill: "var(--color-done)" },
  ];
  const last7Days = getLast7Days();
  const barChartData = last7Days.map((day) => {
    const dayLabel = formatDate(day, "EEE");
    const dateLabel = formatDate(day, "MMM dd");

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
              {cleanCapitalize(user?.name || "")}
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
              {openCount + inProgressCount + doneCount}{" "}
              {isAdmin && (
                <span className="text-base font-normal text-muted-foreground">
                  / {stats.total}
                </span>
              )}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <AlertCircle size={22} color="#f59e0b" />
              <span className="text-sm text-muted-foreground">Open Tasks</span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {openCount}{" "}
              {isAdmin && (
                <span className="text-base font-normal text-muted-foreground">
                  / {stats.byStatus.open}
                </span>
              )}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <PlayCircle size={22} color="#3b82f6" />

              <span className="text-sm text-muted-foreground">
                Tasks In Progress
              </span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {inProgressCount}{" "}
              {isAdmin && (
                <span className="text-base font-normal text-muted-foreground">
                  / {stats.byStatus.in_progress}
                </span>
              )}
            </h3>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardContent className="flex flex-col">
            <div className="flex gap-2 items-center">
              <CheckCircle2 size={22} color="#10b981" />
              <span className="text-sm text-muted-foreground">
                Completed Tasks
              </span>
            </div>
            <h3 className="text-3xl font-bold items-end text-right">
              {doneCount}{" "}
              {isAdmin && (
                <span className="text-base font-normal text-muted-foreground">
                  / {stats.byStatus.done}
                </span>
              )}
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
                    {openCount + inProgressCount + doneCount}
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
