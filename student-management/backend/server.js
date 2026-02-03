const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "student_management",
  waitForConnections: true,
  connectionLimit: 10,
});

const requireAuth = (roles = []) => async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const connection = await pool.getConnection();
  try {
    const [[roleRow]] = await connection.query("SELECT id FROM roles WHERE name = ?", [role]);
    if (!roleRow) {
      return res.status(400).json({ message: "Invalid role" });
    }
    await connection.query(
      "INSERT INTO users (role_id, email, password_hash) VALUES (?, ?, ?)",
      [roleRow.id, email, passwordHash]
    );
    return res.status(201).json({ message: "User registered" });
  } finally {
    connection.release();
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const connection = await pool.getConnection();
  try {
    const [[user]] = await connection.query(
      "SELECT users.id, users.password_hash, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "8h" }
    );

    return res.json({ token, role: user.role });
  } finally {
    connection.release();
  }
});

app.get("/api/students", requireAuth(["Admin", "Teacher"]), async (req, res) => {
  const [rows] = await pool.query(
    "SELECT student_code, full_name, grade, guardian_name, guardian_phone, status FROM students ORDER BY created_at DESC"
  );
  res.json(rows);
});

app.post("/api/attendance", requireAuth(["Teacher"]), async (req, res) => {
  const { studentId, courseId, attendanceDate, status } = req.body;
  if (!studentId || !courseId || !attendanceDate || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  await pool.query(
    "INSERT INTO attendance (student_id, course_id, attendance_date, status, marked_by) VALUES (?, ?, ?, ?, ?)",
    [studentId, courseId, attendanceDate, status, req.user.userId]
  );
  res.status(201).json({ message: "Attendance saved" });
});

app.post("/api/marks", requireAuth(["Teacher"]), async (req, res) => {
  const { studentId, courseId, assessmentTitle, score, grade } = req.body;
  if (!studentId || !courseId || !assessmentTitle || score === undefined) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  await pool.query(
    "INSERT INTO marks (student_id, course_id, assessment_title, score, grade) VALUES (?, ?, ?, ?, ?)",
    [studentId, courseId, assessmentTitle, score, grade]
  );
  res.status(201).json({ message: "Marks uploaded" });
});

app.get("/api/student/profile", requireAuth(["Student"]), async (req, res) => {
  const [rows] = await pool.query(
    "SELECT student_code, full_name, grade, guardian_name, guardian_phone FROM students WHERE user_id = ?",
    [req.user.userId]
  );
  res.json(rows[0] || null);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Student Management API running on port ${PORT}`);
});
