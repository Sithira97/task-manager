import { Calendar, Crown, Edit, Trash } from "lucide-react";
import type { Task, User } from "../types";
import { useTasks } from "../context/TaskContext";
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
} from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./reui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cleanCapitalize, getInitials } from "@/lib/words";
import { Button } from "./ui/button";
import { useSidebar } from "@/components/ui/sidebar";

interface TaskCardProps {
  task: Task;
  setDialogDelete?: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
  setModalEdit?: React.Dispatch<
    React.SetStateAction<{ open: boolean; taskId: number }>
  >;
}
const statusValues = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  setDialogDelete,
  setModalEdit,
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { updateTaskStatus } = useTasks();

  const handleStatusChange = async (newStatus: Task["status"]) => {
    await updateTaskStatus(task.id, newStatus);
  };

  const assigneeList = task.assignees?.filter(
    (assignee) => assignee.username !== task.created_by?.username,
  );
  const overflowAssignees =
    assigneeList && assigneeList.length > 3 && assigneeList.slice(3);

  return (
    <Card>
      <CardContent className="flex flex-col gap-2.5 min-w-64 max-w lg:w-auto">
        <CardHeader className="px-0">
          <CardTitle className="line-clamp-1 text-sm font-medium">
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

        <div className="flex flex-col gap-2 pt-3 border-t border-border mt-auto">
          <div className="flex justify-between items-end text-sm text-muted-foreground">
            <AvatarGroup className="flex justify-end items-end">
              {task.created_by && (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(task.created_by.username)}
                      </AvatarFallback>
                      <span className="absolute left-0 bottom-0">
                        <Crown className="size-3 fill-yellow-500 text-yellow-500" />
                      </span>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    {cleanCapitalize(task.created_by.username)}
                  </TooltipContent>
                </Tooltip>
              )}
              {assigneeList?.slice(0, 3).map((assignee: User, idx) => (
                <Tooltip key={idx}>
                  <TooltipTrigger>
                    <Avatar size="sm">
                      <AvatarFallback>
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
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {task.due_date && (
                <time className="text-[10px] whitespace-nowrap tabular-nums">
                  {formatDate(task.due_date)}
                </time>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="block xl:flex gap-x-2 w-full space-y-1 items-center">
        <div className="flex flex-1 items-center gap-x-2">
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
          {setModalEdit && (
            <Button
              onClick={() => setModalEdit({ open: true, taskId: task.id })}
              variant="outline"
              className="flex-1 xl:flex-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary hover:border-primary dark:hover:text-primary-foreground"
            >
              <Edit />
              <span
                className={`hidden xs:block ${!isCollapsed && "lg:hidden"} xl:hidden text-sm`}
              >
                Edit
              </span>
            </Button>
          )}
          {setDialogDelete && (
            <Button
              onClick={() => setDialogDelete({ open: true, taskId: task.id })}
              variant="outline"
              className="flex-1 xl:flex-0 border-destructive text-destructive hover:bg-destructive/40 hover:text-destructive-foreground dark:hover:bg-destructive/50 hover:border-destructive-foreground dark:hover:text-destructive-foreground"
            >
              <Trash />
              <span
                className={`hidden xs:block ${!isCollapsed && "lg:hidden"} xl:hidden text-sm`}
              >
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
