import { Router } from "express";
import {
  getUserById,
  getUsers,
  login,
  register,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

export default router;
