import { Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket } from "mysql2";
import {
  fetchTeam,
  fetchTeams,
  fetchUsersWorkFor,
  fetchUsersWorkWith,
} from "../db/queries.js";
import { AuthRequest } from "../types/index.js";

// get teams grouped by task ---------------------------------------
export const getUsersTasks = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === "admin";
  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTeams(isAdmin),
      isAdmin ? [] : [req.user!.id, req.user!.id],
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
  if (isNaN(taskId) || taskId <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Valid Task ID is required" });
  }

  try {
    const [tasks] = await pool.execute<RowDataPacket[]>(
      fetchTeam(isAdmin),
      isAdmin ? [taskId] : [taskId, req.user!.id, req.user!.id],
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

export const getTeams = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === "admin" || false;
  const users = new Map<number, any>();
  try {
    const [workWith] = await pool.execute<RowDataPacket[]>(
      fetchUsersWorkWith(isAdmin),
      isAdmin ? [] : [req.user!.id, req.user!.id],
    );

    // Collaborate
    for (const user of workWith) {
      users.set(user.id, {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tasks: {
          lead: [],
          collaborate: user.tasks,
        },
      });
    }

    const [workFor] = await pool.execute<RowDataPacket[]>(
      fetchUsersWorkFor(isAdmin),
      isAdmin ? [] : [req.user!.id, req.user!.id],
    );

    for (const user of workFor) {
      if (!users.has(user.id)) {
        users.set(user.id, {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          tasks: {
            lead: user.tasks,
            collaborate: [],
          },
        });
      } else {
        users.get(user.id).tasks.lead = user.tasks;
      }
    }
    return res.status(200).json({
      success: true,
      message: "User Task Groups fetched successfully",
      users: Array.from(users.values()),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
