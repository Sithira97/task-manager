import React from "react";
import type { Task, User } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./reui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Calendar, Crown, FileText, Users, Clock } from "lucide-react";
import { cleanCapitalize, getInitials } from "@/lib/words";

interface TaskViewProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TaskView: React.FC<TaskViewProps> = ({ isOpen, onClose, task }) => {
  if (!task) return null;
  const isOverdue =
    task.due_date &&
    task.status !== "done" &&
    Date.parse(task.due_date) < Date.now();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[42rem] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col gap-3 w-full pr-6">
            <DialogTitle className="text-xl leading-tight font-semibold break-words">
              <div className="flex items-center gap-2">
                {task.title}
                {isOverdue && (
                  <Badge
                    variant={"destructive-light"}
                    className="pointer-events-none rounded-sm h-auto py-1 px-3 capitalize"
                  >
                    Overdue
                  </Badge>
                )}
              </div>
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive-light"
                    : task.priority === "medium"
                      ? "warning-light"
                      : "success-light"
                }
                className="pointer-events-none text-base rounded-sm h-auto py-1 px-3 capitalize"
              >
                {task.priority} Priority
              </Badge>
              <Badge
                variant="outline"
                className="capitalize  text-base pointer-events-none rounded-sm h-auto py-1 px-3"
              >
                {task.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Description Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={16} />
              <h3 className="text-sm font-medium">Description</h3>
            </div>
            <div className="text-sm text-foreground/90 bg-muted/40 p-4 rounded-lg whitespace-pre-wrap border border-border/50">
              {task.description || (
                <span className="italic text-muted-foreground">
                  No description provided.
                </span>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-lg border border-border/50">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={16} />
                <h3 className="text-sm font-medium">Due Date</h3>
              </div>
              <div
                className={`flex items-center gap-2 text-sm font-medium pl-6 ${isOverdue ? "text-red-500" : ""}`}
              >
                <Calendar
                  size={15}
                  className={`text-muted-foreground/70 ${
                    isOverdue ? "text-red-500" : ""
                  }`}
                />
                {task.due_date ? formatDate(task.due_date) : "No due date"}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Crown size={16} />
                <h3 className="text-sm font-medium">Created By</h3>
              </div>
              <div className="flex items-center gap-2 pl-6">
                {task.created_by ? (
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm" className="h-7 w-7">
                      <AvatarFallback className="text-xs">
                        {getInitials(task.created_by.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      {cleanCapitalize(task.created_by.username)}
                      <Crown className="size-3 fill-yellow-500 text-yellow-500" />
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unknown</span>
                )}
              </div>
            </div>
          </div>

          {/* Assignees Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={16} />
              <h3 className="text-sm font-medium">
                Assignees ({task.assignees?.length || 0})
              </h3>
            </div>
            {task.assignees && task.assignees.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pl-6">
                {task.assignees.map((assignee: User) => (
                  <div
                    key={assignee.id}
                    className="flex items-center gap-2.5 bg-background border border-border/60 py-1.5 pl-1.5 pr-3.5 rounded-full shadow-sm"
                  >
                    <Avatar size="sm" className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(assignee.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {cleanCapitalize(assignee.username)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground pl-6">
                Unassigned
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskView;
