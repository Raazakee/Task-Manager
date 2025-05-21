const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret in production

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database at ./tasks.db");
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table ensured.");
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'medium',
      deadline TEXT,
      completed INTEGER DEFAULT 0,
      user_id INTEGER
    )`,
    (err) => {
      if (err) {
        console.error("Error creating tasks table:", err.message);
      } else {
        console.log("Tasks table ensured.");
      }
    }
  );
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Task Manager API!");
});

// User Registration
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;
    db.run(sql, [email, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "Email already exists." });
        }
        console.error("Error registering user:", err.message);
        return res.status(500).json({ error: "Database error." });
      }
      res.status(201).json({ message: "User registered successfully." });
    });
  } catch (error) {
    console.error("Error hashing password:", error.message);
    res.status(500).json({ error: "Server error." });
  }
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;
  db.get(sql, [email], async (err, user) => {
    if (err) {
      console.error("Error fetching user:", err.message);
      return res.status(500).json({ error: "Database error." });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });

      res.status(200).json({ token, userId: user.id });
    } catch (error) {
      console.error("Error validating password:", error.message);
      res.status(500).json({ error: "Server error." });
    }
  });
});

// Middleware for token verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token missing." });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token." });
    }
    req.user = user;
    next();
  });
};

// Fetch tasks for the authenticated user
app.get("/tasks", authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) {
      console.error("Error fetching tasks:", err.message);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(200).json(rows);
  });
});

// Add a new task for the authenticated user
app.post("/tasks", authenticateToken, (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  const sql = `
    INSERT INTO tasks (title, description, priority, deadline, user_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.run(sql, [title, description, priority || "medium", deadline || null, userId], function (err) {
    if (err) {
      console.error("Error adding task:", err.message);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(201).json({ id: this.lastID, message: "Task added successfully." });
  });
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, priority, deadline, completed } = req.body;

  const sql = `UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ?, completed = ? WHERE id = ?`;
  const values = [title, description, priority, deadline, completed, id];

  db.run(sql, values, function (err) {
    if (err) {
      console.error("Error updating task:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json({ id, title, description, priority, deadline, completed });
  });
});
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Received Authorization Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access token missing." });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token." });
    }
    req.userId = decoded.userId;
    next();
  });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access token missing." });
  }

  try {
    const tokenWithoutBearer = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenWithoutBearer, "your-secret-key");
    req.user = decoded;  // Attach the decoded token to the request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token." });
  }
};

// Sample route to get tasks
app.get("/tasks", verifyToken, async (req, res) => {
  const userId = req.query.userId;
  // Replace with your actual database logic to fetch tasks by userId
  const tasks = await getTasksForUser(userId);  // Replace with your DB query
  res.json(tasks);
});


// Task delete route (DELETE)
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM tasks WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error("Error deleting task:", err.message);
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  });
 
  
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

