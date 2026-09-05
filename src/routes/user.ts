import { Router } from 'express';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js';
import { verifyToken, optionalVerifyToken, AuthRequest, JWT_SECRET } from '../middleware/auth.js';
import { getSessionState } from '../middleware/state.js';

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
      },
    });
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
    const sessionIdHeader = req.get('session_id')?.trim();

    if (typeof state_name !== 'string' || !state_name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'state_name is required.',
      });
    }

    if (sessionIdHeader) {
      const existingSession = await db.execute({
        sql: `
          SELECT id
          FROM user_states
          WHERE session_id = ?
          LIMIT 1
        `,
        args: [sessionIdHeader],
      });

      if (existingSession.rows.length > 0) {
        await db.execute({
          sql: `
            UPDATE user_states
            SET state_name = ?
            WHERE session_id = ?
          `,
          args: [state_name.trim(), sessionIdHeader],
        });

        return res.json({
          success: true,
          session_id: sessionIdHeader,
        });
      }
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
 * Get a state name from a session ID
 * GET /api/user/state-session?session_id=<session-id>
 */
router.get('/state-session', optionalVerifyToken, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.user_id ?? null;
    const sessionId = typeof req.query.session_id === 'string' ? req.query.session_id.trim() : '';

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'session_id query parameter is required.',
      });
    }

    const stateName = await getSessionState(sessionId, userId)
    if (!stateName) {
      return res.status(404).json({
        success: false,
        message: 'Session not found.',
      });
    }

    return res.json({
      success: true,
      state_name: stateName,
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
 * Create a new user
 * POST /api/user/users
 * Body: { username: string, phone: string, email?: string, role?: string }
 */
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
