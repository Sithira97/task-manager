# Task Manager Backend

## Routes

| Route               | Method | URL                          |
| ------------------- | ------ | ---------------------------- |
| Check server status | GET    | http://localhost:3001/health |

---

**Authentication**

| Authentication | Method | URL                                     |
| -------------- | :----: | --------------------------------------- |
| Register User  |  POST  | http://localhost:3001/api/auth/register |
| Login User     |  POST  | http://localhost:3001/api/auth/login    |

---

**Tasks**

| Tasks                | Method | URL                                          |
| -------------------- | :----: | -------------------------------------------- |
| Create Task          |  POST  | http://localhost:3001/api/tasks              |
| Get All Tasks        |  GET   | http://localhost:3001/api/tasks              |
| Get Task by ID       |  GET   | http://localhost:3001/api/tasks/:id          |
| Update Task          |  PUT   | http://localhost:3001/api/tasks/:id          |
| Delete Task          | DELETE | http://localhost:3001/api/tasks/:id          |
| Update Task Status   | PATCH  | http://localhost:3001/api/tasks/status/:id   |
| Update Task Priority | PATCH  | http://localhost:3001/api/tasks/priority/:id |
