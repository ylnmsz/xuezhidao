<template>
  <div class="bg-background text-on-background min-h-screen bg-blobs pb-32">
    <nav
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md font-['Plus_Jakarta_Sans'] font-bold tracking-tight docked full-width top-0 sticky z-40 shadow-[0_20px_50px_rgba(0,180,216,0.08)]"
    >
      <div class="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
        <div class="flex items-center gap-4">
          <button
            class="hover:scale-105 transition-transform duration-300 ease-out active:scale-95 flex items-center justify-center p-2 rounded-full bg-surface-container-low text-primary"
            @click="$router.back()"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 class="text-2xl font-black text-cyan-700 dark:text-cyan-300">教师资料</h1>
        </div>
        <div class="flex items-center gap-6">
          <div class="hidden md:flex gap-8 items-center text-slate-500">
            <RouterLink
              to="/teacherdashboard"
              class="text-cyan-700 dark:text-cyan-300 border-b-4 border-cyan-400 dark:border-cyan-500 pb-1"
            >
              Dashboard
            </RouterLink>
            <RouterLink to="/classmanagement" class="hover:text-cyan-500 transition-colors">
              Classes
            </RouterLink>
            <RouterLink to="/questionbank" class="hover:text-cyan-500 transition-colors">
              Curriculum
            </RouterLink>
          </div>
          <div class="flex items-center gap-3 border-l pl-6 border-outline-variant/30">
            <button class="hover:scale-105 transition-transform p-2 text-slate-500">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <button class="hover:scale-105 transition-transform p-2 text-slate-500">
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-8 py-10">
      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <section
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_60px_rgba(0,100,121,0.04)] hover:-translate-y-2 transition-all duration-500"
          >
            <div class="flex flex-col items-center text-center">
              <div class="relative group">
                <img
                  :alt="`${displayName}头像`"
                  class="w-32 h-32 rounded-full border-4 border-primary-container object-cover"
                  data-alt="professional portrait of a friendly female teacher with glasses and a warm smile, soft bright studio lighting, educational setting background"
                  :src="displayAvatar"
                />
                <button
                  class="absolute bottom-0 right-0 bg-primary-container p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <span class="material-symbols-outlined text-white text-sm">photo_camera</span>
                </button>
              </div>
              <h2 class="mt-6 text-2xl font-headline font-extrabold text-on-surface">
                {{ displayName }}
              </h2>
              <p class="text-on-surface-variant font-medium">ID: {{ displayId }}</p>
              <div class="flex flex-wrap justify-center gap-2 mt-4">
                <span
                  class="px-3 py-1 bg-primary-container/20 text-primary font-bold rounded-full text-xs"
                >
                  {{ displaySubject }}
                </span>
                <span
                  class="px-3 py-1 bg-secondary-container/20 text-secondary font-bold rounded-full text-xs"
                >
                  {{ displaySchool }}
                </span>
              </div>
              <p class="mt-6 italic text-on-surface-variant text-sm leading-relaxed">
                "{{ displaySignature }}"
              </p>
              <button
                class="mt-8 w-full py-3 px-6 bg-surface-container-low text-primary font-bold rounded-xl hover:bg-primary-container/10 transition-colors active:scale-95"
              >
                更换头像
              </button>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_60px_rgba(0,0,0,0.02)] hover:-translate-y-2 transition-all duration-500"
          >
            <h3 class="text-xl font-headline font-bold mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-tertiary">security</span>
              账户安全
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2">
                <span class="text-on-surface-variant text-sm">绑定手机</span>
                <span class="text-on-surface font-semibold">{{ displayPhone }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-on-surface-variant text-sm">工作邮箱</span>
                <span class="text-on-surface font-semibold">{{ displayEmail }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-on-surface-variant text-sm">实名状态</span>
                <span class="flex items-center gap-1 text-secondary font-bold text-sm">
                  <span
                    class="material-symbols-outlined text-sm"
                    style="font-variation-settings: 'FILL' 1"
                    >check_circle</span
                  >
                  已实名
                </span>
              </div>
              <RouterLink
                to="/forgotpassword"
                class="block text-center mt-6 text-primary font-bold text-sm underline underline-offset-4 hover:text-primary-dim"
              >
                修改登录密码
              </RouterLink>
              <button
                class="mt-4 w-full flex items-center justify-between py-3 text-error hover:text-error transition-colors"
                @click="handleLogout"
              >
                <span class="font-bold">退出登录</span>
                <span class="material-symbols-outlined">logout</span>
              </button>
            </div>
          </section>
        </div>

        <div class="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section
              class="bg-primary-container/10 p-6 rounded-lg border border-primary-container/20 flex items-center gap-4"
            >
              <div
                class="bg-primary-container w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <span class="material-symbols-outlined text-3xl">schedule</span>
              </div>
              <div>
                <p class="text-primary-dim text-sm font-bold uppercase tracking-wider">本周授课</p>
                <p class="text-2xl font-black text-on-primary-container">24 小时</p>
              </div>
            </section>
            <section
              class="bg-secondary-container/10 p-6 rounded-lg border border-secondary-container/20 flex items-center gap-4"
            >
              <div
                class="bg-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center text-secondary shadow-lg"
              >
                <span class="material-symbols-outlined text-3xl">assignment</span>
              </div>
              <div>
                <p class="text-secondary-dim text-sm font-bold uppercase tracking-wider">
                  已发布作业
                </p>
                <p class="text-2xl font-black text-on-secondary-container">156 份</p>
              </div>
            </section>
          </div>

          <section
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <h4 class="font-bold text-on-surface">批改完成率</h4>
                  <span class="text-primary font-black text-xl">95%</span>
                </div>
                <div class="h-4 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-primary-container w-[95%] rounded-full"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-on-surface">班级满意度</h4>
                <div class="flex items-center gap-2 text-tertiary-fixed">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="ml-2 text-on-surface-variant font-bold text-lg">5.0</span>
                </div>
              </div>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <div class="flex justify-between items-center mb-8">
              <div>
                <h3 class="text-xl font-headline font-bold">班级管理</h3>
                <p class="text-on-surface-variant text-sm">当前共负责 6 个教学班级</p>
              </div>
              <RouterLink
                to="/classmanagement"
                class="px-5 py-2 rounded-full border-2 border-primary-container text-primary font-bold text-sm hover:bg-primary-container/5 transition-all"
              >
                查看全部
              </RouterLink>
            </div>
            <div class="space-y-4">
              <div
                class="group flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary-container/20"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    A1
                  </div>
                  <div>
                    <p class="font-bold text-on-surface">高三 (01) 班 - 尖子生数学</p>
                    <p class="text-xs text-on-surface-variant">45名学生 · 下周二 08:30</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
              <div
                class="group flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary-container/20"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    B4
                  </div>
                  <div>
                    <p class="font-bold text-on-surface">高二 (04) 班 - 代数进阶</p>
                    <p class="text-xs text-on-surface-variant">38名学生 · 明日 14:00</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
              <div
                class="group flex items-center justify-between p-4 bg-surface-container-low rounded-xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary-container/20"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    C2
                  </div>
                  <div>
                    <p class="font-bold text-on-surface">高一 (12) 班 - 趣味逻辑</p>
                    <p class="text-xs text-on-surface-variant">52名学生 · 周五 10:15</p>
                  </div>
                </div>
                <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
              </div>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <h3 class="text-xl font-headline font-bold mb-8">教学偏好与通知</h3>
            <div class="space-y-10">
              <div>
                <label class="block text-sm font-bold text-on-surface-variant mb-4"
                  >擅长题型标签</label
                >
                <div class="flex flex-wrap gap-3">
                  <span
                    class="px-4 py-2 bg-tertiary-container/10 text-tertiary font-bold rounded-full text-sm border border-tertiary-container/30"
                    >函数解析</span
                  >
                  <span
                    class="px-4 py-2 bg-tertiary-container/10 text-tertiary font-bold rounded-full text-sm border border-tertiary-container/30"
                    >立体几何</span
                  >
                  <span
                    class="px-4 py-2 bg-tertiary-container/10 text-tertiary font-bold rounded-full text-sm border border-tertiary-container/30"
                    >概率统计</span
                  >
                  <button
                    class="px-4 py-2 border-2 border-dashed border-outline-variant text-outline-variant rounded-full text-sm font-bold flex items-center gap-1 hover:border-primary hover:text-primary transition-colors"
                  >
                    <span class="material-symbols-outlined text-sm">add</span> 添加
                  </button>
                </div>
              </div>
              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-sm font-bold text-on-surface-variant mb-4"
                    >负责年级范围</label
                  >
                  <div class="flex gap-4">
                    <label
                      class="flex-1 text-center py-3 rounded-xl border-2 border-primary-container bg-primary-container/10 text-primary font-bold cursor-pointer"
                      >高一</label
                    >
                    <label
                      class="flex-1 text-center py-3 rounded-xl border-2 border-primary-container bg-primary-container/10 text-primary font-bold cursor-pointer"
                      >高二</label
                    >
                    <label
                      class="flex-1 text-center py-3 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold cursor-pointer"
                      >高三</label
                    >
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-bold text-on-surface-variant mb-4"
                    >消息通知订阅</label
                  >
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <div
                        class="w-10 h-6 bg-secondary rounded-full relative p-1 flex items-center"
                      >
                        <div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                      <span class="text-sm font-medium text-on-surface">APP推送</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <div
                        class="w-10 h-6 bg-outline-variant rounded-full relative p-1 flex items-center"
                      >
                        <div class="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <span class="text-sm font-medium text-on-surface">短信</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <div
                        class="w-10 h-6 bg-secondary rounded-full relative p-1 flex items-center"
                      >
                        <div class="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </div>
                      <span class="text-sm font-medium text-on-surface">邮件</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <footer
      class="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-2xl px-8 py-6 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] rounded-t-[2.5rem]"
    >
      <div class="max-w-7xl mx-auto flex justify-end items-center gap-4">
        <button
          class="px-10 py-4 bg-surface-container text-on-surface font-extrabold uppercase tracking-widest text-sm rounded-full hover:bg-surface-container-high transition-all active:scale-95"
        >
          取消
        </button>
        <button
          class="px-12 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-extrabold uppercase tracking-widest text-sm rounded-full shadow-[0_10px_30px_rgba(0,100,121,0.3)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,100,121,0.4)] transition-all active:scale-95"
        >
          保存修改
        </button>
      </div>
    </footer>

    <div class="md:hidden">
      <nav
        class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
      >
        <RouterLink
          to="/teacherdashboard"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">grid_view</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1"
            >Home</span
          >
        </RouterLink>
        <RouterLink
          to="/classmanagement"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">group</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Students
          </span>
        </RouterLink>
        <RouterLink
          to="/analyticsgrading"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">insights</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Insights
          </span>
        </RouterLink>
        <RouterLink
          to="/teacherprofile"
          class="flex flex-col items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 rounded-full px-6 py-2 transform scale-110 -translate-y-1"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
            >account_circle</span
          >
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Account
          </span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getMe, getStoredUser, saveUser } from '@/services/userService.js'

const router = useRouter()
const user = ref(getStoredUser())

const displayName = computed(() => user.value?.name || '未登录用户')
const displayEmail = computed(() => user.value?.email || '—')
const displayId = computed(() => user.value?.id || '—')
const displayPhone = computed(() => user.value?.phone || '—')
const displayAvatar = computed(
  () =>
    user.value?.avatar_url ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBio8Ta8BRczgOqmfYounc7e6QpjjTlQnHdU5HfUE2cZ1HbShaL9c4L27Wgnq6IMxub44Ab-DFlnC1pM3jiZ9AIPWN-oaarXOi41uMZ3U9ilNlJRsm5EeYhwsp8jRoTm0zgwuz63e_m3bxnoNjnT0m_L5-kITQ3i1PmDT5mRivIYQO3X6UEph24aJ5kd5Bl6SH1-JOF-CGQQEiK9zefeG95HGuLgRfiV8oGCr8lBDa8P6hBEhJJP9_aqnIP_IUljLSQozKyy70nbzP2',
)
const displaySignature = computed(() => user.value?.signature || '专注教学，点亮每个学生。')
const displaySchool = computed(() => user.value?.school || '学校未填写')
const displaySubject = computed(() => user.value?.grade || '任教学科')

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
</script>

<style scoped>
.bg-blobs {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(64, 206, 243, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(139, 254, 50, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(254, 157, 0, 0.05) 0%, transparent 50%);
}
</style>
