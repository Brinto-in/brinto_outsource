import { Request, Response, NextFunction } from 'express'

export const requireStateHeader = (req: Request, res: Response, next: NextFunction) => {
	const state = req.get('state')

	if (!state?.trim()) {
		return res.status(400).json({
			success: false,
			message: 'state is required',
		})
	}

	next()
}