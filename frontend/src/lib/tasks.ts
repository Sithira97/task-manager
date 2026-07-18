import type { Task, TaskStatus } from "@/types";

export const filterValidTasks = (tasks: Task[] | null | undefined): Task[] =>
  (tasks || []).filter(
    (t): t is Task =>
      t !== null &&
      typeof t === "object" &&
      t.id !== null &&
      t.id !== undefined,
  );

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];
