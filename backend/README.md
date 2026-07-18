# ⚙️ Task Manager Backend

A robust, secure, and production-ready RESTful API server powering the Team Task Management System. Built using Node.js, Express, and TypeScript, it utilizes MySQL for relational data persistence, implements JWT-based state protection, and supports comprehensive unit/integration tests.

---

## 🛠️ Architecture & Core Components

- **Express v5 Routing**: Designed around modular routing layers mapping Auth, Tasks, and Team resources.
- **JWT Protection Middleware**: Implements [auth.ts](file:///Volumes/Data/Work/task-manager/backend/src/middleware/auth.ts) middleware for authentication, parsing bearer tokens, and attaching user details to requests.
- **Admin Restriction guards**: Employs `requireAdmin` helper filters for critical endpoints such as global stats and permanent database records purge.
- **Safe Queries**: Executes SQL prepared statements using `mysql2/promise` to prevent SQL injection vulnerabilities.
- **Centralized Error Handler**: Handles runtime exceptions globally, returning standardized JSON payloads.

---

## ⚙️ Environment Configurations

Configure settings by copying [backend/.env.example](file:///Volumes/Data/Work/task-manager/backend/.env.example) to `.env`:

| Parameter      | Type    | Default             | Description                                      |
| -------------- | ------- | ------------------- | ------------------------------------------------ |
| `HOST`         | String  | `localhost`         | Server host address                              |
| `PORT`         | Number  | `3001`              | Server listening port                            |
| `DB_HOST`      | String  | `localhost`         | MySQL database host address                      |
| `DB_PORT`      | Number  | `3306`              | MySQL database connection port                   |
| `DB_USER`      | String  | `root`              | Database username                                |
| `DB_PASSWORD`  | String  | _None_              | Database password                                |
| `DB_NAME`      | String  | `task_manager`      | Development database name                        |
| `IS_TESTING`   | Boolean | `false`             | Set to `true` when running test configurations   |
| `DB_NAME_TEST` | String  | `task_manager_test` | Testing database name                            |
| `JWT_SECRET`   | String  | _Required_          | Encryption key used for signing JWT login tokens |

---

## 🗄️ Database Setup

The database requires MySQL. Migrations and seeds are compiled dynamically using `tsx` at runtime:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Execute Migrations**: Drops existing schemas (in both dev & test environments) and recreates tables with optimized indices.
   ```bash
   npx tsx src/db/migrate.ts
   ```
3. **Execute Data Seeding**: Populates development database tables with 20 mock users, 50 tasks, and randomized assignees.
   ```bash
   npx tsx src/db/seed.ts
   ```

---

## 📡 API Reference & Payload Specifications

### 🔑 Authentication & Users

#### 1. Register User

- **Route**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "username": "jane_doe",
    "email": "jane@taskmanager.com",
    "password": "securepassword123",
    "role": "user" // Optional, default is "user" (or "admin")
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 2,
      "username": "jane_doe",
      "email": "jane@taskmanager.com",
      "role": "user"
    }
  }
  ```

#### 2. User Login

- **Route**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@taskmanager.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "id": 2,
      "username": "jane_doe",
      "email": "jane@taskmanager.com",
      "role": "user"
    }
  }
  ```

#### 3. List All Users

- **Route**: `GET /api/auth/users`
- **Access**: Authenticated User
- **Response (200 OK)**:
  - Users see: `[{ "id": 1, "username": "jane_doe" }]`
  - Admins see detailed profile outputs: `[{ "id": 1, "username": "jane_doe", "email": "jane@taskmanager.com", "role": "user" }]`

#### 4. Get User Profile by ID

- **Route**: `GET /api/auth/users/:id`
- **Access**: Admin only
- **Response (200 OK)**:
  ```json
  {
    "id": 2,
    "username": "jane_doe",
    "email": "jane@taskmanager.com",
    "role": "user"
  }
  ```

#### 5. Admin Dashboard Statistics

- **Route**: `GET /api/auth/dashboard/stats`
- **Access**: Admin only
- **Response (200 OK)**:
  ```json
  {
    "message": "Dashboard stats fetched successfully",
    "stats": {
      "total": 50,
      "byStatus": { "open": 20, "in_progress": 15, "done": 15 },
      "overdue": 3
    }
  }
  ```

---

### 📋 Tasks

#### 1. Create a Task

- **Route**: `POST /api/tasks`
- **Access**: Authenticated User
- **Request Body**:
  ```json
  {
    "title": "Design Database Schema",
    "description": "Create MySQL tables for teams and tasks",
    "priority": "high", // Optional: 'low' | 'medium' (default) | 'high'
    "status": "open", // Optional: 'open' (default) | 'in_progress' | 'done'
    "due_date": "2026-08-31",
    "assignees": [2, 3] // Optional array of User IDs to assign
  }
  ```

#### 2. Get All Tasks

- **Route**: `GET /api/tasks`
- **Access**: Authenticated User (retrieves self-created or assigned tasks; Admin retrieves all)
- **Query Parameters**:
  - `page` (default: `1`)
  - `limit` (default: `1000`)
  - `search` (filters by matching query in title or description)
  - `status` (filters by status value: `open`, `in_progress`, `done`)
  - `priority` (filters by priority: `low`, `medium`, `high`)
  - `timeframe` (filters by updates: `week` or `month`)

#### 3. Get Task Details by ID

- **Route**: `GET /api/tasks/:id`
- **Access**: Creator, Assignee, or Admin

#### 4. Update Task Details

- **Route**: `PUT /api/tasks/:id`
- **Access**: Creator or Admin (Full edit); Assignee (Status-only edit)
- **Request Body**: (Optional fields to edit)
  ```json
  {
    "title": "New Title",
    "description": "New description",
    "priority": "low",
    "status": "in_progress",
    "due_date": "2026-09-10",
    "assignees": [1, 2, 4]
  }
  ```

#### 5. Update Task Status

- **Route**: `PATCH /api/tasks/:id/status`
- **Access**: Creator, Assignee, or Admin
- **Request Body**:
  ```json
  {
    "status": "done" // 'open' | 'in_progress' | 'done'
  }
  ```

#### 6. Update Task Priority

- **Route**: `PATCH /api/tasks/:id/priority`
- **Access**: Creator or Admin
- **Request Body**:
  ```json
  {
    "priority": "high" // 'low' | 'medium' | 'high'
  }
  ```

#### 7. Soft Delete Task

- **Route**: `DELETE /api/tasks/:id`
- **Access**: Creator or Admin
- **Response**: Sets `deleted_at` timestamp. Regular users will no longer see it.

#### 8. Permanent (Force) Delete Task

- **Route**: `DELETE /api/tasks/:id/force`
- **Access**: Admin only
- **Response**: Deletes the record permanently from database.

---

### 👥 Teams

#### 1. Get Collaborator and Lead Tasks Grouped by User

- **Route**: `GET /api/team`
- **Access**: Authenticated User
- **Response (200 OK)**:
  Returns user profiles and lists of tasks where the current user is team lead or collaborator.

#### 2. Get Team Details of a Specific Task

- **Route**: `GET /api/team/task/:id`
- **Access**: Authenticated User

#### 3. Get Task Groupings by User

- **Route**: `GET /api/team/user`
- **Access**: Authenticated User

---

## 🧪 Testing and Quality Control

The backend includes automated integration test suites built on top of Node's built-in testing harness and `supertest`.

### Run Test Suites

1. Configure `DB_NAME_TEST` database inside `.env`.
2. Run migrations for test database structures:
   ```bash
   IS_TESTING=true npx tsx src/db/migrate.ts
   ```
3. Run test suites:
   ```bash
   npm run test
   ```

### Tested Components

- **API Status checks**: Verifies `/health` endpoint output.
- **Auth Flow**: Verifies validation handling, passwords hashing, unique logins, and JWT parsing.
- **Tasks Operations**: Tests listing boundaries, task creation, authorization scopes, updates, soft deletion, and permanent deletion restrictions.
- **Teams Collaborations**: Verifies tasks isolation rules and teams groupings.

---

## 📁 Key Files & Directories

- [server.ts](./src/server.ts) : Entrypoint starting Express server listener.
- [app.ts](./src/app.ts) : Main application logic registering routing tables.
- [config.ts](./src/db/config.ts) : MySQL connections pool configurations.
- [migrate.ts](./src/db/migrate.ts) : Database structure setup script.
- [seed.ts](./src/db/seed.ts) : Seeding script creating development datasets.
- [queries.ts](./src/db/queries.ts) : Relational queries definitions.
- [test/](./test) : Test folder with `auth.test.ts`, `task.test.ts`, `team.test.ts`, and `app.test.ts`.
