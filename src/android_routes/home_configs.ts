import express from 'express'
import { requireStateHeader } from '../middleware/state.js'

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
	// {
	// 	label: 'Notifications',
	// 	imageUrl:
	// 		'https://blog.brinto.in/brinto/notification.png',
	// },
	{
		label: 'Voter ID',
		imageUrl: 'https://blog.brinto.in/brinto/voter_id.png',
	},
]

const quickCategories = [
	{ label: 'For You', icon: 'auto_awesome_rounded' },
	// { label: 'Jobs', icon: 'work_outline_rounded' },
	// { label: 'Documents', icon: 'description_outlined' },
	// { label: 'Health', icon: 'local_hospital_outlined' },
	// { label: 'Education', icon: 'school_outlined' },
	// { label: 'Finance', icon: 'account_balance_outlined' },
	// { label: 'Legal', icon: 'gavel_outlined' },
	// { label: 'Property', icon: 'home_outlined' },
	// { label: 'Agriculture', icon: 'grass_outlined' },
]

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

type ProviderCategory = 'corporate' | 'government' | 'odisha'

interface ScholarshipScheme {
	id: string
	slug: string
	title: string
}

interface ScholarshipProvider {
	id: string
	name: string
	category: ProviderCategory
	logoUrl: string | null
	schemes: ScholarshipScheme[]
}

const scholarshipProviders: ScholarshipProvider[] = [
	{
		id: 'hdfc-bank',
		name: 'HDFC Bank',
		category: 'corporate',
		logoUrl: 'https://cdn.brinto.in/providers/hdfc-bank.png',
		schemes: [
			{
				id: 'corp_3',
				slug: 'hdfc-parivartan-ecss',
				title: "HDFC Bank Parivartan's ECSS",
			},
		],
	},
	{
		id: 'govt-of-odisha-higher-education',
		name: 'Higher Education Dept, Govt of Odisha',
		category: 'odisha',
		logoUrl: null,
		schemes: [
			{
				id: 'odi_1',
				slug: 'e-medhabruti-ug-merit',
				title: 'e-Medhabruti - UG Merit',
			},
			{
				id: 'odi_2',
				slug: 'e-medhabruti-technical',
				title: 'e-Medhabruti - Technical & Professional',
			},
		],
	},
]

const scholarshipProviderCategories: ProviderCategory[] = ['corporate', 'government', 'odisha']

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

router.get('/scholarships/providers', (req, res) => {
	const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : ''
	const category = typeof req.query.category === 'string' ? req.query.category : undefined
	const pageValue = typeof req.query.page === 'string' ? Number.parseInt(req.query.page, 10) : 1
	const limitValue = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 50

	if (category && !scholarshipProviderCategories.includes(category as ProviderCategory)) {
		res.status(400).json({
			message: `category must be one of: ${scholarshipProviderCategories.join(', ')}`,
		})
		return
	}

	const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
	const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 50
	const filteredProviders = scholarshipProviders.filter((provider) => {
		const matchesQuery = !query || provider.name.toLowerCase().includes(query)
		const matchesCategory = !category || provider.category === category

		return matchesQuery && matchesCategory
	})
	const start = (page - 1) * limit

	res.json({
		meta: {
			total: filteredProviders.length,
			page,
			limit,
		},
		providers: filteredProviders.slice(start, start + limit).map((provider) => ({
			...provider,
			schemeCount: provider.schemes.length,
			activeSchemeCount: provider.schemes.length,
		})),
	})
})

router.get('/home_config', requireStateHeader, (req, res) => {
	const state = req.get('state')

	if (state === 'Odisha') {
		res.json(popularServices.map((service) => ({
			...service,
			state,
		})))
		return
	} else if (state === 'Uttar Pradesh' || state === 'Telangana') {
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
			// {
			// 	label: 'Tahasil',
			// 	imageUrl:
			// 		'https://blog.brinto.in/brinto/tahasil.png',
			// },
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
				label: 'Notifications',
				imageUrl:
					'https://blog.brinto.in/brinto/notification.png',
			},
		]
		res.json(popularServices.map((service) => ({
			...service,
			state,
		})))
		return
	}

	res.json([])
})

export default router
