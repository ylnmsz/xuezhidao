<template>
  <StudentTopNavbar />
  <StudentSidebar />

  <main class="lg:ml-72 p-6 md:p-10 pt-24 md:pt-28 min-h-screen">
    <div class="max-w-7xl mx-auto w-full">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="assignment">assignment</span>
        <p class="text-lg text-on-surface-variant font-medium">加载作业列表...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
        <p class="text-lg text-error font-medium">{{ error }}</p>
        <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
      </div>

      <template v-else>
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h2 class="text-4xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">我的作业</h2>
            <p class="text-on-surface-variant font-medium">
              <template v-if="pendingCount > 0">
                今天还有 <span class="text-primary font-bold">{{ pendingCount }}</span> 项任务待完成，加油哦！
              </template>
              <template v-else>
                太棒了！所有作业都已提交！
              </template>
            </p>
          </div>
        </div>

        <!-- Filter buttons -->
        <div class="flex flex-wrap gap-3 mb-10">
          <button
            v-for="f in filters"
            :key="f.value"
            @click="activeFilter = f.value"
            class="px-6 py-2.5 rounded-full font-headline font-bold text-sm bouncy-hover active-squish transition-all"
            :class="activeFilter === f.value
              ? 'bg-primary-container text-on-primary-container shadow-md shadow-primary/10'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-white'"
          >{{ f.label }}</button>
        </div>

        <!-- Empty state -->
        <div v-if="filteredItems.length === 0" class="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <span class="material-symbols-outlined text-6xl" data-icon="assignment_turned_in">assignment_turned_in</span>
          <p class="text-lg font-medium">{{ emptyMessage }}</p>
        </div>

        <!-- Assignment cards grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <!-- Featured urgent card (first if pending) -->
          <div
            v-if="urgentItem && (activeFilter === 'all' || activeFilter === 'pending')"
            :key="urgentItem.id"
            class="md:col-span-2 xl:col-span-2 bg-surface-container-lowest rounded-xl p-8 diffuse-shadow relative overflow-hidden group"
          >
            <div v-if="urgentItem.derived_status === 'overdue'" class="absolute top-0 right-0 p-8">
              <span class="px-4 py-1.5 bg-error-container/10 text-error-dim rounded-full text-xs font-bold uppercase tracking-wider">已逾期</span>
            </div>
            <div v-else-if="isDueToday(urgentItem.due_at)" class="absolute top-0 right-0 p-8">
              <span class="px-4 py-1.5 bg-error/10 text-error rounded-full text-xs font-bold uppercase tracking-wider">今日截止</span>
            </div>
            <div class="flex flex-col h-full justify-between gap-8">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">{{ urgentItem.class_name }}</span>
                  <span class="text-on-surface-variant text-sm font-medium">
                    · {{ dueText(urgentItem.due_at) }}
                  </span>
                </div>
                <h3 class="text-2xl md:text-3xl font-headline font-extrabold text-on-surface leading-tight mb-4">
                  {{ urgentItem.title }}
                </h3>
                <p v-if="urgentItem.description" class="text-on-surface-variant max-w-lg line-clamp-2">{{ urgentItem.description }}</p>
              </div>
              <div class="space-y-6">
                <div v-if="urgentItem.submission_id" class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-on-surface-variant" v-if="urgentItem.score !== null">
                    <span class="text-sm font-semibold">得分：</span>
                    <span class="text-2xl font-black" :class="scoreColor(urgentItem.score)">{{ urgentItem.score }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-on-surface-variant" v-else>
                    <span class="material-symbols-outlined text-xl">check_circle</span>
                    <span class="text-sm font-semibold">已提交，等待批改</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-on-surface-variant">
                    <span class="material-symbols-outlined text-xl">calendar_today</span>
                    <span class="text-sm font-semibold">截止于：{{ dueDateText(urgentItem.due_at) }}</span>
                  </div>
                  <button
                    class="px-10 py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-full bouncy-hover active-squish shadow-xl shadow-primary/20 flex items-center gap-2"
                    @click="$router.push(`/challengeprep?assignmentId=${urgentItem.id}`)"
                  >
                    {{ urgentItem.submission_id ? '查看详情' : '去完成' }}
                    <span class="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Regular cards -->
          <div
            v-for="item in cardItems"
            :key="item.id"
            class="bg-surface-container-lowest rounded-xl p-6 diffuse-shadow group flex flex-col justify-between"
            :class="item.derived_status === 'overdue' ? 'opacity-80' : ''"
          >
            <div>
              <div class="flex justify-between items-start mb-4">
                <span class="px-3 py-1 rounded-lg text-xs font-bold"
                  :class="statusBadgeClass(item.derived_status)"
                >{{ item.class_name }}</span>
                <span
                  class="text-xs font-bold flex items-center gap-1"
                  :class="statusTextClass(item.derived_status)"
                >
                  <span class="material-symbols-outlined text-sm">{{ statusIcon(item.derived_status) }}</span>
                  {{ statusLabel(item.derived_status) }}
                </span>
              </div>
              <h4 class="font-headline font-bold text-lg text-on-surface mb-2">{{ item.title }}</h4>
              <p v-if="item.description" class="text-on-surface-variant text-sm mb-4 line-clamp-2">{{ item.description }}</p>
              <div v-if="item.score !== null" class="mb-4">
                <span class="text-xs font-bold" :class="scoreColor(item.score)">得分：{{ item.score }}</span>
              </div>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-outline-variant/10">
              <div class="flex flex-col">
                <span class="text-xs font-bold text-on-surface-variant/60">{{ dueShortText(item.due_at) }}</span>
                <span v-if="item.submitted_at" class="text-xs text-on-surface-variant/40">提交于 {{ formatDate(item.submitted_at) }}</span>
              </div>
              <button
                class="text-primary font-bold text-sm flex items-center gap-1 bouncy-hover"
                @click="$router.push(`/challengeprep?assignmentId=${item.id}`)"
              >
                {{ item.submission_id ? '查看' : '去完成' }}
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>

  <!-- Floating action hint -->
  <button
    v-if="pendingCount > 0 && filteredItems.length > 0"
    class="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full diffuse-shadow flex items-center justify-center bouncy-hover active-squish z-50"
    @click="activeFilter = 'pending'"
  >
    <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'wght' 700">pending_actions</span>
  </button>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { getStudentAssignments } from '@/services/questionService.js'

const loading = ref(true)
const error = ref('')
const assignments = ref([])
const activeFilter = ref('all')

const filters = [
  { label: '全部', value: 'all' },
  { label: '未完成', value: 'pending' },
  { label: '待批改', value: 'submitted' },
  { label: '已批改', value: 'graded' },
]

const filteredItems = computed(() => {
  const f = activeFilter.value
  if (f === 'all') return assignments.value
  return assignments.value.filter(a => a.derived_status === f)
})

const pendingCount = computed(() =>
  assignments.value.filter(a => a.derived_status === 'pending' || a.derived_status === 'overdue').length
)

const urgentItem = computed(() => {
  // Most urgent: overdue first, then due soonest, then pending
  const pending = [...assignments.value].filter(a =>
    a.derived_status === 'pending' || a.derived_status === 'overdue'
  )
  if (pending.length === 0) return null
  pending.sort((a, b) => {
    // Overdue items first
    if (a.derived_status === 'overdue' && b.derived_status !== 'overdue') return -1
    if (a.derived_status !== 'overdue' && b.derived_status === 'overdue') return 1
    // Then by due date
    const aDue = a.due_at ? new Date(a.due_at) : new Date(8640000000000000)
    const bDue = b.due_at ? new Date(b.due_at) : new Date(8640000000000000)
    return aDue - bDue
  })
  return pending[0]
})

const cardItems = computed(() => {
  const items = filteredItems.value
  if (!urgentItem.value) return items
  return items.filter(a => a.id !== urgentItem.value.id)
})

const emptyMessage = computed(() => {
  const map = { all: '暂无作业', pending: '所有作业都已提交！', submitted: '没有待批改的作业', graded: '暂无已批改的作业' }
  return map[activeFilter.value] || '暂无数据'
})

function isDueToday(dateStr) {
  if (!dateStr) return false
  const due = new Date(dateStr)
  const now = new Date()
  return due.toDateString() === now.toDateString()
}

function dueText(dateStr) {
  if (!dateStr) return '无截止日期'
  const due = new Date(dateStr)
  const now = new Date()
  const diff = due - now
  if (diff < 0) return `已逾期 ${Math.ceil(Math.abs(diff) / 86400000)} 天`
  if (diff < 86400000) return `剩余 ${Math.ceil(diff / 3600000)} 小时`
  return `剩余 ${Math.ceil(diff / 86400000)} 天`
}

function dueDateText(dateStr) {
  if (!dateStr) return '无截止日期'
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function dueShortText(dateStr) {
  if (!dateStr) return '无截止日期'
  const due = new Date(dateStr)
  const now = new Date()
  const diff = due - now
  if (diff < 0) return '已逾期'
  if (diff < 86400000) return `今日 ${String(due.getHours()).padStart(2, '0')}:${String(due.getMinutes()).padStart(2, '0')} 截止`
  return `截止 ${due.getMonth() + 1}/${due.getDate()}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function statusLabel(status) {
  const map = { pending: '未开始', submitted: '已提交', graded: '已完成', overdue: '已逾期' }
  return map[status] || status
}

function statusIcon(status) {
  const map = { pending: 'schedule', submitted: 'hourglass_top', graded: 'check_circle', overdue: 'error' }
  return map[status] || 'schedule'
}

function statusBadgeClass(status) {
  if (status === 'graded') return 'bg-secondary-container/20 text-secondary'
  if (status === 'submitted') return 'bg-tertiary-container/20 text-tertiary-dim'
  if (status === 'overdue') return 'bg-error/10 text-error'
  return 'bg-primary/10 text-primary'
}

function statusTextClass(status) {
  if (status === 'graded') return 'text-secondary'
  if (status === 'submitted') return 'text-tertiary-dim'
  if (status === 'overdue') return 'text-error'
  return 'text-on-surface-variant'
}

function scoreColor(score) {
  if (score >= 80) return 'text-secondary'
  if (score >= 60) return 'text-primary'
  return 'text-tertiary'
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await getStudentAssignments()
    assignments.value = data.items || []
  } catch {
    error.value = '加载作业列表失败'
  } finally {
    loading.value = false
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
.diffuse-shadow {
  box-shadow: 0 40px 60px -20px rgba(0, 100, 121, 0.08);
}
.bouncy-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.active-squish:active {
  transform: scale(0.95);
}
</style>
