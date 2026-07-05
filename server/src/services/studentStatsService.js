import { randomUUID } from 'crypto'
import { query } from '../db.js'

// ============================================================
// 积分 / 等级 / 战力值 业务逻辑
// ============================================================

/**
 * 积分获取常量（理由枚举）
 */
export const POINT_REASONS = {
  SUBMIT_HOMEWORK: 'submit_homework',         // 提交作业
  HIGH_SCORE_BONUS: 'high_score_bonus',       // 高分奖励
  STREAK_BONUS: 'streak_bonus',               // 连续登录
  ERROR_BOOK_CORRECTION: 'error_book_correction', // 错题订正
  PRACTICE_CORRECT: 'practice_correct',       // 练习答题正确
}

// ---- 积分规则 ----

/** 提交一次作业 */
const POINTS_SUBMIT = 10
/** 成绩 >= 60 额外奖励 */
const POINTS_BONUS_60 = 5
/** 成绩 >= 80 额外奖励 */
const POINTS_BONUS_80 = 10
/** 成绩 >= 90 额外奖励 */
const POINTS_BONUS_90 = 20
/** 每连续一天额外奖励 */
const POINTS_PER_STREAK_DAY = 2
/** 每次错题订正 */
const POINTS_ERROR_BOOK = 3

// ---- 等级公式 ----

/**
 * 根据总积分计算等级
 * Level 1:    0-99 分
 * Level 2:  100-299 分
 * Level 3:  300-599 分
 * Level 4:  600-999 分
 * Level 5: 1000-1499 分
 * 之后每级需要 500 分
 */
function calcLevel(points) {
  if (points < 100) return 1
  if (points < 300) return 2
  if (points < 600) return 3
  if (points < 1000) return 4
  if (points < 1500) return 5
  // 5 级之后每 500 分升一级
  return 5 + Math.floor((points - 1500) / 500)
}

/** 当前等级所需的最小积分 */
function levelFloor(level) {
  if (level <= 1) return 0
  const floors = [0, 0, 100, 300, 600, 1000, 1500]
  if (level <= 6) return floors[level - 1]
  return 1500 + (level - 6) * 500
}

/** 升到下一级所需积分 */
function nextLevelPoints(level) {
  if (level < 2) return 100
  if (level < 3) return 300
  if (level < 4) return 600
  if (level < 5) return 1000
  if (level < 6) return 1500
  return 1500 + (level - 5) * 500
}

// ---- 战力公式 ----

/**
 * 计算战力值
 * - 等级贡献: level * 80
 * - 准确率贡献: accuracy * 6  (accuracy 0~100)
 * - 作业贡献: homework_done * 8
 * - 连续贡献: streak_days * 20
 */
function calcCombatPower(level, accuracy, homeworkDone, streakDays) {
  const levelPart = level * 80
  const accuracyPart = Math.round((accuracy || 0) * 6)
  const homeworkPart = (homeworkDone || 0) * 8
  const streakPart = (streakDays || 0) * 20
  return levelPart + accuracyPart + homeworkPart + streakPart
}

// ============================================================
// 对外方法
// ============================================================

/**
 * 奖励积分：增加积分 + 写日志 + 重新计算等级和战力
 */
export async function awardPoints(userId, points, reason, referenceId = null) {
  await query('UPDATE users SET points = COALESCE(points, 0) + $1 WHERE id = $2', [
    points,
    userId,
  ])
  await query(
    'INSERT INTO points_log (id, user_id, points, reason, reference_id) VALUES ($1, $2, $3, $4, $5)',
    [randomUUID(), userId, points, reason, referenceId],
  )
  await recalculateLevel(userId)
  await recalculateCombatPower(userId)
}

/**
 * 获取学生完整统计（含战力明细、学科表现）
 */
export async function getStudentStats(userId) {
  const result = await query(
    `SELECT points, level, combat_power, streak_days, homework_done, accuracy,
            practice_questions_done, total_practice_time_seconds
     FROM users WHERE id = $1`,
    [userId],
  )
  if (result.rowCount === 0) return null

  const u = result.rows[0]
  const points = u.points || 0
  const level = u.level || 1

  // 作业答题数（来自作业提交记录）
  const totalQs = await query(
    `SELECT COALESCE(SUM(
       (SELECT COUNT(*) FROM jsonb_array_elements_text(a.question_ids))
     ), 0)::int AS total
     FROM submissions s
     JOIN assignments a ON s.assignment_id = a.id
     WHERE s.student_id = $1`,
    [userId],
  )
  const totalQuestionsDone = (totalQs.rows[0]?.total || 0) + (u.practice_questions_done || 0)

  // 等级进度
  const currentLevelMin = levelFloor(level)
  const nextLevelMin = nextLevelPoints(level)
  const progressInLevel = points - currentLevelMin
  const levelRange = nextLevelMin - currentLevelMin

  // 战力明细
  const combatPower = u.combat_power || 0
  const breakdown = {
    level_contribution: level * 80,
    accuracy_contribution: Math.round((u.accuracy || 0) * 6),
    homework_contribution: (u.homework_done || 0) * 8,
    streak_contribution: (u.streak_days || 0) * 20,
  }

  // 学科表现
  const subjectPerformance = await getSubjectPerformance(userId)

  return {
    points,
    level,
    combat_power: combatPower,
    combat_breakdown: breakdown,
    next_level_points: nextLevelMin,
    points_to_next_level: Math.max(0, nextLevelMin - points),
    progress_in_level: progressInLevel,
    level_range: levelRange,
    streak_days: u.streak_days || 0,
    homework_done: u.homework_done || 0,
    accuracy: u.accuracy || 0,
    total_questions_done: totalQuestionsDone,
    total_practice_time_seconds: u.total_practice_time_seconds || 0,
    subject_performance: subjectPerformance,
  }
}

/**
 * 获取各学科平均分（依托作业关联的题目）
 */
async function getSubjectPerformance(userId) {
  try {
    const result = await query(
      `SELECT
         COALESCE(q.subject, '未分类') AS subject,
         COUNT(*)::int AS total,
         ROUND(AVG(s.score)::numeric, 1) AS avg_score
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id,
       LATERAL jsonb_array_elements_text(a.question_ids) AS qid
       JOIN questions q ON q.id::text = qid
       WHERE s.student_id = $1 AND s.score IS NOT NULL
       GROUP BY q.subject
       ORDER BY avg_score DESC`,
      [userId],
    )
    return result.rows
  } catch {
    return []
  }
}

/**
 * 根据总积分重新计算等级
 */
async function recalculateLevel(userId) {
  const result = await query('SELECT points FROM users WHERE id = $1', [userId])
  if (result.rowCount === 0) return
  const newLevel = calcLevel(result.rows[0].points || 0)
  await query('UPDATE users SET level = $1 WHERE id = $2', [newLevel, userId])
}

/**
 * 重新计算战力值
 */
async function recalculateCombatPower(userId) {
  const result = await query(
    `SELECT level, accuracy, homework_done, streak_days FROM users WHERE id = $1`,
    [userId],
  )
  if (result.rowCount === 0) return
  const u = result.rows[0]
  const total = calcCombatPower(
    u.level || 1,
    u.accuracy || 0,
    u.homework_done || 0,
    u.streak_days || 0,
  )
  await query('UPDATE users SET combat_power = $1 WHERE id = $2', [total, userId])
}

/**
 * 获取积分变动历史
 */
export async function getPointsLog(userId, limit = 50) {
  const result = await query(
    `SELECT id, points, reason, reference_id, created_at
     FROM points_log
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  )
  return result.rows
}

/**
 * 从原始数据全量重新统计数据（用于手动修正 / 初始化）
 */
export async function recalculateAllStats(userId) {
  // 1. 统计作业提交情况
  const subStats = await query(
    `SELECT
       COUNT(*)::int AS total_submissions,
       COUNT(*) FILTER (WHERE score IS NOT NULL)::int AS graded_count,
       COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS avg_score
     FROM submissions WHERE student_id = $1`,
    [userId],
  )
  const s = subStats.rows[0]
  const homeworkDone = s.total_submissions
  const accuracy = parseFloat(s.avg_score) || 0

  // 2. 更新 homework_done 和 accuracy
  await query('UPDATE users SET homework_done = $1, accuracy = $2 WHERE id = $3', [
    homeworkDone,
    accuracy,
    userId,
  ])

  // 3. 从 points_log 汇总总积分
  const pointsResult = await query(
    'SELECT COALESCE(SUM(points), 0)::int AS total FROM points_log WHERE user_id = $1',
    [userId],
  )
  const totalPoints = pointsResult.rows[0].total || 0
  await query('UPDATE users SET points = $1 WHERE id = $2', [totalPoints, userId])

  // 4. 重新计算等级和战力
  await recalculateLevel(userId)
  await recalculateCombatPower(userId)

  return getStudentStats(userId)
}

/**
 * 根据作业得分自动奖励积分（由提交/批改处调用）
 */
export async function awardHomeworkPoints(studentId, submissionId, score) {
  // 提交积分
  await awardPoints(studentId, POINTS_SUBMIT, POINT_REASONS.SUBMIT_HOMEWORK, submissionId)

  // 高分奖励
  if (score >= 90) {
    await awardPoints(studentId, POINTS_BONUS_90, POINT_REASONS.HIGH_SCORE_BONUS, submissionId)
  } else if (score >= 80) {
    await awardPoints(studentId, POINTS_BONUS_80, POINT_REASONS.HIGH_SCORE_BONUS, submissionId)
  } else if (score >= 60) {
    await awardPoints(studentId, POINTS_BONUS_60, POINT_REASONS.HIGH_SCORE_BONUS, submissionId)
  }
}

/**
 * 错题订正奖励积分
 */
export async function awardErrorBookPoints(userId, errorBookId) {
  await awardPoints(
    userId,
    POINTS_ERROR_BOOK,
    POINT_REASONS.ERROR_BOOK_CORRECTION,
    errorBookId,
  )
}

/**
 * 连续登录奖励（每日由登录流程触发）
 */
export async function awardStreakPoints(userId, streakDays) {
  const points = streakDays * POINTS_PER_STREAK_DAY
  if (points <= 0) return
  await awardPoints(userId, points, POINT_REASONS.STREAK_BONUS, null)
}
