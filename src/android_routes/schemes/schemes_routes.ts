import { Router, Response } from 'express'
import { loadSessionState, StateRequest } from '../../middleware/state.js'
import { allOdishaSchemes, StateSchemeItem } from './odisha_schemes.js'

const router = Router()

// Apply state middleware to all routes in this router
router.use(loadSessionState)

interface SchemeQuery {
	title?: string
	slug?: string
	state?: string
	category?: string
	tag?: string
	page?: string
}

/**
 * GET /api/schemes
 * Returns schemes based on session state and query filters with pagination
 * Query params:
 *   - title: Search by scheme title (substring match)
 *   - slug: Filter by slug (exact match)
 *   - state: Filter by state (defaults to session state from middleware)
 *   - category: Filter by category
 *   - tag: Filter by tag
 *   - page: Page number (default: 1, items per page: 3)
 * Requires: session_id header (fetches state from database)
 */
router.get('/', (req: StateRequest, res: Response) => {
	try {
		const recommendedTags = [
			'All',
			'Subhadra',
			'Farmers (KALIA)',
			'Women & Youth',
			'Health (BSKY)',
			'Pension',
		]
		const query = req.query as SchemeQuery
		const ITEMS_PER_PAGE = 3
		const page = Math.max(1, parseInt(query.page || '1', 10))

		// Filter by state (use query param if provided, otherwise default to session state)
		const stateFilter = query.state || req.sessionState

		// Return empty array if no state filter provided
		if (!stateFilter) {
			return res.status(200).json({
				success: true,
				data: [],
				total: 0,
				state: stateFilter,
				recommendedTags: [],
				pagination: {
					page,
					itemsPerPage: ITEMS_PER_PAGE,
					totalItems: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			})
		}

		let filteredSchemes: StateSchemeItem[] = [...allOdishaSchemes]

		// Filter by state
		filteredSchemes = filteredSchemes.filter(
			(scheme) => scheme.state.toLowerCase() === stateFilter.toLowerCase()
		)

		// Filter by title (substring match)
		if (query.title) {
			filteredSchemes = filteredSchemes.filter(
				(scheme) => scheme.title.toLowerCase().includes((query.title as string).toLowerCase())
			)
		}

		// Filter by slug (exact match)
		if (query.slug) {
			filteredSchemes = filteredSchemes.filter(
				(scheme) => scheme.slug.toLowerCase() === (query.slug as string).toLowerCase()
			)
		}

		// Filter by category if provided
		if (query.category) {
			filteredSchemes = filteredSchemes.filter(
				(scheme) => scheme.category.toLowerCase() === query.category?.toLowerCase()
			)
		}

		// Filter by tag if provided
		if (query.tag) {
			filteredSchemes = filteredSchemes.filter(
				(scheme) => scheme.tag.toLowerCase() === query.tag?.toLowerCase()
			)
		}

		// Calculate pagination
		const totalItems = filteredSchemes.length
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
		const startIndex = (page - 1) * ITEMS_PER_PAGE
		const endIndex = startIndex + ITEMS_PER_PAGE
		const paginatedSchemes = filteredSchemes.slice(startIndex, endIndex)

		return res.status(200).json({
			success: true,
			data: paginatedSchemes,
			total: totalItems,
			state: stateFilter,
			recommendedTags,
			pagination: {
				page,
				itemsPerPage: ITEMS_PER_PAGE,
				totalItems,
				totalPages,
				hasNextPage: page < totalPages,
				hasPrevPage: page > 1,
			},
		})
	} catch (error) {
		console.error('Error fetching schemes:', error)
		return res.status(500).json({
			success: false,
			message: 'Failed to fetch schemes',
			error: error instanceof Error ? error.message : 'Unknown error',
		})
	}
})

export default router
