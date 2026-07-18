import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const port = Number(process.env.PORT) || 3001;
const host = process.env.HOST || "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Task Manager API Server running on http://${host}:${port}`);
});
