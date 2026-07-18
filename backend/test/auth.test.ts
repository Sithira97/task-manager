// backend/test/auth.test.ts

import { describe, it, before, after } from "node:test";
import app from "../src/app.js";
import request from "supertest";
import assert from "node:assert";
import pool from "../src/db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import { User } from "../src/types/index.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_development_key_123!";

describe("Auth API Tests", () => {
  const testUser = {
    email: "testuser@example.com",
    password: "password1",
    username: "Test User",
  };

  const testAdmin = {
    email: "testadmin@example.com",
    password: "password2",
    username: "Test Admin",
  };

  describe("POST /api/auth/register", () => {
    let newUserId: number;
    before(async () => {
      await pool.execute("DELETE FROM users WHERE email = ?", [testUser.email]);
    });

    it("should return 201 Created on the register endpoint", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect("Content-Type", /json/)
        .expect(201);

      assert.ok(response.body.token);
      assert.ok(response.body.user);
      assert.strictEqual(response.body.user.email, testUser.email);
      assert.strictEqual(response.body.user.username, testUser.username);
      newUserId = response.body.user.id;
    });

    it("should throw error for existing user register endpoint", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect("Content-Type", /json/)
        .expect(409);

      assert.strictEqual(
        response.body.error,
        "Username or email already in use",
      );
    });

    after(async () => {
      await pool.execute("DELETE FROM users WHERE id = ?", [newUserId]);
    });
  });

  describe("POST /api/auth/login", () => {
    let newUserId: number;
    before(async () => {
      await pool.execute("DELETE FROM users WHERE email = ?", [testUser.email]);
      const [res] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
        [
          testUser.email,
          await bcrypt.hash(testUser.password, 10),
          testUser.username,
        ],
      );
      newUserId = res.insertId;
    });

    it("should return 200 OK on the login endpoint", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect("Content-Type", /json/)
        .expect(200);
      assert.ok(response.body.token);
      assert.ok(response.body.user);
      assert.strictEqual(response.body.user.email, testUser.email);
    });

    it("should throw error for invalid password login endpoint", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testAdmin.password + "wrong",
        })
        .expect("Content-Type", /json/)
        .expect(401);

      assert.strictEqual(response.body.error, "Invalid email or password");
    });

    it("should throw error for invalid email login endpoint", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testAdmin.email,
          password: testUser.password,
        })
        .expect("Content-Type", /json/)
        .expect(401);

      assert.strictEqual(response.body.error, "Invalid email or password");
    });

    after(async () => {
      await pool.execute("DELETE FROM users WHERE id = ?", [newUserId]);
    });
  });

  describe("GET /api/auth/users and /api/auth/users/:id", () => {
    let adminId: number;
    let regularUserId: number;
    let adminToken: string;
    let regularUserToken: string;

    before(async () => {
      await pool.execute("DELETE FROM users WHERE email IN (?, ?)", [
        testAdmin.email,
        testUser.email,
      ]);

      const [adminRes] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [testAdmin.username, testAdmin.email, testAdmin.password, "admin"],
      );
      const [regRes] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [testUser.username, testUser.email, testUser.password, "user"],
      );

      adminId = adminRes.insertId;
      regularUserId = regRes.insertId;

      adminToken = jwt.sign(
        {
          id: adminId,
          username: testAdmin.username,
          email: testAdmin.email,
          role: "admin",
        },
        JWT_SECRET,
      );
      regularUserToken = jwt.sign(
        {
          id: regularUserId,
          username: testUser.username,
          email: testUser.email,
          role: "user",
        },
        JWT_SECRET,
      );
    });

    it("should allow admin and non-admin to get all users", async () => {
      const response = await request(app)
        .get("/api/auth/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(Array.isArray(response.body.users));
      assert.ok(response.body.users.length >= 2);
      assert.ok(response.body.users.find((user: User) => !!user.role));
    });

    it("should allow admin to get a user by ID", async () => {
      const response = await request(app)
        .get(`/api/auth/users/${regularUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect("Content-Type", /json/)
        .expect(200);

      assert.ok(response.body.user);
      assert.strictEqual(response.body.user[0].id, regularUserId);
      assert.strictEqual(response.body.user[0].username, testUser.username);
    });

    it("should block non-admin from getting a user by ID", async () => {
      const response = await request(app)
        .get(`/api/auth/users/${regularUserId}`)
        .set("Authorization", `Bearer ${regularUserToken}`)
        .expect("Content-Type", /json/)
        .expect(403);

      assert.strictEqual(
        response.body.error,
        "Access denied: Admin privileges required",
      );
    });

    after(async () => {
      await pool.execute("DELETE FROM users WHERE id IN (?, ?)", [
        adminId,
        regularUserId,
      ]);
    });
  });

  after(async () => {
    await pool.end();
  });
});
