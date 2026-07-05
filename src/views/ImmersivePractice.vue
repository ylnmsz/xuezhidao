<template>
  <div class="bg-surface text-on-surface min-h-screen selection:bg-primary-container">
    <StudentTopNavbar />
    <StudentSidebar />

    <main class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 pt-24 lg:ml-72">
      <div class="flex flex-col gap-12">
        <!-- Header + Stats -->
        <section
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1
              class="text-4xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight"
            >
              练习中心
            </h1>
            <p class="text-on-surface-variant mt-2 text-lg">选择题型/难度/题量，生成你的专属练习</p>
          </div>
          <div class="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-primary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >timer</span
              >
              <span class="text-xs text-on-surface-variant font-medium">练习时长</span>
              <span class="font-bold text-on-surface">{{ totalTimeDisplay }}</span>
            </div>
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-tertiary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >bolt</span
              >
              <span class="text-xs text-on-surface-variant font-medium">连续打卡</span>
              <span class="font-bold text-on-surface">{{ streakDays }}d</span>
            </div>
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-secondary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >auto_stories</span
              >
              <span class="text-xs text-on-surface-variant font-medium">完成题数</span>
              <span class="font-bold text-on-surface">{{ totalQuestionsDone }}</span>
            </div>
          </div>
        </section>

        <!-- Filter Section -->
        <section class="bg-surface-container-low p-8 rounded-lg space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">quiz</span>
                <h3 class="font-headline font-bold">题型选择</h3>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="t in questionTypes"
                  :key="t.value"
                  class="px-5 py-3 rounded-xl font-medium active:scale-95 transition-all"
                  :class="selectedType === t.value
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-primary/50'"
                  type="button"
                  @click="selectedType = selectedType === t.value ? '' : t.value"
                >
                  {{ t.label }}
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">military_tech</span>
                <h3 class="font-headline font-bold">难度选择</h3>
              </div>
              <div
                class="flex items-center gap-1 bg-surface-container-low border border-outline-variant/20 rounded-xl px-5 py-3 w-fit"
                role="radiogroup"
                aria-label="选择难度"
                @mouseleave="hoveredDifficulty = 0"
              >
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  class="transition-all hover:scale-110 active:scale-90"
                  :class="star <= (hoveredDifficulty || Number(selectedDifficulty))
                    ? 'text-primary'
                    : 'text-on-surface-variant/30'"
                  :aria-checked="Number(selectedDifficulty) === star"
                  role="radio"
                  @mouseenter="hoveredDifficulty = star"
                  @click="selectedDifficulty = Number(selectedDifficulty) === star ? '' : String(star)"
                >
                  <span
                    class="material-symbols-outlined text-2xl star-icon"
                    :class="star <= (hoveredDifficulty || Number(selectedDifficulty))
                      ? 'star-filled'
                      : ''"
                  >star</span>
                </button>
                <span v-if="selectedDifficulty" class="ml-3 text-sm text-on-surface-variant font-medium">
                  {{ ['', '简单', '较简单', '中等', '较难', '困难'][Number(selectedDifficulty)] }}
                </span>
                <span v-else class="ml-3 text-sm text-on-surface-variant/50 font-medium">不限</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined text-xl">filter_list</span>
              <h3 class="font-headline font-bold">学科选择</h3>
            </div>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="s in subjects"
                :key="s.value"
                class="px-6 py-2.5 rounded-full font-bold cursor-pointer hover:scale-105 transition-transform flex items-center gap-2"
                :class="selectedSubject === s.value
                  ? 'bg-secondary-container text-on-secondary-container border-2 border-secondary/20'
                  : 'bg-surface-container-lowest text-on-surface border-2 border-transparent hover:border-primary/30'"
                @click="selectedSubject = selectedSubject === s.value ? '' : s.value"
              >
                {{ s.label }}
                <span v-if="selectedSubject === s.value" class="material-symbols-outlined text-sm">check</span>
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-on-surface-variant">
                  <span class="material-symbols-outlined text-xl">tune</span>
                  <h3 class="font-headline font-bold">题量选择</h3>
                </div>
                <span class="font-bold text-primary">{{ questionCount }} 题</span>
              </div>
              <input
                class="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                type="range"
                min="5"
                max="50"
                step="5"
                v-model.number="questionCount"
              />
              <div class="flex justify-between text-xs font-bold text-outline">
                <span>5</span>
                <span>15</span>
                <span>25</span>
                <span>35</span>
                <span>50</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">alarm</span>
                <h3 class="font-headline font-bold">时间模式</h3>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-bold" :class="timedMode ? 'text-on-surface-variant' : 'text-on-surface'">不限时</span>
                <button
                  class="relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none"
                  :class="timedMode ? 'bg-primary' : 'bg-surface-container-highest'"
                  type="button"
                  @click="timedMode = !timedMode"
                >
                  <span
                    class="inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm"
                    :class="timedMode ? 'translate-x-7' : 'translate-x-1'"
                  ></span>
                </button>
                <span class="font-bold" :class="timedMode ? 'text-primary' : 'text-on-surface-variant'">限时 (30min)</span>
              </div>
            </div>
          </div>

          <div
            class="pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-sm font-bold text-on-surface-variant">已选条件:</span>
              <span
                v-for="tag in activeFilterTags"
                :key="tag"
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-lg font-bold"
              >
                {{ tag }}
              </span>
              <span v-if="activeFilterTags.length === 0" class="text-xs text-on-surface-variant/50">暂无</span>
            </div>
            <button
              class="flex items-center gap-2 text-error text-sm font-bold hover:bg-error/5 px-4 py-2 rounded-full transition-all"
              type="button"
              @click="clearFilters"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
              一键清空
            </button>
          </div>
        </section>

        <!-- 为你推荐 -->
        <section class="space-y-6">
          <div class="flex justify-between items-end">
            <h2 class="text-2xl font-black text-on-surface">为你推荐</h2>
            <button class="text-primary font-bold text-sm hover:underline" type="button" @click="loadRecommended">
              换一批
            </button>
          </div>
          <div v-if="loadingRecommended" class="text-center py-10 text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl animate-spin inline-block">refresh</span>
            <p class="mt-2">加载推荐题目...</p>
          </div>
          <div v-else-if="recommended.length === 0" class="text-center py-10 text-on-surface-variant">
            <p>暂无推荐题目，先去题库看看吧</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(rec, idx) in recommended"
              :key="idx"
              class="group bg-surface-container-lowest p-6 rounded-lg candy-shadow border border-transparent hover:border-primary/20 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden"
              @click="startPractice(rec)"
            >
              <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
              >
                <span
                  class="material-symbols-outlined text-7xl"
                  style="font-variation-settings: 'FILL' 1"
                >
                  {{ rec.icon }}
                </span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold" :class="rec.badgeClass">
                  {{ rec.subjectLabel }}
                </span>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-colors"
                >
                  star
                </span>
              </div>
              <h4 class="font-headline font-bold text-lg mb-2">{{ rec.title }}</h4>
              <div class="flex gap-4 mb-6 text-xs text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  难度: {{ rec.difficultyLabel }}
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">quiz</span>
                  {{ rec.questionCount }} 题
                </div>
              </div>
              <button
                class="w-full py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
                :class="rec.buttonClass"
                type="button"
              >
                一键开始
              </button>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <section class="flex flex-col items-center gap-8 py-10">
          <div class="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
            <button
              class="flex-1 py-5 bg-primary text-white rounded-xl text-xl font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              type="button"
              @click="startCustomPractice"
            >
              <span class="material-symbols-outlined text-3xl">play_circle</span>
              开始练习
            </button>
            <button
              class="px-8 py-5 bg-white text-on-surface-variant rounded-xl font-bold border-2 border-outline-variant/10 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
              type="button"
              @click="saveAsTemplate"
            >
              <span class="material-symbols-outlined">save</span>
              保存为模板
            </button>
          </div>
          <div class="flex gap-8 text-on-surface-variant font-bold text-sm">
            <button
              class="flex items-center gap-2 hover:text-primary transition-colors"
              type="button"
              @click="scrollToHistory"
            >
              <span class="material-symbols-outlined text-lg">history</span>
              历史练习
            </button>
            <button
              class="flex items-center gap-2 hover:text-error transition-colors"
              type="button"
              @click="$router.push('/studenterrorbook')"
            >
              <span class="material-symbols-outlined text-lg">error_outline</span>
              错题专项
            </button>
          </div>
        </section>

        <!-- Recent Practice Records -->
        <section ref="historySection" class="bg-surface-container-lowest/50 p-8 rounded-lg">
          <h3 class="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined">analytics</span>
            最近练习记录
          </h3>
          <div v-if="loadingHistory" class="text-center py-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-3xl animate-spin inline-block">refresh</span>
            <p class="mt-2 text-sm">加载记录...</p>
          </div>
          <div v-else-if="recentHistory.length === 0" class="text-center py-8 text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl">history</span>
            <p class="mt-2 text-sm">暂无练习记录</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="h in recentHistory"
              :key="h.id"
              class="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-surface-container-low transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="subjectColor(h.class_name)"
                >
                  <span class="material-symbols-outlined text-xl">{{ subjectIcon(h.class_name) }}</span>
                </div>
                <div>
                  <p class="font-bold text-on-surface">{{ h.assignment_title }}</p>
                  <p class="text-xs text-on-surface-variant">{{ formatTime(h.submitted_at) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="hidden sm:block text-right">
                  <p class="text-xs text-on-surface-variant">准确率</p>
                  <p class="font-black" :class="scoreClass(h.score)">{{ h.score != null ? h.score + '%' : '待批改' }}</p>
                </div>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-all"
                >
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <div
      class="fixed top-20 right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"
    ></div>
    <div
      class="fixed bottom-20 left-[-10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { getStoredUser } from '@/services/userService.js'
import { getMyStats, listQuestions, getMyRecentPractice } from '@/services/questionService.js'

const router = useRouter()

// ---- User ----
const user = getStoredUser()

// ---- Save Template ----
function saveAsTemplate() {
  const filters = {
    type: selectedType.value,
    difficulty: selectedDifficulty.value,
    subject: selectedSubject.value,
    count: questionCount.value,
    timed: timedMode.value,
  }
  try {
    localStorage.setItem('practice_template', JSON.stringify(filters))
    alert('当前筛选条件已保存为模板！下次进入练习中心可快速加载。')
  } catch {
    alert('保存失败，请稍后重试')
  }
}

// ---- Stats ----
const streakDays = ref(0)
const totalQuestionsDone = ref(0)
const totalTimeDisplay = ref('—')

onMounted(async () => {
  await loadStats()
  await loadRecommended()
  await loadHistory()
})

async function loadStats() {
  try {
    const stats = await getMyStats()
    if (stats) {
      streakDays.value = stats.streak_days || 0
      totalQuestionsDone.value = stats.total_questions_done || 0
      // 累计练习时长（秒 → 可读格式）
      const totalSec = stats.total_practice_time_seconds || 0
      if (totalSec < 60) {
        totalTimeDisplay.value = totalSec + 's'
      } else if (totalSec < 3600) {
        totalTimeDisplay.value = Math.floor(totalSec / 60) + 'm'
      } else {
        const h = Math.floor(totalSec / 3600)
        const m = Math.floor((totalSec % 3600) / 60)
        totalTimeDisplay.value = h + 'h' + (m > 0 ? ' ' + m + 'm' : '')
      }
    }
  } catch (e) {
    console.error('Failed to load stats:', e)
  }
}

// ---- Filters ----
const questionTypes = [
  { value: '单选题', label: '单选题' },
  { value: '多选题', label: '多选题' },
  { value: '判断题', label: '判断题' },
  { value: '填空题', label: '填空题' },
  { value: '问答题', label: '问答题' },
  { value: '简答题', label: '简答题' },
  { value: '阅读理解', label: '阅读理解' },
  { value: '连线题', label: '连线题' },
  { value: '翻译题', label: '翻译题' },
  { value: '改错题', label: '改错题' },
  { value: '编程题', label: '编程题' },
]
const subjects = [
  { value: '数学', label: '数学' },
  { value: '语文', label: '语文' },
  { value: '英语', label: '英语' },
  { value: '物理', label: '物理' },
  { value: '化学', label: '化学' },
  { value: '生物', label: '生物' },
  { value: '历史', label: '历史' },
  { value: '政治', label: '政治' },
  { value: '地理', label: '地理' },
]

const selectedType = ref('')
const selectedDifficulty = ref('')
const selectedSubject = ref('')
const questionCount = ref(20)
const timedMode = ref(false)
const hoveredDifficulty = ref(0)

const activeFilterTags = computed(() => {
  const tags = []
  if (selectedType.value) {
    const t = questionTypes.find((t) => t.value === selectedType.value)
    if (t) tags.push(t.label)
  }
  if (selectedDifficulty.value) {
    const n = Number(selectedDifficulty.value)
    tags.push('⭐'.repeat(n))
  }
  if (selectedSubject.value) tags.push(selectedSubject.value)
  if (questionCount.value) tags.push(questionCount.value + '题')
  if (timedMode.value) tags.push('限时30min')
  return tags
})

function clearFilters() {
  selectedType.value = ''
  selectedDifficulty.value = ''
  selectedSubject.value = ''
  questionCount.value = 20
  timedMode.value = false
}

// ---- 为你推荐 ----
const loadingRecommended = ref(false)
const recommended = ref([])

const subjectIcons = {
  数学: 'calculate', 语文: 'history_edu', 英语: 'language',
  物理: 'science', 化学: 'science', 生物: 'biotech',
  历史: 'history', 政治: 'gavel', 地理: 'public',
}
const subjectColors = {
  数学: ['bg-primary/10', 'text-primary'],
  语文: ['bg-secondary/10', 'text-secondary'],
  英语: ['bg-tertiary/10', 'text-tertiary'],
  物理: ['bg-secondary-fixed-dim/20', 'text-secondary-fixed-dim'],
  化学: ['bg-tertiary-fixed-dim/20', 'text-tertiary-fixed-dim'],
  生物: ['bg-primary-dim/20', 'text-primary-dim'],
  历史: ['bg-error/10', 'text-error'],
  政治: ['bg-secondary-fixed/20', 'text-secondary-fixed'],
  地理: ['bg-tertiary-fixed/20', 'text-tertiary-fixed'],
}

async function loadRecommended() {
  loadingRecommended.value = true
  try {
    // Fetch some questions to build recommendations
    const resp = await listQuestions({ limit: 50 })
    const questions = resp.items || []

    if (questions.length === 0) {
      recommended.value = []
      return
    }

    // Group by subject
    const bySubject = {}
    for (const q of questions) {
      const sub = q.subject || '未分类'
      if (!bySubject[sub]) bySubject[sub] = []
      bySubject[sub].push(q)
    }

    const subjectKeys = Object.keys(bySubject)
    // Pick up to 3 subjects with the most questions
    subjectKeys.sort((a, b) => bySubject[b].length - bySubject[a].length)
    const topSubjects = subjectKeys.slice(0, 3)

    recommended.value = topSubjects.map((sub) => {
      const qs = bySubject[sub]
      const diffs = [...new Set(qs.map((q) => q.difficulty).filter(Boolean))]
      const primaryDiff = diffs.reduce((a, b) =>
        bySubject[sub].filter(q => q.difficulty === a).length >= bySubject[sub].filter(q => q.difficulty === b).length ? a : b
      , diffs[0]) || '3'
      const starCount = parseInt(primaryDiff) || 3
      const diffLabel = '⭐'.repeat(Math.max(1, Math.min(5, starCount)))
      const icon = subjectIcons[sub] || 'school'
      const c = subjectColors[sub] || ['bg-primary/10', 'text-primary']

      return {
        subjectLabel: sub + '专项',
        title: `${sub} · ${diffLabel} · ${qs.length}题`,
        icon,
        badgeClass: c[0] + ' ' + c[1],
        buttonClass: subjectButtonClass(sub),
        difficultyLabel: diffLabel,
        questionCount: qs.length,
        subject: sub,
        difficulty: primaryDiff,
      }
    })
  } catch (e) {
    console.error('Failed to load recommendations:', e)
    recommended.value = []
  } finally {
    loadingRecommended.value = false
  }
}

function startPractice(rec) {
  selectedSubject.value = rec.subject
  selectedDifficulty.value = rec.difficulty || ''
  selectedType.value = ''
  startCustomPractice()
}

function startCustomPractice() {
  const params = new URLSearchParams()
  if (selectedType.value) params.set('question_type', selectedType.value)
  if (selectedDifficulty.value) params.set('difficulty', selectedDifficulty.value)
  if (selectedSubject.value) params.set('subject', selectedSubject.value)
  params.set('limit', String(questionCount.value))
  if (timedMode.value) params.set('timed', 'true')
  router.push('/practice-session?' + params.toString())
}

// ---- Recent History ----
const historySection = ref(null)
const loadingHistory = ref(false)
const recentHistory = ref([])

async function loadHistory() {
  loadingHistory.value = true
  try {
    const resp = await getMyRecentPractice({ limit: 5 })
    recentHistory.value = resp.items || []
  } catch (e) {
    console.error('Failed to load history:', e)
    recentHistory.value = []
  } finally {
    loadingHistory.value = false
  }
}

function scrollToHistory() {
  if (historySection.value) {
    historySection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function scoreClass(score) {
  if (score == null) return 'text-on-surface-variant'
  if (score >= 80) return 'text-secondary'
  if (score >= 60) return 'text-primary-dim'
  return 'text-error'
}

function subjectButtonClass(sub) {
  const color = subjectColorMap(sub)
  return `bg-${color}-container text-on-${color}-container`
}

function subjectColorMap(sub) {
  const map = {
    数学: 'primary', 语文: 'secondary', 英语: 'tertiary',
    物理: 'secondary-fixed-dim', 化学: 'tertiary-fixed-dim',
    生物: 'primary-dim', 历史: 'error', 政治: 'secondary-fixed', 地理: 'tertiary-fixed',
  }
  return map[sub] || 'primary'
}

function subjectColor(name) {
  const map = {
    数学: 'bg-primary/5 text-primary',
    语文: 'bg-secondary/5 text-secondary',
    英语: 'bg-tertiary/5 text-tertiary',
    物理: 'bg-secondary-fixed-dim/10 text-secondary-fixed-dim',
    化学: 'bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim',
    生物: 'bg-primary-dim/10 text-primary-dim',
    历史: 'bg-error/5 text-error',
    政治: 'bg-secondary-fixed/10 text-secondary-fixed',
    地理: 'bg-tertiary-fixed/10 text-tertiary-fixed',
  }
  return map[name] || 'bg-surface-container-high text-on-surface-variant'
}

function subjectIcon(name) {
  return subjectIcons[name] || 'school'
}
</script>

<style scoped>
.star-icon.star-filled {
  font-variation-settings: 'FILL' 1;
}
</style>
