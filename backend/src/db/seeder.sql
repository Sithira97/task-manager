-- Seed Users (Passwords hashed using bcrypt for 'password123')
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'admin'),
('john_doe', 'john@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'user'),
('jane_smith', 'jane@taskmanager.com', '$2b$10$MEUGvCgtUqBz3dU.FbGcvueZ/EXnJ/aLxoow9xuoFEAqUfi5WctV2', 'user');

-- Seed Tasks
INSERT INTO `tasks` (`title`, `description`, `priority`, `status`, `due_date`, `created_by`, `assigned_to`) VALUES
('Setup Database Server', 'Install and configure MySQL / MariaDB server locally.', 'high', 'in_progress', '2026-07-20', 1, 2),
('Design Task Manager API', 'Draft routes and middlewares for JWT authentication.', 'high', 'to_do', '2026-07-15', 1, 1),
('Build Frontend Layout', 'Create responsive CSS and landing page with dark theme.', 'medium', 'to_do', '2026-07-22', 2, 2),
('Implement Optimistic State Updates', 'Ensure status transitions feel instantaneous on the Kanban board.', 'high', 'to_do', '2026-07-25', 1, 3),
('Audit Accessibility Standards', 'Check keyboard trap in modal dialogs and contrast levels.', 'low', 'done', '2026-07-10', 3, 3);
