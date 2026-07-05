<template>
  <header
    class="fixed top-0 left-0 lg:left-72 w-full lg:w-[calc(100%-18rem)] flex justify-between items-center px-6 h-20 bg-[#f7f6f1]/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-none"
  >
    <div class="flex items-center gap-8">
      <span
        class="text-2xl font-black text-[#006479] dark:text-[#40cef3] tracking-tight font-headline lg:hidden"
      >
        Xue Zhi Dao
      </span>
      <!-- Currency/XP Bars (Game Style) -->
      <div class="hidden md:flex items-center gap-4 lg:pl-4">
        <!-- XP Bar -->
        <div class="flex items-center bg-surface-container-highest rounded-full px-3 py-1 gap-2">
          <span class="material-symbols-outlined text-primary" data-icon="military_tech"
            >military_tech</span
          >
          <div class="w-32 h-3 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full bg-primary rounded-full transition-all duration-1000" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="text-xs font-bold text-primary">LV.{{ level }}</span>
        </div>
        <!-- Coins Bar -->
        <div class="flex items-center bg-surface-container-highest rounded-full px-3 py-1 gap-2">
          <span class="material-symbols-outlined text-tertiary" data-icon="payments">payments</span>
          <span class="text-sm font-bold text-on-surface">{{ formattedPoints }}</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
        <span class="material-symbols-outlined text-on-surface-variant" data-icon="notifications"
          >notifications</span
        >
      </button>
      <RouterLink
        :to="profileRoute"
        class="flex items-center gap-3 bg-surface-container-low p-1 pr-4 rounded-full border border-outline-variant/10 hover:bg-surface-container transition-colors"
        aria-label="打开个人信息"
      >
        <img
          alt="Student Avatar"
          class="w-10 h-10 rounded-full bg-primary-container"
          data-alt="Cute 3D character avatar of a young student with a friendly smile"
          :src="displayAvatar"
        />
        <div class="flex flex-col">
          <span class="text-sm font-bold leading-none">{{ displayName }}</span>
          <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">
            {{ displayRole }}
          </span>
        </div>
      </RouterLink>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { API_BASE } from '@/services/api.js'
import { getMe, getStoredUser, saveUser } from '@/services/userService.js'
import { getMyStats } from '@/services/questionService.js'

defineProps({
  profileRoute: {
    type: String,
    default: '/studentprofile',
  },
})

const user = ref(getStoredUser())
const stats = ref(null)

const displayName = computed(() => user.value?.name || '未登录用户')
const displayRole = computed(() => (user.value?.role === 'teacher' ? '教师' : '学生'))
const fallbackAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBe6IM-fOrRbFo4dafI3z5jki3uWSd-EknFRgh_eWmpguGliZJ36IzWOElNNw7GcrSLCCSNTV8h6M8b5H3OwV7R0np9PI0ajRRl51yqszFhwc4PqqqV2wghEgFC57s9DAAe5Bku-YrT0U6b_bVt975AxDMd6JvoYTM9UFy79hEouQs9IC3vuycZ6NnSTzYPwxraJ_tgE4eWInvhXVfWt7cDcuAumAJgALVarP-ovqv42UflDIDM_JeGFzlLFwQscBL09d0Cv6MEszrQ'

const resolveAvatarUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) {
    const base = API_BASE.replace(/\/api\/?$/, '')
    return `${base}${url}`
  }
  return url
}

const displayAvatar = computed(() => resolveAvatarUrl(user.value?.avatar_url) || fallbackAvatar)

const level = computed(() => stats.value?.level || user.value?.level || 1)
const points = computed(() => stats.value?.points || user.value?.points || 0)
const progressPercent = computed(() => {
  const range = stats.value?.level_range || 100
  if (range <= 0) return 0
  return Math.min(100, Math.round(((stats.value?.progress_in_level || 0) / range) * 100))
})
const formattedPoints = computed(() => {
  const v = points.value
  if (v >= 10000) return (v / 1000).toFixed(1) + 'k'
  return v.toLocaleString()
})

const handleUserUpdated = (event) => {
  if (event?.detail) {
    user.value = event.detail
  }
}

onMounted(async () => {
  window.addEventListener('user:updated', handleUserUpdated)
  try {
    const data = await getMe()
    user.value = data
    saveUser(data)
  } catch {
    // Keep local cached user when API fails.
  }
  // Also fetch stats for level/points/progress
  try {
    stats.value = await getMyStats()
  } catch {
    // stats will fall back to user data
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('user:updated', handleUserUpdated)
})
</script>
