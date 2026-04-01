import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listNotifications = async (req, res) => {
  const { userId } = req.query
  try {
    const result = userId
      ? await query(
          'SELECT id, user_id, title, body, read_at, created_at FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
          [userId],
        )
      : await query(
          'SELECT id, user_id, title, body, read_at, created_at FROM notifications ORDER BY created_at DESC',
        )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getNotificationById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, user_id, title, body, read_at, created_at FROM notifications WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createNotification = async (req, res) => {
  const { user_id, title, body } = req.body
  if (!user_id || !title) {
    return res.status(400).json({ message: 'user_id and title are required.' })
  }

  try {
    const notificationId = randomUUID()
    const result = await query(
      'INSERT INTO notifications (id, user_id, title, body) VALUES ($1, $2, $3, $4) RETURNING id, user_id, title, body, read_at, created_at',
      [notificationId, user_id, title, body || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateNotification = async (req, res) => {
  const { title, body, read_at } = req.body
  try {
    const result = await query(
      'UPDATE notifications SET title = COALESCE($1, title), body = COALESCE($2, body), read_at = COALESCE($3, read_at) WHERE id = $4 RETURNING id, user_id, title, body, read_at, created_at',
      [title || null, body || null, read_at || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const result = await query('DELETE FROM notifications WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Notification not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
