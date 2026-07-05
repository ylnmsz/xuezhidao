<template>
  <div class="flex min-h-screen">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />

    <main class="flex-1 lg:ml-72 p-4 md:p-10 pt-24 md:pt-28 space-y-10">
      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="query_stats">query_stats</span>
        <p class="text-lg text-on-surface-variant font-medium">加载学情数据中...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
        <p class="text-lg text-error font-medium">{{ error }}</p>
        <button @click="fetchData" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
      </div>

      <template v-else>
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-primary">学情分析</h1>
            <p class="text-on-surface-variant mt-1">全面了解班级学习状况与学生表现</p>
          </div>
          <div class="flex gap-4 items-center">
            <!-- Class selector -->
            <div class="relative">
              <div
                @click="showClassDropdown = !showClassDropdown"
                class="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3 diffused-shadow cursor-pointer hover:bg-white transition-all"
              >
                <span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
                <span class="font-semibold text-on-surface">{{ selectedClass?.name || '选择班级' }}</span>
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
          <span class="material-symbols-outlined text-6xl text-on-surface-variant" data-icon="school">school</span>
          <p class="text-xl text-on-surface-variant font-medium">请选择一个班级查看学情</p>
        </div>

        <template v-else>
          <!-- Overview Cards -->
          <section class="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-surface-container-lowest p-6 rounded-xl diffused-shadow border-l-4 border-primary">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
                </div>
                <span class="text-sm font-bold text-on-surface-variant">班级人数</span>
              </div>
              <p class="text-3xl font-black font-headline">{{ analytics.summary.totalStudents }}</p>
            </div>

            <div class="bg-surface-container-lowest p-6 rounded-xl diffused-shadow border-l-4 border-secondary">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-secondary" data-icon="bolt">bolt</span>
                </div>
                <span class="text-sm font-bold text-on-surface-variant">平均战力</span>
              </div>
              <p class="text-3xl font-black font-headline">{{ analytics.summary.avgCombatPower }}</p>
            </div>

            <div class="bg-surface-container-lowest p-6 rounded-xl diffused-shadow border-l-4 border-tertiary">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center">
                  <span class="material-symbols-outlined text-tertiary" data-icon="check_circle">check_circle</span>
                </div>
                <span class="text-sm font-bold text-on-surface-variant">平均正确率</span>
              </div>
              <p class="text-3xl font-black font-headline">{{ analytics.summary.avgAccuracy }}%</p>
            </div>

            <div class="bg-surface-container-lowest p-6 rounded-xl diffused-shadow border-l-4 border-error">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span class="material-symbols-outlined text-orange-500" style="font-variation-settings: 'FILL' 1" data-icon="local_fire_department">local_fire_department</span>
                </div>
                <span class="text-sm font-bold text-on-surface-variant">平均连续学习</span>
              </div>
              <p class="text-3xl font-black font-headline">{{ analytics.summary.avgStreak }} 天</p>
            </div>
          </section>

          <!-- Charts Row -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Score Distribution -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary" data-icon="bar_chart">bar_chart</span>
                正确率分布
              </h3>
              <div class="space-y-4">
                <div v-for="bucket in analytics.distribution" :key="bucket.label" class="flex items-center gap-4">
                  <span class="w-16 text-sm font-bold text-on-surface-variant shrink-0">{{ bucket.label }}分</span>
                  <div class="flex-1 h-7 bg-surface-container-high rounded-full overflow-hidden relative">
                    <div
                      class="h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                      :class="distributionBarClass(bucket)"
                      :style="{ width: distributionPercent(bucket) + '%' }"
                    >
                      <span v-if="distributionPercent(bucket) > 15" class="text-xs font-bold text-white drop-shadow">
                        {{ bucket.count }}人
                      </span>
                    </div>
                  </div>
                  <span v-if="distributionPercent(bucket) <= 15" class="text-xs font-bold text-on-surface-variant w-8 shrink-0">
                    {{ bucket.count }}人
                  </span>
                </div>
              </div>
            </div>

            <!-- Subject Performance -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary" data-icon="auto_graph">auto_graph</span>
                学科表现
              </h3>
              <div v-if="analytics.subjectPerformance.length > 0" class="space-y-5">
                <div v-for="sub in analytics.subjectPerformance" :key="sub.subject" class="group">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm font-bold">{{ sub.subject }}</span>
                    <span class="text-sm font-black" :class="scoreTextColor(Number(sub.avg_score))">{{ sub.avg_score }}分</span>
                  </div>
                  <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-1000"
                      :class="scoreBarClass(Number(sub.avg_score))"
                      :style="{ width: Math.min(Number(sub.avg_score || 0), 100) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
                <span class="material-symbols-outlined text-4xl" data-icon="science">science</span>
                <p class="text-sm">暂无学科数据，布置作业后将自动分析</p>
              </div>
            </div>
          </section>

          <!-- Top & Bottom Performers -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Top Performers -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-500" style="font-variation-settings: 'FILL' 1" data-icon="stars">stars</span>
                优秀学员 Top 5
              </h3>
              <div v-if="analytics.topPerformers.length > 0" class="space-y-4">
                <div
                  v-for="(s, i) in analytics.topPerformers"
                  :key="s.id"
                  class="flex items-center gap-4 p-3 rounded-xl hover:bg-primary-container/10 transition-all"
                >
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    :class="['bg-amber-100', 'text-amber-700']"
                  >{{ i + 1 }}</div>
                  <img :src="avatarSrc(s)" class="w-10 h-10 rounded-full object-cover" alt="" />
                  <div class="flex-1">
                    <p class="font-bold text-sm">{{ s.name }}</p>
                    <p class="text-xs text-on-surface-variant">Lv.{{ s.level }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-primary">{{ s.combat_power }}</p>
                    <p class="text-xs text-on-surface-variant">战力</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-secondary">{{ Number(s.accuracy || 0).toFixed(1) }}%</p>
                    <p class="text-xs text-on-surface-variant">正确率</p>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center py-12 text-on-surface-variant">
                <p class="text-sm">暂无数据</p>
              </div>
            </div>

            <!-- Bottom Performers -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1" data-icon="priority_high">priority_high</span>
                需要关注
              </h3>
              <div v-if="analytics.bottomPerformers.length > 0" class="space-y-4">
                <div
                  v-for="(s, i) in analytics.bottomPerformers"
                  :key="s.id"
                  class="flex items-center gap-4 p-3 rounded-xl hover:bg-error/5 transition-all"
                >
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-error/10 text-error">
                    {{ i + 1 }}
                  </div>
                  <img :src="avatarSrc(s)" class="w-10 h-10 rounded-full object-cover" alt="" />
                  <div class="flex-1">
                    <p class="font-bold text-sm">{{ s.name }}</p>
                    <p class="text-xs text-on-surface-variant">Lv.{{ s.level }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-error">{{ s.combat_power }}</p>
                    <p class="text-xs text-on-surface-variant">战力</p>
                  </div>
                  <div class="text-right">
                    <p class="font-black text-tertiary">{{ Number(s.accuracy || 0).toFixed(1) }}%</p>
                    <p class="text-xs text-on-surface-variant">正确率</p>
                  </div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center py-12 text-on-surface-variant">
                <p class="text-sm">暂无数据</p>
              </div>
            </div>
          </section>

          <!-- Student List Table -->
          <section class="bg-surface-container-lowest rounded-xl overflow-hidden diffused-shadow">
            <div class="p-6 border-b border-surface-container-low flex justify-between items-center">
              <h3 class="font-headline font-bold text-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-primary" data-icon="group">group</span>
                学生表现全部列表
              </h3>
              <div class="relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input
                  v-model="searchQuery"
                  class="pl-9 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/50 text-sm w-48"
                  placeholder="搜索学生..."
                  type="text"
                />
              </div>
            </div>

            <div v-if="filteredStudents.length === 0" class="flex flex-col items-center justify-center py-20 gap-4">
              <span class="material-symbols-outlined text-5xl text-on-surface-variant" data-icon="group_off">group_off</span>
              <p class="text-on-surface-variant font-medium">{{ searchQuery ? '未找到匹配的学生' : '暂无学生数据' }}</p>
            </div>

            <div v-else class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-on-surface-variant text-sm font-semibold">
                    <th class="px-6 py-4 cursor-pointer hover:text-primary transition-colors" @click="toggleSort('combat_power')">
                      <span class="flex items-center gap-1">
                        排名
                        <span class="material-symbols-outlined text-xs">unfold_more</span>
                      </span>
                    </th>
                    <th class="px-6 py-4">学员</th>
                    <th class="px-6 py-4">等级</th>
                    <th class="px-6 py-4 cursor-pointer hover:text-primary transition-colors" @click="toggleSort('combat_power')">
                      <span class="flex items-center gap-1">
                        战力
                        <span class="material-symbols-outlined text-xs">unfold_more</span>
                      </span>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:text-primary transition-colors" @click="toggleSort('accuracy')">
                      <span class="flex items-center gap-1">
                        正确率
                        <span class="material-symbols-outlined text-xs">unfold_more</span>
                      </span>
                    </th>
                    <th class="px-6 py-4 cursor-pointer hover:text-primary transition-colors" @click="toggleSort('streak_days')">
                      <span class="flex items-center gap-1">
                        连续学习
                        <span class="material-symbols-outlined text-xs">unfold_more</span>
                      </span>
                    </th>
                    <th class="px-6 py-4">作业数</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-surface-container-low">
                  <tr
                    v-for="(s, i) in sortedStudents"
                    :key="s.id"
                    class="hover:bg-primary-container/5 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <span
                        class="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                        :class="rankBadgeClass(i + 1)"
                      >{{ i + 1 }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <img :src="avatarSrc(s)" class="w-9 h-9 rounded-full object-cover" alt="" />
                        <span class="font-semibold text-sm">{{ s.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4"><span class="font-bold text-sm">Lv.{{ s.level }}</span></td>
                    <td class="px-6 py-4"><span class="font-bold text-primary">{{ s.combat_power }}</span></td>
                    <td class="px-6 py-4">
                      <span class="font-bold" :class="s.accuracy >= 70 ? 'text-secondary' : 'text-tertiary'">
                        {{ Number(s.accuracy || 0).toFixed(1) }}%
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm" :class="s.streak_days > 0 ? 'text-orange-400' : 'text-on-surface-variant'" style="font-variation-settings: 'FILL' 1" data-icon="local_fire_department">local_fire_department</span>
                        <span class="font-medium text-sm">{{ s.streak_days || 0 }}天</span>
                      </div>
                    </td>
                    <td class="px-6 py-4"><span class="text-sm">{{ s.homework_done || 0 }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Error Topics & Recent Homework -->
          <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Weak areas / Error-prone topics -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-error" style="font-variation-settings: 'FILL' 1" data-icon="warning">warning</span>
                易错知识点
              </h3>
              <div v-if="analytics.errorTopics.length > 0" class="space-y-4">
                <div
                  v-for="topic in analytics.errorTopics"
                  :key="topic.content + topic.subject"
                  class="flex items-center gap-3 p-3 rounded-xl bg-error/5 border border-error/10"
                >
                  <div class="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                    <span class="font-black text-error text-sm">{{ topic.error_count }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-bold truncate" v-html="renderStem(topic.content)"></p>
                    <p class="text-xs text-on-surface-variant">{{ topic.subject }}</p>
                  </div>
                  <div class="text-xs font-bold text-error shrink-0">{{ topic.error_count }}次</div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
                <span class="material-symbols-outlined text-4xl" data-icon="check_circle">check_circle</span>
                <p class="text-sm">暂无易错题数据</p>
              </div>
            </div>

            <!-- Recent homework -->
            <div class="bg-surface-container-lowest rounded-xl p-8 diffused-shadow">
              <h3 class="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary" data-icon="history_edu">history_edu</span>
                最近作业统计
              </h3>
              <div v-if="analytics.assignments.recent.length > 0" class="space-y-4">
                <div
                  v-for="hw in analytics.assignments.recent"
                  :key="hw.id"
                  class="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-low transition-all"
                >
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm truncate">{{ hw.title }}</p>
                    <p class="text-xs text-on-surface-variant">{{ hw.submission_count }} 人提交</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="font-black" :class="hw.avg_score ? scoreTextColor(Number(hw.avg_score)) : 'text-on-surface-variant'">
                      {{ hw.avg_score || '--' }}
                    </p>
                    <p class="text-xs text-on-surface-variant">{{ hw.avg_score ? '均分' : '未批改' }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-2">
                <span class="material-symbols-outlined text-4xl" data-icon="library_books">library_books</span>
                <p class="text-sm">暂无作业数据</p>
              </div>
            </div>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { listClasses, getClassAnalytics } from '@/services/questionService.js'
import { getMe } from '@/services/userService.js'
import { API_BASE } from '@/services/api.js'
import { renderMathWithHtml } from '@/utils/renderMath.js'

const loading = ref(true)
const error = ref('')
const classes = ref([])
const selectedClassId = ref(null)
const selectedClass = ref(null)
const showClassDropdown = ref(false)
const searchQuery = ref('')
const sortField = ref('combat_power')
const sortDir = ref('desc')

const analytics = ref({
  classInfo: null,
  summary: { totalStudents: 0, avgCombatPower: 0, avgAccuracy: '0.0', avgStreak: 0 },
  distribution: [],
  topPerformers: [],
  bottomPerformers: [],
  subjectPerformance: [],
  errorTopics: [],
  assignments: { total: 0, published: 0, recent: [] },
  students: [],
})

const maxDistributionCount = computed(() => {
  const counts = analytics.value.distribution.map(b => b.count)
  return Math.max(...counts, 1)
})

function distributionPercent(bucket) {
  return (bucket.count / maxDistributionCount.value) * 100
}

function distributionBarClass(bucket) {
  if (bucket.label === '90-100') return 'bg-gradient-to-r from-secondary to-secondary-fixed-dim'
  if (bucket.label === '80-89') return 'bg-gradient-to-r from-primary to-primary-fixed-dim'
  if (bucket.label === '70-79') return 'bg-gradient-to-r from-tertiary to-tertiary-fixed-dim'
  if (bucket.label === '60-69') return 'bg-gradient-to-r from-orange-400 to-orange-500'
  return 'bg-gradient-to-r from-error to-error-dim'
}

function getStemFromContent(content) {
  if (!content) return ''
  try {
    const parsed = JSON.parse(content)
    if (parsed.stem) return parsed.stem
    if (parsed.passage) return parsed.passage
    return ''
  } catch {
    // 纯文本回退：按选项标记截取
    const match = content.match(/(?:^|\n)\s*[A-Za-z][.、)）]\s*/)
    if (match) return content.slice(0, match.index).trim()
    return content.trim()
  }
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

function convertImagePlaceholders(text) {
  if (!text) return ''
  return text.replace(/\[img:([^\]]+)\]/g, (_, url) => {
    const resolved = resolveImageUrl(url.trim())
    return `<img src="${resolved}" alt="题目图片" class="max-w-full h-auto rounded-lg my-1" />`
  })
}

function renderStem(content) {
  const stem = getStemFromContent(content)
  return renderMathWithHtml(convertImagePlaceholders(stem))
}

function scoreTextColor(score) {
  if (score >= 80) return 'text-secondary'
  if (score >= 60) return 'text-primary'
  if (score >= 40) return 'text-tertiary'
  return 'text-error'
}

function scoreBarClass(score) {
  if (score >= 80) return 'bg-gradient-to-r from-secondary to-secondary-fixed-dim'
  if (score >= 60) return 'bg-gradient-to-r from-primary to-primary-fixed-dim'
  if (score >= 40) return 'bg-gradient-to-r from-tertiary to-tertiary-fixed-dim'
  return 'bg-gradient-to-r from-error to-error-dim'
}

function rankBadgeClass(rank) {
  if (rank === 1) return 'bg-amber-100 text-amber-700'
  if (rank === 2) return 'bg-slate-100 text-slate-600'
  if (rank === 3) return 'bg-orange-100 text-orange-700'
  return 'bg-surface-container text-on-surface-variant'
}

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

const filteredStudents = computed(() => {
  let list = analytics.value.students
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => s.name.toLowerCase().includes(q))
  }
  return list
})

const sortedStudents = computed(() => {
  const list = [...filteredStudents.value]
  const dir = sortDir.value === 'asc' ? 1 : -1
  list.sort((a, b) => {
    const va = Number(a[sortField.value] || 0)
    const vb = Number(b[sortField.value] || 0)
    return (va - vb) * dir
  })
  return list
})

function toggleSort(field) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortField.value = field
    sortDir.value = 'desc'
  }
}

async function selectClass(cls) {
  showClassDropdown.value = false
  selectedClassId.value = cls.id
  selectedClass.value = cls
  await fetchAnalytics()
}

async function fetchAnalytics() {
  if (!selectedClassId.value) return
  try {
    const data = await getClassAnalytics(selectedClassId.value)
    analytics.value = data
  } catch (e) {
    error.value = '加载学情数据失败'
  } finally {
    loading.value = false
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const user = await getMe()
    const data = await listClasses({ teacherId: user.id })
    classes.value = data.items || []

    if (classes.value.length > 0) {
      await selectClass(classes.value[0])
    } else {
      loading.value = false
    }
  } catch (e) {
    error.value = '加载班级列表失败'
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
}
.diffused-shadow {
  box-shadow: 0 40px 60px -15px rgba(0, 100, 121, 0.08);
}
</style>
