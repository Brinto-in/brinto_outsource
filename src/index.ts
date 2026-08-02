import axios from 'axios'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dbRoutes from './routes/db-example.js'
import userRoutes from './routes/user.js'
import anganwadiRoutes from './routes/anganwadi_routes.js'
import testRoutes from './routes/test.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

// Database routes
app.use('/api', dbRoutes)
// User routes
app.use('/api/user', userRoutes)
// Anganwadi routes
app.use('/api', anganwadiRoutes)

// Anganwadi routes
app.use('/api/test', testRoutes)

// Home route - HTML
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
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

/**
 * ✅ Get SAMS Cutoff Marks
 * POST /api/config/sams-cutoff-deg
 */
app.post("/sams-cutoff-deg", async (req, res) => {
  try {
    const { tkn, dist, colg, acyear, SelectionType } = req.body;
    const response = await axios.post("https://degree.samsodisha.gov.in/HSS/SAMSWebService.asmx/GetCutOffMarksDeg", {
      tkn,
      dist,
      colg,
      acyear,
      SelectionType
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cutoff marks",
      error: error.message
    });
  }
});

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
