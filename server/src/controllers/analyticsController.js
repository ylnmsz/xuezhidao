import { query } from '../db.js'

/**
 * 教师仪表盘数据
 * GET /api/analytics/overview
 */
export const getOverview = async (req, res) => {
  const teacherId = req.user.id
  try {
    // Teacher's classes
    const classesResult = await query(
      'SELECT id, name FROM classes WHERE teacher_id = $1',
      [teacherId],
    )
    const classIds = classesResult.rows.map(c => c.id)
    const classList = classesResult.rows

    if (classIds.length === 0) {
      return res.json({
        classes: [],
        totalClasses: 0,
        totalStudents: 0,
        avgCombatPower: 0,
        avgAccuracy: 0,
        totalAssignments: 0,
        pendingGrading: 0,
        totalQuestions: 0,
        weeklyStats: [],
        recentSubmissions: [],
      })
    }

    // Total students across all classes (students only)
    const studentCount = await query(
      `SELECT COUNT(DISTINCT cm.user_id)::int AS total
       FROM class_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.class_id = ANY($1::uuid[]) AND u.role = 'student'`,
      [classIds],
    )

    // Average stats across all students in these classes
    const avgStats = await query(
      `SELECT
         ROUND(AVG(u.combat_power))::int AS avg_combat_power,
         ROUND(AVG(u.accuracy)::numeric, 1) AS avg_accuracy
       FROM class_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.class_id = ANY($1::uuid[]) AND u.role = 'student'`,
      [classIds],
    )

    // Total assignments created by this teacher
    const assignmentsResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM assignments a
       WHERE a.teacher_id = $1`,
      [teacherId],
    )

    // Pending submissions (submitted but not graded)
    const pendingResult = await query(
      `SELECT COUNT(*)::int AS total
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.teacher_id = $1 AND s.score IS NULL AND s.status = 'submitted'`,
      [teacherId],
    )

    // Total questions in the system
    const questionsResult = await query('SELECT COUNT(*)::int AS total FROM questions')

    // Weekly submission stats — last 7 days grouped by day of week
    const weeklyResult = await query(
      `SELECT
         EXTRACT(DOW FROM s.submitted_at)::int AS dow,
         COUNT(*)::int AS count
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       WHERE a.teacher_id = $1
         AND s.submitted_at >= NOW() - INTERVAL '7 days'
       GROUP BY EXTRACT(DOW FROM s.submitted_at)
       ORDER BY dow`,
      [teacherId],
    )
    const weeklyMap = {}
    weeklyResult.rows.forEach(r => { weeklyMap[r.dow] = r.count })
    // DOW: 0=Sun,1=Mon,...,6=Sat. Build Mon-Sun array
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weeklyStats = []
    for (let d = 1; d <= 7; d++) {
      const dow = d % 7 // Mon=1,...,Sun=0
      weeklyStats.push({
        label: dayNames[dow],
        count: weeklyMap[dow] || 0,
      })
    }

    // Recent submissions (latest 10)
    const recentResult = await query(
      `SELECT
         s.id, s.score, s.status, s.submitted_at,
         u.name AS student_name, u.avatar_url,
         a.title AS assignment_title, a.id AS assignment_id
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN users u ON s.student_id = u.id
       WHERE a.teacher_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT 10`,
      [teacherId],
    )

    return res.json({
      classes: classList,
      totalClasses: classList.length,
      totalStudents: studentCount.rows[0]?.total || 0,
      avgCombatPower: avgStats.rows[0]?.avg_combat_power || 0,
      avgAccuracy: avgStats.rows[0]?.avg_accuracy || 0,
      totalAssignments: assignmentsResult.rows[0]?.total || 0,
      pendingGrading: pendingResult.rows[0]?.total || 0,
      totalQuestions: questionsResult.rows[0]?.total || 0,
      weeklyStats,
      recentSubmissions: recentResult.rows || [],
    })
  } catch (error) {
    console.error('getOverview error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 班级学情详情
 * GET /api/analytics/class/:id
 */
export const getClassAnalytics = async (req, res) => {
  const classId = req.params.id
  const teacherId = req.user.id

  try {
    // 1. Class info + verify ownership
    const classInfo = await query(
      'SELECT id, name FROM classes WHERE id = $1 AND teacher_id = $2',
      [classId, teacherId],
    )
    if (classInfo.rowCount === 0) {
      return res.status(404).json({ message: 'Class not found.' })
    }

    // 2. Students with full stats
    const students = await query(
      `SELECT
         u.id, u.name, u.avatar_url, u.email,
         u.level, u.points, u.combat_power, u.accuracy,
         u.streak_days, u.homework_done, u.weekly_study_hours,
         u.grade, u.class_name, u.school, u.signature
       FROM class_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.class_id = $1 AND u.role = 'student'
       ORDER BY u.combat_power DESC`,
      [classId],
    )

    const studentList = students.rows
    const totalStudents = studentList.length

    // 3. Summary statistics
    const avgCombatPower = totalStudents > 0
      ? Math.round(studentList.reduce((s, r) => s + Number(r.combat_power || 0), 0) / totalStudents)
      : 0
    const avgAccuracy = totalStudents > 0
      ? (studentList.reduce((s, r) => s + Number(r.accuracy || 0), 0) / totalStudents).toFixed(1)
      : '0.0'
    const avgStreak = totalStudents > 0
      ? Math.round(studentList.reduce((s, r) => s + Number(r.streak_days || 0), 0) / totalStudents)
      : 0

    // 4. Score distribution
    const buckets = [
      { label: '90-100', min: 90, max: 101 },
      { label: '80-89', min: 80, max: 90 },
      { label: '70-79', min: 70, max: 80 },
      { label: '60-69', min: 60, max: 70 },
      { label: '0-59', min: 0, max: 60 },
    ]
    const distribution = buckets.map(b => ({
      label: b.label,
      count: studentList.filter(r => {
        const acc = Number(r.accuracy || 0)
        return acc >= b.min && acc < b.max
      }).length,
    }))

    // 5. Top & bottom performers
    const topPerformers = studentList.slice(0, 5).map(r => ({
      id: r.id, name: r.name, avatar_url: r.avatar_url,
      combat_power: r.combat_power, accuracy: r.accuracy, level: r.level,
    }))
    const bottomPerformers = studentList.slice(-5).reverse().map(r => ({
      id: r.id, name: r.name, avatar_url: r.avatar_url,
      combat_power: r.combat_power, accuracy: r.accuracy, level: r.level,
    }))

    // 6. Assignments & submissions for this class
    const assignmentsStats = await query(
      `SELECT
         COUNT(*)::int AS total_assignments,
         COUNT(*) FILTER (WHERE status = 'published')::int AS published
       FROM assignments
       WHERE class_id = $1`,
      [classId],
    )

    // Submission rate per assignment (last 5)
    const recentSubmissions = await query(
      `SELECT
         a.id, a.title, a.due_at, a.status,
         COUNT(s.id)::int AS submission_count,
         ROUND(AVG(s.score)::numeric, 1) AS avg_score
       FROM assignments a
       LEFT JOIN submissions s ON s.assignment_id = a.id
       WHERE a.class_id = $1 AND a.status = 'published'
       GROUP BY a.id
       ORDER BY a.due_at DESC
       LIMIT 5`,
      [classId],
    )

    // 7. Subject performance — aggregate from submissions joined with questions
    const subjectPerformance = await query(
      `SELECT
         q.subject,
         COUNT(*)::int AS total_questions,
         ROUND(AVG(s.score)::numeric, 1) AS avg_score
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       JOIN LATERAL jsonb_array_elements_text(a.question_ids) AS qid ON true
       JOIN questions q ON q.id::text = qid
       WHERE a.class_id = $1 AND s.score IS NOT NULL
       GROUP BY q.subject
       ORDER BY avg_score DESC`,
      [classId],
    )

    // 8. Error-prone topics — from error_book joined with questions
    const errorTopics = await query(
      `SELECT
         q.subject,
         q.content,
         COUNT(*)::int AS error_count
       FROM error_book eb
       JOIN questions q ON eb.question_id = q.id
       JOIN class_members cm ON eb.user_id = cm.user_id
       WHERE cm.class_id = $1
       GROUP BY q.subject, q.id, q.content
       ORDER BY error_count DESC
       LIMIT 10`,
      [classId],
    )

    return res.json({
      classInfo: classInfo.rows[0],
      summary: {
        totalStudents,
        avgCombatPower,
        avgAccuracy,
        avgStreak,
      },
      distribution,
      topPerformers,
      bottomPerformers,
      assignments: {
        total: assignmentsStats.rows[0]?.total_assignments || 0,
        published: assignmentsStats.rows[0]?.published || 0,
        recent: recentSubmissions.rows || [],
      },
      subjectPerformance: subjectPerformance.rows || [],
      errorTopics: errorTopics.rows || [],
      students: studentList.map(r => ({
        id: r.id, name: r.name, avatar_url: r.avatar_url,
        level: r.level, points: r.points, combat_power: r.combat_power,
        accuracy: r.accuracy, streak_days: r.streak_days,
        homework_done: r.homework_done,
      })),
    })
  } catch (error) {
    console.error('getClassAnalytics error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
