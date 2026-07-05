import { randomUUID } from 'crypto'
import { parseDocxToQuestions } from './docxQuestionParser.js'

// In-memory task store (ephemeral — cleared on server restart)
const tasks = new Map()

const TASK_TTL_MS = 30 * 60 * 1000 // 30 minutes

// Periodically clean up old tasks
setInterval(() => {
  const cutoff = Date.now() - TASK_TTL_MS
  for (const [id, task] of tasks) {
    if (task.doneAt && task.doneAt < cutoff) {
      tasks.delete(id)
    }
  }
}, 60_000)

export const createTask = (type, data) => {
  const id = randomUUID()
  const task = {
    id,
    type,
    data,
    status: 'pending', // pending → processing → done | error
    progress: 0,
    result: null,
    error: null,
    createdAt: Date.now(),
    doneAt: null,
  }
  tasks.set(id, task)
  return task
}

export const getTask = (id) => tasks.get(id) || null

export const updateTask = (id, updates) => {
  const task = tasks.get(id)
  if (task) Object.assign(task, updates)
}

/**
 * Start processing a batch-docx task in the background.
 * Returns immediately; the task status can be polled via getTask.
 */
export const startDocxProcessing = async (taskId, buffer, originalName) => {
  updateTask(taskId, { status: 'processing', progress: 10 })
  try {
    // 1. If .doc file, convert via LibreOffice (same as synchronous path)
    let processBuffer = buffer
    let processName = originalName
    const lname = String(originalName).toLowerCase()
    if (lname.endsWith('.doc')) {
      const { convertDocToDocx } = await import('./convertDoc.js')
      const converted = convertDocToDocx(processBuffer, processName)
      if (converted.length !== buffer.length || !converted.equals(buffer)) {
        processBuffer = converted
        processName = processName.replace(/\.doc$/i, '.docx')
      }
      updateTask(taskId, { progress: 20 })
    } else if (lname.endsWith('.docx')) {
      const { repairDocx } = await import('./convertDoc.js')
      processBuffer = repairDocx(processBuffer)
      updateTask(taskId, { progress: 20 })
    }
    // For PDF — no preprocessing needed, go straight to MinerU

    updateTask(taskId, { progress: 30, statusMessage: '正在 OCR 识别...' })
    const result = await parseDocxToQuestions(processBuffer, processName)

    updateTask(taskId, { progress: 90, statusMessage: '解析完成' })
    const items = Array.isArray(result?.items) ? result.items : []
    const raw = result?.raw || ''
    const truncatedRaw = raw ? raw.slice(0, 5000) : null

    updateTask(taskId, {
      status: 'done',
      progress: 100,
      doneAt: Date.now(),
      result: { items, raw: truncatedRaw },
    })
  } catch (error) {
    console.error('[task] processing error:', error)
    updateTask(taskId, {
      status: 'error',
      doneAt: Date.now(),
      error: error.message || 'Processing failed',
    })
  }
}

export const listRecentTasks = (type, limit = 5) => {
  const filtered = []
  for (const task of tasks.values()) {
    if (task.type === type) {
      filtered.push({
        id: task.id,
        status: task.status,
        progress: task.progress,
        statusMessage: task.statusMessage,
        error: task.error,
        doneAt: task.doneAt,
        createdAt: task.createdAt,
      })
    }
  }
  filtered.sort((a, b) => b.createdAt - a.createdAt)
  return filtered.slice(0, limit)
}
