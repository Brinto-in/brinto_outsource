import { Request, Response, NextFunction } from 'express'
import db from '../lib/db.js'

export interface StateRequest extends Request {
	sessionState?: string
}

export const loadSessionState = async (req: StateRequest, res: Response, next: NextFunction) => {
	const sessionId = req.get('session_id')?.trim()

	if (!sessionId) {
		return next()
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
		return res.status(404).json({
			success: false,
			message: 'Session not found.',
		})
	}

	req.sessionState = stateName.trim().toLowerCase()
	next()
}

export const requireStateHeader = (req: Request, res: Response, next: NextFunction) => {
	const state = req.get('state')

	if (!state?.trim()) {
		return res.status(400).json({
			success: false,
			message: 'state is required',
		})
	}

	next()
}