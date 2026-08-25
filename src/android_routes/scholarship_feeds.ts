import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/scholarships/education-levels', async (_req, res) => {
	try {
		const result = await db.execute(
			'SELECT id, name FROM education_levels WHERE is_active = 1 ORDER BY display_order ASC',
		)

		res.json({
			levels: result.rows,
		})
	} catch (error: any) {
		res.status(500).json({
			message: 'Failed to fetch education levels',
			error: error.message,
		})
	}
})

export default router
