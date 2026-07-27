import { Router } from 'express'
import db from '../lib/db.js'

const router = Router()

interface AnganwadiCenter {
    slNo: string
    state: string
    anganwadiCenterName: string
    district: string
    ruralUrbanProject: string
    area: string
    vacantPositions: string
    startDate: string
    endDate: string
    canApply: boolean
    awwEventId: string
    applyUrl: string
    viewDocumentsUrl: string
    tab: string
    searchedDistrict: string
    forValue: string
}

router.get('/anganwadi', async (req, res) => {
    try {
        // Fetch all records from the anganwadi_centers table
        const result = await db.execute({
            sql: 'SELECT * FROM anganwadi_centers',
            args: [],
        })

        res.json(result.rows as unknown as AnganwadiCenter[])
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch anganwadi centers',
            error: error.message,
        })
    }
})

/**
 * Create a new Anganwadi Center record
 * POST /api/anganwadi
 */
router.post('/anganwadi', async (req, res) => {
    try {
        const {
            slNo,
            state,
            anganwadiCenterName,
            district,
            ruralUrbanProject,
            area,
            vacantPositions,
            startDate,
            endDate,
            canApply,
            awwEventId,
            applyUrl,
            viewDocumentsUrl,
            tab,
            searchedDistrict,
            forValue,
        } = req.body as AnganwadiCenter

        // Note: You would typically have validation here to ensure all required fields are present.

        // The database insertion logic is commented out, similar to user.ts.
        // You can uncomment and adapt it once your 'anganwadi_centers' table is ready.
        const result = await db.execute({
            sql: 'INSERT INTO anganwadi_recruitments (sl_no, state, anganwadi_center_name, district, rural_urban_project, area, vacant_positions, start_date, end_date, can_apply, aww_event_id, apply_url, view_documents_url, tab, searched_district, for_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [slNo, state, anganwadiCenterName, district, ruralUrbanProject, area, vacantPositions, startDate, endDate, canApply, awwEventId, applyUrl, viewDocumentsUrl, tab, searchedDistrict, forValue],
        });

        res.status(201).json({
            success: true,
            message: 'Anganwadi recruitment record created successfully',
            // data: req.body, // Returning the request body as confirmation
            data: { id: result.lastInsertRowid, ...req.body }, // Use this line when DB is connected
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: 'Failed to create anganwadi center record',
            error: error.message,
        })
    }
})

export default router