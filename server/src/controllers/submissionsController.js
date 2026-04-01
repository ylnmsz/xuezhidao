import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listSubmissions = async (req, res) => {
  const { assignmentId, studentId } = req.query
  try {
    if (assignmentId) {
      const result = await query(
        'SELECT id, assignment_id, student_id, content, score, status, submitted_at, graded_at FROM submissions WHERE assignment_id = $1 ORDER BY submitted_at DESC',
        [assignmentId],
      )
      return res.json({ items: result.rows })
    }
    if (studentId) {
      const result = await query(
        'SELECT id, assignment_id, student_id, content, score, status, submitted_at, graded_at FROM submissions WHERE student_id = $1 ORDER BY submitted_at DESC',
        [studentId],
      )
      return res.json({ items: result.rows })
    }
    const result = await query(
      'SELECT id, assignment_id, student_id, content, score, status, submitted_at, graded_at FROM submissions ORDER BY submitted_at DESC',
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getSubmissionById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, assignment_id, student_id, content, score, status, submitted_at, graded_at FROM submissions WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createSubmission = async (req, res) => {
  const { assignment_id, student_id, content } = req.body
  if (!assignment_id || !student_id) {
    return res.status(400).json({ message: 'assignment_id and student_id are required.' })
  }

  try {
    const submissionId = randomUUID()
    const result = await query(
      'INSERT INTO submissions (id, assignment_id, student_id, content) VALUES ($1, $2, $3, $4) RETURNING id, assignment_id, student_id, content, score, status, submitted_at, graded_at',
      [submissionId, assignment_id, student_id, content || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateSubmission = async (req, res) => {
  const { content, score, status, graded_at } = req.body
  try {
    const result = await query(
      'UPDATE submissions SET content = COALESCE($1, content), score = COALESCE($2, score), status = COALESCE($3, status), graded_at = COALESCE($4, graded_at) WHERE id = $5 RETURNING id, assignment_id, student_id, content, score, status, submitted_at, graded_at',
      [content || null, score || null, status || null, graded_at || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteSubmission = async (req, res) => {
  try {
    const result = await query('DELETE FROM submissions WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
