import { randomUUID } from 'crypto'
import multer from 'multer'
import { parse } from 'csv-parse/sync'
import pool, { query } from '../db.js'

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isCsv =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname?.toLowerCase().endsWith('.csv')
    if (isCsv) {
      return cb(null, true)
    }
    return cb(new Error('Only CSV uploads are allowed.'))
  },
})

export const uploadQuestionsCsv = csvUpload.single('file')

export const listQuestions = async (req, res) => {
  const { subject, difficulty, bankId } = req.query
  try {
    if (subject || difficulty || bankId) {
      const filters = []
      const values = []
      if (subject) {
        values.push(subject)
        filters.push(`subject = $${values.length}`)
      }
      if (difficulty) {
        values.push(difficulty)
        filters.push(`difficulty = $${values.length}`)
      }
      if (bankId) {
        values.push(bankId)
        filters.push(`bank_id = $${values.length}`)
      }
      const result = await query(
        `SELECT id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation, created_at FROM questions WHERE ${filters.join(
          ' AND ',
        )} ORDER BY created_at DESC`,
        values,
      )
      return res.json({ items: result.rows })
    }

    const result = await query(
      'SELECT id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation, created_at FROM questions ORDER BY created_at DESC',
    )
    return res.json({ items: result.rows })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getQuestionById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation, created_at FROM questions WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createQuestion = async (req, res) => {
  const { content, subject, grade, difficulty, bank_id, question_type, answer, explanation } =
    req.body
  if (!content) {
    return res.status(400).json({ message: 'content is required.' })
  }
  if (!question_type) {
    return res.status(400).json({ message: 'question_type is required.' })
  }
  if (!answer) {
    return res.status(400).json({ message: 'answer is required.' })
  }

  try {
    const questionId = randomUUID()
    const result = await query(
      'INSERT INTO questions (id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation, created_at',
      [
        questionId,
        bank_id || null,
        content,
        subject || null,
        grade || null,
        difficulty || null,
        question_type,
        answer,
        explanation || null,
      ],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateQuestion = async (req, res) => {
  const { content, subject, grade, difficulty, bank_id, question_type, answer, explanation } =
    req.body
  try {
    const result = await query(
      'UPDATE questions SET content = COALESCE($1, content), subject = COALESCE($2, subject), grade = COALESCE($3, grade), difficulty = COALESCE($4, difficulty), bank_id = COALESCE($5, bank_id), question_type = COALESCE($6, question_type), answer = COALESCE($7, answer), explanation = COALESCE($8, explanation) WHERE id = $9 RETURNING id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation, created_at',
      [
        content || null,
        subject || null,
        grade || null,
        difficulty || null,
        bank_id || null,
        question_type || null,
        answer || null,
        explanation || null,
        req.params.id,
      ],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteQuestion = async (req, res) => {
  try {
    const result = await query('DELETE FROM questions WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const bulkCreateQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }

  let records
  try {
    records = parse(req.file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid CSV format.', error: error.message })
  }

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: 'CSV has no rows.' })
  }

  const requiredFields = ['content', 'question_type', 'difficulty', 'answer']
  const missingRow = records.findIndex((row) =>
    requiredFields.some((field) => !row[field] || String(row[field]).trim() === ''),
  )
  if (missingRow !== -1) {
    return res.status(400).json({
      message: 'CSV missing required fields.',
      row: missingRow + 1,
      required: requiredFields,
    })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const inserted = []
    for (const row of records) {
      const questionId = randomUUID()
      const result = await client.query(
        'INSERT INTO questions (id, bank_id, content, subject, grade, difficulty, question_type, answer, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
        [
          questionId,
          row.bank_id?.trim() || null,
          row.content,
          row.subject?.trim() || null,
          row.grade?.trim() || null,
          row.difficulty?.trim() || null,
          row.question_type?.trim() || null,
          row.answer?.trim() || null,
          row.explanation?.trim() || null,
        ],
      )
      inserted.push(result.rows[0])
    }
    await client.query('COMMIT')
    return res.status(201).json({ count: inserted.length, items: inserted })
  } catch (error) {
    await client.query('ROLLBACK')
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  } finally {
    client.release()
  }
}
