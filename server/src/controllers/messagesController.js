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
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createMessage = async (req, res) => {
  // Use authenticated user as sender, or allow body override
  const sender_id = req.user?.id || req.body.sender_id
  const { receiver_id, content } = req.body
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
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取当前用户的会话列表
 * GET /api/messages/conversations
 * 按对话对方分组，返回最新消息和未读数
 */
export const getConversations = async (req, res) => {
  const userId = req.user.id
  try {
    // Find all unique conversation partners
    const result = await query(
      `WITH partner AS (
         SELECT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
                created_at, content, sender_id
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1
       ),
       latest AS (
         SELECT DISTINCT ON (other_user_id)
                other_user_id, content, created_at, sender_id
         FROM partner
         ORDER BY other_user_id, created_at DESC
       ),
       unread AS (
         SELECT CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
                COUNT(*)::int AS unread_count
         FROM messages
         WHERE receiver_id = $1 AND sender_id != $1
         GROUP BY other_user_id
       )
       SELECT
         l.other_user_id,
         u.name, u.avatar_url, u.role,
         l.content AS last_message,
         l.created_at AS last_message_at,
         COALESCE(ur.unread_count, 0) AS unread_count
       FROM latest l
       JOIN users u ON l.other_user_id = u.id
       LEFT JOIN unread ur ON l.other_user_id = ur.other_user_id
       ORDER BY l.created_at DESC`,
      [userId],
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取当前用户未读消息总数
 * GET /api/messages/unread-total
 */
export const getUnreadTotal = async (req, res) => {
  const userId = req.user.id
  try {
    const result = await query(
      'SELECT COUNT(*)::int AS count FROM messages WHERE receiver_id = $1 AND read_at IS NULL',
      [userId],
    )
    return res.json({ count: result.rows[0].count })
  } catch (error) {
    // Column read_at might not exist yet — fall back to counting all messages
    console.warn('getUnreadTotal fallback (read_at may not exist):', error.message)
    try {
      const fallback = await query(
        'SELECT COUNT(*)::int AS count FROM messages WHERE receiver_id = $1',
        [userId],
      )
      return res.json({ count: fallback.rows[0].count })
    } catch {
      return res.json({ count: 0 })
    }
  }
}

/**
 * 标记与指定发件人的消息为已读
 * PUT /api/messages/read/:senderId
 */
export const markAsRead = async (req, res) => {
  const userId = req.user.id
  const senderId = req.params.senderId
  try {
    await query(
      'UPDATE messages SET read_at = NOW() WHERE sender_id = $1 AND receiver_id = $2 AND read_at IS NULL',
      [senderId, userId],
    )
    return res.json({ ok: true })
  } catch (error) {
    // Column read_at might not exist yet — silent fail
    console.warn('markAsRead fallback (read_at may not exist):', error.message)
    return res.json({ ok: true })
  }
}

/**
 * 获取当前用户与指定用户的聊天记录
 * GET /api/messages/conversation/:userId
 */
export const getConversation = async (req, res) => {
  const currentUserId = req.user.id
  const otherUserId = req.params.userId

  try {
    const result = await query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at,
              u.name AS sender_name, u.avatar_url AS sender_avatar
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.created_at ASC`,
      [currentUserId, otherUserId],
    )

    // Get the other user's info
    const otherUser = await query(
      'SELECT id, name, avatar_url, role FROM users WHERE id = $1',
      [otherUserId],
    )

    return res.json({
      messages: result.rows,
      otherUser: otherUser.rows[0] || null,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
