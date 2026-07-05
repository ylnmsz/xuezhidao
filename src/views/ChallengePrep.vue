<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden">
    <StudentTopNavbar />
    <StudentSidebar />

    <header
      class="bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-20 z-30 flex justify-between items-center px-8 py-4 w-full lg:ml-72"
    >
      <div class="flex items-center gap-4">
        <button
          class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100/50 hover:scale-105 hover:bg-slate-100/50 transition-all duration-300 scale-95 active:duration-75"
          @click="$router.back()"
        >
          <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <h1 class="font-bold text-lg text-on-surface leading-tight">作业准备</h1>
          <p class="text-xs text-on-surface-variant font-medium">Xue Zhi Dao · 学习中心</p>
        </div>
      </div>
      <div v-if="assignment" class="flex items-center gap-3">
        <div class="hidden md:flex flex-col items-end mr-2">
          <span class="text-xs font-bold text-primary">{{ assignment.class_name }}</span>
          <span v-if="assignment.due_at" class="text-[10px] text-on-surface-variant">截止：{{ dueDateText(assignment.due_at) }}</span>
        </div>
        <div
          class="w-10 h-10 rounded-full overflow-hidden bg-primary-container ring-4 ring-white shadow-sm cursor-pointer"
          role="button"
          aria-label="打开个人信息"
          @click="$router.push('/studentprofile')"
        >
          <img
            alt="Student avatar"
            data-alt="cute cartoon 3d avatar of a young student with glasses and a happy expression on a soft pastel background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCVU_Aop6vqf-ReUWgiJY9fOc_ZmdgpwJeRkf8obthJl9k3Oi3uQeBE1Wt32hiUUTPeXsk-bvw8oFQOnEJ3Trtoz5zmdB51cbSMh8ml3lBPMq9JEx0aK6U_OCE7-oyCjnBoV7mVzo8UbK_2Cgnm1ehAk59dooSlY_RewAjchY9mQ7qzwXCuiZYAtF8YVp17HwXSwq-qtFURVS9x6pgIV4S7AKzw7elo4_wUbU3qhmLuyIUCHsIltiIJ5sWzkFtIZX5Xgv9RlYEJyBU"
          />
        </div>
      </div>
    </header>

    <main
      class="flex-grow flex flex-col items-center justify-center p-6 md:p-12 pt-24 md:pt-28 relative lg:ml-72"
    >
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse">auto_stories</span>
        <p class="text-lg text-on-surface-variant font-medium">加载作业信息...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1">error</span>
        <p class="text-lg text-error font-medium">{{ error }}</p>
        <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
      </div>

      <template v-else-if="assignment">
        <div
          class="absolute top-20 left-10 w-32 h-32 bg-primary-fixed/20 rounded-full blur-3xl -z-10"
        ></div>
        <div
          class="absolute bottom-20 right-10 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-3xl -z-10"
        ></div>

        <!-- Overdue badge -->
        <div v-if="isOverdue" class="w-full max-w-4xl mb-4">
          <div class="bg-error/10 border border-error/20 rounded-xl px-6 py-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1">error</span>
            <span class="text-error font-semibold">该作业已逾期，但你可以继续作答</span>
          </div>
        </div>

        <div
          class="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-[40px_40px_80px_rgba(0,100,121,0.08)] overflow-hidden flex flex-col md:flex-row border border-outline-variant/15"
        >
          <!-- Left panel: icon + title -->
          <div
            class="md:w-2/5 bg-gradient-to-br from-primary-container/40 to-primary-fixed/10 p-8 flex flex-col justify-between items-center text-center"
          >
            <div class="relative">
              <div
                class="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center relative z-10"
              >
                <span class="material-symbols-outlined text-primary text-7xl fill-icon"
                  >auto_stories</span
                >
              </div>
              <div
                v-if="!assignment.submission_id"
                class="absolute -top-4 -right-4 w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center shadow-lg text-white font-bold animate-bounce"
              >
                <span class="material-symbols-outlined">star</span>
              </div>
            </div>
            <div class="mt-8">
              <h2 class="text-2xl font-black text-on-primary-container tracking-tight mb-2">
                {{ assignment.title }}
              </h2>
              <div class="flex flex-wrap justify-center gap-2">
                <span v-if="assignment.subject" class="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-primary">
                  {{ assignment.subject }}
                </span>
                <span class="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-secondary">
                  作业挑战
                </span>
              </div>
            </div>
            <div v-if="assignment.submission_id" class="w-full mt-8 p-4 bg-white/40 rounded-lg backdrop-blur-sm">
              <div class="flex justify-between items-center text-sm mb-2">
                <span class="text-on-surface-variant font-medium">完成状态</span>
                <span :class="assignment.score !== null ? 'text-secondary font-bold' : 'text-primary font-bold'">
                  {{ assignment.score !== null ? `得分 ${assignment.score}` : '已提交，待批改' }}
                </span>
              </div>
              <div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary-fixed-dim to-primary-container w-full rounded-full"
                ></div>
              </div>
            </div>
          </div>

          <!-- Right panel: details -->
          <div class="md:w-3/5 p-8 md:p-12 flex flex-col">
            <h3
              class="text-xl font-headline font-extrabold text-on-surface mb-8 flex items-center gap-2"
            >
              <span class="w-2 h-8 bg-tertiary rounded-full"></span>
              任务概览
            </h3>
            <div class="grid grid-cols-2 gap-4 mb-8">
              <div
                class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
              >
                <span class="material-symbols-outlined text-primary-dim mb-2"
                  >format_list_numbered</span
                >
                <span class="text-2xl font-black text-on-surface tracking-tight">{{ assignment.question_count }}</span>
                <span class="text-xs text-on-surface-variant font-medium">题目数量</span>
              </div>
              <div
                class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
              >
                <span class="material-symbols-outlined text-secondary mb-2">schedule</span>
                <span class="text-2xl font-black text-on-surface tracking-tight"
                  >{{ assignment.estimated_minutes }} <span class="text-sm">min</span></span
                >
                <span class="text-xs text-on-surface-variant font-medium">预计时长</span>
              </div>
              <div
                class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
              >
                <div class="flex gap-0.5 mb-2">
                  <span v-for="i in 5" :key="i" class="material-symbols-outlined text-sm"
                    :class="i <= difficultyStars ? 'text-tertiary-fixed fill-icon' : 'text-outline-variant'"
                  >star</span>
                </div>
                <span class="text-xl font-black text-on-surface tracking-tight">{{ difficultyLabel }}</span>
                <span class="text-xs text-on-surface-variant font-medium">挑战评级</span>
              </div>
              <div
                class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
              >
                <div
                  class="w-10 h-10 bg-tertiary-container/20 rounded-full flex items-center justify-center mb-1"
                >
                  <span class="material-symbols-outlined text-tertiary fill-icon">military_tech</span>
                </div>
                <span class="text-2xl font-black text-tertiary tracking-tight">+{{ assignment.xp_reward }} XP</span>
                <span class="text-xs text-on-surface-variant font-medium">完成奖励</span>
              </div>
            </div>

            <div v-if="assignment.description" class="mb-10">
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                作业说明
              </p>
              <p class="text-sm text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-lg">
                {{ assignment.description }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                class="flex-1 order-2 sm:order-1 bg-surface-container-high py-4 px-6 rounded-xl font-bold text-on-surface-variant hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                @click="$router.back()"
              >
                稍后再做
              </button>
              <button
                v-if="assignment.submission_id && assignment.score !== null"
                class="flex-[2] order-1 sm:order-2 bg-secondary-container py-4 px-6 rounded-xl font-extrabold text-on-secondary-container shadow-xl shadow-secondary-container/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
                @click="goToChallenge"
              >
                <span class="text-lg">查看详情</span>
                <span class="material-symbols-outlined text-xl">visibility</span>
              </button>
              <button
                v-else-if="assignment.submission_id"
                class="flex-[2] order-1 sm:order-2 bg-tertiary-container/50 py-4 px-6 rounded-xl font-extrabold text-on-surface-variant cursor-default flex items-center justify-center gap-3"
                disabled
              >
                <span class="material-symbols-outlined text-xl">check_circle</span>
                <span class="text-lg">已提交，等待批改</span>
              </button>
              <button
                v-else
                class="flex-[2] order-1 sm:order-2 bg-primary-container py-4 px-6 rounded-xl font-extrabold text-on-primary-container shadow-xl shadow-primary-container/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
                @click="goToChallenge"
              >
                <span class="text-lg">开始挑战</span>
                <span class="material-symbols-outlined text-xl">rocket_launch</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center gap-4 text-on-surface-variant/60">
          <span class="material-symbols-outlined text-lg">lightbulb</span>
          <p class="text-sm italic">温馨提示：深呼吸，保持专注。你可以尝试在草稿纸上画图辅助思考！</p>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { getAssignmentPrep } from '@/services/questionService.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const assignment = ref(null)

const isOverdue = computed(() => {
  if (!assignment.value?.due_at) return false
  return new Date(assignment.value.due_at) < new Date()
})

const difficultyStars = computed(() => {
  const count = assignment.value?.question_count || 0
  if (count <= 5) return 2
  if (count <= 10) return 3
  if (count <= 15) return 4
  return 5
})

const difficultyLabel = computed(() => {
  const stars = difficultyStars.value
  if (stars <= 2) return '简单'
  if (stars <= 3) return '中等'
  if (stars <= 4) return '困难'
  return '地狱'
})

function dueDateText(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function goToChallenge() {
  // Navigate to the challenge/quiz page with the assignmentId
  router.push(`/practice-session?assignmentId=${assignment.value.id}`)
}

async function fetchData() {
  const assignmentId = route.query.assignmentId
  if (!assignmentId) {
    error.value = '缺少作业ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const data = await getAssignmentPrep(assignmentId)
    assignment.value = data
  } catch (err) {
    error.value = err.message || '加载作业信息失败'
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
    'opsz' 48;
  vertical-align: middle;
}
.fill-icon {
  font-variation-settings: 'FILL' 1;
}
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
}
</style>
