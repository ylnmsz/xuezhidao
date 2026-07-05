import { randomUUID } from 'crypto'
import { query } from '../db.js'
import { awardPoints, POINT_REASONS } from '../services/studentStatsService.js'

export const listSubmissions = async (req, res) => {
  const { assignmentId, studentId } = req.query
  try {
    if (assignmentId) {
      const result = await query(
        `SELECT s.id, s.assignment_id, s.student_id, s.content, s.score, s.status, s.submitted_at, s.graded_at,
                u.name AS student_name, u.avatar_url
         FROM submissions s
         LEFT JOIN users u ON s.student_id = u.id
         WHERE s.assignment_id = $1
         ORDER BY s.submitted_at DESC`,
        [assignmentId],
      )
      return res.json({ items: result.rows })
    }
    if (studentId) {
      const result = await query(
        `SELECT s.id, s.assignment_id, s.student_id, s.content, s.score, s.status, s.submitted_at, s.graded_at,
                u.name AS student_name, u.avatar_url
         FROM submissions s
         LEFT JOIN users u ON s.student_id = u.id
         WHERE s.student_id = $1
         ORDER BY s.submitted_at DESC`,
        [studentId],
      )
      return res.json({ items: result.rows })
    }
    const result = await query(
      `SELECT s.id, s.assignment_id, s.student_id, s.content, s.score, s.status, s.submitted_at, s.graded_at,
              u.name AS student_name, u.avatar_url
       FROM submissions s
       LEFT JOIN users u ON s.student_id = u.id
       ORDER BY s.submitted_at DESC`,
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

    // 提交作业奖励 10 积分
    await awardPoints(
      student_id,
      10,
      POINT_REASONS.SUBMIT_HOMEWORK,
      submissionId,
    ).catch((err) => console.error('Failed to award submit points:', err))

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
      [content ?? null, score ?? null, status ?? null, graded_at ?? null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Submission not found.' })
    }

    // 批改得分时奖励高分积分
    if (score !== undefined && score !== null) {
      const sub = result.rows[0]
      const bonusPoints =
        score >= 90 ? 20 : score >= 80 ? 10 : score >= 60 ? 5 : 0
      if (bonusPoints > 0) {
        await awardPoints(
          sub.student_id,
          bonusPoints,
          POINT_REASONS.HIGH_SCORE_BONUS,
          req.params.id,
        ).catch((err) => console.error('Failed to award score bonus:', err))
      }
    }

    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取当前学生的最近练习记录（含作业标题）
 * GET /submissions/me/recent?limit=10
 */
export const getMyRecentPractice = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 10, 50)
  try {
    const result = await query(
      `SELECT
         s.id, s.assignment_id, s.score, s.status, s.submitted_at, s.graded_at,
         a.title AS assignment_title,
         a.class_id,
         c.name AS class_name
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       LEFT JOIN classes c ON a.class_id = c.id
       WHERE s.student_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT $2`,
      [req.user.id, limit],
    )
    return res.json({ items: result.rows })
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
