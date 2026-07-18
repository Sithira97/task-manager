import type { Task } from "@/types";
import { useTasks } from "../context/TaskContext";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
  type KanbanMoveEvent,
} from "@/components/reui/kanban";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp } from "lucide-react";
import { useCallback, useEffect, useState, type ComponentProps } from "react";
import { Badge } from "@/components/reui/badge";
import { useAuth } from "@/context/AuthContext";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Empty, EmptyDescription } from "@/components/ui/empty";
import { lazy, Suspense } from "react";

const TaskCard = lazy(() => import("@/components/TaskCard"));
const TaskView = lazy(() => import("@/components/TaskView"));
const TaskModal = lazy(() => import("@/components/TaskModal"));

const COLUMN_TITLES: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  done: "Done",
};

const PRIORITY_FILTER = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const TIMEFRAME_FILTER = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  {
    label: "All Time",
    value: "all",
  },
];

const STATUS_KEYS = Object.keys(COLUMN_TITLES) as Task["status"][];

interface TaskColumnProps extends Omit<
  ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: Task[];
  isOverlay?: boolean;
  setDialogDelete: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalEdit: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalView: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
}

function TaskColumn({
  value,
  tasks,
  isOverlay,
  setDialogDelete,
  setModalEdit,
  setModalView,
  ...props
}: TaskColumnProps) {
  const [sortBy, setSortBy] = useState<
    "due_date" | "created_at" | "updated_at" | null
  >(null);

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === "due_date") {
      const aTime = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const bTime = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return aTime - bTime;
    }
    if (sortBy === "created_at") {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    }
    if (sortBy === "updated_at") {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    }
    return 0;
  });

  return (
    <KanbanColumn value={value} {...props} className="min-w-0 flex flex-1">
      <Card className="mb-2.5 w-full flex flex-1 gap-0 py-0 min-w-0">
        <CardHeader className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold">
              {COLUMN_TITLES[value]}
            </span>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSortBy(null)}
                  className={sortBy === null ? "bg-muted" : ""}
                >
                  Default
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("due_date")}
                  className={sortBy === "due_date" ? "bg-muted" : ""}
                >
                  Due Soon
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("created_at")}
                  className={sortBy === "created_at" ? "bg-muted" : ""}
                >
                  Created Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("updated_at")}
                  className={sortBy === "updated_at" ? "bg-muted" : ""}
                >
                  Updated Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent className="px-0">
          <KanbanColumnContent
            value={value}
            className="flex-row lg:flex-col overflow-x-auto p-4"
          >
            {sortedTasks && sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <KanbanItem key={task.id} value={task.id.toString()} {...props}>
                  {!isOverlay ? (
                    <KanbanItemHandle>
                      <TaskCard
                        task={task}
                        setDialogDelete={setDialogDelete}
                        setModalEdit={setModalEdit}
                        setModalView={setModalView}
                      />
                    </KanbanItemHandle>
                  ) : (
                    <TaskCard
                      task={task}
                      setDialogDelete={setDialogDelete}
                      setModalEdit={setModalEdit}
                      setModalView={setModalView}
                    />
                  )}
                </KanbanItem>
              ))
            ) : (
              <Empty className="gap-0">
                <EmptyDescription>No tasks found</EmptyDescription>
              </Empty>
            )}
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
  const {
    tasks,
    updateTaskStatus,
    deleteTask,
    forceDeleteTask,
    timeframeFilter,
    setTimeframeFilter,
    priorityFilter,
    setPriorityFilter,
  } = useTasks();
  const { user } = useAuth();
  const [dialogDelete, setDialogDelete] = useState<{
    open: boolean;
    taskId: number;
  }>({
    open: false,
    taskId: 0,
  });
  const [modalEdit, setModalEdit] = useState<{ open: boolean; taskId: number }>(
    {
      open: false,
      taskId: 0,
    },
  );
  const [modalView, setModalView] = useState<{ open: boolean; taskId: number }>(
    {
      open: false,
      taskId: 0,
    },
  );

  const [columns, setColumns] = useState<Record<string, Task[]>>(() =>
    buildColumns(tasks),
  );

  useEffect(() => {
    setColumns(buildColumns(tasks));
  }, [tasks]);

  const handleMove = useCallback(
    ({ activeContainer, overContainer, event }: KanbanMoveEvent) => {
      if (activeContainer !== overContainer) {
        const taskId = Number(event.active.id);
        updateTaskStatus(taskId, overContainer as Task["status"]);
      }
    },
    [updateTaskStatus],
  );

  return (
    <div className="w-full lg:max-w-7xl 2xl:max-w-[95rem] flex flex-1 mx-auto flex-col 2xl:flex-row gap-3 mb-17 sm:mb-0 pt-5 lg:px-2 xl:px-5 min-w-0">
      <div className="flex flex-col xs:flex-row 2xl:flex-col gap-4 px-4 sm:items-center 2xl:items-start justify-between 2xl:justify-start">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <div className="flex items-center gap-3 2xl:flex-col 2xl:items-start 2xl:w-full">
          <Select
            items={PRIORITY_FILTER}
            value={priorityFilter || "all"}
            onValueChange={(val) =>
              val
                ? setPriorityFilter(val === "all" ? "" : val)
                : setPriorityFilter("")
            }
          >
            <SelectTrigger className="w-[140px] 2xl:hidden">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_FILTER.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldSet className="w-full max-w-xs hidden 2xl:flex">
            <FieldLegend
              variant="label"
              className="text-muted-foreground 2xl:!text-base"
            >
              Task Priority
            </FieldLegend>
            <RadioGroup
              className="2xl:flex hidden flex-col gap-1"
              value={priorityFilter || "all"}
              onValueChange={(val) =>
                setPriorityFilter(val === "all" ? "" : val)
              }
            >
              {PRIORITY_FILTER.map((priority) => (
                <Field key={priority.value} orientation="horizontal">
                  <RadioGroupItem value={priority.value} id={priority.value} />
                  <FieldLabel htmlFor={priority.value}>
                    {priority.label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>

          <Select
            items={TIMEFRAME_FILTER}
            value={timeframeFilter || "all"}
            onValueChange={(val) =>
              val
                ? setTimeframeFilter(val === "all" ? "" : val)
                : setTimeframeFilter("")
            }
          >
            <SelectTrigger className="w-[150px] 2xl:hidden">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              {TIMEFRAME_FILTER.map((timeframe) => (
                <SelectItem key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldSet className="w-full max-w-xs hidden 2xl:flex">
            <FieldLegend
              variant="label"
              className="text-muted-foreground 2xl:!text-base"
            >
              Task Timeframe
            </FieldLegend>
            <RadioGroup
              className="hidden 2xl:flex flex-col gap-1"
              value={timeframeFilter || "all"}
              onValueChange={(val) =>
                val
                  ? setTimeframeFilter(val === "all" ? "" : val)
                  : setTimeframeFilter("")
              }
            >
              {TIMEFRAME_FILTER.map((timeframe) => (
                <Field key={timeframe.value} orientation="horizontal">
                  <RadioGroupItem
                    value={timeframe.value}
                    id={timeframe.value}
                  />
                  <FieldLabel htmlFor={timeframe.value}>
                    {timeframe.label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
        </div>
      </div>
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id.toString()}
        onMove={handleMove}
        className="flex-1 min-w-0 flex"
      >
        <KanbanBoard className="flex-1 gap-2 grid grid-rows-3 grid-cols-1 sm:grid-cols-1 lg:grid-rows-1 lg:auto-rows-fr lg:grid-cols-3 px-4 min-w-0">
          {Object.entries(columns).map(([columnValue, columnTasks]) => (
            <TaskColumn
              key={columnValue}
              value={columnValue}
              tasks={columnTasks}
              setDialogDelete={setDialogDelete}
              setModalEdit={setModalEdit}
              setModalView={setModalView}
            />
          ))}
        </KanbanBoard>
        <KanbanOverlay className="bg-muted/10 opacity-80 rounded-[min(var(--radius-4xl),24px)] outline-dashed outline-2 outline-offset-2">
          {({ value, variant }) => {
            if (variant === "item") {
              const task = tasks.find(
                (t) => t.id.toString() === value.toString(),
              );
              if (task) return <TaskCard task={task} />;
            }
            return null;
          }}
        </KanbanOverlay>
      </Kanban>
      <AlertDialog
        open={dialogDelete.open}
        onOpenChange={(open) => setDialogDelete({ open, taskId: 0 })}
      >
        <AlertDialogContent className="select-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete this task and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:flex-row sm:justify-between">
            {user && user.role === "admin" && (
              <AlertDialogAction
                onClick={() => {
                  forceDeleteTask(dialogDelete.taskId);
                  setDialogDelete({ open: false, taskId: 0 });
                }}
                variant="outline"
                className="hidden sm:flex border-destructive text-destructive/80 dark:hover:text-destructive-foreground hover:bg-destructive dark:hover:bg-destructive hover:text-destructive-foreground "
              >
                Permenantly Delete
              </AlertDialogAction>
            )}
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <AlertDialogCancel
                onClick={() => setDialogDelete({ open: false, taskId: 0 })}
              >
                Cancel
              </AlertDialogCancel>
              <div className="flex w-full gap-1 sm:w-fit sm:gap-2 justify-between">
                <AlertDialogAction
                  onClick={() => {
                    deleteTask(dialogDelete.taskId);
                    setDialogDelete({ open: false, taskId: 0 });
                  }}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete
                </AlertDialogAction>
                {user && user.role === "admin" && (
                  <AlertDialogAction
                    onClick={() => {
                      forceDeleteTask(dialogDelete.taskId);
                      setDialogDelete({ open: false, taskId: 0 });
                    }}
                    variant="outline"
                    className="sm:hidden text-xs sm:text-sm border-destructive text-destructive/80 dark:hover:text-destructive-foreground hover:bg-destructive dark:hover:bg-destructive hover:text-destructive-foreground "
                  >
                    Permenantly Delete
                  </AlertDialogAction>
                )}
              </div>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Suspense fallback={null}>
        <TaskModal
          isOpen={modalEdit.open}
          onClose={() => setModalEdit({ open: false, taskId: 0 })}
          isEdit={true}
          task={tasks.find((t) => t.id === modalEdit.taskId)}
        />
      </Suspense>
      <Suspense fallback={null}>
        <TaskView
          isOpen={modalView.open}
          onClose={() => setModalView({ open: false, taskId: 0 })}
          task={tasks.find((t) => t.id === modalView.taskId)}
        />
      </Suspense>
    </div>
  );
};

export default Tasks;
