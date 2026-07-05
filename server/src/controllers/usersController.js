import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { query } from '../db.js'
import {
  getStudentStats,
  getPointsLog,
  recalculateAllStats,
} from '../services/studentStatsService.js'

export const listUsers = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power, created_at, updated_at FROM users ORDER BY created_at DESC',
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getMe = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power, study_goal, reminder_time, weak_subjects, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateMe = async (req, res) => {
  const { name, avatar_url, signature, grade, class_name, school, study_goal, reminder_time, weak_subjects } = req.body
  if (name !== undefined && !name) {
    return res.status(400).json({ message: 'Name cannot be empty.' })
  }

  try {
    const previous = await query('SELECT avatar_url FROM users WHERE id = $1', [req.user.id])
    const previousAvatar = previous.rows?.[0]?.avatar_url || null
    const result = await query(
      `UPDATE users SET
        name = COALESCE($1, name),
        avatar_url = COALESCE($2, avatar_url),
        signature = COALESCE($3, signature),
        grade = COALESCE($4, grade),
        class_name = COALESCE($5, class_name),
        school = COALESCE($6, school),
        study_goal = COALESCE($7, study_goal),
        reminder_time = COALESCE($8, reminder_time),
        weak_subjects = COALESCE($9::jsonb, weak_subjects),
        updated_at = NOW()
       WHERE id = $10
       RETURNING id, role, name, email, phone, avatar_url, grade, class_name, school, signature,
                 level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power,
                 study_goal, reminder_time, weak_subjects, created_at, updated_at`,
      [
        name ?? null,
        avatar_url ?? null,
        signature ?? null,
        grade ?? null,
        class_name ?? null,
        school ?? null,
        study_goal ?? null,
        reminder_time ?? null,
        weak_subjects !== undefined ? JSON.stringify(weak_subjects) : null,
        req.user.id,
      ],
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const updatedAvatar = result.rows[0]?.avatar_url || null
    if (
      avatar_url &&
      previousAvatar &&
      previousAvatar !== updatedAvatar &&
      previousAvatar.startsWith('/uploads/avatars/')
    ) {
      const filename = path.basename(previousAvatar)
      const filePath = path.resolve('uploads', 'avatars', filename)
      fs.promises.unlink(filePath).catch((error) => {
        console.warn('Failed to delete old avatar:', error)
      })
    }

    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power, study_goal, reminder_time, weak_subjects, created_at, updated_at FROM users WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    avatar_url,
    grade,
    class_name,
    school,
    signature,
    level,
    streak_days,
    weekly_study_hours,
    homework_done,
    accuracy,
  } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Email already in use.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const userId = randomUUID()
    const userRole = role || 'student'

    const result = await query(
      'INSERT INTO users (id, role, name, email, phone, password_hash, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power, created_at, updated_at',
      [
        userId,
        userRole,
        name,
        email,
        phone || null,
        passwordHash,
        avatar_url || null,
        grade || null,
        class_name || null,
        school || null,
        signature || null,
        level || null,
        streak_days || null,
        weekly_study_hours || null,
        homework_done || null,
        accuracy || null,
        0,  // points
        0,  // combat_power
      ],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateUser = async (req, res) => {
  const {
    name,
    email,
    role,
    phone,
    avatar_url,
    grade,
    class_name,
    school,
    signature,
    level,
    streak_days,
    weekly_study_hours,
    homework_done,
    accuracy,
  } = req.body
  try {
    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), phone = COALESCE($4, phone), avatar_url = COALESCE($5, avatar_url), grade = COALESCE($6, grade), class_name = COALESCE($7, class_name), school = COALESCE($8, school), signature = COALESCE($9, signature), level = COALESCE($10, level), streak_days = COALESCE($11, streak_days), weekly_study_hours = COALESCE($12, weekly_study_hours), homework_done = COALESCE($13, homework_done), accuracy = COALESCE($14, accuracy), updated_at = NOW() WHERE id = $15 RETURNING id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power, created_at, updated_at',
      [
        name || null,
        email || null,
        role || null,
        phone || null,
        avatar_url || null,
        grade || null,
        class_name || null,
        school || null,
        signature || null,
        level || null,
        streak_days || null,
        weekly_study_hours || null,
        homework_done || null,
        accuracy || null,
        req.params.id,
      ],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// ---- 修改密码 ----

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'currentPassword and newPassword are required.' })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' })
  }

  try {
    const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const valid = await bcrypt.compare(currentPassword, result.rows[0].password_hash)
    if (!valid) {
      return res.status(403).json({ message: '当前密码不正确。' })
    }

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, req.user.id])
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

// ---- 学生积分 / 等级 / 战力 接口 ----

export const getMyStats = async (req, res) => {
  try {
    const stats = await getStudentStats(req.user.id)
    if (!stats) {
      return res.status(404).json({ message: 'User not found.' })
    }
    return res.json(stats)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getMyPointsLog = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const log = await getPointsLog(req.user.id, limit)
    return res.json({ items: log })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const recalculateMyStats = async (req, res) => {
  try {
    const stats = await recalculateAllStats(req.user.id)
    return res.json(stats)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
