export interface JobCutOffItem {
	id: string
	title: string
	department: string
	date: string
	badgeText: string
	themeColor: string
	icon: string
	type: 'cutOff'
	slug: string
}

export const defaultCutOffs: JobCutOffItem[] = [
	{
		id: 'co_1',
		title: 'OSSSC Sevak Sevika Category-wise Cut Off Marks (UR/SEBC/SC/ST)',
		department: 'Odisha Sub-Ordinate Staff Selection Commission',
		date: 'Published',
		badgeText: 'Official Cut Off',
		themeColor: '#7C3AED',
		icon: 'trending_up_rounded',
		type: 'cutOff',
		slug: 'osssc-sevak-sevika-cut-off-2026',
	},
	{
		id: 'co_2',
		title: 'OPSC OCS Civil Services Prelims Expected & Official Qualifying Marks',
		department: 'Odisha Public Service Commission',
		date: 'Updated',
		badgeText: 'Qualifying Score',
		themeColor: '#6D28D9',
		icon: 'insights_rounded',
		type: 'cutOff',
		slug: 'opsc-ocs-cut-off-2026',
	},
	{
		id: 'co_3',
		title: 'OSSC Junior Executive Assistant Category & Gender Cut Off List',
		department: 'Odisha Staff Selection Commission',
		date: '2026 Marks',
		badgeText: 'Merit Cut Off',
		themeColor: '#9333EA',
		icon: 'analytics_outlined',
		type: 'cutOff',
		slug: 'ossc-jea-cut-off-2026',
	},
]
