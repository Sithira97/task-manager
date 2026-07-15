import { Request, Response } from "express";
import pool from "../db/config.js";
import { RowDataPacket, ResultSetHeader, QueryResult } from "mysql2";
import bcrypt from "bcrypt";

// register a new user
export const register = async (req: Request, res: Response) => {
  let { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!role) {
    role = "user";
  }

  const [user] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email],
  );

  if (user.length > 0) {
    return res.status(400).json({ error: "User already exists" });
  }

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
};

// login a user
export const login = async (req: Request, res: Response) => {
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
};

// get users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT id, username, email, role FROM users",
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
};

// get user by id
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const [user] = await pool.execute<RowDataPacket[]>(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [userId],
    );
    return res.json({
      message: "User fetched successfully",
      user,
    });
  } catch (error: any) {
    console.error("Get User Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred fetching user" });
  }
};
