export interface JobResultItem {
	id: string
	title: string
	department: string
	date: string
	badgeText: string
	badgeColor: string
	slug: string
}

export const defaultResults: JobResultItem[] = [
	{
		id: '1',
		title: 'OSSSC Sevak Sevika Final Result 2026',
		department: 'Odisha Sub-Ordinate Staff Selection Commission',
		date: 'Declared Today',
		badgeText: 'Final Result',
		badgeColor: '#059669',
		slug: 'osssc-sevak-sevika-final-result-2026',
	},
	{
		id: '2',
		title: 'Odisha Govt Jobs Result 2026 (OPSC / OSSSC / OSSC)',
		department: 'Odisha Public Service & Staff Selection',
		date: 'Updated 2026',
		badgeText: 'Merit List',
		badgeColor: '#2563EB',
		slug: 'odisha-govt-jobs-result-2026',
	},
	{
		id: '3',
		title: 'OSSC CGL Tier-1 Written Exam Result 2026',
		department: 'Odisha Staff Selection Commission',
		date: '2 Days Ago',
		badgeText: 'Scorecard',
		badgeColor: '#D97706',
		slug: 'ossc-cgl-tier-1-result-2026',
	},
]
