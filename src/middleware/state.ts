import { Request, Response, NextFunction } from 'express'
import db from '../lib/db.js'

export interface StateRequest extends Request {
	sessionState?: string
}

// Simple in-memory cache with TTL
interface CacheEntry {
	state: string
	expiresAt: number
}

const sessionStateCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

// Clean up expired cache entries periodically
setInterval(() => {
	const now = Date.now()
	for (const [key, entry] of sessionStateCache.entries()) {
		if (entry.expiresAt <= now) {
			sessionStateCache.delete(key)
		}
	}
}, 10 * 60 * 1000) // Clean up every 10 minutes

export const loadSessionState = async (req: StateRequest, res: Response, next: NextFunction) => {
	const sessionId = req.get('session_id')?.trim()

	if (!sessionId) {
		return next()
	}

	// Check cache first
	const cached = sessionStateCache.get(sessionId)
	if (cached && cached.expiresAt > Date.now()) {
		req.sessionState = cached.state
		return next()
	}

	// Cache miss or expired, query database
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

	const normalizedState = stateName.trim().toLowerCase()
	
	// Store in cache
	sessionStateCache.set(sessionId, {
		state: normalizedState,
		expiresAt: Date.now() + CACHE_TTL_MS,
	})

	req.sessionState = normalizedState
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