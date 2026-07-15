import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

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
app.use("/api/team", teamRoutes);

// Server status endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date() });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal server error occurred" });
  },
);

app.listen(port, () => {
  console.log(`Task Manager API Server running on http://localhost:${port}`);
});
