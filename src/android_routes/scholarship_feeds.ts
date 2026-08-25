import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/scholarships/providers', async (req, res) => {
	try {
		const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
		const pageValue = typeof req.query.page === 'string' ? Number.parseInt(req.query.page, 10) : 1
		const limitValue = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 50
		const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
		const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 50
		const searchCondition = query ? ' AND LOWER(name) LIKE LOWER(?)' : ''
		const searchArgs = query ? [`%${query}%`] : []

		const [countResult, providersResult] = await Promise.all([
			db.execute({
				sql: `SELECT COUNT(*) AS total FROM scholarship_providers WHERE is_active = 1${searchCondition}`,
				args: searchArgs,
			}),
			db.execute({
				sql: `SELECT id, name, description, website, logo, is_active
					FROM scholarship_providers
					WHERE is_active = 1${searchCondition}
					ORDER BY id ASC
					LIMIT ? OFFSET ?`,
				args: [...searchArgs, limit, (page - 1) * limit],
			}),
		])

		res.json({
			meta: {
				total: Number(countResult.rows[0]?.total ?? 0),
				page,
				limit,
			},
			providers: providersResult.rows,
		})
	} catch (error: any) {
		res.status(500).json({
			message: 'Failed to fetch scholarship providers',
			error: error.message,
		})
	}
})

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
