<template>
  <StudentTopNavbar />
  <StudentSidebar />
  <!-- Main Canvas -->
  <main class="lg:ml-72 p-4 pt-24 md:p-8 md:pt-28 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <!-- Welcome Banner & Task Board (Left Column) -->
      <div class="col-span-12 lg:col-span-8 space-y-8">
        <!-- Welcome Card -->
        <section
          class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dim rounded-lg p-8 text-on-primary shadow-xl h-64 flex items-center"
        >
          <div class="relative z-10 space-y-4">
            <div
              class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold"
            >
              <span
                class="material-symbols-outlined text-tertiary-fixed"
                data-icon="local_fire_department"
                style="font-variation-settings: 'FILL' 1"
                >local_fire_department</span
              >
              {{ streakDisplay }}
            </div>
            <h1 class="text-4xl md:text-5xl font-black font-headline leading-tight">
              {{ greeting }}，<br />{{ displayName }}！
            </h1>
            <p class="text-on-primary/80 font-medium">
              {{ progressHint }}
            </p>
          </div>
        </section>
        <!-- Task Board -->
        <section>
          <div class="flex justify-between items-end mb-6">
            <div>
              <h3 class="text-2xl font-headline font-bold text-on-surface">我的任务</h3>
              <p class="text-on-surface-variant">不要让学习之火熄灭哦！</p>
            </div>
            <button
              class="text-primary font-bold flex items-center gap-1 hover:underline"
              @click="$router.push('/studenthomeworklist')"
            >
              查看全部
              <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <!-- Level Card -->
            <div
              class="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 breathing-glow relative group"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg"
                >
                  {{ stats.level || '?' }}
                </div>
                <div>
                  <h4 class="text-lg font-bold">当前等级 Lv.{{ stats.level || '?' }}</h4>
                  <p class="text-sm text-on-surface-variant">
                    总积分 {{ stats.points || 0 }} / {{ stats.next_level_points || 100 }}
                  </p>
                </div>
              </div>
              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>升级进度</span>
                  <span>{{ progressPercent }}%</span>
                </div>
                <div class="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000"
                    :style="{ width: progressPercent + '%' }"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-on-surface-variant italic">
                {{ levelHint }}
              </p>
            </div>
          </div>
        </section>
      </div>
      <!-- Data Planet (Right Column) -->
      <div class="col-span-12 lg:col-span-4 space-y-8">
        <!-- My Battle Power Card -->
        <section
          class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-outline-variant/5"
        >
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-10 h-10 bg-tertiary-container/20 rounded-full flex items-center justify-center text-tertiary"
            >
              <span class="material-symbols-outlined" data-icon="insights">insights</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface">我的战力值</h3>
          </div>
          <!-- Radar/Donut Chart -->
          <div class="relative w-full aspect-square flex items-center justify-center mb-8">
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="absolute w-[80%] h-[80%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
              <div
                class="absolute w-[60%] h-[60%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
              <div
                class="absolute w-[40%] h-[40%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
            </div>
            <div class="relative z-10 w-full h-full">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" fill="none" r="40"
                  stroke="#e3e3dd" stroke-width="8"
                ></circle>
                <circle
                  cx="50" cy="50" fill="none" r="40"
                  stroke="#40cef3"
                  :stroke-dasharray="circleDash(40, breakdown.level_contribution)"
                  stroke-linecap="round" stroke-width="8"
                ></circle>
                <circle
                  cx="50" cy="50" fill="none" r="30"
                  stroke="#8bfe32"
                  :stroke-dasharray="circleDash(30, breakdown.accuracy_contribution)"
                  stroke-linecap="round" stroke-width="8"
                ></circle>
                <circle
                  cx="50" cy="50" fill="none" r="20"
                  stroke="#fe9d00"
                  :stroke-dasharray="circleDash(20, breakdown.homework_contribution)"
                  stroke-linecap="round" stroke-width="8"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black font-headline text-on-surface">
                  {{ formatCombatPower(stats.combat_power) }}
                </span>
                <span class="text-xs font-bold text-on-surface-variant tracking-widest uppercase"
                  >总战力</span
                >
              </div>
            </div>
          </div>
          <!-- Legend -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-primary"></div>
                <span class="text-sm font-semibold">等级</span>
              </div>
              <span class="text-sm font-black text-on-surface">
                {{ breakdown.level_contribution }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-[#8bfe32]"></div>
                <span class="text-sm font-semibold">准确率</span>
              </div>
              <span class="text-sm font-black text-on-surface">
                {{ breakdown.accuracy_contribution }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-[#fe9d00]"></div>
                <span class="text-sm font-semibold">作业</span>
              </div>
              <span class="text-sm font-black text-on-surface">
                {{ breakdown.homework_contribution }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-[#40cef3]"></div>
                <span class="text-sm font-semibold">连续</span>
              </div>
              <span class="text-sm font-black text-on-surface">
                {{ breakdown.streak_contribution }}
              </span>
            </div>
          </div>
          <!-- Subject Performance -->
          <div class="mt-6 pt-4 border-t border-outline-variant/20" v-if="stats.subject_performance && stats.subject_performance.length">
            <h4 class="text-sm font-bold text-on-surface-variant mb-3">学科表现</h4>
            <div
              v-for="sub in stats.subject_performance"
              :key="sub.subject"
              class="flex items-center justify-between py-1"
            >
              <span class="text-xs font-semibold">{{ sub.subject }}</span>
              <div class="flex items-center gap-2">
                <div class="h-2 w-24 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="scoreColor(sub.avg_score)"
                    :style="{ width: sub.avg_score + '%' }"
                  ></div>
                </div>
                <span class="text-xs font-black" :class="scoreTextColor(sub.avg_score)">
                  {{ sub.avg_score }}%
                </span>
              </div>
            </div>
          </div>
        </section>
        <!-- Ranking Preview -->
        <section
          class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10 cursor-pointer"
          @click="$router.push('/studentrankings')"
        >
          <h4 class="font-bold mb-4 flex items-center gap-2">
            <span
              class="material-symbols-outlined text-tertiary"
              data-icon="trophy"
              style="font-variation-settings: 'FILL' 1"
              >trophy</span
            >
            战力成就
          </h4>
          <div class="space-y-3 text-center">
            <div class="text-5xl font-black font-headline text-primary">
              {{ formatCombatPower(stats.combat_power) }}
            </div>
            <p class="text-sm text-on-surface-variant">
              Lv.{{ stats.level || '?' }} ・ 完成 {{ stats.homework_done || 0 }} 份作业 ・ 连续 {{ stats.streak_days || 0 }} 天
            </p>
            <div class="flex justify-center gap-4 text-xs font-bold text-on-surface-variant">
              <span>准确率 {{ Number(stats.accuracy || 0).toFixed(1) }}%</span>
              <span>积分 {{ stats.points || 0 }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { getStoredUser } from '@/services/userService.js'
import { getMyStats } from '@/services/questionService.js'

const user = ref(getStoredUser())
const displayName = computed(() => user.value?.name || '未登录用户')

// 实时统计数据
const stats = ref({
  points: 0,
  level: 1,
  combat_power: 0,
  next_level_points: 100,
  points_to_next_level: 100,
  progress_in_level: 0,
  level_range: 100,
  streak_days: 0,
  homework_done: 0,
  accuracy: 0,
  combat_breakdown: { level_contribution: 0, accuracy_contribution: 0, homework_contribution: 0, streak_contribution: 0 },
  subject_performance: [],
})

const breakdown = computed(() => stats.value.combat_breakdown || {})

const maxCombatContribution = computed(() => {
  const b = breakdown.value
  const vals = [b.level_contribution || 0, b.accuracy_contribution || 0, b.homework_contribution || 0, b.streak_contribution || 0]
  return Math.max(...vals, 1)
})

// SVG arc helper — maps a contribution value to a dasharray
function circleDash(radius, value) {
  const circumference = 2 * Math.PI * radius
  const ratio = maxCombatContribution.value > 0 ? (value || 0) / maxCombatContribution.value : 0
  const filled = circumference * Math.min(ratio, 1)
  return `${filled} ${circumference * 3}`
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const streakDisplay = computed(() => {
  const days = stats.value.streak_days || 0
  if (days <= 0) return '今天开始学习吧！'
  return `连续学习 ${days} 天`
})

const progressPercent = computed(() => {
  const range = stats.value.level_range || 100
  if (range <= 0) return 0
  return Math.min(100, Math.round(((stats.value.progress_in_level || 0) / range) * 100))
})

const progressHint = computed(() => {
  const needed = stats.value.points_to_next_level
  if (needed <= 0) return '已达最高等级！继续努力保持！'
  return `表现不错！再获得 ${needed} 经验值即可升级！`
})

const levelHint = computed(() => {
  const p = stats.value.points_to_next_level
  if (p <= 0) return '当前等级已满级！'
  return `还差 ${p} 分升到 Lv.${(stats.value.level || 1) + 1}`
})

function formatCombatPower(val) {
  if (!val) return '0'
  if (val >= 10000) return (val / 1000).toFixed(1) + 'k'
  return val.toLocaleString()
}

function scoreColor(score) {
  if (score >= 80) return 'bg-primary'
  if (score >= 60) return 'bg-secondary'
  return 'bg-tertiary'
}

function scoreTextColor(score) {
  if (score >= 80) return 'text-primary'
  if (score >= 60) return 'text-secondary'
  return 'text-tertiary'
}

onMounted(async () => {
  try {
    const data = await getMyStats()
    if (data) stats.value = data
  } catch (e) {
    console.error('Failed to load student stats:', e)
  }
})
</script>

<style scoped>
/* Breathing glow animation — matching existing style */
@keyframes breathing-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 180, 216, 0.1); }
  50% { box-shadow: 0 0 20px 4px rgba(0, 180, 216, 0.15); }
}
.breathing-glow {
  animation: breathing-glow 3s ease-in-out infinite;
}
</style>
