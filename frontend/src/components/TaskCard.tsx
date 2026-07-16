import React from "react";
import { Calendar } from "lucide-react";
import type { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import { AvatarPopup } from "./Avatar";
import Select from "./Select";

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
  const { updateTaskStatus } = useTasks();

  const handleStatusChange = async (newStatus: Task["status"]) => {
    await updateTaskStatus(task.id, newStatus);
  };

  return (
    <div className="bg-card min-w-[300px] max-w-[300px] lg:min-w-auto lg:max-w-full fade-in flex flex-col rounded-lg ring-1 ring-foreground/10 text-sm text-card-foreground p-4 relative focus-within:z-20 hover:z-10">
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

      <div className="flex mt-auto flex-col gap-2 mb-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar size={14} className="" />
          <span>Due {formatDate(task.due_date)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-muted-foreground text-sm shrink-0">
            Created by:
          </span>
          {task.created_by ? (
            <AvatarPopup user={task.created_by} size="sm" />
          ) : (
            <span className="font-semibold text-sm">Unknown</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-muted-foreground text-sm shrink-0">
            Assignees:
          </span>
          <div className="flex -space-x-2 items-center overflow-visible">
            {task.assignees && task.assignees.length > 0 ? (
              task.assignees.map((assignee) => (
                <AvatarPopup
                  key={assignee.id || assignee.username}
                  user={assignee}
                  size="sm"
                />
              ))
            ) : (
              <span className="text-muted-foreground italic text-sm pl-2">
                Unassigned
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-3">
        <label
          htmlFor={`status-select-${task.id}`}
          className="text-sm font-medium shrink-0"
        >
          Status
        </label>
        <div className="flex-1 min-w-0">
          <Select
            options={[
              { value: "open", label: "Open" },
              { value: "in_progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
            value={task.status}
            onChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
