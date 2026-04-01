import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listAssignments = async (req, res) => {
  const { classId } = req.query
  try {
    const result = classId
      ? await query(
          'SELECT id, class_id, title, description, due_at, created_at FROM assignments WHERE class_id = $1 ORDER BY created_at DESC',
          [classId],
        )
      : await query(
          'SELECT id, class_id, title, description, due_at, created_at FROM assignments ORDER BY created_at DESC',
        )
    return res.json({ items: result.rows })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getAssignmentById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, class_id, title, description, due_at, created_at FROM assignments WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createAssignment = async (req, res) => {
  const { class_id, title, description, due_at } = req.body
  if (!class_id || !title) {
    return res.status(400).json({ message: 'class_id and title are required.' })
  }

  try {
    const assignmentId = randomUUID()
    const result = await query(
      'INSERT INTO assignments (id, class_id, title, description, due_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, class_id, title, description, due_at, created_at',
      [assignmentId, class_id, title, description || null, due_at || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateAssignment = async (req, res) => {
  const { title, description, due_at, class_id } = req.body
  try {
    const result = await query(
      'UPDATE assignments SET title = COALESCE($1, title), description = COALESCE($2, description), due_at = COALESCE($3, due_at), class_id = COALESCE($4, class_id) WHERE id = $5 RETURNING id, class_id, title, description, due_at, created_at',
      [title || null, description || null, due_at || null, class_id || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteAssignment = async (req, res) => {
  try {
    const result = await query('DELETE FROM assignments WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const listSubmissions = async (req, res) => {
  res.json({ assignmentId: req.params.id, items: [] })
}
