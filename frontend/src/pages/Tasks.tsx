import type { Task } from "@/types";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../context/TaskContext";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCallback, useMemo, type ComponentProps } from "react";
import { Badge } from "@/components/reui/badge";

const COLUMN_TITLES: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_KEYS = Object.keys(COLUMN_TITLES) as Task["status"][];

interface TaskColumnProps extends Omit<
  ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: Task[];
  isOverlay?: boolean;
}

function TaskColumn({ value, tasks, isOverlay, ...props }: TaskColumnProps) {
  return (
    <KanbanColumn value={value} {...props}>
      <Card className="mb-2.5 w-full flex flex-1 gap-0 py-0">
        <CardHeader className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold">
              {COLUMN_TITLES[value]}
            </span>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <KanbanColumnContent
            value={value}
            className="flex-row lg:flex-col overflow-x-auto p-4"
          >
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                asHandle={!isOverlay}
                isOverlay={isOverlay}
              />
            ))}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  );
}

function buildColumns(tasks: Task[]): Record<string, Task[]> {
  const cols: Record<string, Task[]> = {};
  for (const key of STATUS_KEYS) {
    cols[key] = [];
  }
  for (const task of tasks) {
    if (cols[task.status]) {
      cols[task.status].push(task);
    }
  }
  return cols;
}

const Tasks: React.FC = () => {
  const { tasks, updateTaskStatus } = useTasks();

  const columns = useMemo(() => buildColumns(tasks), [tasks]);

  const handleValueChange = useCallback(
    (newColumns: Record<string, Task[]>) => {
      for (const [status, columnTasks] of Object.entries(newColumns)) {
        for (const task of columnTasks) {
          if (task.status !== status) {
            updateTaskStatus(task.id, status as Task["status"]);
          }
        }
      }
    },
    [updateTaskStatus],
  );

  return (
    <main className="flex-1 max-w-7xl mx-auto flex flex-col gap-3 w-full mb-16 sm:mb-0 pt-5 lg:px-5 over">
      <Kanban
        value={columns}
        onValueChange={handleValueChange}
        getItemValue={(item) => item.id.toString()}
      >
        <KanbanBoard className="flex-1 flex flex-col gap-2  lg:grid auto-rows-fr grid-cols-3  w-full px-4">
          {Object.entries(columns).map(([columnValue, tasks]) => (
            <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
          ))}
        </KanbanBoard>
        <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
      </Kanban>
    </main>
  );
};

export default Tasks;
