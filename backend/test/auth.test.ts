import { describe, it, before, after } from "node:test";
import app from "../src/app.js";
import request from "supertest";
import assert from "node:assert";
import pool from "../src/db/config.js";
import bcrypt from "bcrypt";

const testUser = {
  email: "testuser@example.com",
  password: "password",
  username: "Test User",
};

describe("POST /api/auth/register", () => {
  before(async () => {
    await pool.execute("DELETE FROM users WHERE email = ? OR username = ?", [
      testUser.email,
      testUser.username,
    ]);
  });

  after(async () => {
    await pool.execute("DELETE FROM users WHERE email = ? OR username = ?", [
      testUser.email,
      testUser.username,
    ]);
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
  });
});

describe("POST /api/auth/login", () => {
  before(async () => {
    await pool.execute(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [
        testUser.email,
        await bcrypt.hash(testUser.password, 10),
        testUser.username,
      ],
    );
  });

  after(async () => {
    await pool.execute("DELETE FROM users WHERE email = ? AND username = ?", [
      testUser.email,
      testUser.username,
    ]);
  });

  it("should return 200 OK on the login endpoint", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "password",
      })
      .expect("Content-Type", /json/)
      .expect(200);
    assert.ok(response.body.token);
    assert.ok(response.body.user);
    assert.strictEqual(response.body.user.email, "testuser@example.com");
  });
});

after(async () => {
  await pool.end();
});
