import { Router } from "express";
import {
  getUserById,
  getUsers,
  login,
  register,
} from "../controllers/authController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/taskController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, requireAdmin, getUserById);
router.get(
  "/dashboard/stats",
  authenticateToken,
  requireAdmin,
  getDashboardStats,
);

export default router;
