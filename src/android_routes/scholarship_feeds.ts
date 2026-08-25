import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/scholarships/education-levels', async (_req, res) => {
	try {
		const result = await db.execute(
			'SELECT * FROM education_levels ORDER BY display_order ASC',
		)
		const levels = result.rows.map((row) => {
			const educationLevel = row as Record<string, unknown>

			return {
				key: educationLevel.key ?? educationLevel.level_key ?? educationLevel.level ?? educationLevel.slug,
				label: educationLevel.label ?? educationLevel.level_label ?? educationLevel.name ?? educationLevel.display_name,
			}
		})

		res.json({
			levels,
		})
	} catch (error: any) {
		res.status(500).json({
			message: 'Failed to fetch education levels',
			error: error.message,
		})
	}
})

export default router
