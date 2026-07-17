import { Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket, ResultSetHeader, QueryResult } from "mysql2";
import { fetchTaskById, fetchTasks } from "../db/queries.js";
import { AuthRequest } from "../types/index.js";

const getCreatorId = (created_by: any): number | null => {
  if (!created_by) return null;

  if (typeof created_by === "object" && created_by !== null) {
    return created_by.user_id || created_by.id;
  }
  if (typeof created_by === "string") {
    try {
      const parsed = JSON.parse(created_by);
      return parsed.user_id || parsed.id || null;
    } catch {
      return Number(created_by) || null;
    }
  }
  return Number(created_by) || null;
};

const getAssigneeIds = (assignees: any): number[] => {
  if (!assignees) return [];
  if (Array.isArray(assignees)) {
    return assignees
      .map((a: any) => {
        if (typeof a === "object" && a !== null) {
          return a.user_id || a.id;
        }
        return Number(a);
      })
      .filter((id) => id !== null && !isNaN(id));
  }
  return [];
};

// create a new task ---------------------------------------
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, priority, status, due_date, assignees } =
    req.body;
  const createdBy = req.user!;

  if (!title || !description || !due_date) {
    return res
      .status(400)
      .json({ error: "Title, description, and due date are required" });
  }

  try {
    let assignedTo: number[] = [];
    if (assignees && Array.isArray(assignees) && assignees.length > 0) {
      const [existingUsers] = await pool.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE id IN (?)",
        [assignees],
      );
      if (existingUsers.length !== assignees.length) {
        return res
          .status(404)
          .json({ error: "One or more assignees do not exist" });
      }
      assignedTo = existingUsers.map((user) => user.id);
    }

    const taskPriority = priority || "medium";
    const taskStatus = status || "to_do";

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO tasks
    (title, description, priority, status, due_date, created_by)
    VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, taskPriority, taskStatus, due_date, createdBy.id],
    );

    const taskId = result.insertId;

    if (assignedTo && Array.isArray(assignedTo) && assignedTo.length > 0) {
      const assigns = assignedTo.flatMap((user_id: number) => [
        taskId,
        user_id,
      ]);
      const placeholders = assignedTo.map(() => "(?, ?)").join(", ");
      await pool.execute(
        `INSERT INTO assignees (task_id, user_id) VALUES ${placeholders}`,
        assigns,
      );
    }

    const [newTask] = await pool.query<RowDataPacket[]>(
      fetchTaskById(taskId, createdBy.role === "admin"),
    );

    const resTask = newTask[0];
    if (resTask && createdBy.role !== "admin") {
      (resTask.deleted_at == null || resTask.deleted_at) &&
        delete resTask.deleted_at;
      resTask.updated_at && delete resTask.updated_at;
      resTask.created_at && delete resTask.created_at;
    }

    return res.status(201).json({
      message: "Task created successfully",
      task: resTask,
    });
  } catch (error: any) {
    console.error("Create Task Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred creating task" });
  }
};

// retrieve all tasks ---------------------------------------
export const getTasks = async (req: AuthRequest, res: Response) => {
  const { page = "1", limit = "1000", search, status, priority, timeframe } = req.query;
  const userId = req.user!.id;
  const isAdmin = req.user!.role === "admin";
  try {
    let query = fetchTasks(isAdmin, userId);
    let countQuery = `SELECT COUNT(DISTINCT t.id) as total FROM tasks t`;
    if (!isAdmin) {
      countQuery += ` LEFT JOIN assignees a ON t.id = a.task_id`;
    }

    const whereConditions: string[] = [];
    const countConditions: string[] = [];
    const params: any[] = [];
    const countParams: any[] = [];

    if (!isAdmin) {
      // For the count query, we can filter in WHERE since we don't aggregate assignees
      countConditions.push(
        "(t.created_by = ? OR a.user_id = ?) AND t.deleted_at IS NULL",
      );
      countParams.push(userId, userId);
    }

    if (search) {
      whereConditions.push("(t.title LIKE ? OR t.description LIKE ?)");
      countConditions.push("(t.title LIKE ? OR t.description LIKE ?)");
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
      countParams.push(searchPattern, searchPattern);
    }

    if (status) {
      whereConditions.push("t.status = ?");
      countConditions.push("t.status = ?");
      params.push(status);
      countParams.push(status);
    }

    if (priority) {
      whereConditions.push("t.priority = ?");
      countConditions.push("t.priority = ?");
      params.push(priority);
      countParams.push(priority);
    }

    if (timeframe) {
      if (timeframe === "week") {
        whereConditions.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
        countConditions.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
      } else if (timeframe === "month") {
        whereConditions.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
        countConditions.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
      }
    }

    if (whereConditions.length > 0) {
      // If fetchTasks already added a WHERE (for non-admin deleted_at check), use AND
      if (!isAdmin) {
        query += " AND " + whereConditions.join(" AND ");
      } else {
        query += " WHERE " + whereConditions.join(" AND ");
      }
    }

    if (countConditions.length > 0) {
      countQuery += " WHERE " + countConditions.join(" AND ");
    }

    // For non-admin users, use HAVING to check access AFTER grouping
    // This preserves all assignee rows for JSON_ARRAYAGG
    const havingParams: any[] = [];
    let havingClause = "";
    if (!isAdmin) {
      havingClause = ` HAVING (MAX(t.created_by = ?) = 1 OR MAX(a.user_id = ?) = 1)`;
      havingParams.push(userId, userId);
    }

    const [countResult] = await pool.execute<RowDataPacket[]>(
      countQuery,
      countParams,
    );
    const totalTasks = countResult[0].total;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offsetNum = (pageNum - 1) * limitNum;

    if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
      return res.status(400).json({ error: "Invalid page or limit" });
    }

    query += ` GROUP BY t.id${havingClause} ORDER BY t.created_at DESC LIMIT ? OFFSET ?`;
    const queryParams = [...params, ...havingParams, limitNum, offsetNum];

    const [tasks] = await pool.query<RowDataPacket[]>(query, queryParams);
    const totalPages = Math.ceil(totalTasks / limitNum);

    const resTasks = tasks.map((task: any) => {
      if (task && !isAdmin) {
        (task.deleted_at == null || task.deleted_at) && delete task.deleted_at;
        task.updated_at && delete task.updated_at;
        task.created_at && delete task.created_at;
      }
      return task;
    });

    return res.json({
      message: "Tasks fetched successfully",
      tasks: resTasks,
      pagination: {
        total: totalTasks,
        page: pageNum,
        limit: limitNum,
        totalPages: totalPages,
      },
    });
  } catch (error: any) {
    console.error("Get Tasks Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred fetching tasks" });
  }
};

// retrieve a single task --------------------------------------
export const getTaskById = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const isAdmin = req.user!.role === "admin";
  try {
    const [tasks] = await pool.query<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[0];
    const creatorId = getCreatorId(task.created_by);
    const assigneeIds = getAssigneeIds(task.assignees);

    if (
      !isAdmin &&
      creatorId !== req.user!.id &&
      !assigneeIds.includes(req.user!.id)
    ) {
      return res
        .status(403)
        .json({ error: "Access denied: Unauthorized view" });
    }
    if (task && !isAdmin) {
      (task.deleted_at == null || task.deleted_at) && delete task.deleted_at;
      task.updated_at && delete task.updated_at;
      task.created_at && delete task.created_at;
    }
    return res.json({
      message: "Task fetched successfully",
      task,
    });
  } catch (error: any) {
    console.error("Get Task ID Error:", error);
    return res.status(500).json({
      error: "Internal server error occurred retrieving task details",
    });
  }
};

// update a task ---------------------------------------
export const updateTask = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const { title, description, priority, status, due_date, assignees } =
    req.body;
  const isAdmin = req.user!.role === "admin";

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[0];
    const creatorId = getCreatorId(task.created_by);
    const assigneeIds = getAssigneeIds(task.assignees);

    const isCreator = creatorId === req.user!.id;
    const isAssignee = assigneeIds.includes(req.user!.id);
    if (!isAdmin && !isCreator && !isAssignee) {
      return res
        .status(403)
        .json({ error: "Access denied: Unauthorized update" });
    }

    const canEditAll = isAdmin || isCreator;
    let assignedTo: number[] = [];
    if (assignees !== undefined && canEditAll) {
      if (assignees && Array.isArray(assignees) && assignees.length > 0) {
        const [existingUsers] = await pool.query<RowDataPacket[]>(
          "SELECT id FROM users WHERE id IN (?)",
          [assignees],
        );
        if (existingUsers.length !== assignees.length) {
          return res
            .status(404)
            .json({ error: "One or more assignees do not exist" });
        }
        assignedTo = existingUsers.map((user) => user.id);
      }
    }

    const canEditStatus = isAdmin || isCreator || isAssignee;

    let updateFields = [];
    let queryParams = [];

    if (title && canEditAll) {
      updateFields.push("title = ?");
      queryParams.push(title);
    }

    if (description && canEditAll) {
      updateFields.push("description = ?");
      queryParams.push(description);
    }

    if (priority && canEditAll) {
      updateFields.push("priority = ?");
      queryParams.push(priority);
    }

    if (status && canEditStatus) {
      updateFields.push("status = ?");
      queryParams.push(status);
    }

    if (due_date && canEditAll) {
      updateFields.push("due_date = ?");
      queryParams.push(due_date);
    }

    if (updateFields.length > 0) {
      const updateQuery = `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`;
      queryParams.push(taskId);
      await pool.execute<QueryResult>(updateQuery, queryParams);
    }
    if (
      assignedTo !== undefined &&
      Array.isArray(assignedTo) &&
      assignedTo.length > 0
    ) {
      await pool.execute(`DELETE FROM assignees WHERE task_id = ?`, [taskId]);
      const assigns = assignedTo.flatMap((user_id: number) => [
        taskId,
        user_id,
      ]);
      const placeholders = assignedTo.map(() => "(?, ?)").join(", ");
      await pool.execute(
        `INSERT INTO assignees (task_id, user_id) VALUES ${placeholders} `,
        assigns,
      );
    }

    const [updatedTasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    return res.json({
      message: "Task updated successfully",
      task: updatedTasks[0],
    });
  } catch (error: any) {
    console.error("Update Task Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred updating task" });
  }
};

// update a task's status ---------------------------------------
export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const { status } = req.body;
  const isAdmin = req.user!.role === "admin";

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[0];
    const creatorId = getCreatorId(task.created_by);
    const assigneeIds = getAssigneeIds(task.assignees);

    const isCreator = creatorId === req.user!.id;
    const isAssignee = assigneeIds.includes(req.user!.id);

    const canEditStatus = isAdmin || isCreator || isAssignee;
    if (!canEditStatus) {
      return res
        .status(403)
        .json({ error: "Access denied: Unauthorized update" });
    }

    await pool.execute<ResultSetHeader>(
      `UPDATE tasks SET status = ? WHERE id = ?`,
      [status, taskId],
    );
    const [updatedTasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    return res.json({
      message: "Task status updated successfully",
      task: updatedTasks[0],
    });
  } catch (error: any) {
    console.error("Update Task Status Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred updating task status" });
  }
};

// update a task's priority ---------------------------------------
export const updateTaskPriority = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const { priority } = req.body;
  const isAdmin = req.user!.role === "admin";

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[0];
    const creatorId = getCreatorId(task.created_by);
    const isCreator = creatorId === req.user!.id;

    const canEditPriority = isAdmin || isCreator;
    if (!canEditPriority) {
      return res
        .status(403)
        .json({ error: "Access denied: Unauthorized update" });
    }
    await pool.execute<ResultSetHeader>(
      `UPDATE tasks SET priority = ? WHERE id = ?`,
      [priority, taskId],
    );
    const [updatedTasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );
    return res.json({
      message: "Task priority updated successfully",
      task: updatedTasks[0],
    });
  } catch (error: any) {
    console.error("Update Task Priority Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred updating task priority" });
  }
};

// soft delete a task ---------------------------------------
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const isAdmin = req.user!.role === "admin";

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );

    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = tasks[0];
    const creatorId = getCreatorId(task.created_by);
    const isCreator = creatorId === req.user!.id;

    const canDelete = isAdmin || isCreator;
    if (!canDelete) {
      return res
        .status(403)
        .json({ error: "Access denied: Unauthorized delete" });
    }
    await pool.execute(
      `UPDATE tasks SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [taskId],
    );
    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Task Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred deleting task" });
  }
};

// force delete a task ---------------------------------------
export const forceDeleteTask = async (req: AuthRequest, res: Response) => {
  const taskId = req.params.id;
  const isAdmin = req.user!.role === "admin";
  if (!isAdmin) {
    return res
      .status(403)
      .json({ error: "Access denied: Unauthorized delete" });
  }

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTaskById(Number(taskId), isAdmin),
    );
    if (tasks.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    await pool.execute(`DELETE FROM tasks WHERE id = ?`, [taskId]);
    return res.json({
      message: "Task permanently deleted successfully",
    });
  } catch (error: any) {
    console.error("Force Delete Task Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred force deleting task" });
  }
};

// get dashboard stats for admins --------------------------------------
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === "admin";
  if (!isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const [[totalTasksResult]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM tasks WHERE deleted_at IS NULL`
    );
    const [[statusStats]] = await pool.query<RowDataPacket[]>(
      `SELECT 
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) as done
       FROM tasks WHERE deleted_at IS NULL`
    );
    const [[overdueStats]] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) as overdue FROM tasks WHERE due_date < NOW() AND status != 'done' AND deleted_at IS NULL`
    );

    return res.json({
      message: "Dashboard stats fetched successfully",
      stats: {
        total: totalTasksResult.count || 0,
        byStatus: {
          open: statusStats.open || 0,
          in_progress: statusStats.in_progress || 0,
          done: statusStats.done || 0,
        },
        overdue: overdueStats.overdue || 0,
      }
    });
  } catch (error: any) {
    console.error("Get Dashboard Stats Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred fetching dashboard stats" });
  }
};
