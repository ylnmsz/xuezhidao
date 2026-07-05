import { randomUUID } from 'crypto'
import multer from 'multer'
import { parse } from 'csv-parse/sync'
import pool, { query } from '../db.js'
import { parseDocxToQuestions } from '../services/docxQuestionParser.js'
import { convertDocToDocx, repairDocx } from '../services/convertDoc.js'
import { createTask, getTask, startDocxProcessing, listRecentTasks } from '../services/taskStore.js'

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const isCsv =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname?.toLowerCase().endsWith('.csv')
    if (isCsv) {
      return cb(null, true)
    }
    return cb(new Error('Only CSV uploads are allowed.'))
  },
})

export const uploadQuestionsCsv = csvUpload.single('file')

const docxUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const name = String(file.originalname || '').toLowerCase()
    const isAccepted =
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/pdf' ||
      name.endsWith('.docx') ||
      name.endsWith('.doc') ||
      name.endsWith('.pdf')
    if (isAccepted) return cb(null, true)
    return cb(new Error('Only .docx, .doc or .pdf uploads are allowed.'))
  },
})

export const uploadQuestionsDocx = docxUpload.single('file')

export const listQuestions = async (req, res) => {
  const { subject, difficulty, bankId, ids, limit } = req.query
  try {
    const filters = []
    const values = []

    if (ids) {
      const idArr = ids.split(',').map((s) => s.trim()).filter(Boolean)
      if (idArr.length > 0) {
        values.push(idArr)
        filters.push(`id = ANY($${values.length}::uuid[])`)
      }
    }
    if (subject) {
      values.push(subject)
      filters.push(`subject = $${values.length}`)
    }
    if (difficulty) {
      values.push(difficulty)
      filters.push(`difficulty = $${values.length}`)
    }
    if (bankId) {
      values.push(bankId)
      filters.push(`bank_id = $${values.length}`)
    }

    const hasLimit = limit && !Number.isNaN(Number(limit))
    const orderClause = hasLimit ? 'ORDER BY RANDOM()' : 'ORDER BY created_at DESC'
    let limitClause = ''
    if (hasLimit) {
      values.push(Number(limit))
      limitClause = ` LIMIT $${values.length}`
    }

    const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : ''
    const result = await query(
      `SELECT id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation, created_at FROM questions ${whereClause} ${orderClause}${limitClause}`,
      values,
    )
    return res.json({ items: result.rows })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const getQuestionById = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation, created_at FROM questions WHERE id = $1',
      [req.params.id],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const createQuestion = async (req, res) => {
  const {
    content,
    stem_image_url,
    option_images,
    subject,
    grade,
    difficulty,
    bank_id,
    question_type,
    answer,
    explanation,
  } = req.body
  if (!content) {
    return res.status(400).json({ message: 'content is required.' })
  }
  if (!question_type) {
    return res.status(400).json({ message: 'question_type is required.' })
  }
  const normalizedType = String(question_type || '')
    .trim()
    .toLowerCase()
  const allowEmptyAnswerTypes = new Set([
    '阅读理解',
    '连线题',
    '改错题',
    '填空题',
    '问答题',
    '简答题',
    '其他',
  ])
  const requiresAnswer = !allowEmptyAnswerTypes.has(normalizedType)
  const isAnswerEmpty =
    answer === undefined || answer === null || (typeof answer === 'string' && answer.trim() === '')
  if (requiresAnswer && isAnswerEmpty) {
    return res.status(400).json({ message: 'answer is required.' })
  }

  try {
    const questionId = randomUUID()
    const result = await query(
      'INSERT INTO questions (id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation, created_at',
      [
        questionId,
        bank_id || null,
        content,
        stem_image_url || null,
        option_images || null,
        subject || null,
        grade || null,
        difficulty || null,
        question_type,
        answer,
        explanation || null,
      ],
    )
    return res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const updateQuestion = async (req, res) => {
  const {
    content,
    stem_image_url,
    option_images,
    subject,
    grade,
    difficulty,
    bank_id,
    question_type,
    answer,
    explanation,
  } = req.body
  try {
    const result = await query(
      'UPDATE questions SET content = COALESCE($1, content), stem_image_url = COALESCE($2, stem_image_url), option_images = COALESCE($3, option_images), subject = COALESCE($4, subject), grade = COALESCE($5, grade), difficulty = COALESCE($6, difficulty), bank_id = COALESCE($7, bank_id), question_type = COALESCE($8, question_type), answer = COALESCE($9, answer), explanation = COALESCE($10, explanation) WHERE id = $11 RETURNING id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation, created_at',
      [
        content || null,
        stem_image_url || null,
        option_images || null,
        subject || null,
        grade || null,
        difficulty || null,
        bank_id || null,
        question_type || null,
        answer || null,
        explanation || null,
        req.params.id,
      ],
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteQuestion = async (req, res) => {
  try {
    const result = await query('DELETE FROM questions WHERE id = $1 RETURNING id', [req.params.id])
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Question not found.' })
    }
    return res.json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const bulkCreateQuestions = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }

  let records
  try {
    records = parse(req.file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })
  } catch (error) {
    return res.status(400).json({ message: 'Invalid CSV format.', error: error.message })
  }

  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ message: 'CSV has no rows.' })
  }

  const requiredFields = ['content', 'question_type', 'difficulty', 'answer']
  const missingRow = records.findIndex((row) =>
    requiredFields.some((field) => !row[field] || String(row[field]).trim() === ''),
  )
  if (missingRow !== -1) {
    return res.status(400).json({
      message: 'CSV missing required fields.',
      row: missingRow + 1,
      required: requiredFields,
    })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const inserted = []
    for (const row of records) {
      const questionId = randomUUID()
      const result = await client.query(
        'INSERT INTO questions (id, bank_id, content, stem_image_url, option_images, subject, grade, difficulty, question_type, answer, explanation) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id',
        [
          questionId,
          row.bank_id?.trim() || null,
          row.content,
          row.stem_image_url?.trim() || null,
          row.option_images?.trim() || null,
          row.subject?.trim() || null,
          row.grade?.trim() || null,
          row.difficulty?.trim() || null,
          row.question_type?.trim() || null,
          row.answer?.trim() || null,
          row.explanation?.trim() || null,
        ],
      )
      inserted.push(result.rows[0])
    }
    await client.query('COMMIT')
    return res.status(201).json({ count: inserted.length, items: inserted })
  } catch (error) {
    await client.query('ROLLBACK')

    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  } finally {
    client.release()
  }
}

export const previewQuestionsFromDocx = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }

  try {
    let buffer = req.file.buffer
    let originalName = req.file.originalname || 'upload.docx'
    const lname = String(originalName).toLowerCase()
    if (lname.endsWith('.doc')) {
      // convert to docx first
      try {
        buffer = convertDocToDocx(buffer, originalName)
        // Only rename to .docx if the buffer actually changed (soffice was available)
        if (buffer.length !== req.file.buffer.length || !buffer.equals(req.file.buffer)) {
          originalName = originalName.replace(/\.doc$/i, '.docx')
        } else {
          console.warn('[doc-convert] soffice not available, sending .doc directly to MinerU')
        }
      } catch (convErr) {
        console.error('Conversion error:', convErr)
        return res
          .status(500)
          .json({ message: `Failed to convert .doc to .docx: ${convErr.message}` })
      }
    } else if (lname.endsWith('.docx')) {
      // For .docx files, repair WMF/EMF images via LibreOffice if needed.
      // The repairDocx function first does a fast AdmZip check — if no WMF files
      // are found it returns immediately (zero overhead on plain docs).
      buffer = repairDocx(buffer)
    }

    const result = await parseDocxToQuestions(buffer, originalName)
    try {
      const count = Array.isArray(result?.items) ? result.items.length : 0
      console.log('[previewQuestionsFromDocx] returning items count:', count)
      if (Array.isArray(result?.items)) {
        console.log(
          '[previewQuestionsFromDocx] items sample ids/types:',
          result.items.slice(0, 5).map((it) => ({ id: it.id, type: it.type })),
        )
      }
    } catch (logErr) {
      console.error('[previewQuestionsFromDocx] logging error', logErr)
    }
    try {
      if (Array.isArray(result?.items)) {
        const preview = JSON.stringify({ items: result.items.slice(0, 10) }, null, 2).slice(0, 2000)
        console.log('[previewQuestionsFromDocx] response preview (first 10 items):', preview)
      }
    } catch (logErr) {
      console.error('[previewQuestionsFromDocx] response preview error', logErr)
    }
    // Truncate raw markdown to prevent oversized responses (5000 chars is enough for preview/debugging)
    const truncatedRaw = result.raw ? result.raw.slice(0, 5000) : null
    return res.json({ items: result.items, raw: truncatedRaw })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message || 'Parse failed.' })
  }
}

// ─── Async batch-docx (doesn't block, returns task ID immediately) ───

export const startBatchDocxAsync = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' })
  }

  const task = createTask('batch-docx', {
    originalName: req.file.originalname || 'upload.docx',
    size: req.file.size,
  })

  // Start processing in background (don't await)
  startDocxProcessing(task.id, req.file.buffer, req.file.originalname || 'upload.docx')

  return res.json({
    taskId: task.id,
    status: task.status,
    message: 'Processing started. Poll /api/questions/batch-status/:taskId for results.',
  })
}

export const getBatchTaskStatus = async (req, res) => {
  const task = getTask(req.params.taskId)
  if (!task) {
    return res.status(404).json({ message: 'Task not found or expired.' })
  }

  return res.json({
    id: task.id,
    status: task.status,
    progress: task.progress,
    statusMessage: task.statusMessage || '',
    result: task.status === 'done' ? task.result : null,
    error: task.error,
    createdAt: task.createdAt,
    doneAt: task.doneAt,
  })
}

export const listBatchTasks = async (req, res) => {
  const tasks = listRecentTasks('batch-docx', 10)
  return res.json({ items: tasks })
}
