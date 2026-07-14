import { Router } from "express";
import { Request, Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, created_by) VALUES ('${req.body.title}', '${req.body.description}', '${req.body.status}', '${req.body.priority}', '${req.body.due_date}', ${req.body.assigned_to}, ${req.body.created_by})`,
  );

  const taskId = result.insertId;
  const [task] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ${taskId}`,
  );
  return res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

router.get("/", async (req: Request, res: Response) => {
  const [tasks] = await pool.query<RowDataPacket[]>("SELECT * FROM tasks");
  return res.json({
    message: "Tasks fetched successfully",
    tasks,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const [task] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ${req.params.id}`,
  );
  return res.json({
    message: "Task fetched successfully",
    task,
  });
});

router.put("/:id", async (req: Request, res: Response) => {
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks SET status = '${req.body.status}', priority = '${req.body.priority}', updated_at = CURRENT_TIMESTAMP WHERE id = '${req.params.id}'`,
  );
  const [task] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ${req.params.id}`,
  );
  return res.json({
    message: "Task updated successfully",
    task,
  });
});

router.patch("/status/:id", async (req: Request, res: Response) => {
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks SET status = '${req.body.status}', updated_at = CURRENT_TIMESTAMP WHERE id = '${req.params.id}'`,
  );
  const [task] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ${req.params.id}`,
  );
  return res.json({
    message: "Task status updated successfully",
    task,
  });
});

router.patch("/priority/:id", async (req: Request, res: Response) => {
  await pool.execute<ResultSetHeader>(
    `UPDATE tasks SET priority = '${req.body.priority}', updated_at = CURRENT_TIMESTAMP WHERE id = '${req.params.id}'`,
  );
  const [task] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM tasks WHERE id = ${req.params.id}`,
  );
  return res.json({
    message: "Task priority updated successfully",
    task,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  await pool.execute(
    `UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ${req.params.id}`,
  );
  return res.json({
    message: "Task deleted successfully",
  });
});

export default router;
