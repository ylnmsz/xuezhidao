<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col overflow-x-hidden">
    <StudentTopNavbar />
    <StudentSidebar />

    <header
      class="bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-0 z-50 flex justify-between items-center px-8 py-4 w-full lg:ml-72"
    >
      <div class="flex items-center gap-4">
        <button
          class="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100/50 hover:scale-105 hover:bg-slate-100/50 transition-all duration-300 scale-95 active:duration-75"
        >
          <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
        </button>
        <div class="flex flex-col">
          <h1 class="font-bold text-lg text-on-surface leading-tight">作业挑战准备页</h1>
          <p class="text-xs text-on-surface-variant font-medium">Xue Zhi Dao · 学习中心</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="hidden md:flex flex-col items-end mr-2">
          <span class="text-xs font-bold text-primary">五年级 (2) 班</span>
          <span class="text-[10px] text-on-surface-variant">截止：2023-11-24 18:00</span>
        </div>
        <div
          class="w-10 h-10 rounded-full overflow-hidden bg-primary-container ring-4 ring-white shadow-sm"
        >
          <img
            alt="Student avatar"
            data-alt="cute cartoon 3d avatar of a young student with glasses and a happy expression on a soft pastel background"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCVU_Aop6vqf-ReUWgiJY9fOc_ZmdgpwJeRkf8obthJl9k3Oi3uQeBE1Wt32hiUUTPeXsk-bvw8oFQOnEJ3Trtoz5zmdB51cbSMh8ml3lBPMq9JEx0aK6U_OCE7-oyCjnBoV7mVzo8UbK_2Cgnm1ehAk59dooSlY_RewAjchY9mQ7qzwXCuiZYAtF8YVp17HwXSwq-qtFURVS9x6pgIV4S7AKzw7elo4_wUbU3qhmLuyIUCHsIltiIJ5sWzkFtIZX5Xgv9RlYEJyBU"
          />
        </div>
      </div>
    </header>

    <main class="flex-grow flex flex-col items-center justify-center p-6 md:p-12 relative lg:ml-72">
      <div
        class="absolute top-20 left-10 w-32 h-32 bg-primary-fixed/20 rounded-full blur-3xl -z-10"
      ></div>
      <div
        class="absolute bottom-20 right-10 w-48 h-48 bg-secondary-fixed/20 rounded-full blur-3xl -z-10"
      ></div>

      <div
        class="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-[40px_40px_80px_rgba(0,100,121,0.08)] overflow-hidden flex flex-col md:flex-row border border-outline-variant/15"
      >
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
              class="absolute -top-4 -right-4 w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center shadow-lg text-white font-bold animate-bounce"
            >
              <span class="material-symbols-outlined">star</span>
            </div>
          </div>
          <div class="mt-8">
            <h2 class="text-2xl font-black text-on-primary-container tracking-tight mb-2">
              趣味几何：三角形的秘密
            </h2>
            <div class="flex flex-wrap justify-center gap-2">
              <span class="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-primary">
                数学课
              </span>
              <span class="px-3 py-1 bg-white/60 rounded-full text-xs font-bold text-secondary">
                每周挑战
              </span>
            </div>
          </div>
          <div class="w-full mt-8 p-4 bg-white/40 rounded-lg backdrop-blur-sm">
            <div class="flex justify-between items-center text-sm mb-2">
              <span class="text-on-surface-variant font-medium">班级参与度</span>
              <span class="text-primary font-bold">85%</span>
            </div>
            <div class="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-primary-fixed-dim to-primary-container w-[85%] rounded-full"
              ></div>
            </div>
          </div>
        </div>

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
              <span class="text-2xl font-black text-on-surface tracking-tight">15</span>
              <span class="text-xs text-on-surface-variant font-medium">题目数量</span>
            </div>
            <div
              class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
            >
              <span class="material-symbols-outlined text-secondary mb-2">schedule</span>
              <span class="text-2xl font-black text-on-surface tracking-tight"
                >20 <span class="text-sm">min</span></span
              >
              <span class="text-xs text-on-surface-variant font-medium">预计时长</span>
            </div>
            <div
              class="bg-surface-container-low p-4 rounded-lg flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-all"
            >
              <div class="flex gap-0.5 mb-2">
                <span class="material-symbols-outlined text-tertiary-fixed text-sm fill-icon"
                  >star</span
                >
                <span class="material-symbols-outlined text-tertiary-fixed text-sm fill-icon"
                  >star</span
                >
                <span class="material-symbols-outlined text-tertiary-fixed text-sm fill-icon"
                  >star</span
                >
                <span class="material-symbols-outlined text-outline-variant text-sm">star</span>
              </div>
              <span class="text-xl font-black text-on-surface tracking-tight">中等难度</span>
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
              <span class="text-2xl font-black text-tertiary tracking-tight">+450 XP</span>
              <span class="text-xs text-on-surface-variant font-medium">完成奖励</span>
            </div>
          </div>
          <div class="mb-10">
            <p class="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              涉及知识点
            </p>
            <div class="flex flex-wrap gap-2">
              <div
                class="px-4 py-2 bg-surface rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-white transition-colors"
              >
                <span class="w-2 h-2 rounded-full bg-primary"></span>
                <span class="text-sm font-semibold text-on-surface-variant">内角和定理</span>
              </div>
              <div
                class="px-4 py-2 bg-surface rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-white transition-colors"
              >
                <span class="w-2 h-2 rounded-full bg-secondary"></span>
                <span class="text-sm font-semibold text-on-surface-variant">等腰三角形性质</span>
              </div>
              <div
                class="px-4 py-2 bg-surface rounded-full border border-outline-variant/20 flex items-center gap-2 hover:bg-white transition-colors"
              >
                <span class="w-2 h-2 rounded-full bg-tertiary"></span>
                <span class="text-sm font-semibold text-on-surface-variant">勾股定理应用</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              class="flex-1 order-2 sm:order-1 bg-surface-container-high py-4 px-6 rounded-xl font-bold text-on-surface-variant hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              稍后再做
            </button>
            <button
              class="flex-[2] order-1 sm:order-2 bg-primary-container py-4 px-6 rounded-xl font-extrabold text-on-primary-container shadow-xl shadow-primary-container/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
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
    </main>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
}
.fill-icon {
  font-variation-settings: 'FILL' 1;
}
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
}
</style>
