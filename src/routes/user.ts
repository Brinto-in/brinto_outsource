import { Router } from 'express';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js';
import { verifyToken, optionalVerifyToken, AuthRequest, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

/**
 * Get user details by user_id from token
 * GET /api/user/details
 * Requires: Authorization: Bearer <token>
 */
router.get('/details', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { user_id, user_name } = req.user!;
    res.json({
      success: true,
      data: {
        user_id,
        user_name,
        // ...result.rows[0],
      },
    });

    // Query user details from database
    // const result = await db.execute({
    //   sql: 'SELECT * FROM users WHERE id = ?',
    //   args: [user_id],
    // });

    // if (result.rows.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'User not found',
    //   });
    // }

    // res.json({
    //   success: true,
    //   data: {
    //     user_id,
    //     user_name,
    //     ...result.rows[0],
    //   },
    // });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message,
    });
  }
});

/**
 * Create a state session for the authenticated user
 * POST /api/user/state-session
 * Body: { state_name: string }
 */
router.post('/state-session', optionalVerifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.user_id ?? null;
    const { state_name } = req.body;

    if (typeof state_name !== 'string' || !state_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'state_name is required.',
      });
    }

    const sessionId = randomUUID();

    await db.execute({
      sql: `
        INSERT INTO user_states (user_id, session_id, state_name)
        VALUES (?, ?, ?)
      `,
      args: [userId, sessionId, state_name.trim()],
    });

    return res.status(201).json({
      success: true,
      session_id: sessionId,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create state session.',
      error: error.message,
    });
  }
});

/**
 * Get the authenticated user's state session
 * GET /api/user/state-session?state_name=Odisha
 */
router.get('/state-session', optionalVerifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.user_id ?? null;
    const stateName = typeof req.query.state_name === 'string' ? req.query.state_name.trim() : '';

    if (!stateName) {
      return res.status(400).json({
        success: false,
        message: 'state_name query parameter is required.',
      });
    }

    const result = await db.execute({
      sql: `
        SELECT session_id
        FROM user_states
        WHERE state_name = ?
          AND ((user_id = ?) OR (user_id IS NULL AND ? IS NULL))
        ORDER BY id DESC
        LIMIT 1
      `,
      args: [stateName, userId, userId],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'State session not found.',
      });
    }

    return res.json({
      success: true,
      session_id: result.rows[0].session_id,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch state session.',
      error: error.message,
    });
  }
});

/**
 * Update user profile
 * PUT /api/user/profile
 * Requires: Authorization: Bearer <token>
 */
// router.put('/profile', verifyToken, async (req: AuthRequest, res) => {
//   try {
//     const { user_id } = req.user!;
//     const { name, email, phone } = req.body;

//     // Update user in database
//     const result = await db.execute({
//       sql: 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
//       args: [name, email, phone, user_id],
//     });

//     res.json({
//       success: true,
//       message: 'User profile updated',
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to update user profile',
//       error: error.message,
//     });
//   }
// });


router.post('/users', async (req, res) => {
  try {
    const { username, phone, email = null, role = 'student' } = req.body;

    if (!username || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Username and phone are required.',
      });
    }

    // Check existing user by phone
    const existingUser = await db.execute({
      sql: `SELECT * FROM users WHERE phone = ? LIMIT 1`,
      args: [phone],
    });

    if (existingUser.rows.length > 0) {
      const userVal = existingUser.rows[0];
      const token = jwt.sign(
        { user_id: userVal.user_id, user_name: userVal.username },
        JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.status(200).json({
        success: true,
        message: 'User already exists.',
        token,
        data: userVal,
      });
    }

    // Get next ID
    const nextIdResult = await db.execute({
      sql: `SELECT IFNULL(MAX(id), 0) + 1 AS nextId FROM users`,
    });

    const nextId = Number(nextIdResult.rows[0].nextId);
    const userId = `M_${10000 + nextId}`;

    // Create user
    await db.execute({
      sql: `
        INSERT INTO users (user_id, username, phone, email, role)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [userId, username, phone, email, role],
    });

    const user = await db.execute({
      sql: `SELECT * FROM users WHERE user_id = ?`,
      args: [userId],
    });

    const userVal = user.rows[0];
    const token = jwt.sign(
      { user_id: userVal.user_id, user_name: userVal.username },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      token,
      data: userVal,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create user.',
      error: error.message,
    });
  }
});
export default router;
