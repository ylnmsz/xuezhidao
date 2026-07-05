import { randomUUID } from 'crypto'
import { query } from '../db.js'
import { awardErrorBookPoints } from '../services/studentStatsService.js'

/**
 * 获取错题本列表（含题目详情，支持分页/筛选/搜索）
 * GET /api/errorbook?subject=&search=&page=1&pageSize=20
 */
export const listErrorBook = async (req, res) => {
  const userId = req.user.id
  const { subject, search, page = '1', pageSize = '20' } = req.query
  const limit = Math.min(parseInt(pageSize) || 20, 100)
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit

  try {
    const conditions = ['e.user_id = $1']
    const values = [userId]
    let paramIndex = 2

    if (subject) {
      conditions.push(`q.subject = $${paramIndex++}`)
      values.push(subject)
    }
    if (search) {
      conditions.push(`q.content ILIKE $${paramIndex++}`)
      values.push(`%${search}%`)
    }

    const whereClause = conditions.join(' AND ')

    // Total count
    const countResult = await query(
      `SELECT COUNT(*)::int AS total FROM error_book e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE ${whereClause}`,
      values,
    )
    const total = countResult.rows[0]?.total || 0

    // Paginated results with question details
    const result = await query(
      `SELECT
         e.id, e.user_id, e.question_id, e.note, e.student_answer, e.created_at,
         q.content, q.stem_image_url, q.subject, q.grade, q.difficulty,
         q.question_type, q.answer AS correct_answer, q.explanation
       FROM error_book e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE ${whereClause}
       ORDER BY e.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...values, limit, offset],
    )

    // Subject stats for the student
    const statsResult = await query(
      `SELECT
         q.subject,
         COUNT(*)::int AS count
       FROM error_book e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE e.user_id = $1
       GROUP BY q.subject
       ORDER BY count DESC`,
      [userId],
    )

    return res.json({
      items: result.rows,
      total,
      page: parseInt(page),
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      subjectStats: statsResult.rows,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取错题本统计数据（总错题数、各学科分布等）
 * GET /api/errorbook/stats
 */
export const getErrorBookStats = async (req, res) => {
  const userId = req.user.id
  try {
    // 总错题数
    const totalResult = await query(
      'SELECT COUNT(*)::int AS total FROM error_book WHERE user_id = $1',
      [userId],
    )
    const total = totalResult.rows[0]?.total || 0

    // 各学科分布
    const subjectResult = await query(
      `SELECT
         COALESCE(q.subject, '未分类') AS subject,
         COUNT(*)::int AS count
       FROM error_book e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE e.user_id = $1
       GROUP BY q.subject
       ORDER BY count DESC`,
      [userId],
    )

    // 最近错题日期分布（近7天）
    const recentResult = await query(
      `SELECT DATE(e.created_at) AS date, COUNT(*)::int AS count
       FROM error_book e
       WHERE e.user_id = $1 AND e.created_at >= NOW() - INTERVAL '7 days'
       GROUP BY DATE(e.created_at)
       ORDER BY date`,
      [userId],
    )

    return res.json({
      total,
      subjectDistribution: subjectResult.rows,
      recent7Days: recentResult.rows,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取单条错题详情
 * GET /api/errorbook/:id
 */
export const getErrorItemById = async (req, res) => {
  try {
    const result = await query(
      `SELECT
         e.id, e.user_id, e.question_id, e.note, e.student_answer, e.created_at,
         q.content, q.stem_image_url, q.subject, q.grade, q.difficulty,
         q.question_type, q.answer AS correct_answer, q.explanation
       FROM error_book e
       LEFT JOIN questions q ON e.question_id = q.id
       WHERE e.id = $1`,
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

/**
 * 创建错题条目（自动去重）
 * POST /api/errorbook
 * Body: { question_id, note? }
 */
export const createErrorItem = async (req, res) => {
  const userId = req.user.id
  const { question_id, note, student_answer } = req.body

  if (!question_id) {
    return res.status(400).json({ message: 'question_id is required.' })
  }

  try {
    // 去重检查
    const existing = await query(
      'SELECT id, note, created_at FROM error_book WHERE user_id = $1 AND question_id = $2',
      [userId, question_id],
    )
    if (existing.rowCount > 0) {
      return res.status(200).json(existing.rows[0])
    }

    const itemId = randomUUID()
    const result = await query(
      `INSERT INTO error_book (id, user_id, question_id, note, student_answer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, question_id, note, student_answer, created_at`,
      [itemId, userId, question_id, note || null, student_answer || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 更新错题笔记
 * PUT /api/errorbook/:id
 * Body: { note }
 */
export const updateErrorItem = async (req, res) => {
  const { note, student_answer } = req.body
  try {
    const result = await query(
      'UPDATE error_book SET note = COALESCE($1, note), student_answer = COALESCE($2, student_answer) WHERE id = $3 RETURNING id, user_id, question_id, note, student_answer, created_at',
      [note || null, student_answer || null, req.params.id],
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

/**
 * 标记错题已掌握（删除条目 + 奖励积分）
 * POST /api/errorbook/:id/master
 */
export const masterErrorItem = async (req, res) => {
  try {
    // 先获取条目信息用于积分奖励
    const item = await query(
      'SELECT id, user_id FROM error_book WHERE id = $1',
      [req.params.id],
    )
    if (item.rowCount === 0) {
      return res.status(404).json({ message: 'Error item not found.' })
    }

    const errorItem = item.rows[0]

    // 删除错题条目
    await query('DELETE FROM error_book WHERE id = $1', [errorItem.id])

    // 奖励积分（错题订正）
    await awardErrorBookPoints(errorItem.user_id, errorItem.id)

    return res.json({ ok: true, pointsAwarded: 3 })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 删除错题条目
 * DELETE /api/errorbook/:id
 */
export const deleteErrorItem = async (req, res) => {
  try {
    const result = await query('DELETE FROM error_book WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Error item not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
