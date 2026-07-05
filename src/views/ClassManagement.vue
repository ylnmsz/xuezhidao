<template>
  <div class="flex min-h-screen">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />

    <main class="flex-1 lg:ml-72 p-4 md:p-10 pt-24 md:pt-28 space-y-10">
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="school">school</span>
        <p class="text-lg text-on-surface-variant font-medium">加载班级数据中...</p>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-error" style="font-variation-settings: 'FILL' 1" data-icon="error">error</span>
        <p class="text-lg text-error font-medium">{{ error }}</p>
        <button @click="fetchAll" class="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all">重新加载</button>
      </div>

      <div v-else class="space-y-12">
        <!-- Class Grid -->
        <section v-if="classes.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main class card -->
          <div
            v-for="(cls, index) in classes.slice(0, 1)"
            :key="cls.id"
            class="lg:col-span-2 relative group overflow-hidden bg-gradient-to-br from-primary-container/40 to-secondary-container/30 p-8 rounded-xl border border-outline-variant/15 hover:shadow-2xl transition-all duration-500"
          >
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex justify-between items-start">
                <div>
                  <span
                    class="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary mb-3 inline-block"
                  >{{ classStats[cls.id]?.grade || '班级' }}</span>
                  <h3 class="text-3xl font-black font-headline text-on-primary-container">
                    {{ cls.name }}
                  </h3>
                  <p class="text-on-surface-variant mt-2">{{ classStats[cls.id]?.studentCount || 0 }} 名学生</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="bg-white/60 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-on-surface">
                    {{ classStats[cls.id]?.studentCount || 0 }} 人
                  </span>
                </div>
              </div>
              <div class="mt-8 grid grid-cols-2 gap-6">
                <div class="bg-white/40 backdrop-blur-lg rounded-lg p-5 border border-white/40">
                  <p class="text-xs font-bold text-on-surface-variant/60 uppercase">平均战力</p>
                  <div class="flex items-end justify-between mt-2">
                    <span class="text-4xl font-black text-on-surface">{{ classStats[cls.id]?.avgCombatPower || '-' }}</span>
                  </div>
                </div>
                <div class="bg-white/40 backdrop-blur-lg rounded-lg p-5 border border-white/40">
                  <p class="text-xs font-bold text-on-surface-variant/60 uppercase">平均正确率</p>
                  <div class="flex items-end justify-between mt-2">
                    <span class="text-4xl font-black text-on-surface">{{ classStats[cls.id]?.avgAccuracy || '-' }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
          </div>

          <!-- Stats sidebar -->
          <div class="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between relative overflow-hidden group">
            <div>
              <h4 class="text-xl font-bold font-headline mb-6">班级概况</h4>
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined">groups</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold">{{ totalStudents }} 名学生</p>
                    <p class="text-xs text-on-surface-variant">共 {{ classes.length }} 个班级</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <span class="material-symbols-outlined">auto_graph</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold">全校平均战力 {{ globalAvgCombat || '-' }}</p>
                    <p class="text-xs text-on-surface-variant">平均正确率 {{ globalAvgAccuracy || '-' }}%</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="mt-8 w-full py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
              @click="$router.push('/teacherrankings')"
            >
              查看全班排名
            </button>
          </div>
        </section>

        <!-- Empty state -->
        <section v-if="classes.length === 0" class="flex flex-col items-center justify-center py-20 gap-6">
          <span class="material-symbols-outlined text-6xl text-on-surface-variant" data-icon="school">school</span>
          <h3 class="text-xl font-bold text-on-surface">还没有创建班级</h3>
          <p class="text-on-surface-variant">点击"创建班级"按钮开始吧</p>
        </section>

        <!-- Student Roster -->
        <section v-if="classes.length > 0" class="space-y-6">
          <div class="flex justify-between items-center px-2">
            <div class="flex items-center gap-4 flex-wrap">
              <label class="text-sm text-on-surface-variant">选择班级：</label>
              <div class="relative">
                <select
                  v-model="selectedClassId"
                  @change="onClassChange"
                  class="py-2 pl-3 pr-10 rounded-full border bg-white/60 appearance-none cursor-pointer"
                >
                  <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }} ({{ classStats[c.id]?.studentCount || 0 }}人)</option>
                </select>
                <svg
                  class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M7 10l5 5 5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <button
                class="ml-4 px-4 py-2 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all"
                @click="openCreateModal"
              >
                创建班级
              </button>
              <button
                class="px-4 py-2 rounded-full bg-secondary-container text-on-secondary-container font-bold hover:scale-105 transition-all flex items-center gap-1"
                @click="openInviteModal"
              >
                <span class="material-symbols-outlined text-sm">link</span>
                邀请码
              </button>
            </div>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                v-model="searchQuery"
                class="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/50 w-64 text-sm"
                placeholder="搜索学生姓名..."
                type="text"
              />
            </div>
          </div>

          <!-- Loading students -->
          <div v-if="studentsLoading" class="bg-surface-container-lowest rounded-lg border border-outline-variant/10 shadow-sm p-20 flex justify-center">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary animate-spin" data-icon="sync">sync</span>
              <span class="text-on-surface-variant">加载学生数据...</span>
            </div>
          </div>

          <!-- Student list -->
          <div v-else class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm">
            <div class="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
              <div class="col-span-4">基本信息</div>
              <div class="col-span-2">等级荣誉</div>
              <div class="col-span-3">学习进度</div>
              <div class="col-span-3 text-right">操作</div>
            </div>

            <!-- Empty -->
            <div v-if="filteredStudents.length === 0" class="py-20 text-center text-on-surface-variant">
              {{ searchQuery ? '未找到匹配的学生' : '该班级暂无学生' }}
            </div>

            <!-- Student rows -->
            <div
              v-for="s in filteredStudents"
              :key="s.user_id"
              class="grid grid-cols-12 gap-4 px-8 py-6 items-center border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-all"
            >
              <div class="col-span-4 flex items-center gap-4">
                <div class="relative">
                  <img
                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    :src="avatarSrc(s)"
                    alt="Avatar"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full"
                    :class="s.combat_power > 500 ? 'bg-green-500' : 'bg-slate-300'"
                  ></div>
                </div>
                <div>
                  <p class="font-bold text-on-surface">{{ s.name }}</p>
                  <p class="text-xs text-on-surface-variant">{{ s.email || '无邮箱' }}</p>
                </div>
              </div>
              <div class="col-span-2">
                <span
                  class="text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  :class="levelBadgeClass(s.level)"
                >Lv.{{ s.level }} {{ levelTitle(s.level) }}</span>
              </div>
              <div class="col-span-3">
                <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :class="accuracyBarClass(s.accuracy)"
                    :style="{ width: Math.min(s.accuracy || 0, 100) + '%' }"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-[10px] font-bold text-on-surface-variant">
                    战力 {{ s.combat_power || 0 }}
                  </span>
                  <span class="text-[10px] font-bold" :class="s.accuracy >= 70 ? 'text-secondary' : 'text-tertiary'">
                    {{ Number(s.accuracy || 0).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="col-span-3 flex justify-end gap-3">
                <button
                  @click="openChat(s)"
                  class="px-4 py-2 rounded-full bg-white border border-outline-variant text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm">chat_bubble</span>
                  私信
                </button>
                <button
                  @click="viewStudentDetail(s)"
                  class="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:scale-105 transition-all flex items-center gap-1"
                >
                  <span class="material-symbols-outlined text-sm">analytics</span>
                  详情
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- Create Class Modal -->
  <div
    v-if="showCreateModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl w-96 p-6 shadow-2xl relative z-[10000]">
      <button
        @click="closeModal"
        class="absolute right-3 top-3 w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-on-surface">close</span>
      </button>
      <h4 class="text-lg font-bold mb-3">创建新班级</h4>
      <p class="text-sm text-on-surface-variant mb-2">请输入班级名称，创建后会生成邀请码</p>
      <input
        v-model="newClassName"
        placeholder="班级名称"
        class="w-full px-3 py-2 border rounded mb-3"
      />
      <div class="flex justify-end items-center gap-3">
        <button class="px-3 py-2 rounded text-on-surface-variant bg-transparent border" @click="closeModal">取消</button>
        <button class="px-4 py-2 rounded bg-primary text-white" @click="createNewClass">创建并生成邀请码</button>
      </div>
      <div v-if="inviteCode" class="mt-4">
        <p class="text-sm text-on-surface-variant mb-2">邀请码（学生使用后可加入班级）：</p>
        <div class="mt-2 flex items-center gap-3">
          <div class="px-3 py-2 bg-surface-container rounded-full text-lg font-bold tracking-wider">{{ inviteCode }}</div>
          <button class="px-3 py-1 rounded-full bg-emerald-600 text-white" @click="copyInvite">
            {{ showCopied ? '已复制' : '复制' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Invite Code Modal -->
  <div
    v-if="showInviteModal"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
    @click.self="closeInviteModal"
  >
    <div class="bg-white rounded-2xl w-96 p-6 shadow-2xl relative z-[10000]">
      <button
        @click="closeInviteModal"
        class="absolute right-3 top-3 w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-on-surface">close</span>
      </button>
      <h4 class="text-lg font-bold mb-3">生成邀请码</h4>
      <p class="text-sm text-on-surface-variant mb-4">选择班级和有效期，生成后学生可凭邀请码加入班级</p>

      <label class="text-sm font-semibold text-on-surface mb-1 block">选择班级</label>
      <select
        v-model="inviteModalClassId"
        class="w-full px-3 py-2 border rounded mb-4 bg-white"
      >
        <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>

      <label class="text-sm font-semibold text-on-surface mb-1 block">有效期限</label>
      <div class="grid grid-cols-3 gap-2 mb-4">
        <button
          v-for="opt in expireOptions"
          :key="opt.value"
          @click="inviteExpireDays = opt.value"
          class="px-3 py-2 rounded-lg text-sm font-semibold border transition-all"
          :class="inviteExpireDays === opt.value ? 'bg-primary text-white border-primary' : 'bg-surface-container text-on-surface border-outline-variant hover:border-primary'"
        >{{ opt.label }}</button>
      </div>

      <div v-if="generatedInviteCode" class="mt-4 bg-surface-container-low rounded-xl p-4">
        <p class="text-sm text-on-surface-variant mb-2 text-center">邀请码</p>
        <div class="text-center">
          <div class="inline-block px-6 py-3 bg-white rounded-full text-2xl font-black tracking-[0.3em] text-primary select-all">
            {{ generatedInviteCode }}
          </div>
        </div>
        <p class="text-xs text-on-surface-variant text-center mt-2" v-if="generatedExpiresAt">
          有效期至: {{ generatedExpiresAt }}
        </p>
        <div class="flex justify-center gap-3 mt-4">
          <button
            class="px-5 py-2 rounded-full bg-primary text-white font-bold hover:scale-105 transition-all flex items-center gap-1"
            @click="copyGeneratedInvite"
          >
            <span class="material-symbols-outlined text-sm">content_copy</span>
            {{ inviteCopied ? '已复制' : '复制邀请码' }}
          </button>
          <button
            class="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-bold hover:scale-105 transition-all"
            @click="generateInviteCode"
          >
            重新生成
          </button>
        </div>
      </div>

      <div v-else class="flex justify-end gap-3 mt-2">
        <button class="px-4 py-2 rounded text-on-surface-variant bg-transparent border" @click="closeInviteModal">取消</button>
        <button class="px-5 py-2 rounded-full bg-primary text-white font-bold" @click="generateInviteCode">生成邀请码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'

const router = useRouter()
import { listClasses, createClass, createClassInvite, listClassMembers, getRankingSummary } from '@/services/questionService.js'
import { getMe } from '@/services/userService.js'
import { API_BASE } from '@/services/api.js'

const loading = ref(true)
const error = ref('')
const classes = ref([])
const selectedClassId = ref(null)
const classStats = ref({})
const globalAvgCombat = ref(null)
const globalAvgAccuracy = ref(null)
const totalStudents = ref(0)

const studentsLoading = ref(false)
const students = ref([])
const searchQuery = ref('')

const showCreateModal = ref(false)
const newClassName = ref('')
const inviteCode = ref('')
const showCopied = ref(false)

// Invite code modal
const showInviteModal = ref(false)
const inviteModalClassId = ref('')
const inviteExpireDays = ref(7)
const generatedInviteCode = ref('')
const generatedExpiresAt = ref('')
const inviteCopied = ref(false)

const expireOptions = [
  { label: '1天', value: 1 },
  { label: '3天', value: 3 },
  { label: '7天', value: 7 },
  { label: '14天', value: 14 },
  { label: '30天', value: 30 },
]

// Helper functions (same pattern as rankings pages)
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

function levelTitle(level) {
  if (level >= 18) return '学神'
  if (level >= 14) return '学霸'
  if (level >= 10) return '知识先锋'
  if (level >= 7) return '努力小天才'
  if (level >= 4) return '进取少年'
  return '勤奋学员'
}

function levelBadgeClass(level) {
  if (level >= 14) return 'bg-tertiary-container/20 text-tertiary-dim'
  if (level >= 10) return 'bg-secondary-container/20 text-on-secondary-container'
  if (level >= 7) return 'bg-primary-container/20 text-on-primary-container'
  if (level >= 4) return 'bg-surface-container-high text-on-surface'
  return 'bg-surface-container text-on-surface-variant'
}

function accuracyBarClass(accuracy) {
  if (accuracy >= 85) return 'bg-gradient-to-r from-secondary-fixed-dim to-secondary'
  if (accuracy >= 60) return 'bg-gradient-to-r from-tertiary/70 to-tertiary'
  return 'bg-gradient-to-r from-error/50 to-error'
}

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value
  const q = searchQuery.value.toLowerCase()
  return students.value.filter(s => s.name.toLowerCase().includes(q))
})

async function fetchClassStudents() {
  if (!selectedClassId.value) return
  studentsLoading.value = true
  try {
    const res = await listClassMembers({ classId: selectedClassId.value, expand: 'user' })
    students.value = res.items || []
  } catch {
    students.value = []
  } finally {
    studentsLoading.value = false
  }
}

function viewStudentDetail(student) {
  router.push(`/messages?userId=${student.user_id}`)
}

async function computeClassStats() {
  const stats = {}
  let allCombat = 0
  let allAccuracy = 0
  let studentCount = 0

  const results = await Promise.all(
    classes.value.map(cls =>
      listClassMembers({ classId: cls.id, expand: 'user' })
        .then(res => ({ clsId: cls.id, data: res }))
        .catch(() => ({ clsId: cls.id, data: null }))
    )
  )

  for (const { clsId, data } of results) {
    const classStudents = data?.items || []
    const totalPower = classStudents.reduce((sum, s) => sum + Number(s.combat_power || 0), 0)
    const totalAcc = classStudents.reduce((sum, s) => sum + Number(s.accuracy || 0), 0)
    const count = classStudents.length

    stats[clsId] = {
      studentCount: count,
      avgCombatPower: count > 0 ? Math.round(totalPower / count) : '-',
      avgAccuracy: count > 0 ? (totalAcc / count).toFixed(1) : '-',
    }

    allCombat += totalPower
    allAccuracy += totalAcc
    studentCount += count
  }

  classStats.value = stats
  if (studentCount > 0) {
    globalAvgCombat.value = Math.round(allCombat / studentCount)
    globalAvgAccuracy.value = (allAccuracy / studentCount).toFixed(1)
  }
}

async function fetchAll() {
  loading.value = true
  error.value = ''
  try {
    const user = await getMe()
    const data = await listClasses({ teacherId: user.id })
    classes.value = data.items || []

    // Fetch global summary
    try {
      const summary = await getRankingSummary()
      totalStudents.value = summary.totalStudents || 0
    } catch { /* ignore */ }

    if (classes.value.length > 0) {
      selectedClassId.value = classes.value[0].id
      await computeClassStats()
      await fetchClassStudents()
    }
  } catch (e) {
    error.value = '加载班级数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

function onClassChange() {
  fetchClassStudents()
}

const openCreateModal = () => {
  newClassName.value = ''
  inviteCode.value = ''
  showCreateModal.value = true
}

const createNewClass = async () => {
  if (!newClassName.value) return alert('请输入班级名称')
  try {
    const user = await getMe()
    const created = await createClass({ name: newClassName.value, teacher_id: user.id })
    await fetchAll()
    selectedClassId.value = created.id
    const invite = await createClassInvite(created.id, {
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    inviteCode.value = invite.code
  } catch (err) {
    alert(err.message || '创建失败')
  }
}

const closeModal = () => {
  showCreateModal.value = false
  inviteCode.value = ''
  showCopied.value = false
}

const copyInvite = async () => {
  if (!inviteCode.value) return
  try {
    await navigator.clipboard.writeText(inviteCode.value)
    showCopied.value = true
    setTimeout(() => (showCopied.value = false), 2000)
  } catch {
    alert('复制失败，请手动复制')
  }
}

function openInviteModal() {
  if (classes.value.length === 0) return alert('请先创建班级')
  inviteModalClassId.value = selectedClassId.value || classes.value[0].id
  inviteExpireDays.value = 7
  generatedInviteCode.value = ''
  generatedExpiresAt.value = ''
  inviteCopied.value = false
  showInviteModal.value = true
}

async function generateInviteCode() {
  if (!inviteModalClassId.value) return alert('请选择班级')
  try {
    const expiresAt = new Date(Date.now() + inviteExpireDays.value * 24 * 60 * 60 * 1000).toISOString()
    const invite = await createClassInvite(inviteModalClassId.value, { expiresAt })
    generatedInviteCode.value = invite.code
    generatedExpiresAt.value = new Date(invite.expires_at).toLocaleString('zh-CN')
  } catch (err) {
    alert(err.message || '生成失败')
  }
}

function closeInviteModal() {
  showInviteModal.value = false
  inviteCopied.value = false
}

function openChat(student) {
  router.push(`/messages?userId=${student.user_id}`)
}

async function copyGeneratedInvite() {
  if (!generatedInviteCode.value) return
  try {
    await navigator.clipboard.writeText(generatedInviteCode.value)
    inviteCopied.value = true
    setTimeout(() => (inviteCopied.value = false), 2000)
  } catch {
    alert('复制失败，请手动复制')
  }
}

onMounted(fetchAll)
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
