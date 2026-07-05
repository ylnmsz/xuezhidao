import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import pool from '../db.js'

const CLASS_NAME = '403班'
const STUDENT_COUNT = 30
const DEFAULT_PASSWORD = '123456'

// Realistic Chinese surnames and given names
const surnames = [
  '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '高',
  '梁', '郑', '宋', '谢', '唐', '韩', '曹', '许', '邓', '冯',
]

const givenNames = [
  '子涵', '雨欣', '浩然', '思琪', '俊杰', '沐曦', '一鸣', '若曦',
  '天宇', '佳琪', '文博', '诗涵', '泽宇', '雅静', '明远', '语嫣',
  '宇航', '欣怡', '睿泽', '紫萱', '志远', '梓涵', '子轩', '雨桐',
  '浩宇', '芷若', '梓豪', '思颖', '致远', '梦洁', '昊然', '晓萱',
  '博文', '文静', '鹏飞', '舒涵', '伟杰', '子馨', '家豪', '若兰',
  '俊贤', '可欣', '子安', '语萱', '凯文', '晓雅', '明哲', '诗琪',
  '子涵', '雨桐',
]

// Grade options
const grades = ['三年级', '四年级', '五年级', '六年级', '初一', '初二', '初三']
const schools = ['阳光小学', '实验中学', '第一小学', '育才学校', '师范附小']

// Realistic stats generation
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min, max, decimals = 2) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals))
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateStudent(index) {
  const surname = pickRandom(surnames)
  const givenName = pickRandom(givenNames)
  const name = surname + givenName
  const level = randomInt(1, 20)
  const points = randomInt(100, 1000)
  const accuracy = randomFloat(40, 98)
  const streakDays = randomInt(0, 30)
  const weeklyStudyHours = randomFloat(1, 20, 1)
  const homeworkDone = randomInt(5, 50)
  // combat_power formula: level * 80 + accuracy * 6 + homework_done * 8 + streak_days * 20
  const combatPower = Math.round(level * 80 + accuracy * 6 + homeworkDone * 8 + streakDays * 20)

  return {
    id: randomUUID(),
    name,
    email: `student_${String(index + 1).padStart(3, '0')}_${Date.now()}@xuezhidao.com`,
    phone: `138${String(randomInt(10000000, 99999999))}`,
    grade: pickRandom(grades),
    class_name: CLASS_NAME,
    school: pickRandom(schools),
    signature: pickRandom(['努力学习，天天向上', '书山有路勤为径', '学海无涯苦作舟', '', '一寸光阴一寸金', '天道酬勤']),
    level,
    streak_days: streakDays,
    weekly_study_hours: weeklyStudyHours,
    homework_done: homeworkDone,
    accuracy,
    points,
    combat_power: combatPower,
  }
}

async function run() {
  const client = await pool.connect()
  try {
    console.log('=== 开始批量插入学生数据 ===')

    // 1. Find or create the class
    console.log(`\n[1/4] 查找/创建班级: ${CLASS_NAME}...`)
    let classResult = await client.query('SELECT id FROM classes WHERE name = $1', [CLASS_NAME])
    let classId
    if (classResult.rowCount === 0) {
      classId = randomUUID()
      await client.query(
        'INSERT INTO classes (id, name) VALUES ($1, $2)',
        [classId, CLASS_NAME],
      )
      console.log(`  -> 班级不存在，已创建新班级: ${CLASS_NAME} (ID: ${classId})`)
    } else {
      classId = classResult.rows[0].id
      console.log(`  -> 找到班级: ${CLASS_NAME} (ID: ${classId})`)
    }

    // 2. Hash the default password
    console.log('\n[2/4] 加密默认密码...')
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)
    console.log(`  -> 默认密码: ${DEFAULT_PASSWORD} (已加密)`)

    // 3. Generate and insert students
    console.log(`\n[3/4] 生成并插入 ${STUDENT_COUNT} 名学生...`)
    const students = Array.from({ length: STUDENT_COUNT }, (_, i) => generateStudent(i))

    let insertedCount = 0
    for (const s of students) {
      try {
        await client.query(
          `INSERT INTO users (id, role, name, email, phone, password_hash, avatar_url, grade, class_name, school, signature,
                              level, streak_days, weekly_study_hours, homework_done, accuracy, points, combat_power)
           VALUES ($1, 'student', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
          [
            s.id, s.name, s.email, s.phone, passwordHash, null,
            s.grade, s.class_name, s.school, s.signature,
            s.level, s.streak_days, s.weekly_study_hours, s.homework_done,
            s.accuracy, s.points, s.combat_power,
          ],
        )
        insertedCount++
        if (insertedCount % 10 === 0) {
          console.log(`  -> 已插入 ${insertedCount}/${STUDENT_COUNT} 人`)
        }
      } catch (err) {
        if (err.code === '23505') { // unique violation
          console.log(`  -> 跳过重复邮箱: ${s.email}`)
        } else {
          throw err
        }
      }
    }
    console.log(`  -> 成功插入 ${insertedCount} 名学生`)

    // 4. Add students to class
    console.log('\n[4/4] 将学生添加到班级...')
    let memberCount = 0
    for (const s of students) {
      try {
        await client.query(
          `INSERT INTO class_members (id, class_id, user_id, role)
           VALUES ($1, $2, $3, 'student')`,
          [randomUUID(), classId, s.id],
        )
        memberCount++
      } catch (err) {
        if (err.code === '23505') { // unique constraint
          console.log(`  -> ${s.name} 已在班级中`)
        } else {
          throw err
        }
      }
    }
    console.log(`  -> 成功添加 ${memberCount} 名学生到 ${CLASS_NAME}`)

    // Summary
    console.log('\n========================================')
    console.log('  批量插入完成!')
    console.log(`  班级: ${CLASS_NAME} (ID: ${classId})`)
    console.log(`  学生数: ${insertedCount}`)
    console.log(`  默认密码: ${DEFAULT_PASSWORD}`)
    console.log('========================================\n')

    // Print student list
    console.log('--- 学生列表 ---')
    students.forEach((s, i) => {
      console.log(
        `  ${String(i + 1).padStart(2, ' ')}. ${s.name.padEnd(8, ' ')} | 等级:${String(s.level).padStart(2, ' ')} | 积分:${String(s.points).padStart(4, ' ')} | 战力:${String(s.combat_power).padStart(5, ' ')} | 正确率:${String(s.accuracy).padStart(5, ' ')}% | 连续:${String(s.streak_days).padStart(2, ' ')}天`,
      )
    })
    console.log('')

    process.exit(0)
  } catch (err) {
    console.error('批量插入失败:', err)
    process.exit(1)
  } finally {
    client.release()
  }
}

run()
