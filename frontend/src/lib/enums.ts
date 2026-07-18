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

export const getStatusClasses = (status: "open" | "in_progress" | "done") => {
  switch (status) {
    case "open":
      return "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]";
    case "in_progress":
      return "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]";
    case "done":
      return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]";
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
