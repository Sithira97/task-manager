import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const migrate = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    await connection.query(`
            CREATE DATABASE IF NOT EXISTS task_manager;
            USE task_manager;

            DROP TABLE IF EXISTS assignees;
            DROP TABLE IF EXISTS tasks;
            DROP TABLE IF EXISTS users;

            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL
            );

            CREATE TABLE tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
                status ENUM('open', 'in_progress', 'done') NOT NULL DEFAULT 'open',
                due_date DATE NOT NULL,
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE assignees (
                task_id INT NOT NULL,
                user_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (task_id, user_id),
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE INDEX idx_tasks_status ON tasks(status);
            CREATE INDEX idx_tasks_priority ON tasks(priority);
            CREATE INDEX idx_tasks_due_date ON tasks(due_date);
            CREATE INDEX idx_assignees_user_id ON assignees(user_id);
        `);

    await connection.query(`
            CREATE DATABASE IF NOT EXISTS task_manager_test;
            USE task_manager_test;

            DROP TABLE IF EXISTS assignees;
            DROP TABLE IF EXISTS tasks;
            DROP TABLE IF EXISTS users;

            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL
            );

            CREATE TABLE tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(100) NOT NULL,
                description TEXT NOT NULL,
                priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
                status ENUM('open', 'in_progress', 'done') NOT NULL DEFAULT 'open',
                due_date DATE NOT NULL,
                created_by INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL DEFAULT NULL,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE assignees (
                task_id INT NOT NULL,
                user_id INT NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (task_id, user_id),
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE INDEX idx_tasks_status ON tasks(status);
            CREATE INDEX idx_tasks_priority ON tasks(priority);
            CREATE INDEX idx_tasks_due_date ON tasks(due_date);
            CREATE INDEX idx_assignees_user_id ON assignees(user_id);
        `);

    await connection.end();
  } catch (error) {
    console.error("Error migrating database:", error);
  }
};

migrate();
