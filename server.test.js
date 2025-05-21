const request = require("supertest");
const app = require("./server");

describe("Task Manager API", () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Register a test user
    await request(app).post("/register").send({ email: "test@example.com", password: "password123" });

    // Login to get token
    const loginRes = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    token = loginRes.body.token;
    userId = loginRes.body.userId;
  });

  test("User can register", async () => {
    const res = await request(app)
      .post("/register")
      .send({ email: "newuser@example.com", password: "password" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered.");
  });

  test("User can login", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Fails to login with incorrect password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid email or password.");
  });

  test("Fetch tasks (initially empty)", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("User can add a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Task", description: "Test description" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Task created.");
  });

  test("User can fetch tasks after adding", async () => {
    const res = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe("New Task");
  });
});
