import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isTesting = (process.env.IS_TESTING as string) === "true" || false;

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: isTesting
    ? process.env.DB_NAME_TEST || "task_manager_test"
    : process.env.DB_NAME || "task_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
