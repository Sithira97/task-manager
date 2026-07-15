import { Router } from "express";
import {
  getUserById,
  getUsers,
  login,
  register,
} from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", authenticateToken, getUsers);
router.get("/users/:id", authenticateToken, getUserById);

export default router;
