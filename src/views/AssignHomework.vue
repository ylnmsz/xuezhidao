<template>
  <div class="flex min-h-screen">
    <TeacherTopNavbar profile-route="/teacherprofile" />
    <TeacherSidebar />

    <!-- Main Workspace -->
    <main
      class="flex-1 lg:ml-72 pt-24 md:pt-28 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <!-- Left: Question Basket -->
      <section class="md:col-span-5 flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-extrabold tracking-tight text-primary">题库篮子</h2>
          <div class="flex gap-3">
            <div class="relative inline-flex items-center">
              <select
                v-model="selectedSubject"
                class="appearance-none bg-primary-container/20 text-primary hover:bg-primary-container/30 pl-4 pr-8 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-primary/40 transition-colors outline-none"
              >
                <option value="">全部学科</option>
                <option v-for="item in subjectOptions" :key="`subject-${item}`" :value="item">
                  {{ formatSubject(item) }}
                </option>
              </select>
              <span
                class="material-symbols-outlined absolute right-2 text-primary pointer-events-none"
                style="font-size: 16px"
                data-icon="arrow_drop_down"
                >arrow_drop_down</span
              >
            </div>
            <div class="relative inline-flex items-center">
              <select
                v-model="selectedGrade"
                class="appearance-none bg-secondary-container/20 text-secondary hover:bg-secondary-container/30 pl-4 pr-8 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-secondary/40 transition-colors outline-none"
              >
                <option value="">全部年级</option>
                <option v-for="item in gradeOptions" :key="`grade-${item}`" :value="item">
                  {{ item }}
                </option>
              </select>
              <span
                class="material-symbols-outlined absolute right-2 text-secondary pointer-events-none"
                style="font-size: 16px"
                data-icon="arrow_drop_down"
                >arrow_drop_down</span
              >
            </div>
          </div>
        </div>
        <div class="relative">
          <span
            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            data-icon="search"
            >search</span
          >
          <input
            class="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
            placeholder="搜索微积分、几何..."
            type="text"
            v-model.trim="searchQuery"
          />
        </div>
        <div
          class="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 scrollbar-hide"
        >
          <div
            v-if="loadingQuestions"
            class="bg-surface-container-lowest p-5 rounded-lg text-on-surface-variant"
          >
            正在加载题目...
          </div>
          <div v-else-if="questionError" class="bg-error-container/20 p-5 rounded-lg text-error">
            {{ questionError }}
          </div>
          <div
            v-for="(q, idx) in filteredQuestionPool"
            :key="q.id"
            class="bouncy-card bg-surface-container-lowest p-5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative group border-2 border-transparent hover:border-primary-container/30 cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-outline">{{
                q.code
              }}</span>
              <div class="flex items-center gap-2">
                <span
                  v-if="q.compoundLabel"
                  class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-tertiary-container/30 text-tertiary-dim"
                >{{ q.compoundLabel }}</span>
                <span
                  v-for="n in q.hot || 0"
                  :key="`hot-${idx}-${n}`"
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
              </div>
            </div>
            <p class="text-on-surface font-medium leading-relaxed mb-4 line-clamp-3" v-html="renderMath(q.stem)"></p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-secondary"
                >{{ q.topic }} • {{ q.points }} 分</span
              >
              <button
                class="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
                @click.prevent="addToSheet(q)"
              >
                <span class="material-symbols-outlined" data-icon="add">add</span>
              </button>
            </div>
          </div>
          <div
            v-if="!loadingQuestions && !questionError && !filteredQuestionPool.length"
            class="bg-surface-container-lowest p-5 rounded-lg text-on-surface-variant"
          >
            暂无匹配题目。
          </div>
        </div>
      </section>
      <!-- Right: Existing Assignments + Today's Assignment Sheet -->
      <section class="md:col-span-7 flex flex-col gap-6">
        <!-- Existing Assignments -->
        <div class="bg-surface-container-lowest rounded-lg shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden">
          <button
            class="w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors"
            @click="showExisting = !showExisting"
          >
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary">history</span>
              <h3 class="font-headline font-bold text-lg text-on-surface">历史作业</h3>
              <span v-if="existingAssignments.length" class="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">{{ existingAssignments.length }}</span>
            </div>
            <span
              class="material-symbols-outlined text-on-surface-variant transition-transform"
              :class="showExisting ? 'rotate-180' : ''"
            >expand_more</span>
          </button>
          <div v-show="showExisting" class="border-t border-outline-variant/10">
            <div v-if="loadingExisting" class="p-6 text-sm text-on-surface-variant">加载中...</div>
            <div v-else-if="existingAssignments.length === 0" class="p-6 text-sm text-on-surface-variant">暂无已发布的作业</div>
            <div v-else class="divide-y divide-outline-variant/10">
              <div
                v-for="a in existingAssignments"
                :key="a.id"
                class="flex items-center gap-4 p-4 hover:bg-surface-container-low transition-colors group"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-bold text-on-surface truncate">{{ a.title }}</span>
                    <span
                      class="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="a.status === 'published' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'"
                    >{{ a.status === 'published' ? '已发布' : '草稿' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span>{{ a.class_name || '未指定班级' }}</span>
                    <span>·</span>
                    <span>{{ a.question_count || 0 }} 题</span>
                    <span v-if="a.due_at" class="hidden sm:inline">· 截止 {{ formatDate(a.due_at) }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    title="编辑"
                    @click="editAssignment(a)"
                  >
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    class="w-9 h-9 rounded-xl flex items-center justify-center bg-error/10 text-error hover:bg-error/20 transition-all"
                    title="删除"
                    @click="confirmDeleteAssignment(a)"
                  >
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Today's Assignment Sheet -->
        <div
          class="bg-surface-container-lowest rounded-lg shadow-[0_40px_100px_rgba(0,0,0,0.05)] min-h-[700px] flex flex-col overflow-hidden"
        >
          <!-- Sheet Header -->
          <div
            class="p-8 border-b border-surface-container-high bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div class="flex justify-between items-start">
              <div>
                <input
                  class="text-3xl font-black text-on-surface bg-transparent border-none p-0 focus:ring-0 w-full mb-1"
                  type="text"
                  v-model.trim="form.title"
                  placeholder="请输入作业标题"
                />
                <div class="text-on-surface-variant flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-sm" data-icon="calendar_today"
                    >calendar_today</span
                  >
                  <label>截止日期</label>
                  <input
                    type="datetime-local"
                    v-model="form.dueAt"
                    class="bg-transparent border border-surface-container-high rounded-lg px-3 py-1"
                  />
                </div>
                <div class="flex flex-wrap gap-3 items-center text-on-surface-variant">
                  <label>班级</label>
                  <select
                    v-model="form.classId"
                    class="bg-transparent border border-surface-container-high rounded-lg px-3 py-1 min-w-[140px]"
                  >
                    <option value="">未选择</option>
                    <option v-for="c in classes" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </option>
                  </select>
                  <span v-if="loadingClasses" class="text-xs">加载班级中...</span>
                </div>
                <textarea
                  v-model.trim="form.description"
                  class="mt-3 w-full bg-transparent border border-surface-container-high rounded-lg px-3 py-2 text-sm"
                  rows="2"
                  placeholder="作业说明（可选）"
                ></textarea>
              </div>
              <div
                class="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl text-center"
              >
                <span class="block text-2xl font-bold">{{ totalPoints }}</span>
                <span class="text-[10px] font-bold uppercase tracking-tighter">分数</span>
              </div>
            </div>
          </div>
          <!-- Assignment Content -->
          <div class="p-8 flex-1 flex flex-col gap-6">
            <template v-if="sheet.length">
              <div v-for="(s, i) in sheet" :key="s.id" class="flex gap-4 group">
                <div class="flex flex-col items-center">
                  <div
                    class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm"
                  >
                    {{ i + 1 }}
                  </div>
                  <div class="w-1 flex-1 bg-surface-container-high my-2 rounded-full"></div>
                </div>
                <div
                  class="flex-1 bg-surface-container-low/50 rounded-xl p-4 flex justify-between items-center group-hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <h4 class="font-bold text-primary mb-1">{{ s.code }} {{ s.topic }}</h4>
                    <p class="text-sm text-on-surface-variant" v-html="renderMath(s.stem)"></p>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="font-bold text-sm">{{ s.points }} 分</span>
                    <button
                      class="text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      @click.prevent="removeFromSheet(i)"
                    >
                      <span class="material-symbols-outlined" data-icon="delete">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                class="drag-placeholder rounded-xl h-32 flex flex-col items-center justify-center text-outline-variant bg-surface-container-low/30 border-spacing-4 hover:bg-surface-container-low/50 transition-all cursor-pointer"
              >
                <span class="material-symbols-outlined text-4xl mb-2" data-icon="upload_file"
                  >upload_file</span
                >
                <p class="font-bold">拖拽题目到此处或点击添加</p>
              </div>
            </template>

            <div v-if="submitError" class="bg-error-container/20 text-error px-4 py-3 rounded-lg">
              {{ submitError }}
            </div>
            <div
              v-if="submitSuccess"
              class="bg-primary-container/30 text-on-primary-container px-4 py-3 rounded-lg"
            >
              {{ submitSuccess }}
            </div>
          </div>
          <!-- Empty State Decoration -->
          <div class="px-8 pb-8 opacity-20 pointer-events-none">
            <div class="h-2 w-1/2 bg-surface-container-highest rounded-full mb-4"></div>
            <div class="h-2 w-3/4 bg-surface-container-highest rounded-full mb-4"></div>
          </div>
        </div>
      </section>
    </main>
    <!-- Floating Graphics Decoration -->
    <div class="fixed top-1/4 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    <div
      class="fixed bottom-1/4 -right-12 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -z-10"
    ></div>
    <!-- Publish Bar (Fixed Glassmorphism Footer) -->
    <footer
      class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl glass-panel rounded-full p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-surface-container-lowest/50 z-[60]"
    >
      <div class="flex items-center gap-8 pl-6">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined" data-icon="task_alt">task_alt</span>
          </div>
          <div>
            <span class="block text-lg font-black leading-tight">已选 {{ totalSelected }} 题</span>
            <span class="text-sm text-on-surface-variant font-medium">总分 {{ totalPoints }}</span>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-2 text-outline">
          <span class="material-symbols-outlined" data-icon="timer">timer</span>
          <span class="text-sm font-semibold">预计用时: 45 分钟</span>
        </div>
      </div>
      <div class="flex items-center gap-3 pr-2">
        <button
          class="px-6 py-4 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
          @click="saveDraft"
          :disabled="savingDraft"
        >
          {{ savingDraft ? '保存中...' : '保存草稿' }}
        </button>
        <button
          class="bg-primary text-on-primary px-8 py-4 rounded-full font-black text-lg flex items-center gap-3 shadow-[0_10px_20px_rgba(0,100,121,0.3)] hover:scale-105 active:scale-95 transition-all"
          @click="publishAssignment"
          :disabled="publishing"
        >
          {{ publishing ? '发布中...' : `发布作业（${totalSelected}题）` }}
        </button>
      </div>
    </footer>
    <!-- Delete Confirmation Dialog -->
    <div
      v-if="deleteTarget"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="deleteTarget = null"
    >
      <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center mb-6">
          <span class="material-symbols-outlined text-5xl text-error mb-3" style="font-variation-settings: 'FILL' 1">delete_forever</span>
          <h3 class="text-xl font-bold text-on-surface">确认删除？</h3>
          <p class="text-sm text-on-surface-variant mt-2">
            作业「{{ deleteTarget.title }}」将被永久删除，无法恢复
          </p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 py-3 bg-surface-container-low rounded-xl font-bold text-on-surface hover:bg-surface-container-higher transition-all"
            type="button"
            @click="deleteTarget = null"
          >
            取消
          </button>
          <button
            class="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all flex items-center justify-center gap-2"
            type="button"
            :disabled="deleting"
            @click="handleDelete"
          >
            <span v-if="deleting" class="material-symbols-outlined animate-spin text-lg">refresh</span>
            <span>{{ deleting ? '删除中...' : '确认删除' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Side Decoration Items (Purely UI) -->
    <div class="fixed bottom-32 left-8 hidden xl:flex flex-col gap-4 animate-bounce">
      <div
        class="w-14 h-14 bg-secondary-container/40 rounded-lg flex items-center justify-center shadow-inner"
      >
        <span class="material-symbols-outlined text-secondary" data-icon="psychology"
          >psychology</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { listQuestions, listClasses } from '@/services/questionService.js'
import { createAssignment, updateAssignment, listAssignments, deleteAssignment, getAssignment } from '@/services/assignmentService.js'
import { renderMathWithHtml } from '@/utils/renderMath.js'

const renderMath = (value) => renderMathWithHtml(value || '')

const questionPool = ref([])
const classes = ref([])
const loadingQuestions = ref(false)
const loadingClasses = ref(false)
const questionError = ref('')
const submitError = ref('')
const submitSuccess = ref('')
const savingDraft = ref(false)
const publishing = ref(false)
const currentAssignmentId = ref('')
const searchQuery = ref('')
const selectedSubject = ref('')
const selectedGrade = ref('')
const showExisting = ref(false)
const existingAssignments = ref([])
const loadingExisting = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

const form = ref({
  title: '',
  description: '',
  dueAt: '',
  classId: '',
})

const sheet = ref([])

const hotByDifficulty = (difficulty) => {
  const n = parseInt(difficulty)
  if (n >= 1 && n <= 5) return n
  return 1
}

const parseQuestionContent = (content) => {
  if (!content) return { stem: '（无题干）', subCount: 0, compoundLabel: '' }

  // Try to parse as JSON (questions parsed from docx store complex structure)
  try {
    const parsed = JSON.parse(content)

    // Simple question with stem
    if (parsed.stem) {
      return { stem: parsed.stem, subCount: 0, compoundLabel: '' }
    }

    const type = parsed.type || ''
    const subs = Array.isArray(parsed.subQuestions) ? parsed.subQuestions : []

    // Reading comprehension with passage
    if (parsed.passage) {
      const preview = parsed.passage.length > 120
        ? parsed.passage.slice(0, 120) + '...'
        : parsed.passage
      return {
        stem: preview,
        subCount: subs.length,
        compoundLabel: subs.length > 0 ? `阅读·${subs.length}小题` : '阅读理解',
      }
    }

    // Cloze or other compound with subQuestions
    if (subs.length > 0) {
      const stemText = parsed.stemWithImages || parsed.stem || ''
      const preview = stemText.length > 100
        ? stemText.slice(0, 100) + '...'
        : stemText
      return {
        stem: preview || `[含 ${subs.length} 道子题]`,
        subCount: subs.length,
        compoundLabel: `${type || '复合'}·${subs.length}小题`,
      }
    }

    // Parsed JSON with unexpected structure — show raw preview
    return { stem: JSON.stringify(parsed).slice(0, 200), subCount: 0, compoundLabel: '' }
  } catch (e) {
    // Plain text — display directly
    return { stem: content, subCount: 0, compoundLabel: '' }
  }
}

const ALL_SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治']

const ALL_GRADES = [
  '一年级', '二年级', '三年级', '四年级', '五年级', '六年级',
  '初一', '初二', '初三', '高一', '高二', '高三',
]

const formatSubject = (s) => {
  if (!s) return '未分类'
  return s
}

const toQuestionCard = (item, index) => {
  const parsed = parseQuestionContent(item.content)
  return {
    id: item.id,
    code: `Q-${String(item.id || index)
      .slice(0, 8)
      .toUpperCase()}`,
    stem: parsed.stem,
    topic: formatSubject(item.question_type || item.subject || '未分类'),
    points: Number(item.points) || 10,
    hot: hotByDifficulty(item.difficulty),
    subject: item.subject || '',
    grade: item.grade || '',
    subCount: parsed.subCount,
    compoundLabel: parsed.compoundLabel,
  }
}

const subjectOptions = computed(() => {
  // Show ALL subjects so teachers can see available filter options
  return ALL_SUBJECTS
})

const gradeOptions = computed(() => {
  // Show ALL grades in correct order
  return ALL_GRADES
})

const filteredQuestionPool = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return questionPool.value.filter((q) => {
    const matchQuery =
      !query ||
      q.stem.toLowerCase().includes(query) ||
      q.code.toLowerCase().includes(query) ||
      q.topic.toLowerCase().includes(query)
    const matchSubject = !selectedSubject.value || q.subject === selectedSubject.value
    const matchGrade = !selectedGrade.value || q.grade === selectedGrade.value
    return matchQuery && matchSubject && matchGrade
  })
})

const fetchQuestions = async () => {
  loadingQuestions.value = true
  questionError.value = ''
  try {
    const data = await listQuestions()
    const items = Array.isArray(data?.items) ? data.items : []
    questionPool.value = items.map(toQuestionCard)
  } catch (error) {
    questionError.value = error.message || '题目加载失败'
  } finally {
    loadingQuestions.value = false
  }
}

const fetchClasses = async () => {
  loadingClasses.value = true
  try {
    const data = await listClasses()
    classes.value = Array.isArray(data?.items) ? data.items : []
  } catch {
    classes.value = []
  } finally {
    loadingClasses.value = false
  }
}

const addToSheet = (q) => {
  if (sheet.value.find((s) => s.id === q.id)) return
  sheet.value.push({ ...q })
}

const removeFromSheet = (index) => {
  sheet.value.splice(index, 1)
}

const totalSelected = computed(() => sheet.value.length)
const totalPoints = computed(() => sheet.value.reduce((s, q) => s + (Number(q.points) || 0), 0))

const buildPayload = (status) => ({
  title: form.value.title.trim(),
  description: form.value.description.trim() || null,
  due_at: form.value.dueAt || null,
  class_id: form.value.classId || null,
  status,
  question_ids: sheet.value.map((q) => q.id),
})

const submitAssignment = async (status) => {
  submitError.value = ''
  submitSuccess.value = ''

  if (!form.value.title.trim()) {
    submitError.value = '请先填写作业标题。'
    return
  }
  if (status === 'published' && sheet.value.length === 0) {
    submitError.value = '发布前请至少添加 1 道题目。'
    return
  }

  try {
    const payload = buildPayload(status)
    const result = currentAssignmentId.value
      ? await updateAssignment(currentAssignmentId.value, payload)
      : await createAssignment(payload)

    if (result?.id) {
      currentAssignmentId.value = result.id
    }
    submitSuccess.value = status === 'published' ? '作业已发布。' : '草稿已保存。'
  } catch (error) {
    submitError.value = error.message || '保存失败，请稍后重试。'
  }
}

const saveDraft = async () => {
  savingDraft.value = true
  try {
    await submitAssignment('draft')
  } finally {
    savingDraft.value = false
  }
}

const publishAssignment = async () => {
  publishing.value = true
  try {
    await submitAssignment('published')
  } finally {
    publishing.value = false
  }
}

const loadExistingAssignments = async () => {
  loadingExisting.value = true
  try {
    const data = await listAssignments()
    existingAssignments.value = Array.isArray(data?.items) ? data.items : []
  } catch {
    existingAssignments.value = []
  } finally {
    loadingExisting.value = false
  }
}

const editAssignment = async (a) => {
  try {
    const full = await getAssignment(a.id)
    currentAssignmentId.value = full.id
    form.value.title = full.title || ''
    form.value.description = full.description || ''
    form.value.dueAt = full.due_at ? full.due_at.slice(0, 16) : ''
    form.value.classId = full.class_id || ''

    // Load questions into sheet
    const qIds = Array.isArray(full.question_ids) ? full.question_ids : []
    if (qIds.length > 0) {
      const resp = await listQuestions({ ids: qIds.join(',') })
      const items = Array.isArray(resp?.items) ? resp.items : []
      sheet.value = items.map(toQuestionCard)
    } else {
      sheet.value = []
    }
    showExisting.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    submitError.value = err.message || '加载作业失败'
  }
}

const confirmDeleteAssignment = (a) => {
  deleteTarget.value = a
}

const handleDelete = async () => {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await deleteAssignment(deleteTarget.value.id)
    existingAssignments.value = existingAssignments.value.filter(
      (a) => a.id !== deleteTarget.value.id,
    )
    deleteTarget.value = null
  } catch (err) {
    submitError.value = err.message || '删除失败'
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

onMounted(async () => {
  await Promise.all([fetchQuestions(), fetchClasses(), loadExistingAssignments()])
})
</script>

<style scoped></style>
