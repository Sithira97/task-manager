export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "done";
  due_date: string;
  created_by: User | number;
  assignees?: User[] | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
export interface User {
  id?: number;
  username: string;
  email?: string;
  role?: "admin" | "user";
}
