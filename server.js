const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const compression = require("compression");

const app = express();
// enable gzip/deflate compression for responses
app.use(compression());
// app.use(express.static("public"));CSS;
app.use(cors());
app.use(bodyParser.json());
// serve static assets with long cache lifetime (immutable assets should be fingerprinted)
app.use(express.static("public", { maxAge: "7d" }));

// Database Config
const dbConfig = {
  user: "sa",
  password: "franko0145A$",
  server: "FRANKO",
  database: "StudentDB",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Connect to DB
// create a single shared pool promise to avoid reconnect overhead
const poolPromise = sql
  .connect(dbConfig)
  .then((pool) => {
    console.log("✅ Connected to SQL Server");
    return pool;
  })
  .catch((err) => console.error("❌ Database connection failed:", err));

// --- Register ---
app.post("/api/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const pool = await poolPromise;
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("password", sql.NVarChar, hashed)
      .input("role", sql.NVarChar, role)
      .query(
        "INSERT INTO users (username, password, role) VALUES (@username, @password, @role)"
      );
    res.json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Login ---
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("SELECT * FROM users WHERE username = @username");

    const user = result.recordset[0];
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({ success: true, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Fetch Student Results ---
app.get("/api/results/:username", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("username", sql.NVarChar, req.params.username)
      .query("SELECT * FROM results WHERE username = @username");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

/* === ADD RESULT (teacher) === */
app.post("/api/results", async (req, res) => {
  const { username, course, score, grade, teacher } = req.body;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("course", sql.NVarChar, course)
      .input("score", sql.Int, score)
      .input("grade", sql.NVarChar, grade)
      .input("teacher", sql.NVarChar, teacher)
      .query(
        "INSERT INTO results (username, course, score, grade, teacher) VALUES (@username,@course,@score,@grade,@teacher)"
      );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* === LIST ALL RESULTS (admin) === */
app.get("/api/results", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT * FROM results ORDER BY id DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* === DELETE RESULT === */
app.delete("/api/results/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM results WHERE id = @id");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* === LIST USERS (admin) === */
app.get("/api/users", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT id, username, role FROM users ORDER BY id DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* === DELETE USER (admin) === */
app.delete("/api/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .query("DELETE FROM users WHERE username = @username");
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/updateResult", async (req, res) => {
  const { studentId, subject, score } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("studentId", sql.Int, studentId)
      .input("subject", sql.VarChar, subject)
      .input("score", sql.Decimal(5,2), score)
      .query("UPDATE Results SET Score = @score WHERE StudentID = @studentId AND Subject = @subject");

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating result:", err);
    res.status(500).json({ success: false });
  }
});

app.get("/getResults/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input("studentId", sql.Int, req.params.id)
      .query("SELECT Subject, Score, Grade, Semester FROM Results WHERE StudentID = @studentId");

    res.json({ success: true, results: result.recordset });
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ success: false });
  }
});
