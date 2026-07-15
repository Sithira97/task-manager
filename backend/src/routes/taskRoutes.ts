import { Router } from "express";
import {
  createTask,
  deleteTask,
  forceDeleteTask,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskPriority,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = Router();

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.patch("/:id/status", updateTaskStatus);
router.patch("/:id/priority", updateTaskPriority);
router.delete("/:id", deleteTask);
router.delete("/:id/force", forceDeleteTask);

export default router;
