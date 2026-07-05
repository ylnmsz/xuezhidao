import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../db.js'

const run = async () => {
  try {
    // Resolve relative to this script's location: server/src/scripts -> server/sql/schema.sql
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const sqlPath = path.resolve(__dirname, '..', '..', 'sql', 'schema.sql')
    const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' })
    console.log('Running migrations from', sqlPath)
    await pool.query(sql)
    console.log('Migrations executed successfully')
    process.exit(0)
  } catch (err) {
    console.error('Migration failed:', err)
    process.exit(1)
  }
}

run()
