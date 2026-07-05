<template>
  <StudentTopNavbar />
  <StudentSidebar />

  <main class="pt-24 pb-12 px-6 md:px-8 lg:ml-72 min-h-screen selection:bg-primary-container">
    <div class="max-w-6xl mx-auto">
      <!-- ===== Header + Stats ===== -->
      <header class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-extrabold font-headline text-on-surface mb-2">我的错题本</h1>
          <p class="text-on-surface-variant font-medium">温故而知新，每一次纠错都是一次成长！</p>
        </div>
        <div
          v-if="stats"
          class="bg-surface-container-lowest p-5 rounded-xl candy-shadow flex items-center gap-6 border border-outline-variant/15"
        >
          <div>
            <div class="flex justify-between text-sm font-bold mb-2">
              <span class="text-on-surface-variant">错题总数</span>
              <span class="text-primary">{{ stats.total }} 题</span>
            </div>
            <div class="w-44 h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div
                v-if="stats.subjectDistribution.length"
                class="h-full rounded-full flex"
              >
                <div
                  v-for="(sub, i) in stats.subjectDistribution.slice(0, 4)"
                  :key="sub.subject"
                  class="h-full transition-all"
                  :style="{
                    width: (sub.count / stats.total) * 100 + '%',
                    backgroundColor: subjectColor(sub.subject),
                  }"
                  :title="sub.subject + ': ' + sub.count + '题'"
                ></div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="sub in stats.subjectDistribution.slice(0, 4)"
                :key="sub.subject"
                class="text-[10px] font-bold flex items-center gap-1"
              >
                <span
                  class="w-2 h-2 rounded-full inline-block"
                  :style="{ backgroundColor: subjectColor(sub.subject) }"
                ></span>
                {{ sub.subject }} {{ sub.count }}
              </span>
            </div>
          </div>
        </div>
      </header>

      <!-- ===== Filters ===== -->
      <section class="flex flex-col sm:flex-row gap-4 mb-6">
        <div class="flex flex-wrap gap-2 flex-1">
          <button
            class="px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            :class="selectedSubject === ''
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/15 hover:bg-surface-container'"
            @click="selectedSubject = ''; page = 1; fetchList()"
          >
            全部
          </button>
          <button
            v-for="sub in subjectList"
            :key="sub"
            class="px-5 py-2 rounded-full text-sm font-bold transition-all active:scale-95"
            :class="selectedSubject === sub
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/15 hover:bg-surface-container'"
            @click="selectedSubject = sub; page = 1; fetchList()"
          >
            {{ sub }}
          </button>
        </div>
        <div class="relative w-full sm:w-56">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索错题..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/15 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm font-body text-on-surface placeholder-on-surface-variant transition-all"
            @input="debounceSearch"
          />
        </div>
      </section>

      <!-- ===== Loading State ===== -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <span class="material-symbols-outlined text-5xl animate-spin mb-4">refresh</span>
        <p class="font-bold">加载错题本...</p>
      </div>

      <!-- ===== Empty State ===== -->
      <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <span class="material-symbols-outlined text-7xl mb-4" style="font-variation-settings: 'FILL' 1">check_circle</span>
        <h3 class="text-xl font-bold text-on-surface mb-2">暂无错题</h3>
        <p class="text-sm">做练习后答错的题目会自动收录到这里</p>
      </div>

      <!-- ===== Error Cards ===== -->
      <section v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          v-for="item in items"
          :key="item.id"
          class="bg-surface-container-lowest rounded-xl p-6 candy-shadow border border-outline-variant/5 relative overflow-hidden transition-all hover:shadow-md group"
        >
          <!-- 右上角装饰 -->
          <div class="absolute top-0 right-0 w-20 h-20 rounded-bl-full -mr-3 -mt-3 transition-transform group-hover:scale-110"
            :style="{ backgroundColor: subjectColorBg(item.subject) }"
          ></div>

          <!-- 标签行 -->
          <div class="flex items-center gap-2 mb-4 relative z-10">
            <span
              class="px-3 py-1 rounded-full text-xs font-bold"
              :style="{ backgroundColor: subjectColorBg(item.subject), color: subjectColor(item.subject) }"
            >
              {{ item.subject || '未分类' }}
            </span>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold"
              :class="typeClass(item.question_type)"
            >
              {{ typeLabel(item.question_type) }}
            </span>
            <span class="ml-auto text-xs text-on-surface-variant">{{ formatDate(item.created_at) }}</span>
          </div>

          <!-- 题目内容 -->
          <h3 class="text-base font-bold text-on-surface leading-snug mb-2 line-clamp-3 relative z-10" v-html="renderStem(item.content)"></h3>
          <div v-if="item.stem_image_url" class="mb-3 relative z-10">
            <img :src="resolveImageUrl(item.stem_image_url)" alt="题目图片" class="max-w-full h-auto max-h-48 rounded-lg object-contain" />
          </div>

          <!-- 难度 -->
          <div class="flex gap-0.5 mb-4 relative z-10">
            <span
              v-for="s in difficultyStars(item.difficulty)"
              :key="s"
              class="material-symbols-outlined text-sm star-filled"
            >star</span>
            <span
              v-for="s in (5 - difficultyStars(item.difficulty))"
              :key="'e' + s"
              class="material-symbols-outlined text-sm text-outline-variant/40"
            >star</span>
          </div>

          <!-- 答案对比 -->
          <div class="space-y-2 mb-4 relative z-10">
            <div
              v-if="item.student_answer"
              class="bg-error/5 p-3 rounded-xl border border-error/10"
            >
              <div class="flex items-center gap-1.5 mb-1">
                <span class="material-symbols-outlined text-error text-sm">close</span>
                <span class="text-xs font-bold text-error">你的答案</span>
              </div>
              <p class="text-sm text-on-surface-variant pl-5" v-html="renderMathWithHtml(convertImagePlaceholders(item.student_answer || ''))"></p>
            </div>
            <div
              v-if="item.correct_answer"
              class="bg-secondary/5 p-3 rounded-xl border border-secondary/10"
            >
              <div class="flex items-center gap-1.5 mb-1">
                <span class="material-symbols-outlined text-secondary text-sm">check</span>
                <span class="text-xs font-bold text-secondary">正确答案</span>
              </div>
              <p class="text-sm text-on-surface-variant pl-5" v-html="renderMathWithHtml(convertImagePlaceholders(formatAnswer(item.correct_answer)))"></p>
            </div>
          </div>

          <!-- 解析（可展开） -->
          <div v-if="item.explanation" class="mb-4 relative z-10">
            <button
              class="flex items-center gap-1 text-xs text-primary font-bold hover:text-primary/80 transition-colors"
              type="button"
              @click="toggleExplanation(item.id)"
            >
              <span class="material-symbols-outlined text-sm">{{ expandedIds.has(item.id) ? 'expand_less' : 'expand_more' }}</span>
              {{ expandedIds.has(item.id) ? '收起解析' : '查看解析' }}
            </button>
            <div v-if="expandedIds.has(item.id)" class="mt-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p class="text-sm text-on-surface leading-relaxed" v-html="renderMathWithHtml(convertImagePlaceholders(item.explanation || ''))"></p>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-between pt-3 border-t border-outline-variant/5 relative z-10">
            <button
              class="flex items-center gap-1.5 px-4 py-2 bg-secondary/10 text-secondary rounded-xl text-sm font-bold hover:bg-secondary/20 transition-all active:scale-95"
              type="button"
              @click="confirmMaster(item)"
            >
              <span class="material-symbols-outlined text-sm">check_circle</span>
              已掌握
            </button>
            <button
              class="flex items-center gap-1.5 px-4 py-2 text-on-surface-variant rounded-xl text-sm font-bold hover:bg-error/5 hover:text-error transition-all active:scale-95"
              type="button"
              @click="confirmDelete(item)"
            >
              <span class="material-symbols-outlined text-sm">delete</span>
              删除
            </button>
          </div>
        </div>
      </section>

      <!-- ===== Pagination ===== -->
      <section v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-10">
        <button
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
          :class="page > 1 ? 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:shadow-sm' : 'text-outline-variant'"
          :disabled="page <= 1"
          type="button"
          @click="page--; fetchList()"
        >
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="text-on-surface-variant px-1">...</span>
          <button
            v-else
            class="w-10 h-10 rounded-xl font-bold text-sm transition-all active:scale-90"
            :class="p === page
              ? 'bg-primary text-white shadow-md'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'"
            type="button"
            @click="page = p; fetchList()"
          >
            {{ p }}
          </button>
        </template>
        <button
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
          :class="page < totalPages ? 'bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:shadow-sm' : 'text-outline-variant'"
          :disabled="page >= totalPages"
          type="button"
          @click="page++; fetchList()"
        >
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </section>
    </div>
  </main>

  <!-- ===== 已掌握确认弹窗 ===== -->
  <div
    v-if="masterTarget"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="masterTarget = null"
  >
    <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl">
      <div class="text-center mb-6">
        <span class="material-symbols-outlined text-5xl text-secondary mb-3" style="font-variation-settings: 'FILL' 1">check_circle</span>
        <h3 class="text-xl font-bold text-on-surface">确认已掌握？</h3>
        <p class="text-sm text-on-surface-variant mt-2">标记后将移出错题本，并获得 3 积分奖励</p>
      </div>
      <div class="flex gap-4">
        <button
          class="flex-1 py-3 bg-surface-container-low rounded-xl font-bold text-on-surface hover:bg-surface-container-higher transition-all"
          type="button"
          @click="masterTarget = null"
        >
          取消
        </button>
        <button
          class="flex-1 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-secondary/90 transition-all active:scale-95"
          type="button"
          :disabled="mastering"
          @click="handleMaster"
        >
          <span v-if="mastering" class="flex items-center justify-center gap-2">
            <span class="material-symbols-outlined animate-spin text-lg">refresh</span>
            处理中...
          </span>
          <span v-else>确认掌握</span>
        </button>
      </div>
    </div>
  </div>

  <!-- ===== 删除确认弹窗 ===== -->
  <div
    v-if="deleteTarget"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="deleteTarget = null"
  >
    <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl">
      <div class="text-center mb-6">
        <span class="material-symbols-outlined text-5xl text-error mb-3" style="font-variation-settings: 'FILL' 1">delete</span>
        <h3 class="text-xl font-bold text-on-surface">确认删除？</h3>
        <p class="text-sm text-on-surface-variant mt-2">此操作不可撤销</p>
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
          class="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all active:scale-95"
          type="button"
          @click="handleDelete"
        >
          确认删除
        </button>
      </div>
    </div>
  </div>

  <!-- 背景装饰 -->
  <div class="fixed top-40 -left-20 w-64 h-32 bg-primary/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>
  <div class="fixed bottom-20 -right-20 w-96 h-48 bg-secondary/5 blur-3xl rounded-full -z-10 pointer-events-none"></div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { listErrorBook, getErrorBookStats, masterErrorItem, deleteErrorItem } from '@/services/questionService.js'
import { renderMathWithHtml } from '@/utils/renderMath.js'

// ============================================================
// State
// ============================================================
const items = ref([])
const stats = ref(null)
const loading = ref(true)
const selectedSubject = ref('')
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const totalPages = ref(1)
const expandedIds = ref(new Set())
const masterTarget = ref(null)
const deleteTarget = ref(null)
const mastering = ref(false)
let searchTimer = null

// ============================================================
// Computed
// ============================================================
const subjectList = computed(() => {
  if (!stats.value?.subjectDistribution) return []
  return stats.value.subjectDistribution.map((s) => s.subject)
})

const visiblePages = computed(() => {
  const p = page.value
  const total = totalPages.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (p > 3) pages.push('...')
  for (let i = Math.max(2, p - 1); i <= Math.min(total - 1, p + 1); i++) {
    pages.push(i)
  }
  if (p < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ============================================================
// API Calls
// ============================================================
async function fetchStats() {
  try {
    stats.value = await getErrorBookStats()
  } catch (e) {
    console.error('Failed to load error book stats:', e)
  }
}

async function fetchList() {
  loading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
    }
    if (selectedSubject.value) params.subject = selectedSubject.value
    if (searchQuery.value.trim()) params.search = searchQuery.value.trim()

    const res = await listErrorBook(params)
    items.value = res.items || []
    total.value = res.total || 0
    totalPages.value = res.totalPages || 1
  } catch (e) {
    console.error('Failed to load error book:', e)
    items.value = []
  } finally {
    loading.value = false
  }
}

function debounceSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchList()
  }, 400)
}

// ============================================================
// Actions
// ============================================================
function confirmMaster(item) {
  masterTarget.value = item
}

async function handleMaster() {
  if (!masterTarget.value) return
  mastering.value = true
  try {
    await masterErrorItem(masterTarget.value.id)
    items.value = items.value.filter((i) => i.id !== masterTarget.value.id)
    total.value--
    totalPages.value = Math.ceil(total.value / pageSize.value) || 1
    masterTarget.value = null
    fetchStats()
  } catch (e) {
    console.error('Failed to master error item:', e)
    alert('操作失败: ' + e.message)
  } finally {
    mastering.value = false
  }
}

function confirmDelete(item) {
  deleteTarget.value = item
}

async function handleDelete() {
  if (!deleteTarget.value) return
  try {
    await deleteErrorItem(deleteTarget.value.id)
    items.value = items.value.filter((i) => i.id !== deleteTarget.value.id)
    total.value--
    totalPages.value = Math.ceil(total.value / pageSize.value) || 1
    deleteTarget.value = null
    if (items.value.length === 0 && page.value > 1) {
      page.value--
      fetchList()
    }
    fetchStats()
  } catch (e) {
    console.error('Failed to delete error item:', e)
    alert('操作失败: ' + e.message)
  }
}

function toggleExplanation(id) {
  const set = new Set(expandedIds.value)
  if (set.has(id)) set.delete(id)
  else set.add(id)
  expandedIds.value = set
}

// ============================================================
// Format Helpers
// ============================================================
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function stripContent(content) {
  if (!content) return ''
  // Remove options (A.. text) and trim
  return content.replace(/\n\s*[A-D][.、)）]\s*/g, ' ').trim()
}

function getStemFromContent(content) {
  if (!content) return ''
  // JSON format from docx parser
  try {
    const parsed = JSON.parse(content)
    if (parsed.stem) return parsed.stem
    if (parsed.passage) return parsed.passage
    return ''
  } catch {
    // Plain text fallback
    const match = content.match(/(?:^|\n)\s*[A-Za-z][.、)）]\s*/)
    if (match) return content.slice(0, match.index).trim()
    return content.trim()
  }
}

function renderStem(content) {
  const stem = getStemFromContent(content)
  return renderMathWithHtml(convertImagePlaceholders(stem))
}

function convertImagePlaceholders(text) {
  if (!text) return ''
  return text.replace(/\[img:([^\]]+)\]/g, (_, url) => {
    const resolved = resolveImageUrl(url.trim())
    return `<img src="${resolved}" alt="题目图片" class="max-w-full h-auto rounded-lg my-1" />`
  })
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

function difficultyStars(diff) {
  const n = parseInt(diff)
  if (n >= 1 && n <= 5) return n
  return 1
}

function formatAnswer(ans) {
  if (!ans) return ''
  if (Array.isArray(ans)) return ans.join(', ')
  return String(ans)
}

// ============================================================
// Color / Style Helpers
// ============================================================
function subjectColor(sub) {
  const map = {
    '语文': '#6366f1', '数学': '#8b5cf6', '英语': '#06b6d4',
    '物理': '#f97316', '化学': '#10b981', '生物': '#84cc16',
    '历史': '#ef4444', '政治': '#ec4899', '地理': '#14b8a6',
  }
  return map[sub] || '#6366f1'
}

function subjectColorBg(sub) {
  const map = {
    '语文': 'rgba(99,102,241,0.08)', '数学': 'rgba(139,92,246,0.08)',
    '英语': 'rgba(6,182,212,0.08)', '物理': 'rgba(249,115,22,0.08)',
    '化学': 'rgba(16,185,129,0.08)', '生物': 'rgba(132,204,22,0.08)',
    '历史': 'rgba(239,68,68,0.08)', '政治': 'rgba(236,72,153,0.08)',
    '地理': 'rgba(20,184,166,0.08)',
  }
  return map[sub] || 'rgba(99,102,241,0.08)'
}

function typeLabel(type) {
  const known = ['单选题', '多选题', '判断题', '填空题', '问答题', '简答题', '阅读理解', '连线题', '翻译题', '改错题', '编程题']
  return known.includes(type) ? type : '未知题型'
}

function typeClass(type) {
  const map = {
    '单选题': 'bg-primary/10 text-primary',
    '多选题': 'bg-secondary/10 text-secondary',
    '判断题': 'bg-tertiary/10 text-tertiary',
    '填空题': 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim',
    '问答题': 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim',
    '简答题': 'bg-primary-dim/20 text-primary-dim',
    '阅读理解': 'bg-primary/10 text-primary',
    '连线题': 'bg-secondary/10 text-secondary',
    '翻译题': 'bg-tertiary/10 text-tertiary',
    '改错题': 'bg-error/10 text-error',
    '编程题': 'bg-primary-dim/20 text-primary-dim',
  }
  return map[type] || 'bg-surface-container-high text-on-surface-variant'
}

// ============================================================
// Init
// ============================================================
onMounted(async () => {
  await Promise.all([fetchStats(), fetchList()])
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

.star-filled {
  font-variation-settings: 'FILL' 1;
  color: #fbbf24;
}
</style>
