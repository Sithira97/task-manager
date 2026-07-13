import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Configure CORS to allow interactions from frontend server
app.use(
  cors({
    origin: "*", // Only in development
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware for parsing JSON bodies
app.use(express.json());

// Main App API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Server status endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Task Manager API Server running on http://localhost:${port}`);
});
