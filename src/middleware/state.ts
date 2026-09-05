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

const getCacheKey = (sessionId: string, userId?: string | null) =>
	`${sessionId}:${userId ?? 'any'}`

export const getSessionState = async (sessionId: string, userId?: string | null) => {
	const cacheKey = getCacheKey(sessionId, userId)
	const cached = sessionStateCache.get(cacheKey)
	if (cached && cached.expiresAt > Date.now()) {
		return cached.state
	}

	const ownershipClause = userId === undefined
		? ''
		: 'AND ((user_id = ?) OR (user_id IS NULL AND ? IS NULL))'
	const args = userId === undefined ? [sessionId] : [sessionId, userId, userId]

	const result = await db.execute({
		sql: `SELECT state_name
			FROM user_states
			WHERE session_id = ?
			${ownershipClause}
			LIMIT 1`,
		args,
	})

	const stateName = result.rows[0]?.state_name
	if (typeof stateName !== 'string' || !stateName.trim()) {
		return null
	}

	const normalizedState = stateName.trim().toLowerCase()
	sessionStateCache.set(cacheKey, {
		state: normalizedState,
		expiresAt: Date.now() + CACHE_TTL_MS,
	})

	return normalizedState
}

export const invalidateSessionState = (sessionId: string) => {
	for (const key of sessionStateCache.keys()) {
		if (key.startsWith(`${sessionId}:`)) {
			sessionStateCache.delete(key)
		}
	}
}

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

	const state = await getSessionState(sessionId)
	if (!state) {
		return res.status(404).json({
			success: false,
			message: 'Session not found.',
		})
	}

	req.sessionState = state
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