export type TaskStatus = "open" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_by: User | null;
  assignees?: User[] | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}
export interface Team {
  id: number;
  title: string;
  description?: string;
  team_lead: User;
  team_members?: User[] | null;
  created_by: User | null;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface TeamUser extends User {
  tasks: {
    lead: Task[];
    collaborate: Task[];
  };
}

export interface User {
  id?: number;
  user_id?: number;
  username: string;
  email?: string;
  role?: "admin" | "user";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
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

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskContextType {
  tasks: Task[];
  userTeam: TeamUser[];
  loading: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  priorityFilter: string;
  timeframeFilter: string;
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  setTimeframeFilter: (timeframe: string) => void;
  fetchTasks: () => Promise<void>;
  fetchUserTeams: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<boolean>;
  updateTaskOptimistic: (
    taskId: number,
    updates: Partial<Task>,
  ) => Promise<boolean>;
  updateTaskStatus: (taskId: number, status: TaskStatus) => Promise<boolean>;
  deleteTask: (taskId: number) => Promise<boolean>;
  forceDeleteTask: (taskId: number) => Promise<boolean>;
}
