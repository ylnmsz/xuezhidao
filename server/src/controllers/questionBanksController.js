import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listQuestionBanks = async (req, res) => {
  const { subject, createdBy } = req.query
  try {
    if (subject || createdBy) {
      const filters = []
      const values = []
      if (subject) {
        values.push(subject)
        filters.push(`subject = $${values.length}`)
      }
      if (createdBy) {
        values.push(createdBy)
        filters.push(`created_by = $${values.length}`)
      }
      const result = await query(
        `SELECT id, name, description, subject, created_by, created_at FROM question_banks WHERE ${filters.join(
          ' AND ',
        )} ORDER BY created_at DESC`,
        values,
      )
      return res.json({ items: result.rows })
    }

    const result = await query(
      'SELECT id, name, description, subject, created_by, created_at FROM question_banks ORDER BY created_at DESC',
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getQuestionBankById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, description, subject, created_by, created_at FROM question_banks WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question bank not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createQuestionBank = async (req, res) => {
  const { name, description, subject, created_by } = req.body
  if (!name) {
    return res.status(400).json({ message: 'name is required.' })
  }

  try {
    const bankId = randomUUID()
    const result = await query(
      'INSERT INTO question_banks (id, name, description, subject, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, subject, created_by, created_at',
      [bankId, name, description || null, subject || null, created_by || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateQuestionBank = async (req, res) => {
  const { name, description, subject } = req.body
  try {
    const result = await query(
      'UPDATE question_banks SET name = COALESCE($1, name), description = COALESCE($2, description), subject = COALESCE($3, subject) WHERE id = $4 RETURNING id, name, description, subject, created_by, created_at',
      [name || null, description || null, subject || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question bank not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteQuestionBank = async (req, res) => {
  try {
    const result = await query('DELETE FROM question_banks WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question bank not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
