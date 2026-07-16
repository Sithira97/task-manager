import { describe, it, before, after } from "node:test";
import app from "../src/app.js";
import request from "supertest";
import assert from "node:assert";
import pool from "../src/db/config.js";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_development_key_123!";

describe("Team API Tests", () => {
  let adminId: number;
  let useraId: number;
  let userbId: number;

  let adminToken: string;
  let useraToken: string;
  let userbToken: string;

  let task1Id: number;
  before(async () => {
    await pool.execute("DELETE FROM users WHERE email IN (?, ?, ?)", [
      "admin@test.com",
      "usera@test.com",
      "userb@test.com",
    ]);

    const [adminRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["admin", "admin@test.com", "hashed_password", "admin"],
    );
    const [useraRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["usera", "usera@test.com", "hashed_password", "user"],
    );
    const [userbRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["userb", "userb@test.com", "hashed_password", "user"],
    );

    adminId = adminRes.insertId;
    useraId = useraRes.insertId;
    userbId = userbRes.insertId;

    adminToken = jwt.sign(
      {
        id: adminId,
        username: "admin",
        email: "admin@test.com",
        role: "admin",
      },
      JWT_SECRET,
    );
    useraToken = jwt.sign(
      { id: useraId, username: "usera", email: "usera@test.com", role: "user" },
      JWT_SECRET,
    );
    userbToken = jwt.sign(
      { id: userbId, username: "userb", email: "userb@test.com", role: "user" },
      JWT_SECRET,
    );

    const [taskRes] = await pool.execute<ResultSetHeader>(
      "INSERT INTO tasks (title, description, priority, status, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "Task Team 1",
        "Team 1 details",
        "medium",
        "open",
        "2026-12-31",
        useraId,
      ],
    );
    task1Id = taskRes.insertId;
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

    await pool.end();
  });

  describe("GET /api/team", () => {
    it("should allow User A to see the team details they are part of", async () => {
      const response = await request(app)
        .get("/api/team")
        .set("Authorization", `Bearer ${useraToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.success, true);
      assert.ok(Array.isArray(response.body.data));
      const team = response.body.data.find((t: any) => t.id === task1Id);
      assert.ok(team);
      assert.strictEqual(team.title, "Task Team 1");
      assert.strictEqual(team.team_lead.user_id, useraId);
    });

    it("should not show the team to User B who is not part of the team", async () => {
      const response = await request(app)
        .get("/api/team")
        .set("Authorization", `Bearer ${userbToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.success, true);
      assert.ok(Array.isArray(response.body.data));
      const team = response.body.data.find((t: any) => t.id === task1Id);
      assert.strictEqual(team, undefined);
    });

    it("should allow Admin to see all teams", async () => {
      const response = await request(app)
        .get("/api/team")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.strictEqual(response.body.success, true);
      assert.ok(Array.isArray(response.body.data));
      const team = response.body.data.find((t: any) => t.id === task1Id);
      assert.ok(team);
    });

    it("should return 401 Unauthorized if authorization token is missing", async () => {
      const response = await request(app)
        .get("/api/team")
        .expect("Content-Type", /json/)
        .expect(401);

      assert.strictEqual(response.body.error, "Authentication token required");
    });
  });
});
