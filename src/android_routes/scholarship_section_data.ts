export const filterOptions = [
	'All Scholarships',
	'Post Matric',
	'Pre Matric',
	'Closing Today',
]

type ScholarshipType = 'postMatric' | 'stateGovt' | 'centralGovt' | 'merit'

export interface ScholarshipItem {
	id: string
	title: string
	provider: string
	amount: string
	eligibility: string
	lastDate: string
	isExpiringToday: boolean
	type: ScholarshipType
	slug: string
}

export const scholarships: ScholarshipItem[] = [
	{
		id: 'sch_1',
		title: 'Odisha State Post Matric Scholarship (PRERANA) 2026',
		provider: 'ST & SC Welfare Department, Odisha',
		amount: 'Up to ₹25,000/yr',
		eligibility: '+2 / Graduation / Diploma',
		lastDate: 'Today (Closing at Midnight)',
		isExpiringToday: true,
		type: 'postMatric',
		slug: 'odisha-post-matric-scholarship-2026',
	},
	{
		id: 'sch_2',
		title: 'Nirman Shramik Kalyan Yojana Education Assistance',
		provider: 'Odisha Building & Other Construction Workers Board',
		amount: '₹10,000 - ₹40,000',
		eligibility: 'Children of BOC Registered Workers',
		lastDate: 'Today (Last Day)',
		isExpiringToday: true,
		type: 'stateGovt',
		slug: 'nirman-shramik-scholarship-2026',
	},
	{
		id: 'sch_3',
		title: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
		provider: 'Ministry of Education (Govt. of India)',
		amount: '₹12,000/year',
		eligibility: 'Class 8th Passed Students',
		lastDate: '30 Aug 2026',
		isExpiringToday: false,
		type: 'centralGovt',
		slug: 'national-means-merit-scholarship-2026',
	},
	{
		id: 'sch_4',
		title: 'Banishree Scholarship for Students with Disabilities',
		provider: 'Social Security & EPD Department',
		amount: '₹2,500 - ₹4,000/month',
		eligibility: 'PwD School/College Students',
		lastDate: '05 Sep 2026',
		isExpiringToday: false,
		type: 'stateGovt',
		slug: 'banishree-scholarship-2026',
	},
	{
		id: 'sch_5',
		title: 'Kalia Chhatra Bruti Higher Education Assistance',
		provider: 'Agriculture & Farmers Empowerment Dept',
		amount: 'Full Course Fee & Hosteller Aid',
		eligibility: 'Children of KALIA Beneficiaries',
		lastDate: '15 Sep 2026',
		isExpiringToday: false,
		type: 'merit',
		slug: 'kalia-chhatra-bruti-2026',
	},
]
