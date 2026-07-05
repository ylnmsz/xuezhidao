import { API_BASE, request, uploadFormData } from './api.js'

export const listQuestions = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/questions${qs ? '?' + qs : ''}`)
}

export const listClasses = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/classes${qs ? '?' + qs : ''}`)
}

export const createClass = (payload) =>
  request('/classes', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const listAssignments = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/assignments${qs ? '?' + qs : ''}`)
}

export const listNotifications = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/notifications${qs ? '?' + qs : ''}`)
}

export const listSubmissions = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/submissions${qs ? '?' + qs : ''}`)
}

export const getStudentAssignments = () => request('/assignments/for-student')

export const getAssignmentPrep = (id) => request(`/assignments/prep/${id}`)

export const createClassInvite = (classId, payload = {}) =>
  request(`/classes/${classId}/invites`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const joinByInviteCode = async (code) => {
  const url = `${API_BASE}/invites/join`
  const token = localStorage.getItem('auth_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const resp = await fetch(url, { method: 'POST', headers, body: JSON.stringify({ code }) })
  const contentType = resp.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await resp.json() : null
  if (!resp.ok) {
    const message = data?.message || 'Request failed'
    throw new Error(message)
  }
  return { status: resp.status, data }
}

export const deleteClass = (id) =>
  request(`/classes/${id}`, {
    method: 'DELETE',
  })

export const listClassMembers = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/class-members${qs ? '?' + qs : ''}`)
}

export const getClassById = (id) => request(`/classes/${id}`)

export const getUserById = (id) => request(`/users/${id}`)

export const createQuestion = (payload) =>
  request('/questions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const uploadQuestionsCsv = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return uploadFormData('/questions/batch', formData)
}

export const parseQuestionsDocx = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return uploadFormData('/questions/batch-docx', formData)
}

/** Async batch-docx — returns immediately with a taskId. Poll getBatchTaskStatus for results. */
export const parseQuestionsDocxAsync = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return uploadFormData('/questions/batch-docx-async', formData)
}

export const getBatchTaskStatus = (taskId) => request(`/questions/batch-status/${taskId}`)

export const listBatchTasks = () => request('/questions/batch-tasks')

export const uploadQuestionImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return uploadFormData('/uploads/question-image', formData)
}

// ---- 学生积分 / 等级 / 战力 ----

export const getMyStats = () => request('/users/me/stats')

export const getMyPointsLog = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/users/me/points-log${qs ? '?' + qs : ''}`)
}

export const recalculateMyStats = () =>
  request('/users/me/recalculate-stats', { method: 'POST' })

export const getMyRecentPractice = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/submissions/me/recent${qs ? '?' + qs : ''}`)
}

export const createErrorItem = (payload) =>
  request('/errorbook', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const listErrorBook = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/errorbook${qs ? '?' + qs : ''}`)
}

export const getErrorBookStats = () => request('/errorbook/stats')

export const masterErrorItem = (id) =>
  request(`/errorbook/${id}/master`, { method: 'POST' })

export const deleteErrorItem = (id) =>
  request(`/errorbook/${id}`, { method: 'DELETE' })

// ---- 排行榜 ----

export const getRankingSummary = () => request('/rankings/summary')

export const getStudentRankings = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/rankings/student${qs ? '?' + qs : ''}`)
}

export const getClassRankings = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return request(`/rankings/class${qs ? '?' + qs : ''}`)
}

// ---- 学情分析 ----

export const getAnalyticsOverview = () => request('/analytics/overview')

// ---- 私信 ----

export const getConversations = () => request('/messages/conversations')

export const getConversation = (userId) => request(`/messages/conversation/${userId}`)

export const sendMessage = (receiverId, content) =>
  request('/messages', {
    method: 'POST',
    body: JSON.stringify({ receiver_id: receiverId, content }),
  })

export const getUnreadTotal = () => request('/messages/unread-total')

export const markMessagesRead = (senderId) =>
  request(`/messages/read/${senderId}`, { method: 'PUT' })

export const getClassAnalytics = (classId) => request(`/analytics/class/${classId}`)
