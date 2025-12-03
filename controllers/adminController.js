
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

// Register admin
export const registerAdmin = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  // Check if admin already exists
  const checkEmail = "SELECT * FROM admins WHERE email = ?";
  db.query(checkEmail, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (result.length > 0)
      return res.status(400).json({ message: "Admin already exists." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const q = "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";
    db.query(q, [name, email, hashedPassword], (err2) => {
      if (err2) return res.status(500).json({ message: "Error saving admin." });
      res.status(201).json({ message: "Admin registered successfully!" });
    });
  });
};

// Login admin
export const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });

  const q = "SELECT * FROM admins WHERE email = ?";
  db.query(q, [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error." });
    if (result.length === 0)
      return res.status(400).json({ message: "Admin not found. Please register first." });

    const admin = result[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password." });

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({
      message: "Login successful!",
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  });
};