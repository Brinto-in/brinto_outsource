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

const spotlights = [
	{
		title: 'Get Your PAN Card Easily',
		subtitle: 'Apply for a new PAN or make corrections.',
		badge: 'PAN CARD',
		image_url: 'https://i.ibb.co/CKZNFKzN/image.png',
		dominant_color: '#780010',
		route: '/pan-services',
	},
]

router.get('/states', (_req, res) => {
	res.json(states)
})

router.get('/quick_categories', (_req, res) => {
	res.json(quickCategories)
})

router.get('/spotlight', (_req, res) => {
	res.json(spotlights)
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
