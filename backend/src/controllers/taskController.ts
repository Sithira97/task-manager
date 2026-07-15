import { Request, Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket, ResultSetHeader, QueryResult } from "mysql2";
import { fetchTaskById, fetchTasks } from "../db/queries.js";

// create a new task
export const createTask = async (req: Request, res: Response) => {
  const {
    title,
    description,
    status,
    priority,
    due_date,
    created_by,
    assigned_to,
  } = req.body;

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tasks
    (title, description, priority, status, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, priority, status, due_date, created_by],
  );

  const taskId = result.insertId;

  if (assigned_to && Array.isArray(assigned_to) && assigned_to.length > 0) {
    const assigns = assigned_to.flatMap((user_id: number) => [taskId, user_id]);
    const placeholders = assigned_to.map(() => "(?, ?)").join(", ");
    await pool.execute(
      `INSERT INTO assignees (task_id, user_id) VALUES ${placeholders}`,
      assigns,
    );
  }

  const [task] = await pool.query<RowDataPacket[]>(fetchTaskById, [taskId]);
  return res.status(201).json({
    message: "Task created successfully",
    task,
  });
};

// retrieve all tasks
export const getTasks = async (req: Request, res: Response) => {
  const [tasks] = await pool.query<RowDataPacket[]>(fetchTasks);
  return res.json({
    message: "Tasks fetched successfully",
    tasks,
  });
};

// retrieve a single task
export const getTaskById = async (req: Request, res: Response) => {
  const taskId = req.params.id;

  const [task] = await pool.query<RowDataPacket[]>(fetchTaskById, [taskId]);
  return res.json({
    message: "Task fetched successfully",
    task,
  });
};

// update a task
export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const {
    title,
    description,
    status,
    priority,
    due_date,
    created_by,
    assigned_to,
  } = req.body;
  await pool.execute<QueryResult>(
    `UPDATE tasks
       SET (title, description, priority, status, due_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?)
       WHERE id = ?`,
    [title, description, priority, status, due_date, created_by, taskId],
  );

  if (assigned_to && Array.isArray(assigned_to) && assigned_to.length > 0) {
    await pool.execute(`DELETE FROM assignees WHERE task_id = ?`, [taskId]);
    const assigns = assigned_to.flatMap((user_id: number) => [taskId, user_id]);
    const placeholders = assigned_to.map(() => "(?, ?)").join(", ");
    await pool.execute(
      `INSERT INTO assignees (task_id, user_id) VALUES ${placeholders}`,
      assigns,
    );
  }

  const [task] = await pool.query<RowDataPacket[]>(fetchTaskById, [taskId]);
  return res.json({
    message: "Task updated successfully",
    task,
  });
};

// update a task's status
export const updateTaskStatus = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const { status } = req.body;
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks SET status = ? WHERE id = ?`,
    [status, taskId],
  );
  const [task] = await pool.query<RowDataPacket[]>(fetchTaskById, [taskId]);
  return res.json({
    message: "Task status updated successfully",
    task,
  });
};

// update a task's priority
export const updateTaskPriority = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const { priority } = req.body;
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks SET priority = ? WHERE id = ?`,
    [priority, taskId],
  );
  const [task] = await pool.query<RowDataPacket[]>(fetchTaskById, [taskId]);
  return res.json({
    message: "Task priority updated successfully",
    task,
  });
};

// soft delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  await pool.execute(
    `UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [taskId],
  );
  return res.json({
    message: "Task deleted successfully",
  });
};

// force delete a task
export const forceDeleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;
  await pool.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);
  return res.json({
    message: "Task deleted successfully",
  });
};
