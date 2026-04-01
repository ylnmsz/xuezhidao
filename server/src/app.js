import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import config from './config.js'
import routes from './routes/index.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({ origin: config.corsOrigin, credentials: true }))
app.use(express.json())
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'xuezhidao-server' })
})

app.use('/api', routes)

export default app
