import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listErrorBook = async (req, res) => {
  const { userId } = req.query
  try {
    const result = userId
      ? await query(
          'SELECT id, user_id, question_id, note, created_at FROM error_book WHERE user_id = $1 ORDER BY created_at DESC',
          [userId],
        )
      : await query(
          'SELECT id, user_id, question_id, note, created_at FROM error_book ORDER BY created_at DESC',
        )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getErrorItemById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, user_id, question_id, note, created_at FROM error_book WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Error item not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createErrorItem = async (req, res) => {
  const { user_id, question_id, note } = req.body
  if (!user_id || !question_id) {
    return res.status(400).json({ message: 'user_id and question_id are required.' })
  }

  try {
    const itemId = randomUUID()
    const result = await query(
      'INSERT INTO error_book (id, user_id, question_id, note) VALUES ($1, $2, $3, $4) RETURNING id, user_id, question_id, note, created_at',
      [itemId, user_id, question_id, note || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateErrorItem = async (req, res) => {
  const { note } = req.body
  try {
    const result = await query(
      'UPDATE error_book SET note = COALESCE($1, note) WHERE id = $2 RETURNING id, user_id, question_id, note, created_at',
      [note || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Error item not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteErrorItem = async (req, res) => {
  try {
    const result = await query('DELETE FROM error_book WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Error item not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
