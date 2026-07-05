import { randomUUID } from 'crypto'
import { query } from '../db.js'

const generateCode = () => {
  // 8-char hex code, uppercase
  return randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()
}

export const createInvite = async (req, res) => {
  const { id: classId } = req.params
  const { expiresAt } = req.body
  if (!classId) return res.status(400).json({ message: 'class id required' })

  try {
    const inviteId = randomUUID()
    const code = generateCode()
    const result = await query(
      'INSERT INTO class_invites (id, class_id, code, created_by, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, class_id, code, created_by, expires_at, created_at',
      [inviteId, classId, code, req.user?.id || null, expiresAt || null],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const listInvitesForClass = async (req, res) => {
  const { id: classId } = req.params
  try {
    const result = await query(
      'SELECT id, class_id, code, created_by, expires_at, created_at FROM class_invites WHERE class_id = $1 ORDER BY created_at DESC',
      [classId],
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const joinByCode = async (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ message: 'code is required' })

  try {
    const result = await query(
      'SELECT id, class_id, code, expires_at FROM class_invites WHERE code = $1',
      [code],
    )
    if (result.rowCount === 0) return res.status(404).json({ message: 'Invite not found' })
    const invite = result.rows[0]
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ message: 'Invite has expired' })
    }

    // create class member for current user
    // prevent duplicate membership: check existing
    const exists = await query(
      'SELECT id, class_id, user_id, role, joined_at FROM class_members WHERE class_id = $1 AND user_id = $2',
      [invite.class_id, req.user.id],
    )
    if (exists.rowCount > 0) {
      // already a member — return existing membership (idempotent)
      return res.status(200).json(exists.rows[0])
    }

    const memberId = randomUUID()
    const insert = await query(
      'INSERT INTO class_members (id, class_id, user_id, role) VALUES ($1, $2, $3, $4) RETURNING id, class_id, user_id, role, joined_at',
      [memberId, invite.class_id, req.user.id, 'student'],
    )
    return res.status(201).json(insert.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
