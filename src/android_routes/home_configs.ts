import express from 'express'
import db from '../lib/db.js'
import { defaultAdmitCards } from './job_admit_card_section_data.js'
import { defaultAnswerKeys } from './job_answer_key_section_data.js'
import { defaultCutOffs } from './job_cut_off_section_data.js'
import { defaultResults } from './job_result_section_data.js'
import { popularServices } from './popular_services_data.js'
import { quickCategories } from './quick_categories_data.js'
import { filterOptions, scholarships } from './scholarship_section_data.js'
import { states } from './states_data.js'
import { spotlights, type SpotlightType } from './spotlight_data.js'
import { loadSessionState, StateRequest } from '../middleware/state.js'

const router = express.Router()

router.get('/job-result-section', (_req, res) => {
	res.json({
		isVisibleSection: true,
		results: defaultResults,
	})
})

router.get('/job-cut-off-section', (_req, res) => {
	res.json({
		isVisibleSection: true,
		cutOffs: defaultCutOffs,
	})
})

router.get('/job-answer-key-section', (_req, res) => {
	res.json({
		isVisibleSection: true,
		answerKeys: defaultAnswerKeys,
	})
})

router.get('/job-admit-card-section', (_req, res) => {
	res.json({
		isVisibleSection: true,
		admitCards: defaultAdmitCards,
	})
})

router.get('/scholarship-section-data', (_req, res) => {
	res.json({
		isVisibleSection: true,
		filterOptions,
		scholarships,
	})
})

router.get('/states', (_req, res) => {
	res.json(states)
})

router.get('/quick_categories', (_req, res) => {
	res.json(quickCategories)
})

router.get('/spotlight', loadSessionState, (req, res) => {
	const requestedType = typeof req.query.type === 'string' ? req.query.type : undefined
	const requestedState = (req as StateRequest).sessionState ?? null
	console.log(requestedType, requestedState);
	
	const spotlightTypes: SpotlightType[] = ['for_you', 'anganwadi', 'scholarship', 'identity']

	if (requestedType && !spotlightTypes.includes(requestedType as SpotlightType)) {
		res.status(400).json({
			message: `type must be one of: ${spotlightTypes.join(', ')}`,
		})
		return
	}

	const filteredSpotlights = spotlights.filter((spotlight) => {
		const matchesType = !requestedType || spotlight.type === requestedType
		const matchesState = requestedState
			? spotlight.state === null || spotlight.state.toLowerCase() === requestedState.toLowerCase()
			: spotlight.state === null

		return matchesType && matchesState
	})

	res.json(filteredSpotlights)
})

router.get('/home_config', async (req, res) => {
	try {
		const sessionId = req.get('session_id')?.trim();
		if (!sessionId) {
			res.json([])
			return
		}

		const result = await db.execute({
			sql: `SELECT state_name
				FROM user_states
				WHERE session_id = ?
				LIMIT 1`,
			args: [sessionId],
		})
		const state = result.rows[0]?.state_name
		if (typeof state !== 'string' || !state.trim()) {
			res.status(404).json({
				success: false,
				message: 'Session not found.',
			})
			return
		}

		if (state.trim().toLowerCase() === 'odisha') {
			res.json(popularServices.map((service) => ({
				...service,
				state: state.trim(),
			})))
			return
		}

		res.json([])
	} catch (error: any) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch home configuration.',
			error: error.message,
		})
	}
})

export default router
