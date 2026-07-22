import { Router } from "express";
import db from "../lib/db.js";

const router = Router();

/**
 * Example: Get all users from Turso
 * GET /api/users
 */
router.get("/users", async (req, res) => {
  try {
    const result = await db.execute("SELECT * FROM users LIMIT 10");
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});

/**
 * Example: Create a new user in Turso
 * POST /api/users
 */
router.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });
    }

    const result = await db.execute({
      sql: "INSERT INTO users (name, email) VALUES (?, ?)",
      args: [name, email],
    });

    res.json({
      success: true,
      message: "User created",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});

export default router;
