import { app } from "@/app.js";
import { connectDatabase, disconnectDatabase } from "@/lib/mongoose.js";
import mongoose from "mongoose";
import request from "supertest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await connectDatabase();
    await app.ready();
  }, 30000);

  beforeEach(async () => {
    await mongoose.connection.db?.collection("users").deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await disconnectDatabase();
  }, 30000);

  afterEach(async () => {
    await mongoose.connection.db?.collection("users").deleteMany({});
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
  });

  it("shoud not be able to register with existing email", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const response = await request(app.server).post("/users").send({
      name: "Jane Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    expect(response.status).toBe(409);
  });
});
