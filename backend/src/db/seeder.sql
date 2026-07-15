-- Seed Users (Passwords hashed using bcrypt for 'password123')
INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'system_admin', 'admin@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'admin'),
(2, 'john_doe', 'john@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'user'),
(3, 'jane_smith', 'jane@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'user');

-- Seed Tasks
INSERT INTO `tasks` (`id`, `title`, `description`, `priority`, `status`, `due_date`, `created_by`) VALUES
(1, 'Setup Database Server', 'Install and configure MySQL / MariaDB server locally.', 'high', 'in_progress', '2026-07-20 10:00:00', 1),
(2, 'Design Task Manager API', 'Draft routes and middlewares for JWT authentication.', 'high', 'open', '2026-07-15 09:00:00', 1),
(3, 'Build Frontend Layout', 'Create responsive CSS and landing page with dark theme.', 'medium', 'open', '2026-07-22 11:00:00', 2),
(4, 'Implement Optimistic State Updates', 'Ensure status transitions feel instantaneous on the Kanban board.', 'high', 'open', '2026-07-25 12:00:00', 1),
(5, 'Audit Accessibility Standards', 'Check keyboard trap in modal dialogs and contrast levels.', 'low', 'done', '2026-07-10 13:00:00', 3);

SET FOREIGN_KEY_CHECKS = 0;
-- Seed Assignees
INSERT INTO `assignees` (`task_id`, `user_id`, `assigned_at`) VALUES
(1, 2, '2026-07-20 10:00:00'),
(1, 3, '2026-07-20 11:00:00'),
(2, 3, '2026-07-20 12:00:00'),
(2, 1, '2026-07-15 09:00:00'),
(3, 2, '2026-07-22 11:00:00'),
(4, 1, '2026-07-25 12:00:00'),
(5, 3, '2026-07-10 13:00:00');

SET FOREIGN_KEY_CHECKS = 1;