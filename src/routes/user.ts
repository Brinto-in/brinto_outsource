import { Router } from 'express';
import db from '../lib/db.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

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
      return res.status(200).json({
        success: true,
        message: 'User already exists.',
        data: existingUser.rows[0],
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
      args: [phone, phone, phone, email, role],
    });

    const user = await db.execute({
      sql: `SELECT * FROM users WHERE user_id = ?`,
      args: [userId],
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: user.rows[0],
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
