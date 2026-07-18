import { Router } from "express";
import {
  getTeams,
  getTeam,
  getUsersTasks,
} from "../controllers/teamController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", getTeams);
router.get("/task/:id", getTeam); //taskId
router.get("/user", getUsersTasks); //group by users

export default router;
