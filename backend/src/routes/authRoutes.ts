import { Router, Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import pool from "../db/config.js";

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute<ResultSetHeader>(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, hashedPassword, role],
  );

  const userId = result.insertId;
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: userId,
      username,
      email,
      role,
    },
  });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const [user] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (user.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user[0].id,
      username: user[0].username,
      email: user[0].email,
      role: user[0].role,
    },
  });
});

router.get("/users", async (req: Request, res: Response) => {
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT id, username, email, role FROM users ORDER BY username ASC",
    );
    return res.json({
      message: "users fetched successfully",
      users,
    });
  } catch (error: any) {
    console.error("Get Users Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred fetching users" });
  }
});

export default router;
