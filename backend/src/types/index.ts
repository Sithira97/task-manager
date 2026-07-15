import { Request } from "express";

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "done";
  due_date: string;
  created_by: User | null;
  assignees: User[] | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
