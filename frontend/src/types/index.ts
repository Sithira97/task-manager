export interface Task {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "done";
  due_date: string;
  created_by: User | null;
  assignees?: [] | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
export interface User {
  id?: number;
  username: string;
  email?: string;
  role?: "admin" | "user";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export interface AuthProps {
  onToggleAuth: () => void;
}

export type Route = "dashboard" | "tasks" | "schedule" | "teams";

export interface RouterContextType {
  currentView: Route;
  setCurrentView: (view: Route) => void;
}
