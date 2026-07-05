<template>
  <StudentTopNavbar />
  <StudentSidebar />

  <main class="lg:ml-72 p-4 pt-24 md:p-8 md:pt-28 min-h-screen bg-[#f7f6f1]">
    <div class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-black font-headline">我的班级</h1>
          <p class="text-on-surface-variant mt-1">在这里查看你加入的所有课程与最新进展。</p>
        </div>
        <button
          @click="openModal"
          class="bg-[#00B4D8] text-white px-6 py-3 rounded-full shadow-md flex items-center gap-2 hover:bg-[#0098b8] transition-all duration-300 font-semibold"
        >
          <span class="material-symbols-outlined">add</span>
          加入新班级
        </button>
      </div>

      <!-- Stats Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#00B4D8]/10 flex items-center justify-center text-[#00B4D8]">
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1">group</span>
          </div>
          <div>
            <p class="text-2xl font-black">{{ classesList.length }}</p>
            <p class="text-sm text-on-surface-variant font-medium">已加入班级</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#fe9d00]/10 flex items-center justify-center text-[#fe9d00]">
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1">assignment</span>
          </div>
          <div>
            <p class="text-2xl font-black">{{ totalPendingTasks }}</p>
            <p class="text-sm text-on-surface-variant font-medium">待完成作业</p>
          </div>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-outline-variant/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#8bfe32]/20 flex items-center justify-center text-green-700">
            <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1">notifications</span>
          </div>
          <div>
            <p class="text-2xl font-black">{{ totalUnreadNotices }}</p>
            <p class="text-sm text-on-surface-variant font-medium">未读通知</p>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-6">
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined">search</span>
        <input
          v-model="searchQuery"
          placeholder="搜索班级名称…"
          class="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] transition-all"
        />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="py-20 text-center">
        <div class="animate-spin w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-on-surface-variant">加载中…</p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Empty State -->
        <div v-if="filteredClasses.length === 0 && searchQuery" class="py-20 text-center">
          <span class="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
          <p class="text-xl font-semibold mb-2">没有找到匹配的班级</p>
          <p class="text-on-surface-variant mb-6">试试其他关键词？</p>
          <button
            class="text-[#00B4D8] font-semibold hover:underline"
            @click="searchQuery = ''"
          >清除搜索</button>
        </div>

        <div v-else-if="filteredClasses.length === 0" class="py-20 text-center">
          <div class="w-24 h-24 rounded-full bg-[#00B4D8]/10 flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-5xl text-[#00B4D8]" style="font-variation-settings: 'FILL' 1">school</span>
          </div>
          <p class="text-xl font-semibold mb-2">你还未加入任何班级</p>
          <p class="text-on-surface-variant mb-6 max-w-md mx-auto">
            可以使用教师提供的邀请码加入班级，点击右上角的「加入新班级」按钮开始吧！
          </p>
          <button
            @click="openModal"
            class="bg-[#00B4D8] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#0098b8] transition-all"
          >
            加入班级
          </button>
        </div>

        <!-- Class Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
            v-for="c in filteredClasses"
            :key="c.id"
            class="bg-white rounded-2xl shadow-sm border border-outline-variant/10 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <!-- Card Top Accent -->
            <div class="h-2 bg-gradient-to-r from-[#00B4D8] to-[#40cef3]"></div>

            <div class="p-6">
              <!-- Header: Badge + Name -->
              <div class="flex items-start gap-4 mb-4">
                <div
                  class="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#006479] flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0"
                >
                  {{ getBadge(c.name) }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-lg truncate group-hover:text-[#00B4D8] transition-colors">{{ c.name }}</p>
                  <p class="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">person</span>
                    教师：{{ c.teacherName || '——' }}
                  </p>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2 mb-4">
                <span class="inline-flex items-center gap-1 text-xs bg-[#00B4D8]/10 text-[#006479] px-3 py-1 rounded-full font-medium">
                  <span class="material-symbols-outlined text-[14px]">person</span>
                  {{ c.memberCount || '-' }} 名成员
                </span>
                <span class="inline-flex items-center gap-1 text-xs bg-[#fe9d00]/10 text-[#b86e00] px-3 py-1 rounded-full font-medium">
                  <span class="material-symbols-outlined text-[14px]">event_note</span>
                  活跃中
                </span>
              </div>

              <!-- Recent Activity Preview -->
              <div class="bg-[#f7f6f1] rounded-xl p-3 mb-4">
                <p class="text-xs font-semibold text-on-surface-variant mb-2 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">history</span>
                  最近动态
                </p>
                <p class="text-sm text-on-surface-variant/80">
                  {{ c.lastActivity || '暂无最新动态' }}
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button
                  class="flex-1 px-4 py-2.5 rounded-full border border-[#00B4D8] text-[#00B4D8] font-semibold hover:bg-[#00B4D8] hover:text-white transition-all duration-300 text-sm"
                  @click="viewClassDetail(c)"
                >
                  查看详情
                </button>
                <button
                  class="flex-1 px-4 py-2.5 rounded-full bg-[#00B4D8] text-white font-semibold hover:bg-[#0098b8] transition-all duration-300 text-sm disabled:opacity-50"
                  :disabled="c.joined"
                  @click="openJoin(c)"
                >
                  {{ c.joined ? '已加入' : '加入' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Join Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-11/12 max-w-lg p-8 z-10">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-xl font-bold font-headline">加入新班级</h3>
            <p class="text-sm text-on-surface-variant mt-1">输入老师提供的邀请码加入班级</p>
          </div>
          <button
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            @click="closeModal"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <input
            ref="inviteInput"
            v-model="inviteCode"
            @keyup.enter="joinByCode"
            placeholder="请输入邀请码"
            class="flex-1 px-5 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/30 focus:border-[#00B4D8] transition-all"
          />
          <button
            class="px-6 py-3 rounded-xl bg-[#00B4D8] text-white font-semibold disabled:opacity-60 hover:bg-[#0098b8] transition-all"
            :disabled="joining || !inviteCode.trim()"
            @click="joinByCode"
          >
            {{ joining ? '加入中…' : '加入' }}
          </button>
        </div>
        <p
          v-if="joinMessage"
          class="mt-4 text-sm flex items-center gap-1"
          :class="joinError ? 'text-red-600' : 'text-green-600'"
        >
          <span class="material-symbols-outlined text-[16px]">{{ joinError ? 'error' : 'check_circle' }}</span>
          {{ joinMessage }}
        </p>
      </div>
    </div>

    <!-- Class Detail Drawer -->
    <div v-if="showDetail" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDetail"></div>
      <div class="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 class="text-lg font-bold font-headline">班级详情</h3>
          <button
            class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            @click="closeDetail"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div v-if="detailClass" class="p-6">
          <!-- Class Info -->
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00B4D8] to-[#006479] flex items-center justify-center text-white text-2xl font-bold shadow-md"
            >
              {{ getBadge(detailClass.name) }}
            </div>
            <div>
              <p class="text-xl font-bold">{{ detailClass.name }}</p>
              <p class="text-sm text-on-surface-variant">教师：{{ detailClass.teacherName || '——' }}</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-[#f7f6f1] rounded-xl p-4 text-center">
              <p class="text-2xl font-black text-[#00B4D8]">{{ detailClass.memberCount || '-' }}</p>
              <p class="text-xs text-on-surface-variant font-medium">班级成员</p>
            </div>
            <div class="bg-[#f7f6f1] rounded-xl p-4 text-center">
              <p class="text-2xl font-black text-[#fe9d00]">{{ detailClass.homeworkCount || '-' }}</p>
              <p class="text-xs text-on-surface-variant font-medium">本周作业</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mb-6">
            <h4 class="font-bold mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#00B4D8]">history</span>
              最近动态
            </h4>
            <div class="space-y-3">
              <div v-if="detailActivities.length === 0" class="text-sm text-on-surface-variant text-center py-4">
                暂无动态
              </div>
              <div
                v-for="(act, idx) in detailActivities"
                :key="idx"
                class="flex items-start gap-3 bg-[#f7f6f1] rounded-xl p-3"
              >
                <div class="w-8 h-8 rounded-full bg-[#00B4D8]/10 flex items-center justify-center text-[#00B4D8] shrink-0">
                  <span class="material-symbols-outlined text-[16px]">{{ act.icon }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium">{{ act.text }}</p>
                  <p class="text-xs text-on-surface-variant mt-0.5">{{ act.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Class Members Preview -->
          <div>
            <h4 class="font-bold mb-3 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#00B4D8]">group</span>
              班级成员
            </h4>
            <div v-if="detailMembers.length === 0" class="text-sm text-on-surface-variant text-center py-4">
              暂无成员信息
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(m, idx) in detailMembers"
                :key="idx"
                class="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f7f6f1] transition-colors"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#00B4D8] to-[#40cef3] flex items-center justify-center text-white text-xs font-bold">
                  {{ m.name ? m.name.charAt(0).toUpperCase() : '?' }}
                </div>
                <span class="text-sm font-medium">{{ m.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import { getStoredUser } from '@/services/userService.js'
import {
  listClassMembers,
  getClassById,
  getUserById,
  joinByInviteCode,
  listAssignments,
  listNotifications,
  listSubmissions,
} from '@/services/questionService.js'

const classesList = ref([])
const loading = ref(true)
const searchQuery = ref('')

const user = getStoredUser()

// 轮询间隔（毫秒）
const POLL_INTERVAL = 30000
let pollTimer = null
let isFetching = false

// Real-time backend data store
const assignmentsByClass = ref({})   // { classId: [assignment, ...] }
const notifications = ref([])        // current user's notifications
const submissions = ref([])          // current user's submissions

// Stats computed from real backend data
const totalPendingTasks = computed(() => {
  const submittedIds = new Set((submissions.value || []).map(s => s.assignment_id))
  let count = 0
  for (const classId in assignmentsByClass.value) {
    const list = assignmentsByClass.value[classId] || []
    for (const a of list) {
      if (a.status === 'published' && !submittedIds.has(a.id)) {
        count++
      }
    }
  }
  return count
})

const totalUnreadNotices = computed(() => {
  return (notifications.value || []).filter(n => !n.read_at).length
})

// Filtered classes based on search
const filteredClasses = computed(() => {
  if (!searchQuery.value.trim()) return classesList.value
  const q = searchQuery.value.trim().toLowerCase()
  return classesList.value.filter(
    (c) => c.name.toLowerCase().includes(q) || (c.teacherName || '').toLowerCase().includes(q)
  )
})

const timeAgo = (dateStr) => {
  if (!dateStr) return null
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / (1000 * 60))
  if (mins < 1) return '刚刚'
  if (mins < 60) return `${mins} 分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days === 1) return '昨天'
  if (days < 30) return `${days} 天前`
  const months = Math.floor(days / 30)
  return `${months} 个月前`
}

const fetchClasses = async () => {
  if (isFetching) return
  isFetching = true
  loading.value = true
  try {
    if (!user?.id) {
      classesList.value = []
      return
    }

    // 1. Get user's class memberships
    const members = await listClassMembers({ userId: user.id })
    const items = members.items || []
    const uniqClassIds = [...new Set(items.map((it) => it.class_id))]

    // 2. Fetch notifications and submissions for this user in parallel
    const [notifResp, subResp] = await Promise.all([
      listNotifications({ userId: user.id }),
      listSubmissions({ studentId: user.id }),
    ])
    notifications.value = notifResp.items || []
    submissions.value = subResp.items || []

    // 3. Fetch class info + assignments for each class
    const classes = await Promise.all(
      uniqClassIds.map(async (id) => {
        try {
          const [cls, assignResp] = await Promise.all([
            getClassById(id),
            listAssignments({ classId: id }),
          ])
          const teacher = cls.teacher_id ? await getUserById(cls.teacher_id) : null

          const classAssignments = assignResp.items || []
          assignmentsByClass.value[id] = classAssignments

          // Find the latest activity from assignments
          const sorted = [...classAssignments].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
          )
          const latest = sorted[0]
          let lastActivity = '暂无最新动态'
          if (latest) {
            const ago = timeAgo(latest.created_at)
            lastActivity = `${ago}发布了新作业《${latest.title}》`
          }

          const activeAssignments = classAssignments.filter(
            (a) => a.status === 'published',
          ).length

          return {
            id: cls.id,
            name: cls.name,
            teacherName: teacher?.name || '—',
            memberCount: items.filter((m) => m.class_id === id).length,
            joined: true,
            lastActivity,
            homeworkCount: activeAssignments,
          }
        } catch (e) {
          console.error(`Failed to load class ${id}:`, e)
          return {
            id,
            name: '未知班级',
            teacherName: '—',
            memberCount: items.filter((m) => m.class_id === id).length,
            joined: true,
            lastActivity: null,
            homeworkCount: 0,
          }
        }
      }),
    )
    classesList.value = classes
  } catch (e) {
    console.error(e)
    classesList.value = []
  } finally {
    loading.value = false
    isFetching = false
  }
}

const getBadge = (name) => (name ? name.charAt(0).toUpperCase() : 'C')

// Invite code
const inviteCode = ref('')
const joining = ref(false)
const joinMessage = ref('')
const joinError = ref(false)
const showModal = ref(false)
const inviteInput = ref(null)

const openModal = async () => {
  showModal.value = true
  await nextTick()
  inviteInput.value && inviteInput.value.focus && inviteInput.value.focus()
}

const closeModal = () => {
  showModal.value = false
}

const joinByCode = async () => {
  const code = (inviteCode.value || '').trim()
  if (!code) return
  joining.value = true
  joinMessage.value = ''
  joinError.value = false
  try {
    const resp = await joinByInviteCode(code)
    if (resp && resp.status === 201) {
      joinMessage.value = '加入成功，列表已刷新。'
    } else if (resp && resp.status === 200) {
      joinMessage.value = '你已是该班级成员。'
    } else {
      joinMessage.value = '加入成功。'
    }
    inviteCode.value = ''
    await fetchClasses()
    closeModal()
  } catch (err) {
    console.error(err)
    joinError.value = true
    joinMessage.value = (err && err.message) || '加入失败，请检查邀请码是否正确。'
  } finally {
    joining.value = false
  }
}

const openJoin = (c) => {
  inviteCode.value = ''
  joinMessage.value = ''
  openModal()
}

// Detail Drawer
const showDetail = ref(false)
const detailClass = ref(null)
const detailActivities = ref([])
const detailMembers = ref([])

const viewClassDetail = async (c) => {
  detailClass.value = c
  showDetail.value = true

  // Build real activity timeline from assignments + submissions
  const acts = []
  const classAssignments = assignmentsByClass.value[c.id] || []

  for (const a of [...classAssignments].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )) {
    if (a.status === 'published') {
      acts.push({
        icon: 'assignment',
        text: `老师发布了新作业《${a.title}》`,
        time: timeAgo(a.created_at),
      })
    }

    const mySub = (submissions.value || []).find((s) => s.assignment_id === a.id)
    if (mySub && mySub.submitted_at) {
      acts.push({
        icon: 'check_circle',
        text: `你已提交《${a.title}》的作业`,
        time: timeAgo(mySub.submitted_at),
      })
    }
  }

  detailActivities.value = acts.slice(0, 6)

  // Fetch real members with user names
  try {
    const membersResp = await listClassMembers({ classId: c.id })
    if (membersResp && membersResp.items) {
      const memberDetails = await Promise.all(
        membersResp.items.map(async (m) => {
          try {
            const u = await getUserById(m.user_id)
            return { name: u?.name || '同学', role: m.role }
          } catch {
            return { name: '同学', role: m.role }
          }
        }),
      )
      detailMembers.value = memberDetails
    } else {
      detailMembers.value = []
    }
  } catch {
    detailMembers.value = []
  }
}

const closeDetail = () => {
  showDetail.value = false
  detailClass.value = null
}

// Keyboard
const onKeydown = (e) => {
  if (e.key === 'Escape') {
    closeModal()
    closeDetail()
  }
}

onMounted(() => {
  fetchClasses()
  window.addEventListener('keydown', onKeydown)
  // 定时轮询刷新作业和通知
  pollTimer = setInterval(fetchClasses, POLL_INTERVAL)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})
</script>

<style scoped>
/* Breathing glow animation for first card — matching dashboard style */
@keyframes breathing-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 180, 216, 0.1); }
  50% { box-shadow: 0 0 20px 4px rgba(0, 180, 216, 0.15); }
}
.breathing-glow {
  animation: breathing-glow 3s ease-in-out infinite;
}
</style>
