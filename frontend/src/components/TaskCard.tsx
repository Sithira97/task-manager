import React from "react";
import { Calendar, User } from "lucide-react";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-card min-w-[300px] max-w-[300px] lg:min-w-auto lg:max-w-full overflow-hidden fade-in flex flex-col rounded-lg ring-1 ring-foreground/10 text-sm text-card-foreground p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="leading-snug text-base font-semibold flex-1 line-clamp-1 md:line-clamp-2">
            {task.title}
          </h3>
        </div>
        <span
          className={`xl:text-nowrap font-semibold uppercase px-3 py-1 rounded-full text-xs
            text-priority-${task.priority} bg-priority-${task.priority}/10`}
        >
          {task.priority} <span className="hidden lg:inline">priority</span>
        </span>
      </div>
      <p className="text-muted-foreground line-clamp-1 md:line-clamp-2 text-sm text-wrap mb-3">
        {task.description}
      </p>

      <div className="flex mt-auto flex-col gap-1 mb-3 pt-3  border-t border-border">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} className="" />
          <span>Due {formatDate(task.due_date)}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User size={14} className="" />
          <span className="text-muted-foreground text-sm">Created by:</span>
          <span className="font-semibold">
            {task.created_by?.username || "Unknown"}
          </span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User size={14} className="" />
          <span className="text-muted-foreground text-sm">Assignee:</span>
          <span className="font-semibold">
            {task.assignees
              ?.map((assignee) => assignee.username)
              .join(", ") || (
              <span className="text-muted-foreground italic">Unassigned</span>
            )}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <label htmlFor={`status-select-${task.id}`} className="text-sm">
          Status
        </label>
        <select
          id={`status-select-${task.id}`}
          value={task.status}
          className="flex-1 py-2 px-3 rounded-lg border-1 border-border bg-background font-semibold text-sm"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard;
