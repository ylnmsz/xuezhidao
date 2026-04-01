import { randomUUID } from 'crypto'
import { query } from '../db.js'

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
        `SELECT id, bank_id, content, subject, difficulty, created_at FROM questions WHERE ${filters.join(
          ' AND ',
        )} ORDER BY created_at DESC`,
        values,
      )
      return res.json({ items: result.rows })
    }

    const result = await query(
      'SELECT id, bank_id, content, subject, difficulty, created_at FROM questions ORDER BY created_at DESC',
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
      'SELECT id, bank_id, content, subject, difficulty, created_at FROM questions WHERE id = $1',
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
  const { content, subject, difficulty, bank_id } = req.body
  if (!content) {
    return res.status(400).json({ message: 'content is required.' })
  }

  try {
    const questionId = randomUUID()
    const result = await query(
      'INSERT INTO questions (id, bank_id, content, subject, difficulty) VALUES ($1, $2, $3, $4, $5) RETURNING id, bank_id, content, subject, difficulty, created_at',
      [questionId, bank_id || null, content, subject || null, difficulty || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateQuestion = async (req, res) => {
  const { content, subject, difficulty, bank_id } = req.body
  try {
    const result = await query(
      'UPDATE questions SET content = COALESCE($1, content), subject = COALESCE($2, subject), difficulty = COALESCE($3, difficulty), bank_id = COALESCE($4, bank_id) WHERE id = $5 RETURNING id, bank_id, content, subject, difficulty, created_at',
      [content || null, subject || null, difficulty || null, bank_id || null, req.params.id],
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
