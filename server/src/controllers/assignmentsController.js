import { randomUUID } from 'crypto'
import { query } from '../db.js'

/**
 * 为班级内所有学生创建通知
 */
async function notifyClassStudents(classId, assignmentTitle, assignmentDescription) {
  // 1. 查询班级的所有学生
  const members = await query(
    "SELECT user_id FROM class_members WHERE class_id = $1 AND role = 'student'",
    [classId],
  )
  if (members.rowCount === 0) return

  // 2. 为每个学生插入一条通知
  const title = `新作业发布：${assignmentTitle}`
  const body = assignmentDescription
    ? `老师发布了新作业《${assignmentTitle}》：${assignmentDescription}`
    : `老师发布了新作业《${assignmentTitle}》，请及时查看并完成。`

  const values = members.rows.map((row) => {
    const id = randomUUID()
    return `('${id}', '${row.user_id}', '${title.replace(/'/g, "''")}', '${body.replace(/'/g, "''")}')`
  })

  await query(
    `INSERT INTO notifications (id, user_id, title, body) VALUES ${values.join(', ')}`,
  )
}

export const listAssignments = async (req, res) => {
  const { classId } = req.query
  const teacherId = req.user?.id
  try {
    let result
    const baseSql =
      `SELECT a.id, a.class_id, a.teacher_id, a.title, a.description, a.due_at, a.status, a.question_ids, a.created_at,
              c.name AS class_name,
              COALESCE(jsonb_array_length(a.question_ids), 0) AS question_count,
              (SELECT COUNT(*)::int FROM submissions s WHERE s.assignment_id = a.id AND s.status = 'submitted') AS pending_count,
              (SELECT ROUND(COUNT(s.id)::numeric / NULLIF((SELECT COUNT(*)::numeric FROM class_members cm WHERE cm.class_id = a.class_id), 0) * 100)::int FROM submissions s WHERE s.assignment_id = a.id) AS submission_rate
       FROM assignments a
       LEFT JOIN classes c ON a.class_id = c.id`

    if (classId) {
      result = await query(
        `${baseSql} WHERE a.class_id = $1 ORDER BY a.created_at DESC`,
        [classId],
      )
    } else if (teacherId) {
      result = await query(
        `${baseSql} WHERE a.teacher_id = $1 ORDER BY a.created_at DESC`,
        [teacherId],
      )
    } else {
      result = await query(
        `${baseSql} ORDER BY a.created_at DESC`,
      )
    }
    return res.json({ items: result.rows })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getAssignmentById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, class_id, teacher_id, title, description, due_at, status, question_ids, created_at FROM assignments WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取学生所属班级的所有作业（含提交状态）
 * GET /api/assignments/for-student
 */
export const getStudentAssignments = async (req, res) => {
  const studentId = req.user.id
  try {
    // Get student's class IDs
    const classes = await query(
      'SELECT class_id FROM class_members WHERE user_id = $1',
      [studentId],
    )
    const classIds = classes.rows.map(r => r.class_id)
    if (classIds.length === 0) {
      return res.json({ items: [] })
    }

    // Get all published + draft assignments for those classes, with submission info
    const result = await query(
      `SELECT
         a.id, a.class_id, a.title, a.description, a.due_at, a.status, a.created_at,
         c.name AS class_name,
         s.id AS submission_id, s.score, s.status AS submission_status,
         s.submitted_at, s.graded_at
       FROM assignments a
       JOIN classes c ON a.class_id = c.id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
       WHERE a.class_id = ANY($2::uuid[]) AND a.status IN ('published', 'draft')
       ORDER BY a.due_at ASC, a.created_at DESC`,
      [studentId, classIds],
    )

    // Enrich with derived status
    const now = new Date()
    const items = result.rows.map(a => {
      let derivedStatus = 'pending'
      let progressPercent = 0
      if (a.submission_id) {
        if (a.score !== null) {
          derivedStatus = 'graded'
          progressPercent = 100
        } else {
          derivedStatus = 'submitted'
          progressPercent = 100
        }
      } else if (a.due_at && new Date(a.due_at) < now) {
        derivedStatus = 'overdue'
      }
      return {
        ...a,
        derived_status: derivedStatus,
        progress_percent: progressPercent,
      }
    })

    return res.json({ items })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createAssignment = async (req, res) => {
  const { class_id, title, description, due_at, status, question_ids } = req.body
  const teacher_id = req.user?.id
  if (!title) {
    return res.status(400).json({ message: 'title is required.' })
  }

  try {
    const assignmentId = randomUUID()
    const qids = Array.isArray(question_ids) ? JSON.stringify(question_ids) : '[]'
    const assignStatus = status || 'draft'
    const result = await query(
      `INSERT INTO assignments (id, class_id, teacher_id, title, description, due_at, status, question_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
       RETURNING id, class_id, teacher_id, title, description, due_at, status, question_ids, created_at`,
      [
        assignmentId,
        class_id || null,
        teacher_id || null,
        title,
        description || null,
        due_at || null,
        assignStatus,
        qids,
      ],
    )
    // 发布时通知班级学生
    if (assignStatus === 'published' && class_id) {
      await notifyClassStudents(class_id, title, description)
    }

    return res.status(201).json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateAssignment = async (req, res) => {
  const { title, description, due_at, class_id, status, question_ids } = req.body
  try {
    // 检查是否从非 published 变更为 published（需要通知学生）
    const oldAssign = await query(
      'SELECT status, class_id, title, description FROM assignments WHERE id = $1',
      [req.params.id],
    )
    if (oldAssign.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }

    const qids = question_ids !== undefined ? JSON.stringify(question_ids) : undefined
    const result = await query(
      `UPDATE assignments SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        due_at = COALESCE($3, due_at),
        class_id = COALESCE($4, class_id),
        status = COALESCE($5, status),
        question_ids = COALESCE($6::jsonb, question_ids)
       WHERE id = $7
       RETURNING id, class_id, teacher_id, title, description, due_at, status, question_ids, created_at`,
      [
        title || null,
        description || null,
        due_at || null,
        class_id || null,
        status || null,
        qids || null,
        req.params.id,
      ],
    )

    // 发布通知：仅当旧状态不是 published 且新状态是 published
    const newStatus = result.rows[0].status
    const finalClassId = result.rows[0].class_id
    if (
      newStatus === 'published' &&
      oldAssign.rows[0].status !== 'published' &&
      finalClassId
    ) {
      await notifyClassStudents(
        finalClassId,
        result.rows[0].title,
        result.rows[0].description,
      )
    }

    return res.json(result.rows[0])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteAssignment = async (req, res) => {
  try {
    const result = await query('DELETE FROM assignments WHERE id = $1 RETURNING id', [
      req.params.id,
    ])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 获取作业准备数据（含班级名称、题目数量、预估时长、XP奖励）
 * GET /api/assignments/prep/:id
 */
export const prepAssignment = async (req, res) => {
  const studentId = req.user.id
  try {
    const result = await query(
      `SELECT
         a.id, a.class_id, a.title, a.description, a.due_at, a.status, a.question_ids, a.created_at,
         c.name AS class_name,
         s.id AS submission_id, s.score, s.status AS submission_status,
         s.submitted_at, s.graded_at
       FROM assignments a
       JOIN classes c ON a.class_id = c.id
       LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = $1
       WHERE a.id = $2`,
      [studentId, req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assignment not found.' })
    }

    const assignment = result.rows[0]
    const questionIds = assignment.question_ids || []
    const questionCount = Array.isArray(questionIds) ? questionIds.length : 0

    // Get subject/category from the first question
    let subject = null
    if (questionCount > 0) {
      const qResult = await query(
        'SELECT subject FROM questions WHERE id = $1',
        [questionIds[0]],
      )
      if (qResult.rowCount > 0) {
        subject = qResult.rows[0].subject
      }
    }

    // Calculate derived fields
    const estimatedMinutes = Math.max(1, Math.round(questionCount * 1.5))
    const xpReward = questionCount * 30

    return res.json({
      ...assignment,
      question_count: questionCount,
      subject,
      estimated_minutes: estimatedMinutes,
      xp_reward: xpReward,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const listSubmissions = async (req, res) => {
  res.json({ assignmentId: req.params.id, items: [] })
}
