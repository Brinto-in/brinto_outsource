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
		type: 'identity',
		state: null,
		slug: 'pan-69354f8d55f23937dc3389c3'
	},
	{
		title: 'Income Certificate Services',
		subtitle: 'Apply for a new Income Certificate or make corrections.',
		badge: 'INCOME CERTIFICATE',
		image_url: 'https://blog.brinto.in/brinto/income_application_service_banner_202608261655.jpeg',
		dominant_color: '#8A54AB',
		route: '/income-certificate-services',
		type: 'identity',
		state: null,
		slug: 'income-certificate-68adbb5e80356552c1e08752'
	},
	{
		title: 'Caste Certificate Services',
		subtitle: 'Apply for a new Caste Certificate or make corrections.',
		badge: 'CASTE CERTIFICATE',
		image_url: 'https://blog.brinto.in/brinto/caste_application_service_banner_202608261655.jpeg',
		dominant_color: '#8A54AB',
		type: 'identity',
		state: null,
		slug: 'caste-certificate-68a56e3f5919404d9cf571cb'
	},
	{
		title: 'Resident Certificate Services',
		subtitle: 'Apply for a new Resident Certificate or make corrections.',
		badge: 'RESIDENT CERTIFICATE',
		image_url: 'https://blog.brinto.in/brinto/resident_application_service_banner_202608261654.jpeg',
		dominant_color: '#8A54AB',
		type: 'identity',
		state: null,
		slug: 'resident-certificate-68a2bf400db871f4ffff4b52'
	},
	{
		title: 'India Post GDS Recruitment 2026',
		subtitle: 'Gramin Dak Sevak Online Engagement – Schedule-II, July 2026.',
		badge: 'GDS',
		image_url: 'https://blog.brinto.in/brinto/Gramin_Dak_Sevak_recruitment_banner_202608271146.jpeg',
		dominant_color: '#D71920',
		route: '/gds-recruitment',
		type: 'for_you',
		state: 'Odisha',
		slug: 'gramin-dak-sevak-gds-july-2026'
	},
	{
		"title": "East Coast Railway Act Apprentice Recruitment 2026",
		"subtitle": "Apply Online for 1,599 Apprentice Posts",
		"badge": "RAILWAY",
		"image_url": "https://blog.brinto.in/brinto/Railway_apprentice_recruitment_b%E2%80%A6_202608271222.jpeg",
		"dominant_color": "#0B0A0B",
		"route": "/railway-apprentice-recruitment",
		"type": "for_you",
		"state": null,
		"slug": "east-coast-railway-act-apprentice-recruitment-2026"
	},
	{
		"title": "OPSC APP Recruitment 2026",
		"subtitle": "Apply Online for 172 Assistant Public Prosecutor Posts",
		"badge": "OPSC",
		"image_url": "https://blog.brinto.in/brinto/OPSC_recruitment_2026_banner_202608271233.jpeg",
		"dominant_color": "#0B182B",
		"route": "/opsc-app-recruitment",
		"type": "for_you",
		"state": "Odisha",
		"slug": "opsc-assistant-public-prosecutor-recruitment-2026"
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
		"title": "OPSC AEE Recruitment 2026",
		"subtitle": "Apply Online for 46 Assistant Executive Engineer Posts",
		"badge": "OPSC",
		"image_url": "https://blog.brinto.in/brinto/OPSC_AEE_recruitment_banner_202608271247.jpeg",
		"dominant_color": "#1F3A5F",
		"route": "/opsc-aee-recruitment",
		"type": "for_you",
		"state": "Odisha",
		"slug": "opsc-assistant-executive-engineer-recruitment-2026"
	},
	{
		title: 'Anganwadi Services',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Anganwadi',
		image_url: 'https://blog.brinto.in/brinto/odisha_anganwadi_2026_08_26_2_44_21.jpeg',
		dominant_color: '#169CD6',
		type: 'anganwadi',
		state: "Odisha",
		slug: 'anganwadi'
	},
	{
		title: 'Anganwadi UP',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Anganwadi',
		image_url: 'https://blog.brinto.in/brinto/up_anganwadi_2026_08_26_02_49_13.jpeg',
		dominant_color: '#169CD6',
		type: 'anganwadi',
		state: "uttar pradesh",
		slug: 'anganwadi'
	},

	{
		title: 'Anganwadi UP',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Odisha State Scholarship Portal',
		image_url: 'https://blog.brinto.in/brinto/Banishree_scholarship_applicatio_202608261636.jpeg',
		dominant_color: '#169CD6',
		type: 'scholarship',
		state: null,
		slug: 'scholarship'
	},
	{
		title: 'Anganwadi UP',
		subtitle: 'Odisha Anganwadi Services for children and mothers.',
		badge: 'Odisha State Scholarship Portal',
		image_url: 'https://blog.brinto.in/brinto/Nirman_shramik_kalyan_yojana_sch%E2%80%A6_202608261708.jpeg',
		dominant_color: '#169CD6',
		type: 'scholarship',
		state: null,
		slug: 'scholarship'
	},
]
