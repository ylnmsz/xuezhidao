<template>
  <div class="flex min-h-screen">
    <TeacherTopNavbar profile-route="/teacherprofile" />
    <TeacherSidebar />

    <main class="flex-1 lg:ml-72 p-6 md:p-10 pl-6 lg:pl-10 space-y-10 pt-24 md:pt-28">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="dashboard">dashboard</span>
        <p class="text-lg text-on-surface-variant font-medium">加载工作台数据...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
        <p class="text-lg text-error font-medium">{{ error }}</p>
        <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
      </div>

      <template v-else>
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-primary">教师工作台</h1>
            <p class="text-on-surface-variant mt-1">{{ welcomeText }}</p>
          </div>
        </header>

        <!-- Statistics Cards -->
        <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Stat Card 1: 管理班级 -->
          <div class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-primary-container/20 rounded-2xl">
                <span class="material-symbols-outlined text-primary text-3xl">school</span>
              </div>
              <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{{ totalClasses }} 个班级</span>
            </div>
            <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">{{ String(totalClasses).padStart(2, '0') }}</h3>
            <p class="text-on-surface-variant font-medium mt-1">管理班级</p>
          </div>

          <!-- Stat Card 2: 学生总数 -->
          <div class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-secondary-container/20 rounded-2xl">
                <span class="material-symbols-outlined text-secondary text-3xl">group</span>
              </div>
              <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">平均战力 {{ avgCombatPower }}</span>
            </div>
            <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">{{ totalStudents }}</h3>
            <p class="text-on-surface-variant font-medium mt-1">学生总数</p>
            <p class="text-xs text-on-surface-variant mt-1">平均正确率 {{ avgAccuracyText }}</p>
          </div>

          <!-- Stat Card 3: 待批改 -->
          <div class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group cursor-pointer"
            :class="{ 'ring-2 ring-error/30': pendingGrading > 0 }"
            @click="$router.push('/homeworkmanagement')">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-tertiary-container/20 rounded-2xl">
                <span class="material-symbols-outlined text-tertiary text-3xl">pending_actions</span>
              </div>
              <span v-if="pendingGrading > 0" class="text-xs font-bold text-error bg-error/10 px-2 py-1 rounded-full">待批改</span>
              <span v-else class="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">已全部批改</span>
            </div>
            <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">{{ pendingGrading }}</h3>
            <p class="text-on-surface-variant font-medium mt-1">待批改</p>
          </div>

          <!-- Stat Card 4: 题库总数 -->
          <div class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            <div class="flex items-center justify-between mb-4">
              <div class="p-3 bg-primary-container/20 rounded-2xl">
                <span class="material-symbols-outlined text-primary text-3xl">quiz</span>
              </div>
              <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">题库</span>
            </div>
            <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">{{ totalQuestionsLabel }}</h3>
            <p class="text-on-surface-variant font-medium mt-1">题库总数</p>
          </div>
        </section>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <!-- Weekly Submission Chart -->
          <section class="lg:col-span-8 space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-black font-headline text-[#006479]">本周提交</h2>
            </div>
            <div class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_80px_rgba(0,0,0,0.02)] border border-outline-variant/5 min-h-[400px] flex flex-col">
              <div v-if="weeklyMax > 0" class="flex-1 flex items-end justify-between gap-4 px-4">
                <div v-for="day in weeklyStats" :key="day.label" class="group relative flex-1 flex flex-col items-center gap-4">
                  <div class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {{ day.count }} 份提交
                  </div>
                  <div
                    class="w-full rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                    :class="barColorClass(day.count, weeklyMax)"
                    :style="{ height: (day.count / weeklyMax * 100) + '%' }"
                  ></div>
                  <span class="text-xs font-bold text-on-surface-variant">{{ day.label }}</span>
                </div>
              </div>
              <div v-else class="flex-1 flex items-center justify-center text-on-surface-variant">
                <p class="text-sm font-medium">本周暂无提交记录</p>
              </div>
              <div class="mt-8 pt-8 border-t border-surface-container-high flex items-center justify-center text-xs font-semibold text-on-surface-variant">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-primary-container rounded-full"></div>
                  提交数量
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="lg:col-span-4 space-y-6">
            <h2 class="text-2xl font-black font-headline text-[#006479]">快捷操作</h2>
            <div class="grid grid-cols-1 gap-4">
              <button
                class="group flex items-center justify-between p-6 bg-primary-container text-on-primary-container rounded-lg shadow-[0_10px_0_#004a5a] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
                @click="$router.push('/assignhomework')"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                    <span class="material-symbols-outlined text-3xl filled-icon">add_task</span>
                  </div>
                  <div class="text-left">
                    <span class="block font-headline font-extrabold text-xl">布置作业</span>
                    <span class="text-xs font-medium opacity-80">为学生创建新任务</span>
                  </div>
                </div>
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
              </button>
              <button
                class="group flex items-center justify-between p-6 bg-secondary-container text-on-secondary-container rounded-lg shadow-[0_10px_0_#2b5d00] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
                @click="$router.push('/questionbank')"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                    <span class="material-symbols-outlined text-3xl filled-icon">post_add</span>
                  </div>
                  <div class="text-left">
                    <span class="block font-headline font-extrabold text-xl">录入题目</span>
                    <span class="text-xs font-medium opacity-80">扩充您的题库</span>
                  </div>
                </div>
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
              </button>
              <button
                class="group flex items-center justify-between p-6 bg-tertiary-container text-on-tertiary-container rounded-lg shadow-[0_10px_0_#4b2b00] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
                @click="$router.push('/analyticsgrading')"
              >
                <div class="flex items-center gap-4">
                  <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                    <span class="material-symbols-outlined text-3xl filled-icon">insights</span>
                  </div>
                  <div class="text-left">
                    <span class="block font-headline font-extrabold text-xl">查看学情</span>
                    <span class="text-xs font-medium opacity-80">分析学生表现数据</span>
                  </div>
                </div>
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
              </button>
            </div>

          </section>
        </div>

        <!-- Recent Submissions -->
        <section class="space-y-6">
          <h2 class="text-2xl font-black font-headline text-[#006479]">近期提交</h2>
          <div v-if="recentSubmissions.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div
              v-for="sub in recentSubmissions"
              :key="sub.id"
              class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/5 hover:shadow-md transition-shadow cursor-pointer"
              @click="$router.push(`/teachergrading?assignmentId=${sub.assignment_id}`)"
            >
              <img
                :src="avatarSrc(sub)"
                class="w-16 h-16 rounded-2xl object-cover"
                alt="Student"
              />
              <div class="flex-1 min-w-0">
                <p class="font-headline font-bold text-on-surface truncate">{{ sub.student_name }}</p>
                <p class="text-xs text-on-surface-variant truncate">{{ sub.assignment_title }}</p>
                <div class="mt-2 flex items-center justify-between">
                  <span
                    class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    :class="sub.score !== null ? 'bg-secondary-container/30 text-secondary-fixed-variant' : 'bg-tertiary-container/30 text-tertiary-fixed-variant'"
                  >
                    {{ sub.score !== null ? '已批改' : '待批改' }}
                  </span>
                  <span class="text-[10px] text-on-surface-variant font-medium">{{ timeAgo(sub.submitted_at) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-surface-container-lowest rounded-lg p-12 text-center text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl mb-3" data-icon="inbox">inbox</span>
            <p class="font-medium">暂无提交记录</p>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { getAnalyticsOverview } from '@/services/questionService.js'
import { API_BASE } from '@/services/api.js'

const loading = ref(true)
const error = ref('')

const totalClasses = ref(0)
const totalStudents = ref(0)
const pendingGrading = ref(0)
const totalQuestions = ref(0)
const avgCombatPower = ref(0)
const avgAccuracy = ref(0)
const weeklyStats = ref([])
const recentSubmissions = ref([])

const avgAccuracyText = computed(() => {
  const v = avgAccuracy.value
  if (!v || !Number.isFinite(Number(v))) return '-'
  const num = Number(v)
  return num > 1 ? num.toFixed(1) + '%' : (num * 100).toFixed(1) + '%'
})

const weeklyMax = computed(() => {
  if (weeklyStats.value.length === 0) return 0
  return Math.max(...weeklyStats.value.map(d => d.count), 1)
})

const totalQuestionsLabel = computed(() => {
  const v = totalQuestions.value
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k'
  return String(v)
})

const welcomeText = computed(() => {
  const hour = new Date().getHours()
  let g
  if (hour < 6) g = '夜深了'
  else if (hour < 12) g = '上午好'
  else if (hour < 14) g = '中午好'
  else if (hour < 18) g = '下午好'
  else g = '晚上好'
  return `${g}，总览您的班级与学生动态`
})

function resolveAvatarUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${API_BASE.replace(/\/api\/?$/, '')}${url}`
  return url
}

function avatarSrc(item) {
  if (item.avatar_url) return resolveAvatarUrl(item.avatar_url)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.student_name || '?')}&background=0891b2&color=fff&bold=true`
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min} 分钟前`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function barColorClass(count, max) {
  if (max === 0) return 'bg-surface-container-high'
  const ratio = count / max
  if (ratio >= 0.7) return 'bg-gradient-to-t from-primary to-primary-fixed-dim'
  if (ratio >= 0.4) return 'bg-gradient-to-t from-secondary to-secondary-fixed-dim'
  return 'bg-gradient-to-t from-tertiary to-tertiary-fixed-dim'
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const data = await getAnalyticsOverview()
    totalClasses.value = data.totalClasses || 0
    totalStudents.value = data.totalStudents || 0
    pendingGrading.value = data.pendingGrading || 0
    totalQuestions.value = data.totalQuestions || 0
    avgCombatPower.value = data.avgCombatPower || 0
    avgAccuracy.value = data.avgAccuracy || 0
    weeklyStats.value = data.weeklyStats || []
    recentSubmissions.value = data.recentSubmissions || []
  } catch (e) {
    error.value = '加载工作台数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
</style>
