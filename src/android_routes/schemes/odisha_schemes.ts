export interface StateSchemeItem {
	title: string
	subtitle: string
	tag: string
	category: string
	icon: string
	color: string
	bgColor: string
	badgeText: string
	badgeColor: string
	formId: string
	slug: string
	state: string
}

export const allOdishaSchemes: StateSchemeItem[] = [
	{
		title: 'Subhadra Yojana',
		subtitle: '₹50,000 financial assistance for women in 5 years (₹10k/yr)',
		tag: 'Subhadra',
		category: 'Women Empowerment',
		icon: 'volunteer_activism_rounded',
		color: '#E11D48',
		bgColor: '#FFE4E6',
		badgeText: 'Active • High Demand',
		badgeColor: '#E11D48',
		formId: 'subhadra-yojana-2024',
		slug: 'subhadra-yojana-6a92890ea0a6ba64feff744c',
		state: 'odisha',
	},
	{
		title: 'KALIA Yojana (Krushak Assistance)',
		subtitle: 'Financial aid for small & marginal farmers & landless cultivators',
		tag: 'Farmers (KALIA)',
		category: 'Agriculture & Farmers',
		icon: 'agriculture_rounded',
		color: '#16A34A',
		bgColor: '#DCFCE7',
		badgeText: '₹10,000 / Year',
		badgeColor: '#16A34A',
		formId: 'kalia-scheme-assistance',
		slug: 'kalia-yojana',
		state: 'odisha',
	},
	{
		title: 'Biju Swasthya Kalyan Yojana (BSKY)',
		subtitle: 'Cashless health coverage up to ₹5 Lakh (₹10 Lakh for women)',
		tag: 'Health (BSKY)',
		category: 'Healthcare & Insurance',
		icon: 'health_and_safety_rounded',
		color: '#0284C7',
		bgColor: '#E0F2FE',
		badgeText: 'Cashless Hospitalization',
		badgeColor: '#0284C7',
		formId: 'bsky-card-services',
		slug: 'biju-swasthya-kalyan',
		state: 'odisha',
	},
	{
		title: 'Madhu Babu Pension Yojana (MBPY)',
		subtitle: 'Monthly pension for elderly, widows, persons with disabilities',
		tag: 'Pension',
		category: 'Social Security',
		icon: 'elderly_rounded',
		color: '#7C3AED',
		bgColor: '#F3E8FF',
		badgeText: 'Monthly Aid',
		badgeColor: '#7C3AED',
		formId: 'madhu-babu-pension',
		slug: 'madhu-babu-pension-yojana',
		state: 'odisha',
	},
	{
		title: 'Sujal - Drink from Tap Mission',
		subtitle: '24x7 quality potable piped drinking water supply connection',
		tag: 'Women & Youth',
		category: 'Water & Sanitation',
		icon: 'water_drop_rounded',
		color: '#0D9488',
		bgColor: '#CCFBF1',
		badgeText: 'Urban Odisha',
		badgeColor: '#0D9488',
		formId: 'sujal-tap-water-connection',
		slug: 'sujal-drink-from-tap',
		state: 'odisha',
	},
	{
		title: 'Biju Yuva Sashaktikaran Yojana',
		subtitle: 'Free laptops & digital skill assistance for meritorious students',
		tag: 'Women & Youth',
		category: 'Education & Youth',
		icon: 'laptop_chromebook_rounded',
		color: '#EA580C',
		bgColor: '#FFEDD5',
		badgeText: 'Students & Youth',
		badgeColor: '#EA580C',
		formId: 'biju-yuva-sashaktikaran',
		slug: 'biju-yuva-sashaktikaran',
		state: 'odisha',
	},
	{
		title: 'Mo Ghara Yojana',
		subtitle: 'Credit linked housing scheme for rural households in Odisha',
		tag: 'All',
		category: 'Housing & Shelter',
		icon: 'cottage_rounded',
		color: '#475569',
		bgColor: '#F1F5F9',
		badgeText: 'Subsidized Loan',
		badgeColor: '#475569',
		formId: 'mo-ghara-housing-scheme',
		slug: 'mo-ghara-yojana',
		state: 'odisha',
	},
	{
		title: 'Balaram Yojana',
		subtitle: 'Credit support for landless farmers through Joint Liability Groups',
		tag: 'Farmers (KALIA)',
		category: 'Agriculture Credit',
		icon: 'eco_rounded',
		color: '#15803D',
		bgColor: '#E7FEE7',
		badgeText: 'Credit Linkage',
		badgeColor: '#15803D',
		formId: 'balaram-yojana-credit',
		slug: 'balaram-yojana',
		state: 'odisha',
	},
]
