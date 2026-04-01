import { randomUUID } from 'crypto'
import { query } from '../db.js'

export const listMessages = async (req, res) => {
  const { userId } = req.query
  try {
    const result = userId
      ? await query(
          'SELECT id, sender_id, receiver_id, content, created_at FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY created_at DESC',
          [userId],
        )
      : await query(
          'SELECT id, sender_id, receiver_id, content, created_at FROM messages ORDER BY created_at DESC',
        )
    return res.json({ items: result.rows })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getMessageById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, sender_id, receiver_id, content, created_at FROM messages WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createMessage = async (req, res) => {
  const { sender_id, receiver_id, content } = req.body
  if (!sender_id || !receiver_id || !content) {
    return res.status(400).json({ message: 'sender_id, receiver_id and content are required.' })
  }

  try {
    const messageId = randomUUID()
    const result = await query(
      'INSERT INTO messages (id, sender_id, receiver_id, content) VALUES ($1, $2, $3, $4) RETURNING id, sender_id, receiver_id, content, created_at',
      [messageId, sender_id, receiver_id, content],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateMessage = async (req, res) => {
  const { content } = req.body
  try {
    const result = await query(
      'UPDATE messages SET content = COALESCE($1, content) WHERE id = $2 RETURNING id, sender_id, receiver_id, content, created_at',
      [content || null, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteMessage = async (req, res) => {
  try {
    const result = await query('DELETE FROM messages WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Message not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
