import express from 'express'
import { requireStateHeader } from '../middleware/state.js'

const router = express.Router()

const popularServices = [
	{
		label: 'PAN Card',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AP1WRLtHKtdqECblcF7wGvszZR2gZ_D-TbF3wa0cSuaNYJteYiAvBYGz8_gpjIxExo74A7klDluiiKpkJDYoR6cQY-Y_TVgmm8YLLgO5XZUU6jENHVDTI1ta6sep-gYN0Bz7IX2jC-NpZdvjNXPM_Wi8Syhya2NMLX8lOuCBldYQB7I6fsfoI3pDX5X54O8Jx0h03TUq-0n2cGMIznUh-rgbSg1SKlG7AeAQR1sZOCkJl9dPne4Uzc0q9Bj3Bw',
	},
	{
		label: 'RTO',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AEtjO1U6kQiWl8FUHXh0CeLIdCLvZTIT3BfHDUo0x5floLNUjnHoECkP21cn0gvse9MH1CylhAxxaFDM2LX4S-3Ug4vDx9bzw-hXiWL0S9UOdKmJO-Ot8JhLp6LXFlbzokdmtdNWezIMXsKXQsP_w0Qko0qgi7GM01iirGOZ8I5zEgmhBYsT0Ekw05fqOvdHU9aIzklO8cCoU8usDXBhvVI78p9R2Zre7d3EdfMiwLuwUEVepnr91Tf1RIJ_GA',
	},
	{
		label: 'Scholarships',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AEtjO1VlyPhsvoHF2zFTK5chjjjJgf5ZRwKc2pQpBC-BWpimZxU-4VI4NZasWXJ4klcUkYMNYGaUVjg664MAvPjWsZIi4CXFMpwpzSUexTe-DT8cnhxAA6EgAPYBvZRbJin1ZYUe0MuSii_CkEp02orWIxFhrKSJB_D2lW4AOm16N_YK9-81UVQxuxV0eA04KDsuHZZkoiAOW1aHIvrWZV7mHwcjYiiHRpOmq0FByndR70DSfd35X-DGhCkspw',
	},
	{
		label: 'Anganwadi',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AP1WRLto_9DamuV2WNZ7foXYWEAsQ71JqOXp2cvGDtU21l77Bv9YVf4XrUctp2LbHjzfSIq0vQY3emM3OwkjCL8DwmHFpUt4dle115PTRyX1jQz9ss6DygY_n1IZmHIjG5FZbq8TnI-DpwIP0SyOOYzTyPJ64dOm9j2e4DPfIxPa8anU8jYqd76FlHNw6QGoYBrSbgrWU8apAgC1rDvpM-1ikwGymY-_xfD1669UlvcpNuB0tG0If8Sw-nhxGWk',
	},
	{
		label: 'Tahasil',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AEtjO1WdZ39MOeYtD8myAwgdMgUI4EdkQ-0beAf2myfWoYrwI1OnSNT-xSfqvJ_mxdCCOmxw1_nxRI3e7eNshFjn1kGULR88uSRHvf9QrH9PZ_Bjh9qFp7iY-L6ccgGqYYGuNhwzzL_ueXiPOx7BtrT0nrSyY48YICvNdMqbQKCbVAwVKOagODpAnpxlARzJ_ZUs0nz13kdHI11nPNtLWmFM3kYeLsJFYN5QRPnn72oEi_nS0KJNWqcajRZz2xc',
	},
	{
		label: 'Near Me',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AP1WRLtAiz_z6gKdhBBvsnkihODMzWte1avyLlWglTUa3Hw4E2Q-DfXTzcRat-oTNYhqWpO9a5paXpEAVJEMaDWl4yjPQ3q-qtotjcKGOWtz3iix2IjB2aumEf7-pnWoG3QVUtZqieZwh4rtX6vIzgT2EEjDgMCVFF-_2gau6YJZ1bji1dhXboxZvTupGxjBlSa2RJ8tndc-s7wQV_5KcTsARyzO3ExG_YvefGfHXc7QcH3XoYVZzSGM9De9sTc',
	},
	{
		label: 'Feeds',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AP1WRLsy_BZW_MT1x-2BVRu4AE-Mi2U4zJ6dEv2T5X9vlk9LtU_ersaRmBte9S9CctVf0M-u9jj3bR5Nzz7uPFaWBGNP_J7tKc0j_eA4neto7VVlV_UAMuMgwFsd4XaxX_k6XBMHjSIeGo1vAFLcu8THSAGQ6Vc-7nxpdjuxMXNFYZ2hd2ghdsJcqn4vJIwUhE1PzJ88bJmpfXlBs84ny2zmpebiWy_UD9xUqFAXkYveSOEwoyTlDobpeaeZtzA',
	},
	{
		label: 'Notifications',
		imageUrl:
			'https://lh3.googleusercontent.com/aida/AP1WRLvVfRCBMu8NezXh-yD9rGUDinq68jjWITxs9KTHO1oeeBFIx8l37AbSbu6Y5qo8aWFn0_A-Sz1IrRJ6bNhnm4VFQjj31MVsSR28FHuzJ9OqywOyVSJ7szJVJQnH9J8vs1_yl3WAU--WVYkauDSW3F8PaZJ0xU7T__hYsdwpB_xpfFilKH29cPEoX5iEzUoEAu-z39mNvpGiE5CY-drvN0pYMOkgNTp8O4B7_qPPSOy6m0CwnEtc5wAG4kM',
	},
]

router.get('/home_config', requireStateHeader, (req, res) => {
	const state = req.get('state')

	res.json(popularServices.map((service) => ({
		...service,
		state,
	})))
})

export default router
