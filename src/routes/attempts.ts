import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

/**
 * POST /api/attempts
 * Save a completed test attempt with sections and per-question answers
 */
router.post('/', async (req, res) => {
  try {
    const {
      session_id,
      test_id,
      score,
      correct,
      wrong,
      skipped,
      marked,
      time_taken,
      total_questions,
      sections = [],   // [{ name, correct, wrong, skipped, total }]
      answers = [],   // [{ question_id, selected_option_id, is_correct }]
    } = req.body;

    // ── Validate required fields ──
    if (!session_id || !test_id || score === undefined) {
      return res.status(400).json({
        success: false,
        message: 'session_id, test_id, and score are required.',
      });
    }

    // ── Upsert session (create if first time, update last_seen if returning) ──
    await db.execute({
      sql: `INSERT INTO sessions (id, last_seen)
            VALUES (?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET last_seen = CURRENT_TIMESTAMP`,
      args: [session_id],
    });

    // ── Insert attempt ──
    const attemptResult = await db.execute({
      sql: `INSERT INTO attempts
              (test_id, session_id, score, correct, wrong, skipped,
               marked, time_taken, total_questions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        test_id, session_id, score, correct,
        wrong, skipped, marked, time_taken, total_questions,
      ],
    });

    const attempt_id = Number(attemptResult.lastInsertRowid);

    // ── Insert section breakdown ──
    if (sections.length > 0) {
      const sectionStatements = sections.map((s: any) => ({
        sql: `INSERT INTO attempt_sections
                (attempt_id, section_name, correct, wrong, skipped, total)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [attempt_id, s.name, s.correct, s.wrong, s.skipped, s.total],
      }));
      await db.batch(sectionStatements);
    }

    // ── Insert per-question answers ──
    if (answers.length > 0) {
      const answerStatements = answers.map((a: any) => ({
        sql: `INSERT INTO attempt_answers
                (attempt_id, question_id, selected_option_id, is_correct)
              VALUES (?, ?, ?, ?)`,
        args: [
          attempt_id,
          a.question_id,
          a.selected_option_id ?? null,
          a.is_correct ? 1 : 0,
        ],
      }));
      await db.batch(answerStatements);
    }

    // ── Bump test attempt count ──
    await db.execute({
      sql: 'UPDATE tests SET attempts = attempts + 1 WHERE id = ?',
      args: [test_id],
    });

    return res.json({
      success: true,
      data: { attempt_id },
    });

  } catch (error: any) {
    console.error('Submit attempt error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save attempt.',
      error: error.message,
    });
  }
});

/**
 * GET /api/attempts/:session_id
 * Fetch all attempts for a session (for /results page)
 */
router.get('/:session_id', async (req, res) => {
  try {
    const { session_id } = req.params;

    const result = await db.execute({
      sql: `SELECT a.*, t.title, t.exam, t.slug
            FROM attempts a
            JOIN tests t ON a.test_id = t.id
            WHERE a.session_id = ?
            ORDER BY a.submitted_at DESC`,
      args: [session_id],
    });

    // Attach sections to each attempt
    const attempts = await Promise.all(
      result.rows.map(async (row: any) => {
        const sections = await db.execute({
          sql: 'SELECT * FROM attempt_sections WHERE attempt_id = ?',
          args: [row.id],
        });
        return { ...row, sections: sections.rows };
      })
    );

    return res.json({ success: true, data: attempts });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch attempts.',
      error: error.message,
    });
  }
});

export default router;