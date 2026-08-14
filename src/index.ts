import axios from 'axios'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import dbRoutes from './routes/db-example.js'
import userRoutes from './routes/user.js'
import anganwadiRoutes from './routes/anganwadi_routes.js'
import testRoutes from './routes/test.js'
import attemptsRoutes from './routes/attempts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())

app.use(express.static(path.join(__dirname, '..', 'public')))

// Database routes
app.use('/api', dbRoutes)

// User routes
app.use('/api/user', userRoutes)

// Anganwadi routes
app.use('/api', anganwadiRoutes)

// Test routes
app.use('/api/test', testRoutes)

// Attempts routes
app.use('/api/attempts', attemptsRoutes)

// SAMS Cutoff
app.post('/sams-cutoff-deg', async (req, res) => {
  try {
    const {
      tkn,
      dist,
      colg,
      acyear,
      SelectionType
    } = req.body

    const response = await axios.post(
      'https://degree.samsodisha.gov.in/HSS/SAMSWebService.asmx/GetCutOffMarksDeg',
      {
        tkn,
        dist,
        colg,
        acyear,
        SelectionType
      }
    )

    res.json(response.data)
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cutoff marks',
      error: error.message
    })
  }
})

// Cloudflare Image Upload URL
app.post('/api/get-upload-url', async (req, res) => {
  try {
    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_API_TOKEN) {
      console.error('Cloudflare environment variables CF_ACCOUNT_ID or CF_API_TOKEN are not set.');
      return res.status(500).json({
        success: false,
        message: 'Image upload service is not configured.',
      });
    }

    const cfResponse = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
      {}, // The direct_upload API expects an empty body
      {
        headers: {
          'Authorization': `Bearer ${process.env.CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = cfResponse.data;

    if (!data.success) {
      console.error('Cloudflare API Error:', data.errors);
      return res.status(500).json({ success: false, message: 'Failed to get upload URL from provider.' });
    }

    // Returns { result: { id, uploadURL }, success: true, errors: [], messages: [] }
    res.json({ success: true, ...data.result });

  } catch (error: any) {
    console.error('Error getting Cloudflare upload URL:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: 'Failed to generate upload URL.' });
  }
});

// Home
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <h1>Welcome to Express on Vercel 🚀</h1>
      </body>
    </html>
  `)
})

// API example
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

export default app