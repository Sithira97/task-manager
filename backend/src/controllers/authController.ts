import { Request, Response } from "express";
import pool from "../db/config.js";
import jwt from "jsonwebtoken";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import { AuthRequest } from "../types/index.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_development_key_123!";

// register a new user
export const register = async (req: Request, res: Response) => {
  let { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  try {
    const [existingUsers] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE name = ? OR email = ?",
      [name, email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "name or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, userRole],
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, name, email, role: userRole },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: userId, name, email, role: userRole },
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred during registration" });
  }
};

// login a user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error occurred during login" });
  }
};

// get users
export const getUsers = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user!.role === "admin";
  try {
    const [users] = await pool.execute<RowDataPacket[]>(
      `SELECT id, name${isAdmin ? ", email, role" : ""} FROM users`,
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
export const getUserById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const [user] = await pool.execute<RowDataPacket[]>(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id],
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
