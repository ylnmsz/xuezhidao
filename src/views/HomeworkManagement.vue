<template>
  <div class="bg-surface font-body text-on-surface">
    <div class="flex min-h-screen">
      <TeacherSidebar />
      <TeacherTopNavbar profile-route="/teacherprofile" />

      <main class="flex-1 min-h-screen overflow-x-hidden lg:ml-72 pt-20">
        <header
          class="bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 w-full border-b border-surface-container-high/20"
        >
          <div class="flex items-center gap-6 flex-1">
            <span class="text-2xl font-black text-cyan-600 tracking-tight font-headline"
              >Xue Zhi Dao</span
            >
            <div class="relative max-w-md w-full hidden lg:block">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >search</span
              >
              <input
                class="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-sm"
                placeholder="搜索作业名称..."
                type="text"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button
                class="p-2 text-slate-500 hover:scale-105 hover:bg-slate-100/50 rounded-full transition-all duration-300"
              >
                <span class="material-symbols-outlined" data-icon="notifications"
                  >notifications</span
                >
              </button>
              <button
                class="p-2 text-slate-500 hover:scale-105 hover:bg-slate-100/50 rounded-full transition-all duration-300"
              >
                <span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
              </button>
            </div>
            <div class="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
            <button
              class="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
              @click="$router.push('/assignhomework')"
            >
              <span class="material-symbols-outlined" data-icon="add">add</span>
              新建作业
            </button>
          </div>
        </header>

        <div class="p-8 max-w-7xl mx-auto">
          <!-- Loading -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
            <span class="material-symbols-outlined text-6xl text-primary animate-pulse">assignment</span>
            <p class="text-lg text-on-surface-variant font-medium">加载作业数据中...</p>
          </div>

          <template v-else>
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <nav class="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                  <span>首页</span>
                  <span class="material-symbols-outlined text-xs">chevron_right</span>
                  <span class="text-primary font-semibold">作业管理</span>
                </nav>
                <h1
                  class="text-4xl font-headline font-extrabold text-on-surface flex items-center gap-3"
                >
                  作业管理
                </h1>
                <p class="text-on-surface-variant mt-2 text-lg" v-if="pendingGradingCount > 0">
                  您有 <span class="text-tertiary font-bold">{{ pendingGradingCount }}份</span> 待批改作业，继续加油！
                </p>
                <p class="text-on-surface-variant mt-2 text-lg" v-else>
                  暂无待批改作业
                </p>
              </div>
            </div>

            <div v-if="assignments.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
              <span class="material-symbols-outlined text-5xl text-on-surface-variant">assignment</span>
              <p class="text-on-surface-variant font-medium">暂无作业数据</p>
              <button @click="$router.push('/assignhomework')" class="bg-primary text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-all">发布新作业</button>
            </div>

            <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div
                v-for="assign in assignments"
                :key="assign.id"
                class="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
              >
                <div class="absolute top-0 left-0 w-2 h-full" :class="getAccentColor(assign.subject)"></div>
                <div class="flex-1">
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <span
                        class="inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                        :class="getSubjectTag(assign.subject).color"
                      >{{ getSubjectTag(assign.subject).label }}</span>
                      <h3
                        class="text-xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors"
                      >{{ assign.title }}</h3>
                      <p class="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
                        <span class="material-symbols-outlined text-sm">groups</span>
                        {{ getClassLabel(assign.class_id) }}
                      </p>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4 mt-6">
                    <div
                      class="bg-surface-container-low/50 p-3 rounded-2xl border border-outline-variant/5"
                    >
                      <p class="text-xs text-on-surface-variant font-medium mb-1">截止时间</p>
                      <p class="text-sm font-bold flex items-center gap-1.5" :class="getStatusInfo(assign).color">
                        <span class="material-symbols-outlined text-sm">{{ getStatusInfo(assign).icon }}</span>
                        {{ assign.due_at ? new Date(assign.due_at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '无截止时间' }}
                      </p>
                    </div>
                    <div
                      class="p-3 rounded-2xl border"
                      :class="(assign.pending_count || 0) > 0 ? 'bg-tertiary-container/10 border-tertiary-container/20' : 'bg-secondary/5 border-secondary/10'"
                    >
                      <p class="text-xs font-bold mb-1" :class="(assign.pending_count || 0) > 0 ? 'text-tertiary' : 'text-secondary'">待批改数量</p>
                      <p class="text-sm font-black flex items-center gap-1.5" :class="(assign.pending_count || 0) > 0 ? 'text-on-tertiary-container' : 'text-secondary-dim'">
                        <span
                          class="material-symbols-outlined text-sm"
                          :class="(assign.pending_count || 0) > 0 ? 'text-tertiary' : 'text-secondary'"
                          :style="(assign.pending_count || 0) > 0 ? 'font-variation-settings: \'FILL\' 1' : ''"
                        >{{ (assign.pending_count || 0) > 0 ? 'warning' : 'check_circle' }}</span>
                        {{ assign.pending_count || 0 }} 份
                      </p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col items-center justify-between gap-4">
                  <div class="relative w-28 h-28 flex items-center justify-center">
                    <svg class="w-full h-full -rotate-90">
                      <circle
                        class="text-surface-container-high"
                        cx="56"
                        cy="56"
                        fill="transparent"
                        r="48"
                        stroke="currentColor"
                        stroke-width="8"
                      ></circle>
                      <circle
                        class="text-secondary"
                        cx="56"
                        cy="56"
                        fill="transparent"
                        r="48"
                        stroke="currentColor"
                        stroke-dasharray="301.59"
                        :stroke-dashoffset="submissionBarOffset(assign.submission_rate || 0)"
                        stroke-linecap="round"
                        stroke-width="8"
                      ></circle>
                    </svg>
                    <div class="absolute flex flex-col items-center">
                      <span class="text-lg font-black text-on-surface">{{ assign.submission_rate || 0 }}%</span>
                      <span
                        class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                      >提交率</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 w-full">
                    <button
                      class="w-full py-2.5 px-4 bg-primary text-on-primary rounded-2xl text-sm font-bold hover:scale-[1.05] active:scale-95 transition-all"
                      @click="viewGrading(assign)"
                    >{{ (assign.pending_count || 0) > 0 ? '去批改' : '查看详情' }}</button>
                    <button
                      class="w-full py-2.5 px-4 bg-surface-container-low text-on-surface-variant rounded-2xl text-sm font-bold hover:bg-surface-container transition-all"
                      @click="viewAnalysis(assign)"
                    >查看分析</button>
                  </div>
                </div>
              </div>

              <div
                class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-surface-container-low/30 hover:border-primary/40 transition-all cursor-pointer group min-h-[250px]"
                @click="$router.push('/assignhomework')"
              >
                <div
                  class="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform bg-white shadow-sm"
                >
                  <span class="material-symbols-outlined text-3xl text-primary">add_circle</span>
                </div>
                <div class="text-center">
                  <p class="font-headline font-bold text-on-surface">发布新作业</p>
                  <p class="text-xs text-on-surface-variant mt-1">支持选择题、简答题及多媒体附件</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { listClasses, listAssignments } from '@/services/questionService.js'
import { getMe } from '@/services/userService.js'
import { API_BASE } from '@/services/api.js'

const router = useRouter()

const loading = ref(true)
const assignments = ref([])
const classes = ref([])
const searchQuery = ref('')
const selectedClassId = ref('')
const selectedStatus = ref('')
const selectedPeriod = ref('')

const pendingGradingCount = computed(() => {
  return assignments.value.reduce((sum, a) => sum + (a.pending_count || 0), 0)
})

async function fetchData() {
  loading.value = true
  try {
    const user = await getMe()
    const classRes = await listClasses({ teacherId: user.id })
    classes.value = classRes.items || []

    const assignRes = await listAssignments({ teacherId: user.id, limit: '50' })
    assignments.value = assignRes.items || []
  } catch (e) {
    console.error('Failed to load homework data:', e)
  } finally {
    loading.value = false
  }
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function getClassLabel(classId) {
  const cls = classes.value.find(c => c.id === classId)
  return cls?.name || '未知班级'
}

function getSubjectTag(subject) {
  if (!subject) return { label: '综合', color: 'bg-primary-container/10 text-primary' }
  const map = {
    '数学': { label: '数学类', color: 'bg-primary-container/10 text-primary' },
    '英语': { label: '英语类', color: 'bg-secondary/10 text-secondary' },
    '物理': { label: '物理类', color: 'bg-tertiary/10 text-tertiary' },
  }
  return map[subject] || { label: subject + '类', color: 'bg-primary-container/10 text-primary' }
}

function getStatusInfo(assign) {
  const now = new Date()
  const due = assign.due_at ? new Date(assign.due_at) : null
  if (due && due < now) return { label: '已截止', icon: 'event_busy', color: 'text-error' }
  if (assign.status === 'published') return { label: '进行中', icon: 'schedule', color: 'text-on-surface-variant' }
  return { label: '草稿', icon: 'edit_note', color: 'text-on-surface-variant' }
}

function getAccentColor(subject) {
  const map = { '数学': 'bg-primary-container', '英语': 'bg-secondary', '物理': 'bg-tertiary' }
  return map[subject] || 'bg-primary-container'
}

function submissionRateClass(rate) {
  if (rate >= 80) return 'text-secondary'
  if (rate >= 50) return 'text-tertiary'
  return 'text-error'
}

function submissionBarOffset(rate) {
  const circumference = 301.59
  return circumference - (rate / 100) * circumference
}

const viewAnalysis = (assign) => {
  router.push(`/analyticsgrading?assignmentId=${assign.id}`)
}

const viewGrading = (assign) => {
  router.push(`/teachergrading?assignmentId=${assign.id}`)
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
</style>
