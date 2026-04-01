<template>
  <aside
    class="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-[#f7f6f1] dark:bg-slate-950 flex-col p-6 gap-4 z-50 shadow-[40px_0_60px_rgba(0,0,0,0.04)]"
  >
    <div class="mb-6 px-4 pt-4">
      <span
        class="text-2xl font-black text-[#006479] dark:text-[#40cef3] tracking-tight font-headline block mb-8"
      >
        Xue Zhi Dao
      </span>
      <h2 class="font-headline font-bold text-[#006479] text-xl">欢迎回来</h2>
      <p class="text-sm text-slate-500">{{ displayName }}</p>
    </div>
    <nav class="flex flex-col gap-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="[
          'flex items-center gap-4 px-6 py-4 rounded-full transition-all duration-300 font-semibold',
          isActive(item.to)
            ? 'bg-[#00B4D8] text-white shadow-lg scale-105'
            : 'text-slate-600 hover:bg-slate-200/50 hover:translate-x-2',
        ]"
      >
        <span class="material-symbols-outlined" :data-icon="item.icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
      <RouterLink
        to="/studentrankings"
        class="flex items-center gap-4 px-6 py-4 text-slate-600 hover:bg-slate-200/50 rounded-full transition-all duration-300 hover:translate-x-2 font-semibold"
      >
        <span class="material-symbols-outlined" data-icon="leaderboard">leaderboard</span>
        <span>排名</span>
      </RouterLink>
    </nav>
    <div class="mt-auto p-4 bg-primary-container/20 rounded-lg relative overflow-hidden group">
      <div class="relative z-10">
        <p class="text-xs font-bold text-primary uppercase mb-1">新任务</p>
        <p class="text-sm font-bold text-on-primary-container mb-3">
          完成 3 个数学谜题即可获得白银宝箱！
        </p>
        <RouterLink
          to="/immersivepractice"
          class="w-full py-2 bg-primary text-white rounded-full text-sm font-bold bouncy-hover text-center"
        >
          开始学习
        </RouterLink>
      </div>
      <!-- Decorative Cloud -->
      <span
        class="material-symbols-outlined absolute -right-4 -bottom-4 text-primary/10 text-8xl"
        data-icon="cloud"
      >
        cloud
      </span>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMe, getStoredUser, saveUser } from '@/services/userService.js'

const route = useRoute()
const user = ref(getStoredUser())
const navItems = [
  { label: '首页', to: '/studentdashboard', icon: 'home' },
  { label: '作业', to: '/immersivepractice', icon: 'auto_stories' },
  { label: '错题本', to: '/studenterrorbook', icon: 'cancel' },
]

const isActive = (path) => route.path === path

const displayName = computed(() => user.value?.name || '未登录用户')

onMounted(async () => {
  try {
    const data = await getMe()
    user.value = data
    saveUser(data)
  } catch {
    // Keep local cached user when API fails.
  }
})
</script>
