import { Request, Response, NextFunction } from 'express'

const REQUIRED_API_VERSION = '1.0.4'

export const requireApiVersion = (req: Request, res: Response, next: NextFunction) => {
	const version = req.get('version')

	if (version !== REQUIRED_API_VERSION) {
		return res.status(400).json({
			success: false,
			message: `version header must be ${REQUIRED_API_VERSION}`,
		})
	}

	next()
}