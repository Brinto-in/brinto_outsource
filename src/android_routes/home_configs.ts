import express from 'express'
import db from '../lib/db.js'
import { defaultCutOffs } from './job_cut_off_section_data.js'
import { defaultResults } from './job_result_section_data.js'
import { filterOptions, scholarships } from './scholarship_section_data.js'

const router = express.Router()

const stateNames = [
	'Andhra Pradesh',
	'Arunachal Pradesh',
	'Assam',
	'Bihar',
	'Chhattisgarh',
	'Goa',
	'Gujarat',
	'Haryana',
	'Himachal Pradesh',
	'Jharkhand',
	'Karnataka',
	'Kerala',
	'Madhya Pradesh',
	'Maharashtra',
	'Manipur',
	'Meghalaya',
	'Mizoram',
	'Nagaland',
	'Odisha',
	'Punjab',
	'Rajasthan',
	'Sikkim',
	'Tamil Nadu',
	'Telangana',
	'Tripura',
	'Uttar Pradesh',
	'Uttarakhand',
	'West Bengal',
]

const states = stateNames.map((name, index) => ({
	id: index + 1,
	name,
	imageUrl: `https://placehold.co/600x400/png?text=${encodeURIComponent(name)}`,
}))

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

const popularServices = [
	{
		label: 'PAN Card',
		imageUrl:
			'https://blog.brinto.in/brinto/pan.png',
	},
	{
		label: 'RTO',
		imageUrl:
			'https://blog.brinto.in/brinto/rto.png',
	},
	{
		label: 'Scholarships',
		imageUrl:
			'https://blog.brinto.in/brinto/scholarships.png',
	},
	{
		label: 'Anganwadi',
		imageUrl:
			'https://blog.brinto.in/brinto/anganwadi.png',
	},
	{
		label: 'Tahasil',
		imageUrl:
			'https://blog.brinto.in/brinto/tahasil.png',
	},
	{
		label: 'Near Me',
		imageUrl:
			'https://blog.brinto.in/brinto/nearme.png',
	},
	{
		label: 'Feeds',
		imageUrl:
			'https://blog.brinto.in/brinto/feeds.png',
	},
	{
		label: 'Voter ID',
		imageUrl: 'https://blog.brinto.in/brinto/voter_id.png',
	},
]

const quickCategories = [
	{ label: 'For You', icon: 'auto_awesome_rounded' },
]

router.get('/scholarship-section-data', (_req, res) => {
	res.json({
		isVisibleSection: false,
		filterOptions,
		scholarships,
	})
})

type SpotlightType = 'for_you' | 'anganwadi' | 'scholarship' | 'identity'

interface Spotlight {
	title: string
	subtitle: string
	badge: string
	image_url: string
	dominant_color: string
	route: string
	type: SpotlightType
	state: string | null
}

const spotlights: Spotlight[] = [
	{
		title: 'Get Your PAN Card Easily',
		subtitle: 'Apply for a new PAN or make corrections.',
		badge: 'PAN CARD',
		image_url: 'https://i.ibb.co/CKZNFKzN/image.png',
		dominant_color: '#36ABAA',
		route: '/pan-services',
		type: 'identity',
		state: null,
	},
	{
		title: 'Get Your Voter ID Easily',
		subtitle: 'Apply for a new Voter ID or make corrections.',
		badge: 'VOTER ID',
		image_url: 'https://i.ibb.co/qFxTLVTM/image.png',
		dominant_color: '#8A54AB',
		route: '/voter-id-services',
		type: 'identity',
		state: null,
	},
	{
		title: 'Get Your RTO Services Easily',
		subtitle: 'Apply for vehicle registration or make corrections.',
		badge: 'RTO',
		image_url: 'https://i.ibb.co/d4dJ3dT2/image.png',
		dominant_color: '#136B2D',
		route: '/rto-services',
		type: 'for_you',
		state: null,
	}
]

router.get('/states', (_req, res) => {
	res.json(states)
})

router.get('/quick_categories', (_req, res) => {
	res.json(quickCategories)
})

router.get('/spotlight', (req, res) => {
	const requestedType = typeof req.query.type === 'string' ? req.query.type : undefined
	const requestedState = typeof req.query.state === 'string' && req.query.state !== 'null'
		? req.query.state
		: null
	const spotlightTypes: SpotlightType[] = ['for_you', 'anganwadi', 'scholarship', 'identity']

	if (requestedType && !spotlightTypes.includes(requestedType as SpotlightType)) {
		res.status(400).json({
			message: `type must be one of: ${spotlightTypes.join(', ')}`,
		})
		return
	}

	const filteredSpotlights = spotlights.filter((spotlight) => {
		const matchesType = !requestedType || spotlight.type === requestedType
		const matchesState = !requestedState || spotlight.state === null || spotlight.state === requestedState

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
