import {
  Calendar,
  Edit,
  Trash,
  CheckCircle2,
  Clock,
  PlayCircle,
} from "lucide-react";
import type { Task, User } from "@/types";
import { useTasks } from "@/context/TaskContext";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardAction,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cleanCapitalize, getInitials } from "@/lib/words";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { getGradientClass } from "@/lib/colors";
import { formatDate } from "date-fns";
import { STATUS_OPTIONS } from "@/lib/tasks";

interface TaskCardProps {
  task: Task;
  setDialogDelete?: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalEdit?: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalView?: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
}
const statusValues = STATUS_OPTIONS;

const DueDateBadge: React.FC<{
  dueDate: string;
  status: string;
  prefix?: string;
}> = ({ dueDate, status, prefix }) => {
  const isOverdue = status !== "done" && Date.parse(dueDate) < Date.now();
  return (
    <div
      className={`flex self-end items-center gap-1.5${isOverdue ? " text-red-500 text-end" : ""}`}
    >
      <Calendar size={14} />
      <time className="text-xs whitespace-nowrap tabular-nums">
        {prefix && `${prefix} `}
        {formatDate(dueDate, "dd MMM yyyy")}
      </time>
    </div>
  );
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  setDialogDelete,
  setModalEdit,
  setModalView,
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { updateTaskStatus } = useTasks();
  const { user } = useAuth();

  const handleStatusChange = async (newStatus: Task["status"] | null) => {
    if (newStatus) {
      await updateTaskStatus(task.id, newStatus);
    }
  };

  const assigneeList = task.assignees?.filter(
    (assignee) => assignee.username !== task.created_by?.username,
  );
  const overflowAssignees =
    assigneeList && assigneeList.length > 2 && assigneeList.slice(2);

  return (
    <Card className="gap-2.5">
      <CardContent className="flex flex-col gap-2 min-w-64 lg:min-w-auto max-w lg:w-auto">
        <CardHeader
          className="px-0 cursor-pointer group hover:bg-muted/10 transition-colors -mx-6 -mt-6 px-6 pt-6 pb-2 rounded-t-lg"
          onClick={() =>
            setModalView && setModalView({ open: true, taskId: task.id })
          }
        >
          <CardTitle
            className={`line-clamp-1 text-sm font-medium group-hover:text-primary transition-colors ${task.deleted_at ? "text-destructive line-through" : ""} ${task.status === "done" ? "line-through" : ""}`}
          >
            {task.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-1 lg:line-clamp-2 text-sm">
            {task.description}
          </CardDescription>
          <CardAction>
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive-light"
                  : task.priority === "medium"
                    ? "warning-light"
                    : "success-light"
              }
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize"
            >
              {task.priority}
            </Badge>
          </CardAction>
        </CardHeader>

        <div className="flex flex-col pt-3 border-t border-border mt-auto">
          <div className="flex flex-row lg:flex-col xl:flex-row justify-between items-end lg:items-start xl:items-end text-sm text-muted-foreground">
            <AvatarGroup className="flex justify-end items-end">
              {task.created_by && (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getGradientClass(task.created_by.username)} text-sm  text-white`}
                      >
                        {getInitials(task.created_by.username)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cleanCapitalize(task.created_by.username)}
                  </TooltipContent>
                </Tooltip>
              )}
              {assigneeList?.slice(0, 2).map((assignee: User, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <Avatar size="sm">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getGradientClass(assignee.username)} text-sm  text-white`}
                      >
                        {getInitials(assignee.username)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cleanCapitalize(assignee.username)}
                  </TooltipContent>
                </Tooltip>
              ))}
              {overflowAssignees && (
                <Tooltip>
                  <TooltipTrigger>
                    <AvatarGroupCount>
                      +{overflowAssignees.length}
                    </AvatarGroupCount>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="flex flex-col gap-1">
                    {overflowAssignees?.map((assignee) => (
                      <p key={assignee.id}>
                        {cleanCapitalize(assignee.username)}
                      </p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
            </AvatarGroup>
            {task.due_date && (
              <DueDateBadge dueDate={task.due_date} status={task.status} />
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter
        className={`block xl:flex items-center flex-col xl:flex-row justify-between gap-x-2 w-full space-y-2 xl:space-y-0 items-center ${isCollapsed && "lg:flex lg:!flex-row lg:space-y-0"}`}
      >
        <div
          className={`flex lg:w-full xl:w-auto xl:min-w-44 3xl:min-w-48 items-center gap-x-2`}
        >
          <label
            htmlFor={`status-select-${task.id}`}
            className="hidden 2xl:block text-sm font-medium shrink-0"
          >
            Status
          </label>
          <div className="flex-1 w-full min-w-0">
            <Select
              items={statusValues}
              value={task.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusValues.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-x-1 flex-1 xl:flex-0">
          {setModalEdit &&
            (user?.role === "admin" ||
              user?.id === task.created_by?.user_id) && (
              <Button
                onClick={() => setModalEdit({ open: true, taskId: task.id })}
                variant="outline"
                className="flex-1 xl:flex-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary hover:border-primary dark:hover:text-primary-foreground"
              >
                <Edit />
                <span className={`hidden xs:block lg:hidden text-sm`}>
                  Edit
                </span>
              </Button>
            )}
          {setDialogDelete &&
            (user?.role === "admin" ||
              user?.id === task.created_by?.user_id) && (
              <Button
                onClick={() => setDialogDelete({ open: true, taskId: task.id })}
                variant="outline"
                className="flex-1 xl:flex-0 border-destructive text-destructive hover:bg-destructive/40 hover:text-destructive-foreground dark:hover:bg-destructive/50 hover:border-destructive-foreground dark:hover:text-destructive-foreground"
              >
                <Trash />
                <span className={`hidden xs:block lg:hidden text-sm`}>
                  Delete
                </span>
              </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};
export default TaskCard;

export const TaskCardSmall: React.FC<TaskCardProps> = ({
  task,
  setModalView,
}) => {
  const assigneeList = task.assignees?.filter(
    (assignee) => assignee.username !== task.created_by?.username,
  );
  const overflowAssignees =
    assigneeList && assigneeList.length > 2 && assigneeList.slice(2);

  return (
    <Card className="gap-2.5">
      <CardContent className="flex flex-col gap-2 min-w-64 lg:min-w-auto max-w lg:w-auto">
        <CardHeader
          className="px-0 cursor-pointer group hover:bg-muted/10 transition-colors -mx-6 -mt-6 px-6 pt-6 pb-2 rounded-t-lg"
          onClick={() =>
            setModalView && setModalView({ open: true, taskId: task.id })
          }
        >
          <CardTitle
            className={`line-clamp-1 text-sm font-medium group-hover:text-primary transition-colors ${task.deleted_at ? "text-destructive line-through" : ""} ${task.status === "done" ? "line-through" : ""}`}
          >
            {task.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground line-clamp-1 text-sm">
            {task.description}
          </CardDescription>
          <CardAction>
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive-light"
                  : task.priority === "medium"
                    ? "warning-light"
                    : "success-light"
              }
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize"
            >
              {task.priority}
            </Badge>
          </CardAction>
        </CardHeader>

        <div className="flex flex-col pt-3 border-t border-border mt-auto">
          <div className="flex flex-row lg:flex-col xl:flex-row justify-between items-end lg:items-start xl:items-end text-sm text-muted-foreground">
            <AvatarGroup className="flex justify-end items-end">
              {task.created_by && (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getGradientClass(task.created_by.username)} text-sm  text-white`}
                      >
                        {getInitials(task.created_by.username)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cleanCapitalize(task.created_by.username)}
                  </TooltipContent>
                </Tooltip>
              )}
              {assigneeList?.slice(0, 2).map((assignee: User, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <Avatar size="sm">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${getGradientClass(assignee.username)} text-sm  text-white`}
                      >
                        {getInitials(assignee.username)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cleanCapitalize(assignee.username)}
                  </TooltipContent>
                </Tooltip>
              ))}
              {overflowAssignees && (
                <Tooltip>
                  <TooltipTrigger>
                    <AvatarGroupCount>
                      +{overflowAssignees.length}
                    </AvatarGroupCount>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="flex flex-col gap-1">
                    {overflowAssignees?.map((assignee) => (
                      <p key={assignee.id}>
                        {cleanCapitalize(assignee.username)}
                      </p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              )}
            </AvatarGroup>
            {task.due_date && (
              <DueDateBadge dueDate={task.due_date} status={task.status} />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const TaskCardExtraSmall: React.FC<TaskCardProps> = ({
  task,
  setModalView,
}) => {
  const renderTaskStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />;
      case "in_progress":
        return (
          <PlayCircle className="size-4 text-blue-500 shrink-0 animate-pulse" />
        );
      default:
        return <Clock className="size-4 text-muted-foreground shrink-0" />;
    }
  };

  return (
    <Card className="gap-0 py-3">
      <CardContent className="flex flex-col gap-0 min-w-64 lg:min-w-auto max-w lg:w-auto">
        <CardHeader
          className="px-0 cursor-pointer group transition-colors pb-2  gap-1"
          onClick={() =>
            setModalView && setModalView({ open: true, taskId: task.id })
          }
        >
          <div className="flex items-center gap-2 min-w-0">
            {renderTaskStatusIcon(task.status)}
            <CardTitle
              className={`line-clamp-1 text-sm font-medium transition-colors ${task.deleted_at ? "text-destructive line-through" : ""} ${task.status === "done" ? "line-through" : ""}`}
            >
              {task.title}
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground line-clamp-1 text-xs">
            {task.description}
          </CardDescription>
          <CardAction>
            <Badge
              variant={
                task.priority === "high"
                  ? "destructive-light"
                  : task.priority === "medium"
                    ? "warning-light"
                    : "success-light"
              }
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize"
            >
              {task.priority}
            </Badge>
          </CardAction>
        </CardHeader>

        <div className="flex flex-col mt-auto">
          <div className="flex flex-row lg:flex-col xl:flex-row justify-between items-end lg:items-start xl:items-end text-sm text-muted-foreground">
            {task.due_date && (
              <DueDateBadge
                dueDate={task.due_date}
                status={task.status}
                prefix="Due"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
