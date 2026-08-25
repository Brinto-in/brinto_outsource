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
import homeConfigRoutes from './android_routes/home_configs.js'
import scholarshipFeedsRoutes from './android_routes/scholarship_feeds.js'
import { requireApiVersion } from './middleware/api_version.js'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

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

// Android home configuration
app.use('/api/android', requireApiVersion, homeConfigRoutes)
app.use('/api/android', requireApiVersion, scholarshipFeedsRoutes)

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

app.post('/api/get-upload-url', async (req, res) => {
  try {
    const {
      fileName,
      contentType = 'application/pdf',
    } = req.body;

    if (
      !process.env.CF_ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      console.error('R2 environment variables are not configured.');

      return res.status(500).json({
        success: false,
        message: 'R2 upload service is not configured.',
      });
    }

    if (!fileName) {
      return res.status(400).json({
        success: false,
        message: 'fileName is required.',
      });
    }

    const key = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadURL = await getSignedUrl(r2, command, {
      expiresIn: 600,
    });

    return res.json({
      success: true,
      uploadURL,
      key,
    });

  } catch (error) {
    console.error(
      'Error generating R2 upload URL:',
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to generate upload URL.',
    });
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