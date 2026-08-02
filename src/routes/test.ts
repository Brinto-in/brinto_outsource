import { Router } from 'express';
import db from '../lib/db.js';

const router = Router();

/**
 * Basic health check endpoint
 * GET /api/test
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Test route is working perfectly!',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Database connection check endpoint
 * GET /api/test/db
 */
router.get('/db', async (req, res) => {
  try {
    const result = await db.execute({
      sql: 'SELECT 1 + 1 AS result',
    });
    res.json({
      success: true,
      message: 'Database connection successful!',
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

/**
 * Fetch test details and questions by slug
 * GET /api/test/:slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db.execute({
      sql: 'SELECT * FROM tests WHERE slug = ? LIMIT 1',
      args: [slug],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    const test = {
      id: result.rows[0].id as number,
      title: result.rows[0].title as string,
      exam: result.rows[0].exam as string,
      questions: result.rows[0].questions as number,
      duration: result.rows[0].duration as number,
      difficulty: result.rows[0].difficulty as 'Easy' | 'Medium' | 'Hard',
      attempts: result.rows[0].attempts as number,
      rating: result.rows[0].rating as number,
      href: result.rows[0].href as string,
      isNew: !!result.rows[0].is_new,
      isFree: !!result.rows[0].is_free,
    };

    // Fetch questions and options directly
    const questionsAndOptionsResult = await db.execute({
      sql: `
        SELECT
          q.id as question_id,
          q.section,
          q.text as question_text,
          q.explanation,
          o.id as option_id,
          o.text as option_text,
          o.is_correct
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.test_id = ?
        ORDER BY q.id, o.id;
      `,
      args: [test.id],
    });

    const questionsMap = new Map();
    for (const row of questionsAndOptionsResult.rows) {
      const qId = row.question_id as number;
      if (!questionsMap.has(qId)) {
        questionsMap.set(qId, {
          id: qId,
          section: row.section,
          text: row.question_text,
          explanation: row.explanation,
          options: [],
          correct: -1,
        });
      }
      const question = questionsMap.get(qId);
      question.options.push(row.option_text);
      if (row.is_correct) {
        question.correct = question.options.length - 1;
      }
    }
    const questionsData = Array.from(questionsMap.values());

    return res.json({
      success: true,
      data: {
        test,
        questions: questionsData,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve test data',
      error: error.message,
    });
  }
});

export default router;
