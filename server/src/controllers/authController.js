import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { signToken } from '../services/tokenService.js'
import { query } from '../db.js'

export const register = async (req, res) => {
  const { email, password, name, role, phone, avatar_url, grade, class_name, school, signature } =
    req.body
  if (!email || !password || !name) {
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
      'INSERT INTO users (id, role, name, email, phone, password_hash, avatar_url, grade, class_name, school, signature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, created_at, updated_at',
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
      ],
    )

    const user = result.rows[0]
    const token = signToken({ id: user.id, role: user.role })
    return res.status(201).json({ token, user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' })
  }

  try {
    const result = await query(
      'SELECT id, role, name, email, phone, avatar_url, grade, class_name, school, signature, level, streak_days, weekly_study_hours, homework_done, accuracy, created_at, updated_at, password_hash FROM users WHERE email = $1',
      [email],
    )
    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const user = result.rows[0]
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = signToken({ id: user.id, role: user.role })
    const { password_hash, ...safeUser } = user
    return res.json({ token, user: safeUser })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
