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
    <div className="bg-card fade-in flex rounded-lg border-1 border-border flex-col p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-bold flex-1 text-wrap">{task.title}</h3>
        </div>
        <span
          className={`text-nowrap font-semibold uppercase px-3 py-1 rounded-full text-xs 
            text-priority-${task.priority} shadow bg-priority-${task.priority}/10`}
        >
          {task.priority} priority
        </span>
      </div>
      <p className="text-muted-foreground text-sm text-wrap">
        {task.description}
      </p>

      <div className="flex flex-col gap-1 mb-3 pt-3 mt-3 border-t border-border">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} className="" />
          <span>Due {formatDate(task.due_date)}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <User size={14} className="" />
          <span className="text-muted-foreground text-sm">Created by:</span>
          <span className="font-semibold">{task.created_by.toString()}</span>
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

      <div className="flex items-center justify-between gap-2 mt-3">
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
