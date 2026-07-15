import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";

const app: Express = express();

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

export default app;
