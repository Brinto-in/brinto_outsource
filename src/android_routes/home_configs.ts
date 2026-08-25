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

const scholarshipEducationLevels = [
	{ key: 'class1to8', label: 'Class 1-8' },
	{ key: 'class9to10', label: 'Class 9-10' },
	{ key: 'class11to12', label: 'Class 11-12' },
	{ key: 'diploma', label: 'Diploma' },
	{ key: 'ug', label: 'UG' },
	{ key: 'pg', label: 'PG' },
]

type ScholarshipEducationLevel = typeof scholarshipEducationLevels[number]['key']

interface ClosingSoonScholarship {
	id: string
	slug: string
	title: string
	organization: string
	category: ProviderCategory
	target?: string
	amount: string
	lastDate: string
	tag: {
		label: string
		colorHex: string
	}
	state: string | null
	eduLevel: ScholarshipEducationLevel
}

const closingSoonScholarships: ClosingSoonScholarship[] = [
	{
		id: 'govt_2',
		slug: 'national-means-merit-scholarship',
		title: 'National Means-cum-Merit Scholarship',
		organization: 'Ministry of Education (Govt. of India)',
		category: 'government',
		amount: 'Rs.12,000 /yr',
		lastDate: '2026-08-25T23:59:59+05:30',
		tag: { label: 'Merit', colorHex: '#7C3AED' },
		state: null,
		eduLevel: 'class9to10',
	},
	{
		id: 'corp_2',
		slug: 'tata-capital-pankh-scholarship',
		title: 'Tata Capital Pankh Scholarship',
		organization: 'Tata Capital',
		category: 'corporate',
		amount: 'Rs.12,000 - Rs.1,00,000',
		lastDate: '2026-08-25T23:59:59+05:30',
		tag: { label: 'UG / PG', colorHex: '#64748B' },
		state: null,
		eduLevel: 'ug',
	},
	]

const corporateScholarships: ClosingSoonScholarship[] = [
	{
		id: 'corp_1',
		slug: 'bharti-airtel-scholarship',
		title: 'Bharti Airtel Scholarship',
		organization: 'Bharti Airtel Foundation',
		category: 'corporate',
		target: 'Engineering / Technology students',
		amount: 'Rs.50,000 /yr',
		lastDate: '2026-09-05T23:59:59+05:30',
		tag: { label: 'Technical', colorHex: '#334155' },
		state: null,
		eduLevel: 'ug',
	},
	{
		id: 'corp_4',
		slug: 'reliance-foundation-ug-scholarship',
		title: 'Reliance Foundation Undergraduate Scholarship',
		organization: 'Reliance Foundation',
		category: 'corporate',
		target: 'Undergraduate students',
		amount: 'Rs.50,000 /yr',
		lastDate: '2026-09-20T23:59:59+05:30',
		tag: { label: 'UG / PG', colorHex: '#64748B' },
		state: null,
		eduLevel: 'ug',
	},
	{
		id: 'govt_3',
		slug: 'pre-matric-scholarship',
		title: 'Pre-Matric Scholarship',
		organization: 'Ministry of Social Justice and Empowerment (Govt. of India)',
		category: 'government',
		amount: 'Rs.4,000 /yr',
		lastDate: '2026-08-30T23:59:59+05:30',
		tag: { label: 'School', colorHex: '#0F766E' },
		state: null,
		eduLevel: 'class1to8',
	},
	{
		id: 'corp_5',
		slug: 'aditya-birla-scholarship',
		title: 'Aditya Birla Scholarship',
		organization: 'Aditya Birla Group',
		category: 'corporate',
		target: 'Class 11-12 students',
		amount: 'Rs.30,000 /yr',
		lastDate: '2026-09-25T23:59:59+05:30',
		tag: { label: 'Merit', colorHex: '#7C3AED' },
		state: null,
		eduLevel: 'class11to12',
	},
	{
		id: 'corp_6',
		slug: 'lic-golden-jubilee-scholarship',
		title: 'LIC Golden Jubilee Scholarship',
		organization: 'Life Insurance Corporation of India',
		category: 'corporate',
		target: 'Class 9-10 students',
		amount: 'Rs.20,000 /yr',
		lastDate: '2026-10-01T23:59:59+05:30',
		tag: { label: 'School', colorHex: '#0F766E' },
		state: null,
		eduLevel: 'class9to10',
	},
	{
		id: 'corp_7',
		slug: 'mahindra-all-india-scholarship',
		title: 'Mahindra All India Scholarship',
		organization: 'Mahindra Group',
		category: 'corporate',
		target: 'Diploma students',
		amount: 'Rs.25,000 /yr',
		lastDate: '2026-10-10T23:59:59+05:30',
		tag: { label: 'Diploma', colorHex: '#334155' },
		state: null,
		eduLevel: 'diploma',
	},
	{
		id: 'corp_8',
		slug: 'tata-trusts-pg-scholarship',
		title: 'Tata Trusts Postgraduate Scholarship',
		organization: 'Tata Trusts',
		category: 'corporate',
		target: 'Postgraduate students',
		amount: 'Rs.60,000 /yr',
		lastDate: '2026-10-20T23:59:59+05:30',
		tag: { label: 'PG', colorHex: '#64748B' },
		state: null,
		eduLevel: 'pg',
	},
	{
		id: 'corp_9',
		slug: 'azim-premji-foundation-school-scholarship',
		title: 'Azim Premji Foundation School Scholarship',
		organization: 'Azim Premji Foundation',
		category: 'corporate',
		target: 'Class 1-8 students',
		amount: 'Rs.10,000 /yr',
		lastDate: '2026-10-25T23:59:59+05:30',
		tag: { label: 'School', colorHex: '#0F766E' },
		state: null,
		eduLevel: 'class1to8',
	},
]

const nationalScholarships: ClosingSoonScholarship[] = [
	...closingSoonScholarships.filter((scholarship) => scholarship.category === 'government'),
	{
		id: 'govt_4',
		slug: 'post-matric-scholarship',
		title: 'Post-Matric Scholarship',
		organization: 'Ministry of Social Justice and Empowerment (Govt. of India)',
		category: 'government',
		amount: 'Rs.8,000 /yr',
		lastDate: '2026-10-15T23:59:59+05:30',
		tag: { label: 'Higher Education', colorHex: '#1D4ED8' },
		state: null,
		eduLevel: 'class9to10',
	},
	{
		id: 'govt_5',
		slug: 'central-sector-scholarship',
		title: 'Central Sector Scholarship',
		organization: 'Department of Higher Education (Govt. of India)',
		category: 'government',
		amount: 'Rs.20,000 /yr',
		lastDate: '2026-10-31T23:59:59+05:30',
		tag: { label: 'Merit', colorHex: '#7C3AED' },
		state: null,
		eduLevel: 'ug',
	},
	{
		id: 'govt_6',
		slug: 'national-scholarship-diploma',
		title: 'National Diploma Scholarship',
		organization: 'Ministry of Education (Govt. of India)',
		category: 'government',
		amount: 'Rs.15,000 /yr',
		lastDate: '2026-11-05T23:59:59+05:30',
		tag: { label: 'Technical', colorHex: '#334155' },
		state: null,
		eduLevel: 'diploma',
	},
	{
		id: 'govt_7',
		slug: 'national-pg-scholarship',
		title: 'National Postgraduate Scholarship',
		organization: 'University Grants Commission',
		category: 'government',
		amount: 'Rs.36,000 /yr',
		lastDate: '2026-11-15T23:59:59+05:30',
		tag: { label: 'PG', colorHex: '#64748B' },
		state: null,
		eduLevel: 'pg',
	},
	{
		id: 'govt_8',
		slug: 'national-primary-scholarship',
		title: 'National Primary Scholarship',
		organization: 'Ministry of Education (Govt. of India)',
		category: 'government',
		amount: 'Rs.5,000 /yr',
		lastDate: '2026-11-20T23:59:59+05:30',
		tag: { label: 'School', colorHex: '#0F766E' },
		state: null,
		eduLevel: 'class1to8',
	},
	{
		id: 'govt_9',
		slug: 'national-senior-secondary-scholarship',
		title: 'National Senior Secondary Scholarship',
		organization: 'Ministry of Education (Govt. of India)',
		category: 'government',
		amount: 'Rs.10,000 /yr',
		lastDate: '2026-11-25T23:59:59+05:30',
		tag: { label: 'Merit', colorHex: '#7C3AED' },
		state: null,
		eduLevel: 'class11to12',
	},
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
			logoUrl: provider.logoUrl,
			name: provider.name,
			activeSchemeCount: provider.schemes.length,
		})),
	})
})

router.get('/scholarships/education-levels', (_req, res) => {
	res.json({
		levels: scholarshipEducationLevels,
	})
})

const sendScholarships = (
	req: express.Request,
	res: express.Response,
	scholarships: ClosingSoonScholarship[],
	defaultLimit: number,
) => {
	const state = typeof req.query.state === 'string' ? req.query.state.trim().toLowerCase() : ''
	const eduLevel = typeof req.query.eduLevel === 'string' ? req.query.eduLevel : undefined
	const pageValue = typeof req.query.page === 'string' ? Number.parseInt(req.query.page, 10) : 1
	const limitValue = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : defaultLimit

	if (eduLevel && !scholarshipEducationLevels.some((level) => level.key === eduLevel)) {
		res.status(400).json({
			message: 'eduLevel must be one of: class1to8, class9to10, class11to12, diploma, ug, pg',
		})
		return
	}

	const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
	const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : defaultLimit
	const filteredScholarships = scholarships.filter((scholarship) => {
		const matchesState = !state || scholarship.state === null || scholarship.state.toLowerCase() === state
		const matchesEducationLevel = !eduLevel || scholarship.eduLevel === eduLevel

		return matchesState && matchesEducationLevel
	})
	const start = (page - 1) * limit

	res.json({
		meta: {
			total: filteredScholarships.length,
			page,
			limit,
		},
		scholarships: filteredScholarships.slice(start, start + limit).map((scholarship) => ({
			id: scholarship.id,
			slug: scholarship.slug,
			title: scholarship.title,
			organization: scholarship.organization,
			...(scholarship.target ? { target: scholarship.target } : {}),
			category: scholarship.category,
			amount: scholarship.amount,
			lastDate: scholarship.lastDate,
			tag: scholarship.tag,
		})),
	})
}

router.get('/scholarships/closing-soon', (req, res) => {
	sendScholarships(req, res, closingSoonScholarships, 20)
})

router.get('/scholarships/corporate', (req, res) => {
	sendScholarships(req, res, corporateScholarships, 20)
})

router.get('/scholarships/national', (req, res) => {
	sendScholarships(req, res, nationalScholarships, 20)
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
