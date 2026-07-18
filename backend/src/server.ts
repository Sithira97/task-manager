import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`Task Manager API Server running on http://localhost:${port}`);
});
