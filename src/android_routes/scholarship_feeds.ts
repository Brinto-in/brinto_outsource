import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

const scholarshipEducationLevels = [
	'class1to8',
	'class9to10',
	'class11to12',
	'diploma',
	'ug',
	'pg',
] as const

const getSessionState = async (req: express.Request, res: express.Response) => {
	const sessionId = req.get('session_id')?.trim()

	if (!sessionId) {
		return null
	}

	const result = await db.execute({
		sql: `SELECT state_name
			FROM user_states
			WHERE session_id = ?
			LIMIT 1`,
		args: [sessionId],
	})

	const stateName = result.rows[0]?.state_name
	if (typeof stateName !== 'string' || !stateName.trim()) {
		res.status(404).json({
			success: false,
			message: 'Session not found.',
		})
		return undefined
	}

	return stateName.trim().toLowerCase()
}

const sendScholarships = async (
	req: express.Request,
	res: express.Response,
	category?: 'corporate' | 'government' | 'odisha',
	closingSoon = false,
	location?: string,
) => {
	const requestedState = closingSoon || category === 'corporate' || location
		? null
		: await getSessionState(req, res)
	if (requestedState === undefined) return

	const eduLevel = typeof req.query.eduLevel === 'string' ? req.query.eduLevel : undefined
	const pageValue = typeof req.query.page === 'string' ? Number.parseInt(req.query.page, 10) : 1
	const limitValue = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 20

	// if (eduLevel && !scholarshipEducationLevels.includes(eduLevel as typeof scholarshipEducationLevels[number])) {
	// 	res.status(400).json({
	// 		message: 'eduLevel must be one of: class1to8, class9to10, class11to12, diploma, ug, pg',
	// 	})
	// 	return
	// }

	const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
	const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 20
	const conditions: string[] = []
	const args: (string | number)[] = []
	if (closingSoon) {
		conditions.push("date(s.last_date) BETWEEN date('now', '+5 hours', '+30 minutes') AND date('now', '+5 hours', '+30 minutes', '+3 days')")
	}

	if (category) {
		conditions.push('s.category = ?')
		args.push(category)
	}
	if (location) {
		conditions.push('LOWER(s.location) = ?')
		args.push(location.toLowerCase())
	}
	if (requestedState) {
		conditions.push('(s.location IS NULL OR LOWER(s.location) = ?)')
		args.push(requestedState)
	}
	if (eduLevel) {
		conditions.push('s.education_level = ?')
		args.push(eduLevel)
	}

	const whereClause = conditions.join(' AND ')
	const queryArgs = [...args, limit, (page - 1) * limit]
	const [countResult, scholarshipsResult] = await Promise.all([
		db.execute({
			sql: `SELECT COUNT(*) AS total
				FROM scholarships s
				WHERE ${whereClause}`,
			args,
		}),
		db.execute({
			sql: `SELECT s.id, s.slug, s.title, s.organization,
					s.category, s.amount, s.last_date AS lastDate,
					s.label AS tagLabel, s.color_hex AS tagColorHex
				FROM scholarships s
				WHERE ${whereClause}
				ORDER BY s.last_date ASC, s.id ASC
				LIMIT ? OFFSET ?`,
			args: queryArgs,
		}),
	])

	res.json({
		meta: {
			total: Number(countResult.rows[0]?.total ?? 0),
			page,
			limit,
		},
		scholarships: scholarshipsResult.rows.map((scholarship) => ({
			id: scholarship.id,
			slug: scholarship.slug,
			title: scholarship.title,
			organization: scholarship.organization,
			category: scholarship.category,
			amount: scholarship.amount,
			lastDate: scholarship.lastDate,
			tag: {
				label: scholarship.tagLabel,
				colorHex: scholarship.tagColorHex,
			},
		})),
	})
}

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

router.get('/scholarships/closing-soon', async (req, res) => {
	try {
		await sendScholarships(req, res, undefined, true)
	} catch (error: any) {
		res.status(500).json({ message: 'Failed to fetch closing-soon scholarships', error: error.message })
	}
})

router.get('/scholarships/corporate', async (req, res) => {
	try {
		await sendScholarships(req, res, 'corporate')
	} catch (error: any) {
		res.status(500).json({ message: 'Failed to fetch corporate scholarships', error: error.message })
	}
})

router.get('/scholarships/national', async (req, res) => {
	try {
		await sendScholarships(req, res, 'government', false, 'India')
	} catch (error: any) {
		res.status(500).json({ message: 'Failed to fetch national scholarships', error: error.message })
	}
})

router.get('/scholarships/state-specific', async (req, res) => {
	try {
		await sendScholarships(req, res, 'odisha')
	} catch (error: any) {
		res.status(500).json({ message: 'Failed to fetch state-specific scholarships', error: error.message })
	}
})

export default router
