<template>
  <div class="flex min-h-screen">
    <StudentTopNavbar />
    <StudentSidebar />
    <!-- Main Content -->
    <main class="flex-1 lg:ml-72 p-6 md:p-10 pl-6 lg:pl-10 space-y-10 pt-24 md:pt-28">
      <!-- Statistics Bento Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Stat Card 1 -->
        <div
          class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
          ></div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-primary-container/20 rounded-2xl">
              <span class="material-symbols-outlined text-primary text-3xl">school</span>
            </div>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full"
              >98% 活跃</span
            >
          </div>
          <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">08</h3>
          <p class="text-on-surface-variant font-medium mt-1">管理班级</p>
        </div>
        <!-- Stat Card 2 -->
        <div
          class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
          ></div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-secondary-container/20 rounded-2xl">
              <span class="material-symbols-outlined text-secondary text-3xl">group</span>
            </div>
            <span class="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full"
              >98% 活跃</span
            >
          </div>
          <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">245</h3>
          <p class="text-on-surface-variant font-medium mt-1">学生总数</p>
        </div>
        <!-- Stat Card 3 -->
        <div
          class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
          ></div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-tertiary-container/20 rounded-2xl">
              <span class="material-symbols-outlined text-tertiary text-3xl">pending_actions</span>
            </div>
            <span class="text-xs font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full"
              >加急</span
            >
          </div>
          <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">14</h3>
          <p class="text-on-surface-variant font-medium mt-1">待批改</p>
        </div>
        <!-- Stat Card 4 -->
        <div
          class="relative overflow-hidden bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-outline-variant/10 bouncy-hover group"
        >
          <div
            class="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"
          ></div>
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-primary-container/20 rounded-2xl">
              <span class="material-symbols-outlined text-primary text-3xl">quiz</span>
            </div>
            <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full"
              >AI 同步</span
            >
          </div>
          <h3 class="text-4xl font-black font-headline text-on-surface tracking-tight">1.2k</h3>
          <p class="text-on-surface-variant font-medium mt-1">题库总数</p>
        </div>
      </section>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Class Dynamics Chart Area -->
        <section class="lg:col-span-8 space-y-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-black font-headline text-[#006479]">近期提交</h2>
            <div class="flex gap-2">
              <button
                class="px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-variant transition-colors"
              >
                周
              </button>
              <button
                class="px-4 py-2 bg-primary-container text-on-primary-container rounded-full text-xs font-bold shadow-sm"
              >
                月
              </button>
            </div>
          </div>
          <!-- Bouncy Bar Chart -->
          <div
            class="bg-surface-container-lowest p-8 rounded-lg shadow-[0_40px_80px_rgba(0,0,0,0.02)] border border-outline-variant/5 min-h-[400px] flex flex-col"
          >
            <div class="flex-1 flex items-end justify-between gap-4 px-4">
              <!-- Mon -->
              <div class="group relative flex-1 flex flex-col items-center gap-4">
                <div
                  class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  30 Submitted, 2 Pending
                </div>
                <div
                  class="w-full bg-primary-container rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                  style="height: 60%"
                ></div>
                <span class="text-xs font-bold text-on-surface-variant">一</span>
              </div>
              <!-- Tue -->
              <div class="group relative flex-1 flex flex-col items-center gap-4">
                <div
                  class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  45 Submitted, 0 Pending
                </div>
                <div
                  class="w-full bg-secondary-container rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                  style="height: 85%"
                ></div>
                <span class="text-xs font-bold text-on-surface-variant">二</span>
              </div>
              <!-- Wed -->
              <div class="group relative flex-1 flex flex-col items-center gap-4">
                <div
                  class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  22 Submitted, 8 Pending
                </div>
                <div
                  class="w-full bg-tertiary-container rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                  style="height: 45%"
                ></div>
                <span class="text-xs font-bold text-on-surface-variant">三</span>
              </div>
              <!-- Thu -->
              <div class="group relative flex-1 flex flex-col items-center gap-4">
                <div
                  class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  38 Submitted, 4 Pending
                </div>
                <div
                  class="w-full bg-primary-container rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                  style="height: 70%"
                ></div>
                <span class="text-xs font-bold text-on-surface-variant">四</span>
              </div>
              <!-- Fri -->
              <div class="group relative flex-1 flex flex-col items-center gap-4">
                <div
                  class="absolute bottom-full mb-2 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  50 Submitted, 0 Pending
                </div>
                <div
                  class="w-full bg-secondary-container rounded-t-full rounded-b-lg transition-all duration-500 hover:scale-110 cursor-pointer"
                  style="height: 95%"
                ></div>
                <span class="text-xs font-bold text-on-surface-variant">五</span>
              </div>
            </div>
            <div
              class="mt-8 pt-8 border-t border-surface-container-high flex items-center justify-around text-xs font-semibold text-on-surface-variant"
            >
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-primary-container rounded-full"></div>
                10年级数学
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-secondary-container rounded-full"></div>
                12年级物理
              </div>
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 bg-tertiary-container rounded-full"></div>
                11年级化学
              </div>
            </div>
          </div>
        </section>
        <!-- Quick Actions Area -->
        <section class="lg:col-span-4 space-y-6">
          <h2 class="text-2xl font-black font-headline text-[#006479]">近期提交</h2>
          <div class="grid grid-cols-1 gap-4">
            <!-- Action 1 -->
            <button
              class="group flex items-center justify-between p-6 bg-primary-container text-on-primary-container rounded-lg shadow-[0_10px_0_#004a5a] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
            >
              <div class="flex items-center gap-4">
                <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                  <span class="material-symbols-outlined text-3xl filled-icon">add_task</span>
                </div>
                <div class="text-left">
                  <span class="block font-headline font-extrabold text-xl">布置作业</span>
                  <span class="text-xs font-medium opacity-80">为学生创建新任务</span>
                </div>
              </div>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                >arrow_forward_ios</span
              >
            </button>
            <!-- Action 2 -->
            <button
              class="group flex items-center justify-between p-6 bg-secondary-container text-on-secondary-container rounded-lg shadow-[0_10px_0_#2b5d00] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
            >
              <div class="flex items-center gap-4">
                <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                  <span class="material-symbols-outlined text-3xl filled-icon">post_add</span>
                </div>
                <div class="text-left">
                  <span class="block font-headline font-extrabold text-xl">录入题目</span>
                  <span class="text-xs font-medium opacity-80">扩充您的题库</span>
                </div>
              </div>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                >arrow_forward_ios</span
              >
            </button>
            <!-- Action 3 -->
            <button
              class="group flex items-center justify-between p-6 bg-tertiary-container text-on-tertiary-container rounded-lg shadow-[0_10px_0_#4b2b00] active:shadow-none active:translate-y-[10px] transition-all duration-150 press-effect"
            >
              <div class="flex items-center gap-4">
                <div class="bg-white/20 p-4 rounded-2xl shadow-inner">
                  <span class="material-symbols-outlined text-3xl filled-icon">insights</span>
                </div>
                <div class="text-left">
                  <span class="block font-headline font-extrabold text-xl">查看分析</span>
                  <span class="text-xs font-medium opacity-80">检查学生表现数据</span>
                </div>
              </div>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
                >arrow_forward_ios</span
              >
            </button>
          </div>
          <!-- Small Illustration Card -->
          <div
            class="relative bg-surface-container-low p-6 rounded-lg border border-outline-variant/10 mt-8 overflow-hidden group"
          >
            <div class="relative z-10">
              <h4 class="font-headline font-bold text-lg text-primary">需要帮助？</h4>
              <p class="text-sm text-on-surface-variant mt-2">
                我们的 AI 助手可以根据课本照片帮您生成题目。
              </p>
              <button
                class="mt-4 px-6 py-2 bg-primary text-white rounded-full text-xs font-bold hover:bg-primary-dim transition-colors"
              >
                启动助手
              </button>
            </div>
            <img
              alt="decoration"
              class="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:rotate-12 transition-transform duration-500"
              data-alt="abstract playful 3D shapes floating in a soft pastel void with cute aesthetic and bright candy colors"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrdRospi39JOaTa4GYIC67UyBusHP7raZJR7DkxeOAxytL2d30N1TdMWXSupZ-hjJORtYPITXQ5CCTnVFXNWFKPL5QrAJRbVhisRRawdqAvIilvn5RvKdEHVKPD4Uu1G5-0yPxrfxgU3vFs41dlNr-5m_9fxz1ixJVDfrp7WHCUsFiLk88ggXl9uYtUr_OaGO3lTu4GdxNDjmsvWHZGSS7CHRAe1HNDX9p4m9KZZoCeqhqu3Alg2TYhhJajOHEPHFgx6-smnfULmir"
            />
          </div>
        </section>
      </div>
      <!-- Recent Submissions List (High-End Card Pattern) -->
      <section class="space-y-6">
        <h2 class="text-2xl font-black font-headline text-[#006479]">近期提交</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <!-- Submission Card 1 -->
          <div
            class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              alt="Student"
              class="w-16 h-16 rounded-2xl object-cover"
              data-alt="portrait of a young smiling student in a bright classroom setting with natural light"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl1igevPa-QolhGT25vj389Jj3ZPOI_lQ5f3pJe00LCSz4EDdUQPkYvUQHwfxwR0-m9EmA-u6Xbe6LyXr3Gstnd8SinrtIeg9Lq9aK6351gu30U_Q1kEB1mX_izCJKugnvsX693ao0BbIyXM_GCriuUdDt1mbEjXprNc8cvmsCvIj9uOdO1pkj4_fewjKlCH_EyxQCl-RhQK1_WfQXwvi4rHUTVpWoqLI1SHz_Z97cbhbxy6lYlipPXSF82L6evELuGak_5si4zgsm"
            />
            <div class="flex-1">
              <p class="font-headline font-bold text-on-surface">Alex Johnson</p>
              <p class="text-xs text-on-surface-variant">Differential Equations HW</p>
              <div class="mt-2 flex items-center justify-between">
                <span
                  class="text-[10px] font-bold text-secondary-fixed-variant bg-secondary-container/30 px-2 py-0.5 rounded-full"
                  >新</span
                >
                <span class="text-[10px] text-on-surface-variant font-medium">1小时前</span>
              </div>
            </div>
          </div>
          <!-- Submission Card 2 -->
          <div
            class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <img
              alt="Student"
              class="w-16 h-16 rounded-2xl object-cover"
              data-alt="portrait of a cheerful girl with glasses in a modern library with books in background"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCSxYZBVTid1an6mlWb-K2pQ-gGNjonnKSw0TVjwDWnw-m4u-7bgm-4aWgqXxiXNQP8BahPNv5oDh4JOtYFeEmpjmGeD1QceMNYQt8gp-jvVVNtv7v0kU46j0YuDsLUYjZDOR2WeQa9lNZhuQA0RPWLjyS7So-lNy5rz6nRCfYeDeSGsV28CojolFVUP98fKP5t9STvcbx6RuFQPqTJynVbqcxMKr_Btp7HGw0t854nHye5lSM-qAZm1hTdJYqJSyYd6Q5hwl8AZ9A"
            />
            <div class="flex-1">
              <p class="font-headline font-bold text-on-surface">Maria Garcia</p>
              <p class="text-xs text-on-surface-variant">Kinematics Unit Quiz</p>
              <div class="mt-2 flex items-center justify-between">
                <span
                  class="text-[10px] font-bold text-tertiary-fixed-variant bg-tertiary-container/30 px-2 py-0.5 rounded-full"
                  >待批改</span
                >
                <span class="text-[10px] text-on-surface-variant font-medium">1小时前</span>
              </div>
            </div>
          </div>
          <!-- Submission Card 3 -->
          <div
            class="flex items-center gap-4 bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/5 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div
              class="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-on-surface-variant text-3xl"
                >more_horiz</span
              >
            </div>
            <div class="flex-1">
              <p class="font-headline font-bold text-on-surface">查看全部历史</p>
              <p class="text-xs text-on-surface-variant">查看另外 24 份提交</p>
              <div class="mt-2 text-right">
                <span class="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
  <!-- Mobile Navigation (Bottom) -->
  <nav
    class="md:hidden fixed bottom-0 left-0 w-full glass-morphism h-20 flex items-center justify-around px-4 z-50 border-t border-surface-container-high"
  >
    <button class="flex flex-col items-center gap-1 text-[#006479]">
      <span class="material-symbols-outlined filled-icon">home</span>
      <span class="text-[10px] font-bold">Home</span>
    </button>
    <button class="flex flex-col items-center gap-1 text-slate-500">
      <span class="material-symbols-outlined">auto_stories</span>
      <span class="text-[10px] font-bold">Class</span>
    </button>
    <button class="flex flex-col items-center gap-1 -translate-y-4">
      <div class="bg-primary p-4 rounded-full shadow-lg">
        <span class="material-symbols-outlined text-white">add</span>
      </div>
    </button>
    <button class="flex flex-col items-center gap-1 text-slate-500">
      <span class="material-symbols-outlined">leaderboard</span>
      <span class="text-[10px] font-bold">Stats</span>
    </button>
    <button class="flex flex-col items-center gap-1 text-slate-500">
      <span class="material-symbols-outlined">account_circle</span>
      <span class="text-[10px] font-bold">Me</span>
    </button>
  </nav>
  <!-- Decorative Elements -->
  <div
    class="fixed top-1/4 -right-20 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl -z-10 pointer-events-none"
  ></div>
  <div
    class="fixed bottom-1/4 -left-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-3xl -z-10 pointer-events-none"
  ></div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped></style>
