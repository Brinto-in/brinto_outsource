export interface JobAnswerKeyItem {
	id: string
	title: string
	department: string
	date: string
	badgeText: string
	themeColor: string
	icon: string
	type: 'answerKey'
	slug: string
}

export const defaultAnswerKeys: JobAnswerKeyItem[] = [
	{
		id: 'ak_1',
		title: 'OSSSC RI, ARI, Amin Official Provisional Answer Key & Objection Link',
		department: 'Odisha Sub-Ordinate Staff Selection Commission',
		date: 'Objection Open',
		badgeText: 'Provisional Key',
		themeColor: '#D97706',
		icon: 'key_outlined',
		type: 'answerKey',
		slug: 'osssc-ri-ari-amin-answer-key-2026',
	},
	{
		id: 'ak_2',
		title: 'Railway RRB ALP & Technician Stage 1 Master Question Paper & Key',
		department: 'Railway Recruitment Board',
		date: 'Released Today',
		badgeText: 'Final Key',
		themeColor: '#B45309',
		icon: 'fact_check_outlined',
		type: 'answerKey',
		slug: 'rrb-alp-answer-key-2026',
	},
	{
		id: 'ak_3',
		title: 'Odisha Police Constable Written Exam Set A/B/C/D Key',
		department: 'State Police Selection Board Odisha',
		date: 'New Key Out',
		badgeText: 'Official Key',
		themeColor: '#EA580C',
		icon: 'menu_book_outlined',
		type: 'answerKey',
		slug: 'odisha-police-answer-key-2026',
	},
]
