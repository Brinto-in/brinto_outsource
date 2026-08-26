export interface JobAdmitCardItem {
	id: string
	title: string
	department: string
	date: string
	badgeText: string
	themeColor: string
	icon: string
	type: 'admitCard'
	slug: string
}

export const defaultAdmitCards: JobAdmitCardItem[] = [
	{
		id: 'ac_1',
		title: 'OSSC CGL 2026 Preliminary Exam Admit Card / Hall Ticket',
		department: 'Odisha Staff Selection Commission',
		date: 'Available Now',
		badgeText: 'Hall Ticket Out',
		themeColor: '#2563EB',
		icon: 'badge_outlined',
		type: 'admitCard',
		slug: 'ossc-cgl-admit-card-2026',
	},
	{
		id: 'ac_2',
		title: 'SSC GD Constable Exam 2026 Call Letter & City Intimation',
		department: 'Staff Selection Commission (Central)',
		date: 'Active Link',
		badgeText: 'Admit Card',
		themeColor: '#4F46E5',
		icon: 'confirmation_number_outlined',
		type: 'admitCard',
		slug: 'ssc-gd-constable-admit-card-2026',
	},
	{
		id: 'ac_3',
		title: 'OPSC Assistant Section Officer (ASO) Mains Admit Card',
		department: 'Odisha Public Service Commission',
		date: 'Exam in 5 Days',
		badgeText: 'Mains Hall Ticket',
		themeColor: '#0284C7',
		icon: 'school_outlined',
		type: 'admitCard',
		slug: 'opsc-aso-admit-card-2026',
	},
]
