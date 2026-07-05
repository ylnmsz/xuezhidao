import dotenv from 'dotenv'

dotenv.config()

const config = {
  port: Number(process.env.PORT || 4000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'deepseek-chat',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  mineruApiUrl: process.env.MINERU_API_URL || 'https://mineru.net/api/v4/file-urls/batch',
  mineruApiToken: process.env.MINERU_API_TOKEN || '',
  mineruApiResultUrl:
    process.env.MINERU_API_RESULT_URL || 'https://mineru.net/api/v4/extract-results/batch',
  mineruModelVersion: process.env.MINERU_MODEL_VERSION || 'vlm',
}

if (!config.databaseUrl) {
  // eslint-disable-next-line no-console
  console.warn('DATABASE_URL is not set. Server will fail on DB access.')
}

export default config
