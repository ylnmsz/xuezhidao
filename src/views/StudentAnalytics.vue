<template>
  <div class="flex min-h-screen">
    <StudentSidebar />
    <StudentTopNavbar />

    <main class="flex-grow p-6 md:p-10 space-y-10 overflow-y-auto pt-24 md:pt-28 lg:ml-72">
      <header
        class="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-xl px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-24 z-40"
      >
        <div class="flex items-center gap-4">
          <button
            class="material-symbols-outlined p-2 hover:bg-surface-container rounded-full transition-colors"
            @click="$router.back()"
          >
            arrow_back
          </button>
          <h1 class="font-headline font-extrabold text-2xl text-cyan-600 tracking-tight">
            学情详情
          </h1>
        </div>
        <div class="flex items-center gap-6">
          <div
            class="hidden md:flex bg-surface-container-low px-4 py-2 rounded-full items-center gap-2"
          >
            <span class="material-symbols-outlined text-outline">search</span>
            <input
              class="bg-transparent border-none focus:ring-0 text-sm w-48"
              placeholder="搜索课程或报告..."
              type="text"
            />
          </div>
          <div class="flex gap-4">
            <span
              class="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer"
            >
              notifications
            </span>
            <span
              class="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer"
            >
              auto_awesome
            </span>
          </div>
        </div>
      </header>

      <section
        class="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_40px_60px_rgba(0,0,0,0.04)] relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>
        <div class="relative group">
          <div
            class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500"
          >
            <img
              class="w-full h-full object-cover"
              :src="displayAvatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0891b2&color=fff&bold=true'"
              alt="Student"
            />
          </div>
          <div
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-xs px-3 py-1 rounded-full font-bold shadow-md"
          >
            LV.{{ displayLevel }} {{ levelTitle(displayLevel) }}
          </div>
        </div>
        <div class="flex-grow space-y-2 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-3">
            <h2 class="text-3xl font-headline font-extrabold text-on-surface">{{ displayName }}</h2>
            <span
              v-if="displayGrade || displayClass"
              class="px-4 py-1 bg-primary-container text-on-primary-container rounded-full text-sm font-semibold"
              >{{ displayGrade }} {{ displayClass }}</span
            >
          </div>
          <div class="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-tertiary"
            >
              <span class="block text-xs text-outline">总积分</span>
              <span class="font-bold text-tertiary">{{ displayPoints }}</span>
            </div>
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-secondary"
            >
              <span class="block text-xs text-outline">完成作业</span>
              <span class="font-bold text-secondary">{{ displayHomeworkDone }}</span>
            </div>
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-primary"
            >
              <span class="block text-xs text-outline">平均分</span>
              <span class="font-bold text-primary">{{ displayAccuracy }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            @click="$router.push('/messages')"
          >
            发送评语
          </button>
          <button
            class="bg-surface-container text-on-surface px-8 py-3 rounded-full font-bold hover:bg-surface-container-high transition-all"
            disabled
          >
            下载报告
          </button>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          class="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col"
        >
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-headline font-bold text-lg">学习活跃度趋势</h3>
            <select class="bg-surface text-xs border-none rounded-full px-4 focus:ring-primary">
              <option>近七天</option>
              <option>近一月</option>
            </select>
          </div>
          <div class="flex-grow h-64 relative flex items-end gap-2 group">
            <div
              class="relative flex-grow bg-primary-container/20 rounded-t-lg h-3/4 hover:bg-primary-container/40 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/30 rounded-t-lg h-1/2 hover:bg-primary-container/50 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/25 rounded-t-lg h-4/5 hover:bg-primary-container/45 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/40 rounded-t-lg h-2/3 hover:bg-primary-container/60 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/20 rounded-t-lg h-5/6 hover:bg-primary-container/40 transition-all cursor-pointer group/item border-t-4 border-primary"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/10 rounded-t-lg h-1/4 hover:bg-primary-container/30 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/15 rounded-t-lg h-1/3 hover:bg-primary-container/35 transition-all cursor-pointer group/item"
            ></div>
          </div>
          <div class="flex justify-between mt-4 text-xs text-outline px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span
            ><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div
          class="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center"
        >
          <h3 class="font-headline font-bold text-lg mb-6 w-full text-left">学科雷达图</h3>
          <div class="relative w-48 h-48 flex items-center justify-center">
            <div class="absolute inset-0 border border-outline-variant/30 rounded-full"></div>
            <div class="absolute inset-4 border border-outline-variant/30 rounded-full"></div>
            <div class="absolute inset-8 border border-outline-variant/30 rounded-full"></div>
            <svg class="w-full h-full transform -rotate-18" viewBox="0 0 100 100">
              <polygon
                fill="rgba(64, 206, 243, 0.4)"
                points="50,10 90,40 80,85 20,85 10,40"
                stroke="#006479"
                stroke-width="1"
              ></polygon>
              <circle cx="50" cy="10" fill="#006479" r="3"></circle>
              <circle cx="90" cy="40" fill="#006479" r="3"></circle>
              <circle cx="80" cy="85" fill="#006479" r="3"></circle>
              <circle cx="20" cy="85" fill="#006479" r="3"></circle>
              <circle cx="10" cy="40" fill="#006479" r="3"></circle>
            </svg>
            <span class="absolute -top-4 text-[10px] font-bold text-primary">语文</span>
            <span class="absolute top-1/4 -right-8 text-[10px] font-bold text-secondary">数学</span>
            <span class="absolute bottom-0 -right-4 text-[10px] font-bold text-tertiary">英语</span>
            <span class="absolute bottom-0 -left-4 text-[10px] font-bold text-on-primary-container">
              科学
            </span>
            <span class="absolute top-1/4 -left-8 text-[10px] font-bold text-error">艺术</span>
          </div>
          <div class="mt-8 w-full space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-on-surface-variant">作业完成率</span>
              <span class="font-bold">98%</span>
            </div>
            <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-secondary-fixed to-secondary w-[98%] rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section class="bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div class="flex items-center gap-3 mb-6">
            <span
              class="material-symbols-outlined text-tertiary"
              style="font-variation-settings: 'FILL' 1"
              >warning</span
            >
            <h3 class="font-headline font-bold text-lg">近期错题分布</h3>
          </div>
          <div v-if="errorStats.items && errorStats.items.length > 0" class="space-y-4">
            <div v-for="(item, idx) in errorStats.items.slice(0, 5)" :key="idx" class="flex items-center gap-4 group">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0"
                :class="idx === 0 ? 'bg-tertiary-container/20 text-tertiary' : idx === 1 ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container/20 text-secondary'"
              >
                {{ String(item.count || item.error_count || 0).padStart(2, '0') }}
              </div>
              <div class="flex-grow">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-semibold">{{ item.content || item.subject || '未知' }}</span>
                  <span class="text-xs text-outline">{{ item.frequency || (item.count > 5 ? '高频' : item.count > 2 ? '中等' : '低频') }}</span>
                </div>
                <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full rounded-full"
                    :class="idx === 0 ? 'bg-tertiary' : idx === 1 ? 'bg-primary' : 'bg-secondary'"
                    :style="{ width: Math.min((item.count || item.error_count || 0) / 20 * 100, 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
            <span class="material-symbols-outlined text-4xl">check_circle</span>
            <p class="text-sm">暂无错题数据</p>
          </div>
          <button
            class="w-full mt-6 py-3 border-2 border-dashed border-outline-variant text-outline hover:border-primary hover:text-primary rounded-xl text-sm font-bold transition-colors"
            @click="$router.push('/studenterrorbook')"
          >
            查看错题本
          </button>
        </section>

        <section class="bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-headline font-bold text-lg">最近作业</h3>
            <button
              class="text-primary text-sm font-bold cursor-pointer hover:underline"
              @click="$router.push('/studenthomeworklist')"
            >
              查看全部
            </button>
          </div>
          <div v-if="recentPractice.length > 0" class="divide-y divide-surface-container-low">
            <div
              v-for="item in recentPractice"
              :key="item.id"
              class="py-4 flex justify-between items-center hover:bg-surface-container-low transition-all px-2 rounded-lg cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="item.class_name ? 'bg-secondary-container' : 'bg-primary-container'"
                >
                  <span class="material-symbols-outlined text-sm" :class="item.class_name ? 'text-secondary' : 'text-primary'">{{ subjectIcon(item.subject || item.class_name) }}</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold">{{ item.assignment_title || item.title || '练习' }}</h4>
                  <p class="text-xs text-outline">提交于 {{ timeAgo(item.submitted_at) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div v-if="item.score != null" class="text-lg font-headline font-black" :class="item.score >= 80 ? 'text-secondary' : item.score >= 60 ? 'text-primary' : 'text-tertiary'">{{ item.score }}</div>
                <div v-else class="text-lg font-headline font-black text-on-surface-variant">--</div>
                <div class="text-[10px] text-outline px-2 rounded" :class="getScoreGrade(item.score).bg">{{ getScoreGrade(item.score).label }}</div>
              </div>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
            <span class="material-symbols-outlined text-4xl">history</span>
            <p class="text-sm">暂无练习记录</p>
          </div>
        </section>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { getMe } from '@/services/userService.js'
import { getMyStats, getMyRecentPractice, getErrorBookStats } from '@/services/questionService.js'

const user = ref(null)
const stats = ref(null)
const recentPractice = ref([])
const errorStats = ref({ items: [], totalCount: 0 })
const loading = ref(true)

const displayName = computed(() => user.value?.name || '—')
const displayAvatar = computed(() => {
  const url = user.value?.avatar_url
  if (!url) return ''
  if (url.startsWith('http')) return url
  return url
})
const displayGrade = computed(() => user.value?.grade || '')
const displayClass = computed(() => user.value?.class_name || '')
const displayLevel = computed(() => user.value?.level || 0)
const displayPoints = computed(() => stats.value?.points || user.value?.points || 0)
const displayAccuracy = computed(() => {
  const val = stats.value?.accuracy ?? user.value?.accuracy ?? 0
  return val > 1 ? Math.round(val) : Math.round(val * 100)
})
const displayCombatPower = computed(() => stats.value?.combat_power || user.value?.combat_power || 0)
const displayHomeworkDone = computed(() => stats.value?.homework_done ?? user.value?.homework_done ?? 0)

function levelTitle(level) {
  if (level >= 18) return '学神'
  if (level >= 14) return '学霸'
  if (level >= 10) return '知识先锋'
  if (level >= 7) return '努力小天才'
  if (level >= 4) return '进取少年'
  return '勤奋学员'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
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
  return formatDate(dateStr)
}

function getScoreGrade(score) {
  if (score == null) return { label: '待批改', color: 'text-on-surface-variant', bg: 'bg-surface-container' }
  if (score >= 90) return { label: '优秀', color: 'text-secondary', bg: 'bg-secondary/10' }
  if (score >= 75) return { label: '良好', color: 'text-primary', bg: 'bg-primary/10' }
  if (score >= 60) return { label: '及格', color: 'text-tertiary', bg: 'bg-tertiary/10' }
  return { label: '需努力', color: 'text-error', bg: 'bg-error/10' }
}

function subjectIcon(subject) {
  const icons = {
    '数学': 'calculate', '语文': 'history_edu', '英语': 'language',
    '物理': 'science', '化学': 'science', '生物': 'biotech',
    '历史': 'history', '政治': 'gavel', '地理': 'public',
  }
  return icons[subject] || 'school'
}

onMounted(async () => {
  try {
    const [userData, statsData, practiceData, errorData] = await Promise.all([
      getMe(),
      getMyStats().catch(() => null),
      getMyRecentPractice({ limit: 5 }).catch(() => ({ items: [] })),
      getErrorBookStats().catch(() => ({ items: [], totalCount: 0 })),
    ])
    user.value = userData
    stats.value = statsData
    recentPractice.value = practiceData.items || []
    errorStats.value = errorData
  } catch (e) {
    console.error('Failed to load analytics:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
