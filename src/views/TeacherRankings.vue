<template>
  <div class="flex min-h-screen">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />

    <main class="flex-1 p-8 overflow-y-auto pt-24 md:pt-28 lg:ml-72">
      <div class="max-w-7xl mx-auto w-full">
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
          <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="leaderboard">leaderboard</span>
          <p class="text-lg text-on-surface-variant font-medium">加载排行榜数据中...</p>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
          <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
          <p class="text-lg text-error font-medium">{{ error }}</p>
          <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
        </div>

        <template v-else>
          <!-- Header -->
          <header class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 class="text-3xl font-extrabold tracking-tight text-primary">班级排行榜</h1>
              <p class="text-on-surface-variant mt-1">查看班级学习进度与优秀学员排名</p>
            </div>
            <div class="flex gap-4 items-center">
              <!-- Class selector -->
              <div class="relative">
                <div
                  @click="showClassDropdown = !showClassDropdown"
                  class="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3 diffused-shadow cursor-pointer hover:bg-white transition-all"
                >
                  <span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
                  <span class="font-semibold text-on-surface">{{ classInfo?.name || '选择班级' }}</span>
                  <span class="material-symbols-outlined text-outline" data-icon="expand_more">expand_more</span>
                </div>
                <div
                  v-if="showClassDropdown"
                  class="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-surface-container-low z-20 overflow-hidden max-h-72 overflow-y-auto"
                >
                  <div
                    v-for="cls in classes"
                    :key="cls.id"
                    @click="selectClass(cls)"
                    class="px-6 py-4 hover:bg-primary-container/20 cursor-pointer transition-colors"
                    :class="selectedClassId === cls.id ? 'text-primary bg-primary-container/10 font-semibold' : 'text-on-surface'"
                  >{{ cls.name }}</div>
                  <div v-if="classes.length === 0" class="px-6 py-4 text-on-surface-variant text-center">暂无班级</div>
                </div>
              </div>
            </div>
          </header>

          <!-- No class selected -->
          <div v-if="!selectedClassId" class="flex flex-col items-center justify-center py-32 gap-6">
            <span class="material-symbols-outlined text-6xl text-on-surface-variant" data-icon="groups">groups</span>
            <p class="text-xl text-on-surface-variant font-medium">请选择一个班级查看排名</p>
          </div>

          <!-- Rankings loading -->
          <div v-if="rankingsLoading" class="flex flex-col items-center justify-center py-32 gap-6">
            <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="leaderboard">leaderboard</span>
            <p class="text-lg text-on-surface-variant font-medium">加载排名数据中...</p>
          </div>

          <template v-else>
            <!-- Podium (top 3) -->
            <div v-if="top3.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
              <!-- #2 -->
              <div v-if="top3[1]" class="bg-surface-container-lowest p-8 rounded-lg diffused-shadow flex flex-col items-center relative transition-transform hover:scale-[1.03] duration-300">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <span class="material-symbols-outlined text-slate-500" style="font-variation-settings: 'FILL' 1" data-icon="workspace_premium">workspace_premium</span>
                </div>
                <div class="w-24 h-24 rounded-full border-4 border-slate-100 p-1 mb-4 overflow-hidden">
                  <img :src="avatarSrc(top3[1])" alt="Avatar" class="w-full h-full object-cover rounded-full" />
                </div>
                <h3 class="text-xl font-bold mb-1">{{ top3[1].name }}</h3>
                <p class="text-on-surface-variant text-sm mb-4">战力 {{ top3[1].combat_power }}</p>
                <div class="flex gap-4 w-full">
                  <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
                    <p class="text-xs text-on-surface-variant">积分</p>
                    <p class="font-bold text-primary">{{ top3[1].points }}</p>
                  </div>
                  <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
                    <p class="text-xs text-on-surface-variant">正确率</p>
                    <p class="font-bold text-secondary">{{ Number(top3[1].accuracy || 0).toFixed(1) }}%</p>
                  </div>
                </div>
              </div>

              <!-- #1 -->
              <div v-if="top3[0]" class="bg-gradient-to-br from-primary-container to-white p-10 rounded-lg diffused-shadow flex flex-col items-center relative transform -translate-y-4 transition-transform hover:scale-[1.05] duration-300 z-10 border border-white/50">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-tertiary-container w-16 h-16 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                  <span class="material-symbols-outlined text-white text-3xl" style="font-variation-settings: 'FILL' 1" data-icon="stars">stars</span>
                </div>
                <div class="w-32 h-32 rounded-full border-4 border-tertiary-container p-1 mb-6 overflow-hidden bg-white">
                  <img :src="avatarSrc(top3[0])" alt="Avatar" class="w-full h-full object-cover rounded-full" />
                </div>
                <h3 class="text-2xl font-extrabold mb-1">{{ top3[0].name }}</h3>
                <p class="text-primary font-semibold mb-6 flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm" data-icon="bolt">bolt</span>
                  学习先锋
                </p>
                <div class="flex gap-6 w-full">
                  <div class="flex-1 bg-white/60 backdrop-blur-sm p-4 rounded-3xl text-center shadow-sm">
                    <p class="text-xs text-on-surface-variant">积分</p>
                    <p class="text-xl font-black text-primary">{{ top3[0].points }}</p>
                  </div>
                  <div class="flex-1 bg-white/60 backdrop-blur-sm p-4 rounded-3xl text-center shadow-sm">
                    <p class="text-xs text-on-surface-variant">正确率</p>
                    <p class="text-xl font-black text-primary">{{ Number(top3[0].accuracy || 0).toFixed(1) }}%</p>
                  </div>
                </div>
              </div>

              <!-- #3 -->
              <div v-if="top3[2]" class="bg-surface-container-lowest p-8 rounded-lg diffused-shadow flex flex-col items-center relative transition-transform hover:scale-[1.03] duration-300">
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1" data-icon="military_tech">military_tech</span>
                </div>
                <div class="w-24 h-24 rounded-full border-4 border-orange-100 p-1 mb-4 overflow-hidden">
                  <img :src="avatarSrc(top3[2])" alt="Avatar" class="w-full h-full object-cover rounded-full" />
                </div>
                <h3 class="text-xl font-bold mb-1">{{ top3[2].name }}</h3>
                <p class="text-on-surface-variant text-sm mb-4">战力 {{ top3[2].combat_power }}</p>
                <div class="flex gap-4 w-full">
                  <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
                    <p class="text-xs text-on-surface-variant">积分</p>
                    <p class="font-bold text-primary">{{ top3[2].points }}</p>
                  </div>
                  <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
                    <p class="text-xs text-on-surface-variant">正确率</p>
                    <p class="font-bold text-secondary">{{ Number(top3[2].accuracy || 0).toFixed(1) }}%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ranking table -->
            <div class="bg-surface-container-lowest rounded-lg overflow-hidden diffused-shadow">
              <div class="p-6 border-b border-surface-container-low flex justify-between items-center">
                <h2 class="text-xl font-bold text-on-surface">{{ classInfo?.name || '班级' }} - 排名详情</h2>
                <span class="text-sm text-on-surface-variant">共 {{ total }} 人</span>
              </div>

              <!-- Empty -->
              <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
                <span class="material-symbols-outlined text-5xl text-on-surface-variant" data-icon="leaderboard">leaderboard</span>
                <p class="text-on-surface-variant font-medium">该班级暂无学生排名数据</p>
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full text-left">
                  <thead>
                    <tr class="text-on-surface-variant text-sm font-semibold">
                      <th class="px-8 py-5">排名</th>
                      <th class="px-8 py-5">学员</th>
                      <th class="px-8 py-5">等级</th>
                      <th class="px-8 py-5">积分</th>
                      <th class="px-8 py-5">战力</th>
                      <th class="px-8 py-5">正确率</th>
                      <th class="px-8 py-5">连续学习</th>
                      <th class="px-8 py-5">本周学习</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-surface-container-low">
                    <tr
                      v-for="item in items"
                      :key="item.id"
                      class="group hover:bg-primary-container/10 transition-colors"
                    >
                      <td class="px-8 py-5">
                        <span
                          v-if="item.rank <= 3"
                          class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          :class="rankBadgeClass(item.rank)"
                        >{{ item.rank }}</span>
                        <span
                          v-else
                          class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-sm text-on-surface-variant"
                        >{{ item.rank }}</span>
                      </td>
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high shrink-0">
                            <img :src="avatarSrc(item)" alt="Avatar" class="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span class="font-semibold text-on-surface">{{ item.name }}</span>
                            <p v-if="item.signature" class="text-xs text-on-surface-variant mt-0.5">{{ item.signature }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="px-8 py-5"><span class="font-headline font-bold">Lv.{{ item.level }}</span></td>
                      <td class="px-8 py-5 font-headline font-bold">{{ item.points }}</td>
                      <td class="px-8 py-5"><span class="font-bold text-primary">{{ item.combat_power }}</span></td>
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-2">
                          <div class="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                            <div class="bg-secondary h-full rounded-full" :style="{ width: (item.accuracy || 0) + '%' }"></div>
                          </div>
                          <span class="text-sm font-medium">{{ Number(item.accuracy || 0).toFixed(1) }}%</span>
                        </div>
                      </td>
                      <td class="px-8 py-5">
                        <div class="flex items-center gap-1">
                          <span class="material-symbols-outlined text-sm" :class="item.streak_days > 0 ? 'text-orange-400' : 'text-on-surface-variant'" style="font-variation-settings: 'FILL' 1" data-icon="local_fire_department">local_fire_department</span>
                          <span class="font-medium">{{ item.streak_days || 0 }} 天</span>
                        </div>
                      </td>
                      <td class="px-8 py-5">
                        <span class="font-medium">{{ item.weekly_study_hours || 0 }}h</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="p-6 border-t border-surface-container-low flex justify-center items-center gap-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage <= 1"
                  class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  :class="currentPage <= 1 ? 'text-on-surface-variant/40 cursor-not-allowed' : 'text-on-surface hover:bg-surface-container-low cursor-pointer'"
                >
                  <span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
                </button>
                <template v-for="p in visiblePages" :key="p">
                  <span v-if="p === '...'" class="px-2 text-on-surface-variant">...</span>
                  <button
                    v-else
                    @click="goToPage(p)"
                    class="w-10 h-10 rounded-full font-semibold transition-all"
                    :class="p === currentPage ? 'bg-primary text-white shadow-md' : 'text-on-surface hover:bg-surface-container-low'"
                  >{{ p }}</button>
                </template>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage >= totalPages"
                  class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  :class="currentPage >= totalPages ? 'text-on-surface-variant/40 cursor-not-allowed' : 'text-on-surface hover:bg-surface-container-low cursor-pointer'"
                >
                  <span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </template>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { getStoredUser } from '@/services/userService.js'
import { getClassRankings, listClasses } from '@/services/questionService.js'
import { API_BASE } from '@/services/api.js'

const currentUser = getStoredUser()

function resolveAvatarUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${API_BASE.replace(/\/api\/?$/, '')}${url}`
  return url
}

function avatarSrc(item) {
  if (item.avatar_url) return resolveAvatarUrl(item.avatar_url)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || '?')}&background=0891b2&color=fff&bold=true`
}

const loading = ref(true)
const rankingsLoading = ref(false)
const error = ref('')
const classes = ref([])
const selectedClassId = ref(null)
const classInfo = ref(null)
const items = ref([])
const top3 = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const totalPages = ref(0)
const showClassDropdown = ref(false)

const visiblePages = computed(() => {
  const tp = totalPages.value
  const cp = currentPage.value
  if (tp <= 7) return Array.from({ length: tp }, (_, i) => i + 1)
  const pages = []
  if (cp <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(tp)
  } else if (cp >= tp - 3) {
    pages.push(1)
    pages.push('...')
    for (let i = tp - 4; i <= tp; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    for (let i = cp - 1; i <= cp + 1; i++) pages.push(i)
    pages.push('...')
    pages.push(tp)
  }
  return pages
})

function rankBadgeClass(rank) {
  if (rank === 1) return 'bg-amber-100 text-amber-700'
  if (rank === 2) return 'bg-slate-100 text-slate-600'
  if (rank === 3) return 'bg-orange-100 text-orange-700'
  return ''
}

async function selectClass(cls) {
  showClassDropdown.value = false
  selectedClassId.value = cls.id
  classInfo.value = cls
  currentPage.value = 1
  rankingsLoading.value = true
  await fetchClassRankings()
  rankingsLoading.value = false
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchClassRankings()
}

async function fetchClasses() {
  try {
    if (!currentUser?.id) { loading.value = false; return }
    const res = await listClasses({ teacherId: currentUser.id })
    classes.value = res.items || []
    // Auto-select first class
    if (classes.value.length > 0) {
      await selectClass(classes.value[0])
    } else {
      loading.value = false
    }
  } catch {
    error.value = '加载班级列表失败'
    loading.value = false
  }
}

async function fetchClassRankings() {
  try {
    const params = {
      class_id: selectedClassId.value,
      page: String(currentPage.value),
      pageSize: String(pageSize.value),
    }
    const res = await getClassRankings(params)
    items.value = res.items || []
    total.value = res.total || 0
    totalPages.value = res.totalPages || 0
    top3.value = (res.items || []).filter(i => i.rank <= 3)
  } catch (e) {
    error.value = '加载排名数据失败'
  } finally {
    loading.value = false
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  await fetchClasses()
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
}
.diffused-shadow {
  box-shadow: 0 40px 60px -15px rgba(0, 100, 121, 0.08);
}
</style>
