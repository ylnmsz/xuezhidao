import { randomUUID } from 'crypto'
import { query } from '../db.js'
import { awardPoints, POINT_REASONS } from '../services/studentStatsService.js'

/**
 * 自动批改练习并写入错题本
 * POST /api/practice/submit
 * Body: { answers: [{ questionId, answer }], elapsed_seconds?: number, assignmentId?: string }
 */
export const submitPractice = async (req, res) => {
  const { answers, elapsed_seconds, assignmentId } = req.body
  const userId = req.user.id

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: 'answers is required.' })
  }

  try {
    // 1. 批量查询题目
    const questionIds = answers.map((a) => a.questionId)
    const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(',')
    const qResult = await query(
      `SELECT id, content, stem_image_url, question_type, answer AS correct_answer, explanation, subject, difficulty
       FROM questions WHERE id IN (${placeholders})`,
      questionIds,
    )

    const questionMap = {}
    for (const q of qResult.rows) {
      questionMap[q.id] = q
    }

    // 2. 逐题批改
    const results = []
    let correctCount = 0
    const wrongQuestionIds = []
    const autoGradedCount = { total: 0, correct: 0 }

    for (const ans of answers) {
      const q = questionMap[ans.questionId]
      if (!q) {
        results.push({
          questionId: ans.questionId,
          questionType: 'unknown',
          correct: false,
          studentAnswer: ans.answer,
          correctAnswer: null,
          explanation: '题目未找到',
          content: '',
          subject: '',
          difficulty: '',
        })
        continue
      }

      const grade = autoGrade(q.question_type, ans.answer, q.correct_answer)
      const isCorrect = grade === true
      const needsManual = grade === null

      results.push({
        questionId: ans.questionId,
        questionType: q.question_type,
        correct: isCorrect,
        needsManual,
        studentAnswer: ans.answer,
        correctAnswer: q.correct_answer,
        explanation: q.explanation || '',
        content: q.content || '',
        subject: q.subject || '',
        difficulty: q.difficulty || '',
      })

      if (grade !== null) {
        autoGradedCount.total++
        if (grade) {
          autoGradedCount.correct++
          correctCount++
        } else {
          wrongQuestionIds.push(ans.questionId)
        }
      }
    }

    // 3. 错题自动收录到错题本（去重，记录学生答案）
    for (const ans of answers) {
      const q = questionMap[ans.questionId]
      if (!q) continue
      const grade = autoGrade(q.question_type, ans.answer, q.correct_answer)
      if (grade !== false) continue // 只收录错题

      const existing = await query(
        'SELECT id FROM error_book WHERE user_id = $1 AND question_id = $2',
        [userId, ans.questionId],
      )
      if (existing.rowCount === 0) {
        const studentAnswer = ans.answer !== null && ans.answer !== undefined
          ? (Array.isArray(ans.answer) ? ans.answer.join(', ') : String(ans.answer))
          : null
        await query(
          'INSERT INTO error_book (id, user_id, question_id, student_answer, note) VALUES ($1, $2, $3, $4, $5)',
          [randomUUID(), userId, ans.questionId, studentAnswer, '练习自动收录'],
        )
      }
    }

    // 4. 奖励积分：每答对一题 2 分
    const practicePoints = correctCount * 2
    if (practicePoints > 0) {
      await awardPoints(userId, practicePoints, POINT_REASONS.PRACTICE_CORRECT, null).catch(
        (err) => console.error('Failed to award practice points:', err),
      )
    }

    const totalQuestions = results.length
    const wrongCount = totalQuestions - correctCount
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

    // 5. 更新用户练习统计
    try {
      const userRow = await query(
        'SELECT practice_questions_done, total_practice_time_seconds, streak_days, accuracy, last_practice_date FROM users WHERE id = $1',
        [userId],
      )
      if (userRow.rowCount > 0) {
        const u = userRow.rows[0]
        const today = new Date().toISOString().slice(0, 10)
        const lastDate = u.last_practice_date
          ? new Date(u.last_practice_date).toISOString().slice(0, 10)
          : null

        // 更新连续打卡
        let newStreak = u.streak_days || 0
        if (lastDate === today) {
          // 今天已经练习过，保持连续
        } else if (lastDate === getPreviousDate(today)) {
          // 昨天练习过，连续+1
          newStreak += 1
        } else {
          // 超过一天没练习，重置
          newStreak = 1
        }

        // 更新准确率（加权平均）
        const oldTotalQs = u.practice_questions_done || 0
        const newTotalQs = oldTotalQs + totalQuestions
        const oldAccuracy = u.accuracy || 0
        const newAccuracy = newTotalQs > 0
          ? Math.round(((oldAccuracy * oldTotalQs + correctCount) / newTotalQs) * 10000) / 10000
          : 0

        // 累计练习时长
        const elapsedSec = Math.max(0, parseInt(elapsed_seconds) || 0)

        await query(
          `UPDATE users SET
            practice_questions_done = COALESCE(practice_questions_done, 0) + $1,
            total_practice_time_seconds = COALESCE(total_practice_time_seconds, 0) + $2,
            streak_days = $3,
            accuracy = $4,
            last_practice_date = $5::date,
            weekly_study_hours = ROUND((COALESCE(total_practice_time_seconds, 0) + $2) / 3600.0, 1)
          WHERE id = $6`,
          [totalQuestions, elapsedSec, newStreak, newAccuracy, today, userId],
        )
      }
    } catch (statsErr) {
      console.error('Failed to update practice stats:', statsErr)
    }

    // 6. 如果是作业模式（有 assignmentId），创建提交记录
    if (assignmentId) {
      try {
        const submissionId = randomUUID()
        const contentJson = JSON.stringify(answers)
        await query(
          `INSERT INTO submissions (id, assignment_id, student_id, content, score, status, submitted_at)
           VALUES ($1, $2, $3, $4, NULL, 'submitted', NOW())`,
          [submissionId, assignmentId, userId, contentJson],
        )
        // 提交作业奖励 10 积分（高分奖励由老师批改时发放）
        await awardPoints(userId, 10, POINT_REASONS.SUBMIT_HOMEWORK, submissionId).catch(
          (err) => console.error('Failed to award submit points:', err),
        )
      } catch (subErr) {
        console.error('Failed to create submission:', subErr)
      }
    }

    return res.json({
      results,
      totalQuestions,
      correctCount,
      wrongCount,
      score,
      pointsEarned: practicePoints,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

/**
 * 自动批改核心逻辑
 * @param {string} questionType
 * @param {*} studentAnswer
 * @param {*} correctAnswer
 * @returns {boolean|null} true=正确, false=错误, null=需人工
 */
function autoGrade(questionType, studentAnswer, correctAnswer) {
  if (studentAnswer === null || studentAnswer === undefined) return false
  if (correctAnswer === null || correctAnswer === undefined) return null

  switch (questionType) {
    case '单选题':
    case '判断题':
      return normalize(studentAnswer) === normalize(correctAnswer)

    case '多选题': {
      const sArr = Array.isArray(studentAnswer) ? studentAnswer : String(studentAnswer).split(/[,，、]/)
      const cArr = Array.isArray(correctAnswer) ? correctAnswer : String(correctAnswer).split(/[,，、]/)
      const sn = sArr.map(normalize).sort().join(',')
      const cn = cArr.map(normalize).sort().join(',')
      return sn === cn
    }

    case '填空题':
      return normalize(String(studentAnswer).replace(/\s+/g, '')) === normalize(String(correctAnswer).replace(/\s+/g, ''))

    case '简答题': {
      const cleanA = normalize(String(studentAnswer)).replace(/[，。！？、；：""''【】]/g, '')
      const cleanC = normalize(String(correctAnswer)).replace(/[，。！？、；：""''【】]/g, '')
      return cleanA === cleanC
    }

    case '问答题':
    case '阅读理解':
    case '翻译题':
    case '改错题':
    case '连线题':
    case '编程题':
      return null

    default:
      return normalize(studentAnswer) === normalize(correctAnswer)
  }
}

function normalize(s) {
  if (s === null || s === undefined) return ''
  return String(s).trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * 返回指定日期（YYYY-MM-DD）的前一天
 */
function getPreviousDate(todayStr) {
  const d = new Date(todayStr + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}
