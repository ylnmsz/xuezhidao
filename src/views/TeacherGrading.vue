<template>
  <div class="bg-surface font-body text-on-surface">
    <div class="flex min-h-screen">
      <TeacherSidebar />
      <TeacherTopNavbar profile-route="/teacherprofile" />

      <main class="flex-1 lg:ml-72 p-4 md:p-10 pt-24 md:pt-28 space-y-8">
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
          <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="rate_review">rate_review</span>
          <p class="text-lg text-on-surface-variant font-medium">加载批改数据中...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
          <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
          <p class="text-lg text-error font-medium">{{ error }}</p>
          <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
        </div>

        <template v-else>
          <!-- Header -->
          <header class="flex flex-col md:flex-row md:items-start gap-4">
            <button
              @click="goBack"
              class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors shrink-0 mt-1"
            >
              <span class="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
              <span class="text-sm font-bold">返回</span>
            </button>
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-extrabold tracking-tight text-primary">{{ assignment.title || '作业批改' }}</h1>
                <span
                  class="px-3 py-1 rounded-full text-xs font-bold"
                  :class="allGraded ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary'"
                >
                  {{ allGraded ? '全部已批改' : '有未批改' }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm" data-icon="groups">groups</span>
                  {{ className || '未知班级' }}
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm" data-icon="description">description</span>
                  {{ questions.length }} 道题
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm" data-icon="how_to_reg">how_to_reg</span>
                  {{ submissions.length }} 人已提交
                </span>
                <span class="flex items-center gap-1.5" :class="pendingCount > 0 ? 'text-tertiary font-semibold' : 'text-secondary'">
                  <span class="material-symbols-outlined text-sm" :style="pendingCount > 0 ? 'font-variation-settings: \'FILL\' 1' : ''" data-icon="pending_actions">pending_actions</span>
                  {{ pendingCount }} 份待批改
                </span>
              </div>
            </div>
          </header>

          <!-- Main content area -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Student list (left) -->
            <div class="lg:col-span-1">
              <section class="bg-surface-container-lowest rounded-xl diffused-shadow overflow-hidden">
                <div class="p-5 border-b border-surface-container-high/30 flex items-center justify-between">
                  <h2 class="font-headline font-bold text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary" data-icon="people">people</span>
                    提交学生
                  </h2>
                  <span class="text-sm font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">{{ submissions.length }}</span>
                </div>

                <div class="max-h-[600px] overflow-y-auto">
                  <div
                    v-for="sub in submissions"
                    :key="sub.id"
                    @click="selectSubmission(sub)"
                    class="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all border-b border-surface-container-high/20 hover:bg-primary-container/5"
                    :class="selectedSubmission?.id === sub.id ? 'bg-primary-container/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'"
                  >
                    <div class="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden shrink-0">
                      <img v-if="sub.avatar_url" :src="studentAvatar(sub)" :alt="sub.student_name" class="w-full h-full object-cover" />
                      <span v-else class="material-symbols-outlined text-primary" data-icon="person">person</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm truncate">{{ sub.student_name || '未知学生' }}</p>
                      <p class="text-xs text-on-surface-variant mt-0.5">
                        {{ formatTime(sub.submitted_at) }}
                      </p>
                    </div>
                    <div class="shrink-0">
                      <span
                        v-if="sub.status === 'graded'"
                        class="text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary"
                      >已批改</span>
                      <span
                        v-else
                        class="text-xs font-bold px-2.5 py-1 rounded-full bg-tertiary/10 text-tertiary"
                      >待批改</span>
                    </div>
                    <span v-if="sub.score !== null && sub.score !== undefined" class="text-sm font-black" :class="scoreTextClass(sub.score)">
                      {{ sub.score }}分
                    </span>
                  </div>

                  <div v-if="submissions.length === 0" class="flex flex-col items-center justify-center py-16 gap-4">
                    <span class="material-symbols-outlined text-5xl text-on-surface-variant" data-icon="inbox">inbox</span>
                    <p class="text-on-surface-variant font-medium">暂无学生提交</p>
                  </div>
                </div>
              </section>
            </div>

            <!-- Grading area (right) -->
            <div class="lg:col-span-2">
              <template v-if="selectedSubmission">
                <!-- Student header -->
                <section class="bg-surface-container-lowest rounded-xl diffused-shadow p-6 mb-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center overflow-hidden">
                        <img v-if="selectedSubmission.avatar_url" :src="studentAvatar(selectedSubmission)" :alt="selectedSubmission.student_name" class="w-full h-full object-cover" />
                        <span v-else class="material-symbols-outlined text-2xl text-primary" data-icon="person">person</span>
                      </div>
                      <div>
                        <h3 class="font-headline font-bold text-lg">{{ selectedSubmission.student_name || '未知学生' }}</h3>
                        <p class="text-sm text-on-surface-variant flex items-center gap-2 mt-0.5">
                          <span>提交于 {{ formatTime(selectedSubmission.submitted_at) }}</span>
                          <span v-if="selectedSubmission.graded_at" class="flex items-center gap-1">
                            <span class="w-1 h-1 rounded-full bg-on-surface-variant inline-block"></span>
                            批改于 {{ formatTime(selectedSubmission.graded_at) }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-sm text-on-surface-variant">当前得分</p>
                      <p class="text-3xl font-black font-headline" :class="scoreTextClass(currentScore)">
                        {{ currentScore }}<span class="text-lg text-on-surface-variant font-bold"> / 100</span>
                      </p>
                    </div>
                  </div>
                </section>

                <!-- Per-question grading -->
                <section class="space-y-6">
                  <div
                    v-for="(item, idx) in studentAnswers"
                    :key="item.questionId"
                    class="bg-surface-container-lowest rounded-xl diffused-shadow overflow-hidden"
                    :class="{ 'ring-2 ring-secondary/30': getMark(item.questionId), 'ring-2 ring-error/20': getMark(item.questionId) === false }"
                  >
                    <!-- Question header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-surface-container-high/20 bg-surface-container-low/20">
                      <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black">{{ idx + 1 }}</span>
                        <span class="font-bold text-sm">{{ item.questionType || '题目' }}</span>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">{{ item.difficulty || '中等' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          @click="setMark(item.questionId, true)"
                          class="px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5"
                          :class="getMark(item.questionId) === true
                            ? 'bg-secondary text-white shadow-md scale-105'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-secondary/10 hover:text-secondary'"
                        >
                          <span class="material-symbols-outlined text-sm" :style="getMark(item.questionId) === true ? 'font-variation-settings: \'FILL\' 1' : ''" data-icon="check_circle">check_circle</span>
                          正确
                        </button>
                        <button
                          @click="setMark(item.questionId, false)"
                          class="px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5"
                          :class="getMark(item.questionId) === false
                            ? 'bg-error text-white shadow-md scale-105'
                            : 'bg-surface-container-high text-on-surface-variant hover:bg-error/10 hover:text-error'"
                        >
                          <span class="material-symbols-outlined text-sm" :style="getMark(item.questionId) === false ? 'font-variation-settings: \'FILL\' 1' : ''" data-icon="cancel">cancel</span>
                          错误
                        </button>
                      </div>
                    </div>

                    <!-- Question content -->
                    <div class="p-6 space-y-5">
                      <!-- Stem -->
                      <div>
                        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">题目</p>
                        <div class="text-on-surface leading-relaxed prose-custom" v-html="getRenderedStem(item.question)"></div>
                      </div>

                      <!-- Options (if multiple choice) -->
                      <div v-if="item.options && item.options.length > 0">
                        <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">选项</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div
                            v-for="opt in item.options"
                            :key="opt.id"
                            class="px-4 py-3 rounded-xl border text-sm"
                            :class="isOptionSelected(item.studentAnswer, opt.id) && isAnswerCorrect(item.correctAnswer, opt.id)
                              ? 'bg-secondary/5 border-secondary/30 text-secondary font-semibold'
                              : isOptionSelected(item.studentAnswer, opt.id) && !isAnswerCorrect(item.correctAnswer, opt.id)
                                ? 'bg-error/5 border-error/30 text-error font-semibold'
                                : isAnswerCorrect(item.correctAnswer, opt.id)
                                  ? 'bg-secondary/5 border-secondary/20 text-secondary'
                                  : 'bg-surface-container-low/30 border-outline-variant/20 text-on-surface'"
                          >
                            <div class="flex items-center gap-2">
                              <span
                                class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                :class="isOptionSelected(item.studentAnswer, opt.id)
                                  ? (isAnswerCorrect(item.correctAnswer, opt.id) ? 'bg-secondary text-white' : 'bg-error text-white')
                                  : isAnswerCorrect(item.correctAnswer, opt.id) ? 'bg-secondary/20 text-secondary' : 'bg-surface-container-high text-on-surface-variant'"
                              >{{ opt.id }}</span>
                              <span v-html="renderInlineMath(opt.text)"></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Answer comparison (shown for ALL question types) -->
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="p-4 rounded-xl bg-error/5 border border-error/10">
                          <p class="text-xs font-bold text-error mb-1.5 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm" data-icon="person">person</span>
                            学生答案
                          </p>
                          <p class="text-sm font-medium" v-html="renderInlineMath(formatAnswer(item.studentAnswer))"></p>
                        </div>
                        <div class="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
                          <p class="text-xs font-bold text-secondary mb-1.5 flex items-center gap-1">
                            <span class="material-symbols-outlined text-sm" data-icon="check">check</span>
                            正确答案
                          </p>
                          <p class="text-sm font-medium" v-html="renderInlineMath(formatAnswer(item.correctAnswer))"></p>
                        </div>
                      </div>

                      <!-- Explanation -->
                      <div v-if="item.explanation" class="p-4 rounded-xl bg-surface-container-low/30 border border-outline-variant/10">
                        <p class="text-xs font-bold text-on-surface-variant mb-1.5 flex items-center gap-1">
                          <span class="material-symbols-outlined text-sm" data-icon="lightbulb">lightbulb</span>
                          解析
                        </p>
                        <p class="text-sm text-on-surface-variant leading-relaxed" v-html="renderInlineMath(item.explanation)"></p>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Submit grading -->
                <section class="bg-surface-container-lowest rounded-xl diffused-shadow p-6 mt-6 sticky bottom-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-6">
                      <div>
                        <p class="text-sm text-on-surface-variant">批改进度</p>
                        <div class="flex items-center gap-2 mt-1">
                          <div class="w-40 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                              class="h-full rounded-full transition-all duration-500"
                              :class="markedAllQuestions ? 'bg-secondary' : 'bg-primary'"
                              :style="{ width: markProgressPercent + '%' }"
                            ></div>
                          </div>
                          <span class="text-xs font-bold text-on-surface-variant">{{ markedCount }}/{{ questions.length }}</span>
                        </div>
                      </div>
                      <div class="hidden md:block">
                        <p class="text-sm text-on-surface-variant">批改结果</p>
                        <p class="text-sm font-bold mt-0.5">
                          <span class="text-secondary">{{ correctMarkCount }} 正确</span>
                          <span class="text-on-surface-variant mx-1">/</span>
                          <span class="text-error">{{ incorrectMarkCount }} 错误</span>
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="text-2xl font-black font-headline" :class="scoreTextClass(currentScore)">{{ currentScore }}</span>
                      <span class="text-on-surface-variant text-sm">分</span>
                      <button
                        @click="submitGrade"
                        :disabled="submitting || !selectedSubmission"
                        class="px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2"
                        :class="submitting ? 'bg-primary/50 text-white cursor-wait' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-lg'"
                      >
                        <span v-if="submitting" class="material-symbols-outlined text-sm animate-spin" data-icon="sync">sync</span>
                        <span v-else class="material-symbols-outlined text-sm" data-icon="task_alt">task_alt</span>
                        {{ submitting ? '提交中...' : (selectedSubmission.status === 'graded' ? '重新批改' : '提交批改') }}
                      </button>
                    </div>
                  </div>
                </section>
              </template>

              <!-- No student selected -->
              <div v-else class="flex flex-col items-center justify-center py-32 gap-6 bg-surface-container-lowest rounded-xl diffused-shadow">
                <span class="material-symbols-outlined text-7xl text-on-surface-variant/40" data-icon="rate_review">rate_review</span>
                <p class="text-xl text-on-surface-variant font-medium">请从左侧选择一个学生进行批改</p>
                <p class="text-sm text-on-surface-variant/60">点击学生卡片查看其作答详情并逐题批改</p>
              </div>
            </div>
          </div>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { request } from '@/services/api.js'
import { listQuestions, listSubmissions, listClasses } from '@/services/questionService.js'
import { renderMathWithHtml } from '@/utils/renderMath.js'
import { API_BASE } from '@/services/api.js'

const router = useRouter()
const route = useRoute()

const assignmentId = computed(() => route.query.assignmentId)

const loading = ref(true)
const error = ref('')
const assignment = ref({})
const className = ref('')
const questions = ref([])
const submissions = ref([])
const selectedSubmission = ref(null)
const classes = ref([])

// Grading state: { submissionId: { questionId: true/false } }
const gradingMarks = ref({})

const submitting = ref(false)

// Initialize grading marks from submission status on load
function initGradingMarks(sub) {
  if (!gradingMarks.value[sub.id]) {
    gradingMarks.value[sub.id] = {}
  }
  const marks = gradingMarks.value[sub.id]
  const answers = parseAnswers(sub.content)

  // Initialize for ALL questions (not just answered ones)
  for (const q of questions.value) {
    if (marks[q.id] === undefined) {
      const studentAnswer = answers.find(a => a.questionId === q.id)
      if (studentAnswer && studentAnswer.answer !== null && studentAnswer.answer !== undefined && studentAnswer.answer !== '') {
        const correct = isAnswerCorrectSimple(studentAnswer.answer, q.answer, q.question_type)
        marks[q.id] = correct
      } else {
        // No answer = mark as incorrect
        marks[q.id] = false
      }
    }
  }
}

function parseAnswers(content) {
  if (!content) return []
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function getQuestion(questionId) {
  return questions.value.find(q => q.id === questionId) || null
}

function getStudentAnswer(questionId) {
  if (!selectedSubmission.value) return ''
  const answers = parseAnswers(selectedSubmission.value.content)
  const found = answers.find(a => a.questionId === questionId)
  return found ? found.answer : ''
}

function isAnswerCorrectSimple(studentAnswer, correctAnswer, questionType) {
  if (studentAnswer === null || studentAnswer === undefined || studentAnswer === '') return false
  if (correctAnswer === null || correctAnswer === undefined) return false
  const sa = String(studentAnswer).trim().toUpperCase()
  const ca = String(correctAnswer).trim().toUpperCase()
  return sa === ca
}

function isOptionSelected(studentAnswer, optionId) {
  if (!studentAnswer && studentAnswer !== 0) return false
  const sa = String(studentAnswer).trim().toUpperCase()
  return sa === optionId.toUpperCase()
}

function isAnswerCorrect(correctAnswer, optionId) {
  if (!correctAnswer) return false
  const ca = String(correctAnswer).trim().toUpperCase()
  return ca === optionId.toUpperCase()
}

function getMark(questionId) {
  if (!selectedSubmission.value) return undefined
  const marks = gradingMarks.value[selectedSubmission.value.id]
  return marks ? marks[questionId] : undefined
}

function setMark(questionId, value) {
  if (!selectedSubmission.value) return
  const subId = selectedSubmission.value.id
  if (!gradingMarks.value[subId]) {
    gradingMarks.value[subId] = {}
  }
  gradingMarks.value[subId][questionId] = value
}

function formatAnswer(answer) {
  if (answer === null || answer === undefined) return '未作答'
  if (Array.isArray(answer)) return answer.join(', ')
  return String(answer)
}

function renderInlineMath(text) {
  if (!text) return ''
  return renderMathWithHtml(text)
}

function getRenderedStem(question) {
  if (!question) return ''
  const content = question.content || ''
  // renderStem logic: extract stem, convert images, render math
  const stem = getStemFromContent(content)
  const withImages = convertImagePlaceholders(stem)
  return renderMathWithHtml(withImages)
}

function getStemFromContent(content) {
  if (!content) return ''
  try {
    const parsed = JSON.parse(content)
    if (parsed.stem) return parsed.stem
    if (parsed.passage) return parsed.passage
    return ''
  } catch {
    // Fallback: trim before option markers
    const match = content.match(/(?:^|\n)\s*[A-Za-z][.、）)]\s*/)
    if (match) return content.slice(0, match.index).trim()
    return content.trim()
  }
}

function convertImagePlaceholders(text) {
  if (!text) return ''
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  return text.replace(/\[img:([^\]]+)\]/g, (_, url) => {
    const resolved = url.startsWith('http') ? url : `${base}${url.startsWith('/') ? '' : '/'}${url}`
    return `<img src="${resolved}" alt="题目图片" class="max-w-full h-auto rounded-lg my-1" />`
  })
}

function parseOptionsFromContent(question) {
  if (!question) return []
  const content = question.content || ''
  // JSON format
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed.options) && parsed.options.length >= 2) {
      return parsed.options.map((opt, i) => {
        const label = String.fromCharCode(65 + i)
        const text = typeof opt === 'object' ? (opt.text || '') : String(opt)
        return { id: label, label, text }
      })
    }
  } catch {
    // Plain text: "A. xxx\nB. xxx\nC. xxx\nD. xxx"
    const lines = content.split('\n')
    const opts = []
    for (const line of lines) {
      const m = line.trim().match(/^([A-Za-z])[.、）)]\s*(.+)/)
      if (m) opts.push({ id: m[1].toUpperCase(), label: m[1].toUpperCase(), text: m[2] })
    }
    if (opts.length >= 2) return opts
  }
  return []
}

// Computed
const studentAnswers = computed(() => {
  if (!selectedSubmission.value) return []
  const answers = parseAnswers(selectedSubmission.value.content)

  // For each question, find the corresponding student answer
  return questions.value.map(q => {
    const answer = answers.find(a => a.questionId === q.id)
    return {
      questionId: q.id,
      question: q,
      questionType: q.question_type || '未知',
      difficulty: q.difficulty || '',
      studentAnswer: answer ? answer.answer : null,
      correctAnswer: q.answer,
      explanation: q.explanation || '',
      options: parseOptionsFromContent(q),
    }
  })
})

const correctMarkCount = computed(() => {
  if (!selectedSubmission.value) return 0
  const marks = gradingMarks.value[selectedSubmission.value.id]
  if (!marks) return 0
  return Object.values(marks).filter(v => v === true).length
})

const incorrectMarkCount = computed(() => {
  if (!selectedSubmission.value) return 0
  const marks = gradingMarks.value[selectedSubmission.value.id]
  if (!marks) return 0
  return Object.values(marks).filter(v => v === false).length
})

const markedCount = computed(() => {
  if (!selectedSubmission.value) return 0
  const marks = gradingMarks.value[selectedSubmission.value.id]
  return marks ? Object.keys(marks).length : 0
})

const markedAllQuestions = computed(() => markedCount.value >= questions.value.length)

const markProgressPercent = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round((markedCount.value / questions.value.length) * 100)
})

const currentScore = computed(() => {
  const total = correctMarkCount.value + incorrectMarkCount.value
  if (total === 0) return 0
  return Math.round((correctMarkCount.value / total) * 100)
})

const pendingCount = computed(() => {
  return submissions.value.filter(s => s.status !== 'graded').length
})

const allGraded = computed(() => pendingCount.value === 0)

function scoreTextClass(score) {
  if (score >= 80) return 'text-secondary'
  if (score >= 60) return 'text-primary'
  return 'text-tertiary'
}

function resolveAvatarUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${API_BASE.replace(/\/api\/?$/, '')}${url}`
  return url
}

function studentAvatar(sub) {
  if (sub.avatar_url) return resolveAvatarUrl(sub.avatar_url)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.student_name || '?')}&background=0891b2&color=fff&bold=true`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function goBack() {
  router.push('/homeworkmanagement')
}

function selectSubmission(sub) {
  selectedSubmission.value = sub
  initGradingMarks(sub)
}

async function fetchData() {
  loading.value = true
  error.value = ''

  try {
    if (!assignmentId.value) {
      error.value = '缺少作业ID参数'
      loading.value = false
      return
    }

    // 1. Fetch assignment details
    const assignRes = await request(`/assignments/${assignmentId.value}`)
    assignment.value = assignRes

    // 2. Fetch class info
    const classRes = await listClasses()
    classes.value = classRes.items || []
    const cls = classes.value.find(c => c.id === assignRes.class_id)
    className.value = cls?.name || ''

    // 3. Fetch questions
    const qIds = assignRes.question_ids || []
    if (qIds.length > 0) {
      const qRes = await listQuestions({ ids: qIds.join(',') })
      questions.value = qRes.items || []
    }

    // 4. Fetch submissions (backend now includes student_name and avatar_url)
    const subRes = await listSubmissions({ assignmentId: assignmentId.value })
    submissions.value = subRes.items || []
  } catch (e) {
    console.error('Failed to load grading data:', e)
    error.value = e.message || '加载数据失败'
  } finally {
    loading.value = false
  }
}

async function submitGrade() {
  if (!selectedSubmission.value || submitting.value) return

  const sub = selectedSubmission.value
  const score = currentScore.value

  submitting.value = true
  try {
    await request(`/submissions/${sub.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        score,
        status: 'graded',
        graded_at: new Date().toISOString(),
      }),
    })
    // Update local state
    sub.score = score
    sub.status = 'graded'
    sub.graded_at = new Date().toISOString()

    // Show success feedback
    // Auto-select next ungraded student
    const nextSub = submissions.value.find(
      s => s.status !== 'graded' && s.id !== sub.id
    )
    if (nextSub) {
      selectSubmission(nextSub)
    }
  } catch (e) {
    console.error('Failed to submit grade:', e)
    error.value = e.message || '提交批改失败'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  vertical-align: middle;
}
.prose-custom :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
}
.prose-custom :deep(.katex) {
  font-size: 1.05em;
}
</style>
