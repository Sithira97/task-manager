import { CheckCircle2, AlertCircle, PlayCircle } from "lucide-react";

export const getPriorityClasses = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "high":
      return "bg-priority-high/10 text-priority-high border-priority-high";
    case "medium":
      return "bg-priority-medium/10 text-priority-medium border-priority-medium";
    case "low":
      return "bg-priority-low/10 text-priority-low border-priority-low";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
};

export const getStatusIcon = (status: "open" | "in_progress" | "done") => {
  switch (status) {
    case "done":
      return CheckCircle2;
    case "in_progress":
      return PlayCircle;
    case "open":
    default:
      return AlertCircle;
  }
};
