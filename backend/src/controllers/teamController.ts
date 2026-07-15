import { Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket } from "mysql2";
import { fetchTeam, fetchTeams } from "../db/queries.js";
import { AuthRequest } from "../types/index.js";

// create a new task ---------------------------------------
export const getTeams = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === "admin";
  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTeams(req.user!.id, isAdmin),
    );

    return res.status(200).json({
      success: true,
      message: "Teams fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getTeam = async (req: AuthRequest, res: Response) => {
  const taskId = Number(req.params.taskId);
  const isAdmin = req.user!.role === "admin";
  if (!taskId) {
    return res
      .status(400)
      .json({ success: false, message: "Task ID is required" });
  }

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTeam(req.user!.id, taskId, isAdmin),
    );

    return res.status(200).json({
      success: true,
      message: "Team fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
