import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listClassMembers = async (req, res) => {
  const { classId, userId, expand } = req.query
  try {
    if (classId) {
      // When expand=user, join with users table to get full profile + stats
      if (expand === 'user') {
        const result = await query(
          `SELECT
             cm.id, cm.class_id, cm.user_id, cm.role AS member_role, cm.joined_at,
             u.name, u.email, u.avatar_url, u.grade, u.class_name, u.school, u.signature,
             u.level, u.streak_days, u.weekly_study_hours, u.homework_done,
             u.accuracy, u.points, u.combat_power, u.role AS user_role
           FROM class_members cm
           JOIN users u ON cm.user_id = u.id
           WHERE cm.class_id = $1 AND u.role = 'student'
           ORDER BY u.combat_power DESC`,
          [classId],
        )
        return res.json({ items: result.rows })
      }
      const result = await query(
        'SELECT id, class_id, user_id, role, joined_at FROM class_members WHERE class_id = $1 ORDER BY joined_at DESC',
        [classId],
      )
      return res.json({ items: result.rows })
    }
    if (userId) {
      const result = await query(
        'SELECT id, class_id, user_id, role, joined_at FROM class_members WHERE user_id = $1 ORDER BY joined_at DESC',
        [userId],
      )
      return res.json({ items: result.rows })
    }
    const result = await query(
      'SELECT id, class_id, user_id, role, joined_at FROM class_members ORDER BY joined_at DESC',
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getClassMemberById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, class_id, user_id, role, joined_at FROM class_members WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class member not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createClassMember = async (req, res) => {
  const { class_id, user_id, role } = req.body
  if (!class_id || !user_id) {
    return res.status(400).json({ message: 'class_id and user_id are required.' })
  }

  try {
    const memberId = randomUUID()
    const result = await query(
      'INSERT INTO class_members (id, class_id, user_id, role) VALUES ($1, $2, $3, $4) RETURNING id, class_id, user_id, role, joined_at',
      [memberId, class_id, user_id, role || 'student'],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateClassMember = async (req, res) => {
  const { role } = req.body
  try {
    const result = await query(
      'UPDATE class_members SET role = COALESCE($1, role) WHERE id = $2 RETURNING id, class_id, user_id, role, joined_at',
      [role || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class member not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteClassMember = async (req, res) => {
  try {
    const result = await query('DELETE FROM class_members WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Class member not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
