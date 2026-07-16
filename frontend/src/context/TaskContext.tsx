import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext.jsx";
import type {
  PaginationInfo,
  Task,
  TaskContextType,
  Team,
} from "../types/index.js";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearchState] = useState<string>("");
  const [statusFilter, setStatusFilterState] = useState<string>("");
  const [priorityFilter, setPriorityFilterState] = useState<string>("");

  const [page, setPageState] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) queryParams.append("search", search);
      if (statusFilter) queryParams.append("status", statusFilter);
      if (priorityFilter) queryParams.append("priority", priorityFilter);

      const response = await fetch(`/api/tasks?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tasks");
      }

      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Error loading tasks");
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter, priorityFilter]);

  const fetchTeams = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch("/api/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTeams(data.data);
      }
    } catch (err) {
      console.error("Failed to load teams list", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  useEffect(() => {
    if (token) {
      fetchTeams();
    }
  }, [token, fetchTeams]);

  const setSearch = (s: string) => {
    setSearchState(s);
    setPageState(1);
  };

  const setStatusFilter = (sf: string) => {
    setStatusFilterState(sf);
    setPageState(1);
  };

  const setPriorityFilter = (pf: string) => {
    setPriorityFilterState(pf);
    setPageState(1);
  };

  const setPage = (p: number) => {
    setPageState(p);
  };

  const createTask = async (taskData: Partial<Task>): Promise<boolean> => {
    if (!token) return false;
    setError(null);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      setTasks((prev) => [data.task, ...prev]);
      return true;
    } catch (err: any) {
      setError(err.message || "Error creating task");
      return false;
    }
  };

  const updateTaskOptimistic = async (
    taskId: number,
    updates: Partial<Task>,
  ): Promise<boolean> => {
    if (!token) return false;

    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return false;

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    );

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? data.task : t)),
      );
      return true;
    } catch (err: any) {
      console.warn(
        "Optimistic Update Failed. Rolling back task changes.",
        err.message,
      );
      alert(
        `Sync Failure: ${err.message || "Unable to update task."} Reverting layout.`,
      );

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === taskId ? originalTask : t)),
      );
      return false;
    }
  };

  const deleteTask = async (taskId: number): Promise<boolean> => {
    if (!token) return false;
    setError(null);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return true;
    } catch (err: any) {
      setError(err.message || "Error deleting task");
      return false;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        teams,
        pagination,
        loading,
        error,
        search,
        statusFilter,
        priorityFilter,
        setSearch,
        setStatusFilter,
        setPriorityFilter,
        setPage,
        fetchTasks,
        fetchTeams,
        createTask,
        updateTaskOptimistic,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
