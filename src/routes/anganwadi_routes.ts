import { Router } from 'express'
import db from '../lib/db.js'

const router = Router()

interface AnganwadiCenter {
    slNo: string
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

router.get('/anganwadi', (req, res) => {
    const dummyData: AnganwadiCenter[] = [
        {
            slNo: '1',
            anganwadiCenterName: 'GHOSAR -A',
            district: 'ANGUL',
            ruralUrbanProject: 'KISHORENAGAR',
            area: 'GHOSAR : HOUSE NO-1 JAI SAHU to HOUSE NO- 228 ASHOK KUMAR MISHRA PADIABANDHU PALI : HOUSE NO-1 JAI SAHU to HOUSE NO- 228 ASHOK KUMAR MISHRA KISHORECHANDRAPUR : HOUSE NO-1 JAI SAHU to HOUSE NO- 228 ASHOK KUMAR MISHRA',
            vacantPositions: '1',
            startDate: '16/07/2026',
            endDate: '30/07/2026',
            canApply: true,
            awwEventId: '32898',
            applyUrl: 'https://engagement-awc.odisha.gov.in/applyForAwwRecruitmentFromOutside.htm?awwEventId=32898',
            viewDocumentsUrl: 'https://engagement-awc.odisha.gov.in/viewAwwEventDocumentOutside.htm?awwEventId=32898',
            tab: 'Active',
            searchedDistrict: 'ANGUL',
            forValue: 'W',
        },
    ]
    res.json(dummyData)
})

/**
 * Create a new Anganwadi Center record
 * POST /api/anganwadi
 */
router.post('/anganwadi', async (req, res) => {
    try {
        const {
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
        }: AnganwadiCenter = req.body

        // Note: You would typically have validation here to ensure all required fields are present.

        // The database insertion logic is commented out, similar to user.ts.
        // You can uncomment and adapt it once your 'anganwadi_centers' table is ready.
        const result = await db.execute({
            sql: 'INSERT INTO anganwadi_centers (anganwadiCenterName, district, ruralUrbanProject, area, vacantPositions, startDate, endDate, canApply, awwEventId, applyUrl, viewDocumentsUrl, tab, searchedDistrict, forValue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [anganwadiCenterName, district, ruralUrbanProject, area, vacantPositions, startDate, endDate, canApply, awwEventId, applyUrl, viewDocumentsUrl, tab, searchedDistrict, forValue],
        });

        res.status(201).json({
            success: true,
            message: 'Anganwadi center record created successfully (simulation)',
            // data: req.body, // Returning the request body as confirmation
            data: { id: result.lastInsertRowid, ...req.body } // Use this line when DB is connected
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