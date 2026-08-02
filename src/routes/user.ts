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
    const { username, phone, email, role = 'student' } = req.body;

    // Check existing user
    const existingUser = await db.execute({
      sql: `
        SELECT *
        FROM users
        WHERE phone = ? OR email = ?
        LIMIT 1
      `,
      args: [phone || null, email || null],
    });

    if (existingUser.rows.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'User already exists.',
        data: existingUser.rows[0],
      });
    }

    // Create user
    const result = await db.execute({
      sql: `
        INSERT INTO users (username, phone, email, role)
        VALUES (?, ?, ?, ?)
      `,
      args: [username, phone || null, email || null, role],
    });

    const id = Number(result.lastInsertRowid);
    const userId = `M_${10000 + id}`;

    await db.execute({
      sql: `UPDATE users SET user_id = ? WHERE id = ?`,
      args: [userId, id],
    });

    const user = await db.execute({
      sql: `SELECT * FROM users WHERE id = ?`,
      args: [id],
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
