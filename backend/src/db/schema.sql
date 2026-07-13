-- Task Management System DB Schema

CREATE DATABASE IF NOT EXISTS `task_manager`;
USE `task_manager`;

-- Drop tables if they exist
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `users`;

-- Create Users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Tasks table
CREATE TABLE `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  `status` ENUM('to_do', 'in_progress', 'in_review', 'testing', 'done') NOT NULL DEFAULT 'to_do',
  `due_date` DATE NOT NULL,
  `created_by` INT NOT NULL,
  `assigned_to` INT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Indexes for performance scaling (avoiding full-table scans)
CREATE INDEX `idx_tasks_assigned_to` ON `tasks` (`assigned_to`);
CREATE INDEX `idx_tasks_created_by` ON `tasks` (`created_by`);
CREATE INDEX `idx_tasks_status` ON `tasks` (`status`);