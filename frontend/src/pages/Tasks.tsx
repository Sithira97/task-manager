import type { Task } from "@/types";
import TaskCard from "../components/TaskCard";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCallback, useEffect, useState, type ComponentProps } from "react";
import { Badge } from "@/components/reui/badge";
import { useAuth } from "@/context/AuthContext";
import TaskModal from "@/components/TaskModal";

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
  setDialogDelete: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalEdit: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
}

function TaskColumn({
  value,
  tasks,
  isOverlay,
  setDialogDelete,
  setModalEdit,
  ...props
}: TaskColumnProps) {
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
              <KanbanItem key={task.id} value={task.id.toString()} {...props}>
                {!isOverlay ? (
                  <KanbanItemHandle>
                    <TaskCard
                      task={task}
                      setDialogDelete={setDialogDelete}
                      setModalEdit={setModalEdit}
                    />
                  </KanbanItemHandle>
                ) : (
                  <TaskCard
                    task={task}
                    setDialogDelete={setDialogDelete}
                    setModalEdit={setModalEdit}
                  />
                )}
              </KanbanItem>
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
  const { tasks, updateTaskStatus, deleteTask, forceDeleteTask } = useTasks();
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
    <main className="flex-1 max-w-7xl mx-auto flex flex-col gap-3 w-full mb-16 sm:mb-0 pt-5 lg:px-5 over">
      <Kanban
        value={columns}
        onValueChange={setColumns}
        getItemValue={(item) => item.id.toString()}
        onMove={handleMove}
      >
        <KanbanBoard className="flex-1 flex flex-col gap-2  lg:grid auto-rows-fr grid-cols-3  w-full px-4">
          {Object.entries(columns).map(([columnValue, columnTasks]) => (
            <TaskColumn
              key={columnValue}
              value={columnValue}
              tasks={columnTasks}
              setDialogDelete={setDialogDelete}
              setModalEdit={setModalEdit}
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
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDialogDelete({ open: false, taskId: 0 })}
            >
              Cancel
            </AlertDialogCancel>
            {user && user.role == "admin" && (
              <AlertDialogAction
                onClick={() => {
                  forceDeleteTask(dialogDelete.taskId);
                  setDialogDelete({ open: false, taskId: 0 });
                }}
                variant="outline"
                className="border-destructive text-destructive/80 dark:hover:text-destructive-foreground hover:bg-destructive dark:hover:bg-destructive hover:text-destructive-foreground "
              >
                Permenantly Delete
              </AlertDialogAction>
            )}
            <AlertDialogAction
              onClick={() => {
                deleteTask(dialogDelete.taskId);
                setDialogDelete({ open: false, taskId: 0 });
              }}
              variant="destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <TaskModal
        isOpen={modalEdit.open}
        onClose={() => setModalEdit({ open: false, taskId: 0 })}
        isEdit={true}
        task={tasks.find((t) => t.id === modalEdit.taskId)}
      />
    </main>
  );
};

export default Tasks;
