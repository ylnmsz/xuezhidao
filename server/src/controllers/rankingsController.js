import { query } from '../db.js'

/**
 * 获取学生排行榜
 * GET /api/rankings/student?class_id=&page=1&pageSize=20
 */
export const getStudentRankings = async (req, res) => {
  const userId = req.user.id
  const { class_id, page = '1', pageSize = '20' } = req.query
  const limit = Math.min(parseInt(pageSize) || 20, 100)
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit

  try {
    let conditions = ["u.role = 'student'"]
    let values = []
    let paramIndex = 1

    // If class_id provided, filter by class membership
    if (class_id) {
      conditions.push(`cm.class_id = $${paramIndex++}`)
      values.push(class_id)
    }

    const joinClause = class_id
      ? 'JOIN class_members cm ON u.id = cm.user_id'
      : ''
    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    // Total count
    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM users u
       ${joinClause}
       ${whereClause}`,
      values,
    )
    const total = countResult.rows[0]?.total || 0

    // Ranking query: ordered by combat_power DESC, with level and accuracy
    const result = await query(
      `SELECT
         u.id, u.name, u.avatar_url, u.role,
         u.level, u.points, u.combat_power, u.accuracy,
         u.streak_days, u.homework_done, u.weekly_study_hours,
         u.grade, u.class_name, u.school, u.signature
       FROM users u
       ${joinClause}
       ${whereClause}
       ORDER BY u.combat_power DESC, u.points DESC, u.accuracy DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
      [...values, limit, offset],
    )

    // Determine ranks
    const items = result.rows.map((row, idx) => ({
      ...row,
      rank: offset + idx + 1,
      // Trend is calculated client-side based on rank changes
    }))

    // Find current user's rank
    let myRank = null
    if (!class_id) {
      // Global: find rank by points
      const myStats = await query(
        `SELECT COUNT(*)::int + 1 AS rank FROM users
         WHERE role = 'student'
         AND (combat_power > (SELECT combat_power FROM users WHERE id = $1)
              OR (combat_power = (SELECT combat_power FROM users WHERE id = $1)
                  AND points > (SELECT points FROM users WHERE id = $1))
              OR (combat_power = (SELECT combat_power FROM users WHERE id = $1)
                  AND points = (SELECT points FROM users WHERE id = $1)
                  AND accuracy > (SELECT accuracy FROM users WHERE id = $1)))`,
        [userId],
      )
      myRank = myStats.rows[0]?.rank || null
    } else {
      // Class: find rank within class
      const myClassStats = await query(
        `SELECT COUNT(*)::int + 1 AS rank FROM users u
         JOIN class_members cm ON u.id = cm.user_id
         WHERE cm.class_id = $1 AND u.role = 'student'
         AND (u.combat_power > (SELECT combat_power FROM users WHERE id = $2)
              OR (u.combat_power = (SELECT combat_power FROM users WHERE id = $2)
                  AND u.points > (SELECT points FROM users WHERE id = $2))
              OR (u.combat_power = (SELECT combat_power FROM users WHERE id = $2)
                  AND u.points = (SELECT points FROM users WHERE id = $2)
                  AND u.accuracy > (SELECT accuracy FROM users WHERE id = $2)))
         AND u.id != $2`,
        [class_id, userId],
      )
      myRank = myClassStats?.rows?.[0]?.rank || null
    }

    return res.json({
      items,
      total,
      page: parseInt(page),
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      myRank,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取班级排行榜（教师端）
 * GET /api/rankings/class?class_id=&page=1&pageSize=20
 */
export const getClassRankings = async (req, res) => {
  const { class_id, page = '1', pageSize = '20' } = req.query
  const limit = Math.min(parseInt(pageSize) || 20, 100)
  const offset = (Math.max(parseInt(page) || 1, 1) - 1) * limit

  try {
    if (!class_id) {
      return res.status(400).json({ message: 'class_id is required.' })
    }

    // Total students in class
    const countResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM class_members WHERE class_id = $1`,
      [class_id],
    )
    const total = countResult.rows[0]?.total || 0

    // Ranked students in the class
    const result = await query(
      `SELECT
         u.id, u.name, u.avatar_url,
         u.level, u.points, u.combat_power, u.accuracy,
         u.streak_days, u.homework_done, u.weekly_study_hours,
         u.grade, u.class_name, u.school, u.signature
       FROM users u
       JOIN class_members cm ON u.id = cm.user_id
       WHERE cm.class_id = $1 AND u.role = 'student'
       ORDER BY u.combat_power DESC, u.points DESC, u.accuracy DESC
       LIMIT $2 OFFSET $3`,
      [class_id, limit, offset],
    )

    // Get class info
    const classInfo = await query(
      'SELECT id, name FROM classes WHERE id = $1',
      [class_id],
    )

    const items = result.rows.map((row, idx) => ({
      ...row,
      rank: offset + idx + 1,
    }))

    return res.json({
      items,
      total,
      classInfo: classInfo.rows[0] || null,
      page: parseInt(page),
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取排行榜统计概览（用于 header 展示）
 * GET /api/rankings/summary
 */
export const getRankingSummary = async (req, res) => {
  const userId = req.user.id
  try {
    // Current user's stats
    const userResult = await query(
      `SELECT level, points, combat_power, accuracy, streak_days,
              homework_done, weekly_study_hours
       FROM users WHERE id = $1`,
      [userId],
    )
    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' })
    }
    const me = userResult.rows[0]

    // Global top 3 (students only)
    const top3 = await query(
      `SELECT id, name, avatar_url, level, points, combat_power
       FROM users
       WHERE role = 'student'
       ORDER BY combat_power DESC, points DESC
       LIMIT 3`,
    )

    // Student count
    const studentCount = await query(
      "SELECT COUNT(*)::int AS total FROM users WHERE role = 'student'",
    )

    // Average stats across all students
    const avgStats = await query(
      `SELECT
         ROUND(AVG(combat_power))::int AS avg_combat_power,
         ROUND(AVG(accuracy)::numeric, 1) AS avg_accuracy,
         ROUND(AVG(streak_days))::int AS avg_streak
       FROM users WHERE role = 'student'`,
    )

    return res.json({
      me,
      top3: top3.rows,
      totalStudents: studentCount.rows[0]?.total || 0,
      averages: avgStats.rows[0],
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}
