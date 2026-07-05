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

// Global error handler – catches multer errors and other unhandled rejections
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('[error-handler]', err)

  // Multer errors (LIMIT_FILE_SIZE, etc.)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: '文件大小超过限制（最大 10MB）。' })
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: `上传错误: ${err.message}` })
  }

  // Generic server error
  const status = err.status || err.statusCode || 500
  return res.status(status).json({
    message: err.message || '服务器内部错误',
  })
})

export default app
