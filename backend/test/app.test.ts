import { describe, it, after } from "node:test";
import app from "../src/app.js";
import request from "supertest";
import assert from "node:assert";
import pool from "../src/db/config.js";

describe("GET /health", () => {
  after(async () => {
    await pool.end();
  });

  it("should return 200 OK on the health endpoint", async () => {
    const response = await request(app)
      .get("/health")
      .expect("Content-Type", /json/)
      .expect(200);
    assert.strictEqual(response.body.status, "OK");
  });
});
