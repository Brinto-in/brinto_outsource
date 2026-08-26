export type SpotlightType = 'for_you' | 'anganwadi' | 'scholarship' | 'identity'

export interface Spotlight {
	title: string
	subtitle: string
	badge: string
	image_url: string
	dominant_color: string
	route?: string
	type: SpotlightType
	state: string | null
	slug?: string
}

export const spotlights: Spotlight[] = [
	{
		title: 'Get Your PAN Card Easily',
		subtitle: 'Apply for a new PAN or make corrections.',
		badge: 'PAN CARD',
		image_url: 'https://blog.brinto.in/brinto/PAN_card_application_service_banner_202608261648.jpeg',
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
		badge: 'SBI',
		image_url: 'https://blog.brinto.in/brinto/Junior_Associate_job_application%E2%80%A6_202608261310.jpeg',
		dominant_color: '#169CD6',
		route: '/rto-services',
		type: 'for_you',
		state: null,
		slug: 'junior-associates-sbi-6a8ea29fa0a6ba64feff6fd7'
	},
	{
		title: 'Anganwadi Services',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Anganwadi',
		image_url: 'https://blog.brinto.in/brinto/odisha_anganwadi_2026_08_26_2_44_21.jpeg',
		dominant_color: '#169CD6',
		type: 'anganwadi',
		state: null,
		slug: 'anganwadi'
	},
	{
		title: 'Anganwadi UP',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Anganwadi',
		image_url: 'https://blog.brinto.in/brinto/up_anganwadi_2026_08_26_02_49_13.jpeg',
		dominant_color: '#169CD6',
		type: 'anganwadi',
		state: null,
		slug: 'anganwadi'
	},

	{
		title: 'Anganwadi UP',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Odisha State Scholarship Portal',
		image_url: 'https://blog.brinto.in/brinto/Banishree_scholarship_applicatio_202608261636.jpeg',
		dominant_color: '#169CD6',
		type: 'anganwadi',
		state: null,
		slug: 'scholarship'
	},

	
	
]
