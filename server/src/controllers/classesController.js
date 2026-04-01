import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listClasses = async (req, res) => {
  const { teacherId } = req.query
  try {
    const result = teacherId
      ? await query(
          'SELECT id, name, teacher_id, created_at FROM classes WHERE teacher_id = $1 ORDER BY created_at DESC',
          [teacherId],
        )
      : await query('SELECT id, name, teacher_id, created_at FROM classes ORDER BY created_at DESC')
    return res.json({ items: result.rows })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getClassById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, teacher_id, created_at FROM classes WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createClass = async (req, res) => {
  const { name, teacher_id } = req.body
  if (!name) {
    return res.status(400).json({ message: 'Name is required.' })
  }

  try {
    const classId = randomUUID()
    const result = await query(
      'INSERT INTO classes (id, name, teacher_id) VALUES ($1, $2, $3) RETURNING id, name, teacher_id, created_at',
      [classId, name, teacher_id || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateClass = async (req, res) => {
  const { name, teacher_id } = req.body
  try {
    const result = await query(
      'UPDATE classes SET name = COALESCE($1, name), teacher_id = COALESCE($2, teacher_id) WHERE id = $3 RETURNING id, name, teacher_id, created_at',
      [name || null, teacher_id || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteClass = async (req, res) => {
  try {
    const result = await query('DELETE FROM classes WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
