// backend/test/task.test.ts

import { describe, it, before, after } from "node:test";
import app from "../src/app.js";
import request from "supertest";
import assert from "node:assert";
import pool from "../src/db/config.js";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_development_key_123!";

describe("Task API Tests", () => {
  let adminId: number;
  let useraId: number;
  let userbId: number;

  let adminToken: string;
  let useraToken: string;
  let userbToken: string;

  let task1Id: number;

  before(async () => {
    const usernames = ["admin_task", "usera_task", "userb_task"];
    const emails = [
      "admin@task-test.com",
      "usera@task-test.com",
      "userb@task-test.com",
    ];

    const [existing] = await pool.query<any[]>(
      "SELECT id FROM users WHERE email IN (?)",
      [emails],
    );
    const staleIds = existing.map((u: any) => u.id);

    if (staleIds.length) {
      await pool.query("DELETE FROM assignees WHERE user_id IN (?)", [
        staleIds,
      ]);
      await pool.query("DELETE FROM tasks WHERE created_by IN (?)", [staleIds]);
      await pool.query("DELETE FROM users WHERE id IN (?)", [staleIds]);
    }

    const [adminRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [usernames[0], emails[0], "hashed_password", "admin"],
    );
    const [useraRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [usernames[1], emails[1], "hashed_password", "user"],
    );
    const [userbRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [usernames[2], emails[2], "hashed_password", "user"],
    );

    adminId = adminRes.insertId;
    useraId = useraRes.insertId;
    userbId = userbRes.insertId;

    adminToken = jwt.sign(
      {
        id: adminId,
        username: usernames[0],
        email: emails[0],
        role: "admin",
      },
      JWT_SECRET,
    );
    useraToken = jwt.sign(
      { id: useraId, username: usernames[1], email: emails[1], role: "user" },
      JWT_SECRET,
    );
    userbToken = jwt.sign(
      { id: userbId, username: usernames[2], email: emails[2], role: "user" },
      JWT_SECRET,
    );
  });

  after(async () => {
    if (task1Id) {
      await pool.execute("DELETE FROM assignees WHERE task_id = ?", [task1Id]);
    }
    await pool.execute("DELETE FROM assignees WHERE user_id IN (?, ?, ?)", [
      adminId,
      useraId,
      userbId,
    ]);

    await pool.execute("DELETE FROM tasks WHERE created_by IN (?, ?, ?)", [
      adminId,
      useraId,
      userbId,
    ]);

    await pool.execute("DELETE FROM users WHERE id IN (?, ?, ?)", [
      adminId,
      useraId,
      userbId,
    ]);
  });

  describe("POST /api/tasks (Create Task)", () => {
    it("should create a new task successfully with creator as User A", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${useraToken}`)
        .send({
          title: "Test Task 1",
          description: "This is test task 1 description",
          priority: "high",
          status: "open",
          due_date: "2026-12-31",
        })
        .expect("Content-Type", /json/)
        .expect(201);

      assert.strictEqual(response.body.message, "Task created successfully");
      assert.ok(response.body.task);
      assert.strictEqual(response.body.task.title, "Test Task 1");
      assert.strictEqual(response.body.task.created_by.user_id, useraId);

      task1Id = response.body.task.id;
    });

    it("should return 400 Bad Request if required fields are missing", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Authorization", `Bearer ${useraToken}`)
        .send({
          title: "Incomplete Task",
        })
        .expect("Content-Type", /json/)
        .expect(400);

      assert.strictEqual(
        response.body.error,
        "Title, description, and due date are required",
      );
    });

    it("should return 401 Unauthorized if authorization header is missing", async () => {
      await request(app)
        .post("/api/tasks")
        .send({
          title: "Unauthorized Task",
          description: "Desc",
          due_date: "2026-12-31",
        })
        .expect("Content-Type", /json/)
        .expect(401);
    });
  });

  describe("GET /api/tasks (Get Tasks List)", () => {
    it("should allow User A to see the task they created", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${useraToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(Array.isArray(response.body.tasks));
      const myTask = response.body.tasks.find((t: any) => t.id === task1Id);
      assert.ok(myTask);
      assert.strictEqual(myTask.title, "Test Task 1");
    });

    it("should not show User A's task to User B (since User B is not assigned)", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${userbToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(Array.isArray(response.body.tasks));
      const myTask = response.body.tasks.find((t: any) => t.id === task1Id);
      assert.strictEqual(myTask, undefined);
    });

    it("should allow Admin to see all tasks including User A's task", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(Array.isArray(response.body.tasks));
      const myTask = response.body.tasks.find((t: any) => t.id === task1Id);
      assert.ok(myTask);
    });
  });

  describe("GET /api/tasks/:id (Get Task by ID)", () => {
    it("should allow User A to retrieve their own task details", async () => {
      const response = await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${useraToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.task.id, task1Id);
      assert.strictEqual(response.body.task.title, "Test Task 1");
    });

    it("should block User B from retrieving User A's task details", async () => {
      const response = await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${userbToken}`)
        .expect("Content-Type", /json/)
        .expect(403);

      assert.strictEqual(
        response.body.error,
        "Access denied: Unauthorized view",
      );
    });

    it("should allow Admin to retrieve User A's task details", async () => {
      const response = await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.task.id, task1Id);
    });
  });

  describe("PUT /api/tasks/:id (Update Task)", () => {
    it("should allow User A (creator) to update all fields of the task", async () => {
      const response = await request(app)
        .put(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${useraToken}`)
        .send({
          title: "Updated Task Title by A",
          description: "Updated description",
          priority: "medium",
          status: "in_progress",
        })
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.task.title, "Updated Task Title by A");
      assert.strictEqual(response.body.task.priority, "medium");
      assert.strictEqual(response.body.task.status, "in_progress");
    });

    it("should deny User B from updating User A's task", async () => {
      const response = await request(app)
        .put(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${userbToken}`)
        .send({
          title: "Hacked Title",
        })
        .expect("Content-Type", /json/)
        .expect(403);

      assert.strictEqual(
        response.body.error,
        "Access denied: Unauthorized update",
      );
    });
  });

  describe("PATCH /api/tasks/:id/status (Update Status)", () => {
    it("should allow User A (creator) to update the task status", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${task1Id}/status`)
        .set("Authorization", `Bearer ${useraToken}`)
        .send({ status: "done" })
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.task.status, "done");
    });
  });

  describe("DELETE /api/tasks/:id (Delete Task)", () => {
    it("should allow User A (creator) to soft delete the task", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${useraToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.message, "Task deleted successfully");
    });

    it("should exclude soft deleted tasks from standard get list for non-admins", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${useraToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      const myTask = response.body.tasks.find((t: any) => t.id === task1Id);
      assert.strictEqual(myTask, undefined);
    });

    it("should allow Admin to hard delete the task from the database", async () => {
      const response = await request(app)
        .delete(`/api/tasks/${task1Id}/force`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);
      assert.strictEqual(
        response.body.message,
        "Task permanently deleted successfully",
      );
    });

    it("should return 404 for task operations on permanently deleted task", async () => {
      await request(app)
        .get(`/api/tasks/${task1Id}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(404);
    });
  });

  after(async () => {
    await pool.end();
  });
});
