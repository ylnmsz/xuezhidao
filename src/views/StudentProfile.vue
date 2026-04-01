<template>
  <div
    class="bg-background text-on-surface min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container"
  >
    <StudentTopNavbar />
    <StudentSidebar />

    <div
      class="candy-blob w-[500px] h-[500px] bg-primary-container top-[-10%] left-[-10%] rounded-full"
    ></div>
    <div
      class="candy-blob w-[400px] h-[400px] bg-secondary-container bottom-[5%] right-[-5%] rounded-full"
    ></div>
    <div
      class="candy-blob w-[300px] h-[300px] bg-tertiary-container top-[20%] right-[10%] rounded-full opacity-20"
    ></div>

    <main class="pt-24 pb-12 px-6 md:px-8 lg:ml-72 min-h-screen">
      <div class="max-w-6xl mx-auto w-full space-y-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div class="lg:col-span-4 space-y-10">
            <div
              class="bg-surface-container-lowest p-7 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center relative overflow-hidden group"
            >
              <div class="relative mb-6">
                <img
                  :alt="`${displayName}头像`"
                  class="w-32 h-32 rounded-full ring-8 ring-primary-container/20 object-cover shadow-xl"
                  data-alt="Detailed portrait of a happy young student, high definition, bright natural lighting, vibrant colors, educational environment feel"
                  :src="displayAvatar"
                />
              </div>
              <h3 class="font-headline text-2xl font-bold text-on-surface">{{ displayName }}</h3>
              <p class="text-on-surface-variant font-medium mb-4">
                <span v-if="displayClass">{{ displayClass }}</span>
              </p>
              <div class="bg-surface-container-low px-4 py-3 rounded-xl mb-6">
                <p class="text-sm text-on-surface italic">“ {{ displaySignature }} ”</p>
              </div>
            </div>

            <div
              class="bg-surface-container-lowest p-7 rounded-2xl shadow-sm border border-outline-variant/10"
            >
              <h4 class="font-headline text-lg font-bold mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-secondary">analytics</span>
                学习统计
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="bg-secondary-container/10 p-4 rounded-xl flex flex-col items-center justify-center"
                >
                  <span class="text-xs text-secondary font-bold uppercase tracking-wider mb-1"
                    >本周学时</span
                  >
                  <span class="text-xl font-bold text-on-surface">{{ weeklyStudyHours }}h</span>
                </div>
                <div class="bg-primary-container/10 p-4 rounded-xl flex flex-col items-center">
                  <span class="text-xs text-primary font-bold uppercase tracking-wider mb-1"
                    >完成作业</span
                  >
                  <span class="text-xl font-bold text-on-surface">{{ homeworkDone }}份</span>
                </div>
                <div class="bg-tertiary-container/10 p-4 rounded-xl flex flex-col items-center">
                  <span class="text-xs text-tertiary font-bold uppercase tracking-wider mb-1"
                    >正确率</span
                  >
                  <span class="text-xl font-bold text-on-surface">{{ accuracy }}%</span>
                </div>
                <div
                  class="bg-surface-container-low p-4 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                >
                  <span
                    class="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1"
                    >连续打卡</span
                  >
                  <div class="flex items-center gap-1">
                    <span class="text-xl font-bold text-on-surface">{{ streakDays }}天</span>
                    <span
                      class="material-symbols-outlined text-orange-500 animate-pulse"
                      style="font-variation-settings: 'FILL' 1"
                      >local_fire_department</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8 space-y-10">
            <div
              class="bg-surface-container-lowest p-7 rounded-2xl shadow-sm border border-outline-variant/10"
            >
              <h4 class="font-headline text-lg font-bold mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">account_circle</span>
                账户详情
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-on-surface-variant"
                      >phone_android</span
                    >
                    <div>
                      <p class="text-xs text-on-surface-variant">手机号</p>
                      <p class="font-bold">{{ displayPhone }}</p>
                    </div>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors"
                >
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-on-surface-variant">mail</span>
                    <div>
                      <p class="text-xs text-on-surface-variant">电子邮箱</p>
                      <p class="font-bold">{{ displayEmail }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-container-lowest p-7 rounded-2xl shadow-sm border border-outline-variant/10"
            >
              <h4 class="font-headline text-lg font-bold mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-tertiary">track_changes</span>
                个人设定
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-xs font-bold text-on-surface-variant uppercase ml-2">
                    学习目标
                  </label>
                  <div class="p-4 bg-surface-container-low rounded-2xl font-medium">
                    冲刺年级前50
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-bold text-on-surface-variant uppercase ml-2">
                    每日提醒
                  </label>
                  <div class="p-4 bg-surface-container-low rounded-2xl flex items-center gap-3">
                    <span class="material-symbols-outlined text-tertiary">alarm</span>
                    <span class="font-bold">19:30</span>
                  </div>
                </div>
                <div class="md:col-span-2 space-y-2">
                  <label class="text-xs font-bold text-on-surface-variant uppercase ml-2">
                    薄弱学科
                  </label>
                  <div class="flex flex-wrap gap-3 p-4 bg-surface-container-low rounded-2xl">
                    <span
                      class="bg-error-container text-on-error-container px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1"
                    >
                      English
                      <span class="material-symbols-outlined text-sm">trending_down</span>
                    </span>
                    <span
                      class="bg-error-container text-on-error-container px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1"
                    >
                      Physics
                      <span class="material-symbols-outlined text-sm">trending_down</span>
                    </span>
                    <button
                      class="bg-surface-container-highest px-4 py-1.5 rounded-full text-sm font-bold text-on-surface-variant hover:scale-105 transition-transform"
                    >
                      + 添加
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-container-lowest p-7 rounded-2xl shadow-sm border border-outline-variant/10"
            >
              <div class="flex items-center justify-between mb-6">
                <h4 class="font-headline text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-outline">verified_user</span>
                  安全与隐私
                </h4>
                <button
                  class="text-primary font-bold text-sm px-4 py-2 rounded-full hover:bg-primary-container/10 transition-all active:scale-95 flex items-center gap-2"
                  @click="openEditModal"
                >
                  <span class="material-symbols-outlined text-sm">edit</span>
                  编辑信息
                </button>
              </div>
              <div class="divide-y divide-outline-variant/10">
                <button class="w-full flex items-center justify-between py-4 group">
                  <span class="font-medium group-hover:text-primary transition-colors"
                    >修改密码</span
                  >
                  <span
                    class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform"
                    >chevron_right</span
                  >
                </button>
                <button class="w-full flex items-center justify-between py-4 group">
                  <span class="font-medium group-hover:text-primary transition-colors"
                    >隐私设置</span
                  >
                  <span
                    class="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform"
                    >chevron_right</span
                  >
                </button>
                <button class="w-full flex items-center justify-between py-4 group">
                  <span class="font-medium text-error/60 group-hover:text-error transition-colors">
                    注销账号
                  </span>
                  <span class="material-symbols-outlined text-error/60 group-hover:text-error"
                    >delete_forever</span
                  >
                </button>
                <button
                  class="w-full flex items-center justify-between py-4 group"
                  @click="handleLogout"
                >
                  <span class="font-medium text-error group-hover:text-error transition-colors">
                    退出登录
                  </span>
                  <span class="material-symbols-outlined text-error">logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div
      v-if="isEditOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/10 backdrop-blur-md px-4"
    >
      <div
        class="relative z-50 w-full max-w-2xl bg-surface-container-lowest rounded-xl overflow-hidden border border-white/50 shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div
          class="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-primary-container/10 to-transparent"
        >
          <h3 class="text-2xl font-headline font-extrabold text-on-surface tracking-tight">
            编辑个人信息
          </h3>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
            @click="closeEditModal"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="px-8 py-6 space-y-8 overflow-y-auto flex-1">
          <div class="flex flex-col items-center space-y-3">
            <div
              class="relative group cursor-pointer"
              role="button"
              tabindex="0"
              aria-label="选择头像"
              @click="triggerAvatarSelect"
              @keydown.enter.prevent="triggerAvatarSelect"
              @keydown.space.prevent="triggerAvatarSelect"
            >
              <div
                class="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-container/30 ring-offset-4 ring-offset-surface-container-lowest"
              >
                <img
                  :src="resolveAvatarUrl(editForm.avatar_url) || displayAvatar"
                  class="w-full h-full object-cover"
                  :alt="`${displayName}头像`"
                />
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center rounded-full bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
              >
                <div class="bg-surface-container-lowest p-2 rounded-full shadow-lg">
                  <span
                    class="material-symbols-outlined text-primary"
                    style="font-variation-settings: 'FILL' 1"
                    >photo_camera</span
                  >
                </div>
              </div>
            </div>
            <span class="text-sm font-semibold text-primary">
              {{ isUploadingAvatar ? '头像上传中...' : '点击修改头像' }}
            </span>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarFileChange"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label class="space-y-2">
              <span class="flex justify-between items-center px-1">
                <span class="text-sm font-bold text-on-surface-variant">姓名</span>
                <span class="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded-full font-bold"
                  >必填</span
                >
              </span>
              <input
                v-model.trim="editForm.name"
                class="w-full px-5 py-4 bg-surface-container-low border-transparent rounded-lg focus:ring-4 focus:ring-primary-container/50 focus:bg-surface-container-lowest focus:border-primary-container transition-all text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="请输入你的姓名"
                type="text"
              />
            </label>
            <label class="space-y-2">
              <span class="px-1 text-sm font-bold text-on-surface-variant">年级</span>
              <input
                v-model.trim="editForm.grade"
                class="w-full px-5 py-4 bg-surface-container-low border-transparent rounded-lg focus:ring-4 focus:ring-primary-container/50 focus:bg-surface-container-lowest focus:border-primary-container transition-all text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="例如：五年级"
                type="text"
              />
            </label>
            <label class="space-y-2">
              <span class="px-1 text-sm font-bold text-on-surface-variant">班级</span>
              <input
                v-model.trim="editForm.class_name"
                class="w-full px-5 py-4 bg-surface-container-low border-transparent rounded-lg focus:ring-4 focus:ring-primary-container/50 focus:bg-surface-container-lowest focus:border-primary-container transition-all text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="例如：A班"
                type="text"
              />
            </label>
            <label class="space-y-2">
              <span class="px-1 text-sm font-bold text-on-surface-variant">就读学校</span>
              <input
                v-model.trim="editForm.school"
                class="w-full px-5 py-4 bg-surface-container-low border-transparent rounded-lg focus:ring-4 focus:ring-primary-container/50 focus:bg-surface-container-lowest focus:border-primary-container transition-all text-on-surface placeholder:text-outline-variant font-medium"
                placeholder="输入学校名称"
                type="text"
              />
            </label>
          </div>

          <label class="space-y-2">
            <span class="px-1 text-sm font-bold text-on-surface-variant">个性签名</span>
            <textarea
              v-model.trim="editForm.signature"
              class="w-full px-5 py-4 bg-surface-container-low border-transparent rounded-lg focus:ring-4 focus:ring-primary-container/50 focus:bg-surface-container-lowest focus:border-primary-container transition-all text-on-surface placeholder:text-outline-variant font-medium resize-none"
              placeholder="介绍一下你自己吧..."
              rows="3"
            ></textarea>
          </label>

          <div class="bg-surface-container-low rounded-lg p-4 flex items-start gap-3">
            <span
              class="material-symbols-outlined text-outline-variant mt-0.5"
              style="font-variation-settings: 'FILL' 1"
              >info</span
            >
            <p class="text-sm text-on-surface-variant font-medium leading-relaxed">
              手机号/邮箱需通过换绑流程修改。如需更改绑定信息，请前往
              <span class="text-primary">安全中心</span>。
            </p>
          </div>

          <p v-if="editError" class="text-sm text-error font-semibold">
            {{ editError }}
          </p>
        </div>

        <div class="px-8 py-6 bg-surface-container-low flex flex-col sm:flex-row justify-end gap-3">
          <button
            class="px-8 py-3.5 rounded-full font-headline font-bold text-on-surface-variant bg-surface-container-highest/50 hover:bg-surface-container-highest transition-all"
            @click="closeEditModal"
          >
            取消
          </button>
          <button
            class="px-10 py-3.5 rounded-full font-headline font-bold text-on-primary bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all relative overflow-hidden disabled:opacity-60"
            :disabled="isSaving"
            @click="saveProfile"
          >
            <span class="relative z-10">{{ isSaving ? '保存中...' : '保存修改' }}</span>
            <div
              class="absolute top-0 left-0 w-full h-1/2 bg-white/10 skew-y-3 -translate-y-full hover:translate-y-0 transition-transform"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isCropOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/20 backdrop-blur-md px-4"
    >
      <div
        class="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-white/50 overflow-hidden"
      >
        <div class="flex items-center justify-between px-6 py-4 bg-surface-container-low">
          <h4 class="text-lg font-headline font-bold">裁剪头像</h4>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
            @click="closeCropper"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="px-6 py-6">
          <div class="w-full max-h-[60vh] overflow-hidden rounded-xl bg-surface-container-low">
            <img ref="cropImageRef" :src="cropImageUrl" alt="裁剪头像" class="w-full" />
          </div>
        </div>
        <div class="px-6 py-4 bg-surface-container-low flex flex-col sm:flex-row justify-end gap-3">
          <button
            class="px-6 py-3 rounded-full font-headline font-bold text-on-surface-variant bg-surface-container-highest/50 hover:bg-surface-container-highest transition-all"
            @click="closeCropper"
          >
            取消
          </button>
          <button
            class="px-8 py-3 rounded-full font-headline font-bold text-on-primary bg-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-60"
            :disabled="isUploadingAvatar"
            @click="confirmCrop"
          >
            {{ isUploadingAvatar ? '上传中...' : '确定裁剪' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { useRouter } from 'vue-router'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { API_BASE } from '@/services/api.js'
import { getMe, getStoredUser, saveUser, updateMe, uploadAvatar } from '@/services/userService.js'

const router = useRouter()
const user = ref(getStoredUser())

const displayName = computed(() => user.value?.name || '未登录用户')
const displayEmail = computed(() => user.value?.email || '—')
const displayId = computed(() => user.value?.id || '—')
const displayPhone = computed(() => user.value?.phone || '—')
const fallbackAvatar =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzXLCl7oddbFNIiHT9kGnzPbpENrwU02mgk6NujRuBROm_hsPil_Ba00RlGLKTPFRt3G12TZ0td4GoMMNozM02kXU59HBwMLf1IXV1iv08Fn6FSAwVmzHZg2dqtZG3bzXSI396xdLSBjeUDz68fpqTEPamVvE-9BhgyTVzudHcxnneq5An9YCeg2IHL4Wn7POGdxxU6jVuv-DUsLWXHBtyHxJ79zqcJ-4RyJ-15eIgLaFp063zhnuXZM8Sgr0PP1aLyJXolI2dROHy'

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
const displaySignature = computed(() => user.value?.signature || '继续加油，今天也要进步！')
const displayClass = computed(() => {
  const grade = user.value?.grade
  const className = user.value?.class_name
  const school = user.value?.school
  const parts = [grade, className, school].filter(Boolean)
  return parts.join(' · ')
})
const weeklyStudyHours = computed(() => user.value?.weekly_study_hours ?? 0)
const homeworkDone = computed(() => user.value?.homework_done ?? 0)
const accuracy = computed(() => user.value?.accuracy ?? 0)
const streakDays = computed(() => user.value?.streak_days ?? 0)

const isEditOpen = ref(false)
const isSaving = ref(false)
const isUploadingAvatar = ref(false)
const editError = ref('')
const avatarInput = ref(null)
const isCropOpen = ref(false)
const cropImageUrl = ref('')
const cropImageRef = ref(null)
const cropperInstance = ref(null)
const editForm = ref({
  name: '',
  avatar_url: '',
  signature: '',
  grade: '',
  class_name: '',
  school: '',
})

const triggerAvatarSelect = () => {
  avatarInput.value?.click()
}

const handleAvatarFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  const maxSizeMb = 2
  if (file.size > maxSizeMb * 1024 * 1024) {
    editError.value = `头像文件不能超过 ${maxSizeMb}MB。`
    event.target.value = ''
    return
  }
  if (!file.type.startsWith('image/')) {
    editError.value = '请选择图片文件。'
    event.target.value = ''
    return
  }

  editError.value = ''
  await openCropper(file)
  event.target.value = ''
}

const openCropper = async (file) => {
  destroyCropper()
  cropImageUrl.value = URL.createObjectURL(file)
  isCropOpen.value = true
  await nextTick()
  if (!cropImageRef.value) return
  cropperInstance.value = new Cropper(cropImageRef.value, {
    aspectRatio: 1,
    viewMode: 1,
    dragMode: 'move',
    background: false,
    autoCropArea: 1,
    responsive: true,
  })
}

const destroyCropper = () => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
  if (cropImageUrl.value) {
    URL.revokeObjectURL(cropImageUrl.value)
    cropImageUrl.value = ''
  }
}

const closeCropper = (force = false) => {
  if (isUploadingAvatar.value && !force) return
  isCropOpen.value = false
  destroyCropper()
}

const confirmCrop = async () => {
  if (!cropperInstance.value) return
  const canvas = cropperInstance.value.getCroppedCanvas({
    width: 320,
    height: 320,
    imageSmoothingQuality: 'high',
  })
  if (!canvas) return

  isUploadingAvatar.value = true
  editError.value = ''
  canvas.toBlob(
    async (blob) => {
      if (!blob) {
        editError.value = '裁剪失败，请重试。'
        isUploadingAvatar.value = false
        return
      }
      closeCropper(true)
      try {
        const file = new File([blob], 'avatar.png', { type: 'image/png' })
        const result = await uploadAvatar(file)
        editForm.value.avatar_url = result.url
      } catch (error) {
        editError.value = error?.message || '上传头像失败，请重试。'
      } finally {
        isUploadingAvatar.value = false
      }
    },
    'image/png',
    0.92,
  )
}

const openEditModal = () => {
  editError.value = ''
  editForm.value = {
    name: user.value?.name || '',
    avatar_url: user.value?.avatar_url || '',
    signature: user.value?.signature || '',
    grade: user.value?.grade || '',
    class_name: user.value?.class_name || '',
    school: user.value?.school || '',
  }
  isEditOpen.value = true
}

const closeEditModal = () => {
  if (isSaving.value) return
  isEditOpen.value = false
  closeCropper()
}

const saveProfile = async () => {
  if (!editForm.value.name) {
    editError.value = '姓名不能为空。'
    return
  }
  isSaving.value = true
  editError.value = ''
  try {
    const payload = {
      name: editForm.value.name,
      avatar_url: editForm.value.avatar_url || null,
      signature: editForm.value.signature || null,
      grade: editForm.value.grade || null,
      class_name: editForm.value.class_name || null,
      school: editForm.value.school || null,
    }
    const data = await updateMe(payload)
    user.value = data
    saveUser(data)
    window.dispatchEvent(new CustomEvent('user:updated', { detail: data }))
    isEditOpen.value = false
  } catch (error) {
    editError.value = error?.message || '保存失败，请稍后重试。'
  } finally {
    isSaving.value = false
  }
}

const handleLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/loginregistrationupdatedowl')
}

onMounted(async () => {
  try {
    const data = await getMe()
    user.value = data
    saveUser(data)
  } catch {
    // Keep local cached user when API fails.
  }
})

onBeforeUnmount(() => {
  destroyCropper()
})
</script>

<style scoped>
.candy-blob {
  position: fixed;
  filter: blur(80px);
  z-index: -1;
  opacity: 0.4;
}

:deep(.cropper-view-box),
:deep(.cropper-face),
:deep(.cropper-crop-box) {
  border-radius: 50%;
}
</style>
