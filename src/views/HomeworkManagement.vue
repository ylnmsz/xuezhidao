<template>
  <div class="bg-surface font-body text-on-surface">
    <div class="flex min-h-screen">
      <StudentSidebar />
      <StudentTopNavbar />

      <main class="flex-1 min-h-screen overflow-x-hidden lg:ml-72">
        <header
          class="bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex justify-between items-center px-8 py-4 w-full"
        >
          <div class="flex items-center gap-6 flex-1">
            <span class="text-2xl font-black text-cyan-600 tracking-tight font-headline"
              >Xue Zhi Dao</span
            >
            <div class="relative max-w-md w-full hidden lg:block">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                >search</span
              >
              <input
                class="w-full pl-12 pr-4 py-2 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary-container text-sm"
                placeholder="搜索作业名称..."
                type="text"
              />
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <button
                class="p-2 text-slate-500 hover:scale-105 hover:bg-slate-100/50 rounded-full transition-all duration-300"
              >
                <span class="material-symbols-outlined" data-icon="notifications"
                  >notifications</span
                >
              </button>
              <button
                class="p-2 text-slate-500 hover:scale-105 hover:bg-slate-100/50 rounded-full transition-all duration-300"
              >
                <span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
              </button>
            </div>
            <div class="h-8 w-[1px] bg-outline-variant/30 mx-2"></div>
            <button
              class="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
            >
              <span class="material-symbols-outlined" data-icon="add">add</span>
              新建作业
            </button>
          </div>
        </header>

        <div class="p-8 max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <nav class="flex items-center gap-2 text-sm text-on-surface-variant mb-2">
                <span>首页</span>
                <span class="material-symbols-outlined text-xs">chevron_right</span>
                <span class="text-primary font-semibold">作业管理</span>
              </nav>
              <h1
                class="text-4xl font-headline font-extrabold text-on-surface flex items-center gap-3"
              >
                作业管理 <span class="text-3xl">📝</span>
              </h1>
              <p class="text-on-surface-variant mt-2 text-lg">
                您有 <span class="text-tertiary font-bold">12份</span> 待批改作业，继续加油！
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <div
                class="bg-surface-container-low px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                <span class="material-symbols-outlined text-on-surface-variant text-xl"
                  >grid_view</span
                >
                <span class="text-sm font-semibold">全部班级</span>
                <span class="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
              <div
                class="bg-surface-container-low px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                <span class="material-symbols-outlined text-on-surface-variant text-xl"
                  >filter_list</span
                >
                <span class="text-sm font-semibold">进行中</span>
                <span class="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
              <div
                class="bg-surface-container-low px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-surface-container transition-colors cursor-pointer border border-outline-variant/10"
              >
                <span class="material-symbols-outlined text-on-surface-variant text-xl"
                  >calendar_month</span
                >
                <span class="text-sm font-semibold">最近7天</span>
                <span class="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div
              class="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-primary-container"></div>
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span
                      class="inline-block px-3 py-1 bg-primary-container/10 text-primary text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                      >数学类</span
                    >
                    <h3
                      class="text-xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors"
                    >
                      初二数学：二次函数综合练习
                    </h3>
                    <p class="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm">groups</span>
                      八年级 (3) 班
                    </p>
                  </div>
                  <div class="relative group/more">
                    <button
                      class="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    >
                      <span class="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div
                    class="bg-surface-container-low/50 p-3 rounded-2xl border border-outline-variant/5"
                  >
                    <p class="text-xs text-on-surface-variant font-medium mb-1">截止时间</p>
                    <p class="text-sm font-bold flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm text-error">timer</span>
                      今天 23:59
                    </p>
                  </div>
                  <div
                    class="bg-tertiary-container/10 p-3 rounded-2xl border border-tertiary-container/20"
                  >
                    <p class="text-xs text-tertiary font-bold mb-1">待批改数量</p>
                    <p
                      class="text-sm font-black flex items-center gap-1.5 text-on-tertiary-container"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-tertiary"
                        style="font-variation-settings: 'FILL' 1"
                        >warning</span
                      >
                      15 份
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center justify-between gap-4">
                <div class="relative w-28 h-28 flex items-center justify-center">
                  <svg class="w-full h-full -rotate-90">
                    <circle
                      class="text-surface-container-high"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-width="8"
                    ></circle>
                    <circle
                      class="text-secondary"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-dasharray="301.59"
                      stroke-dashoffset="60.3"
                      stroke-linecap="round"
                      stroke-width="8"
                    ></circle>
                  </svg>
                  <div class="absolute flex flex-col items-center">
                    <span class="text-lg font-black text-on-surface">80%</span>
                    <span
                      class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                    >
                      提交率
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <button
                    class="w-full py-2.5 px-4 bg-primary text-on-primary rounded-2xl text-sm font-bold hover:scale-[1.05] active:scale-95 transition-all"
                  >
                    去批改
                  </button>
                  <button
                    class="w-full py-2.5 px-4 bg-surface-container-low text-on-surface-variant rounded-2xl text-sm font-bold hover:bg-surface-container transition-all"
                  >
                    查看分析
                  </button>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span
                      class="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                      >英语类</span
                    >
                    <h3
                      class="text-xl font-headline font-bold text-on-surface group-hover:text-secondary transition-colors"
                    >
                      Unit 4: My Neighborhood 单词听写
                    </h3>
                    <p class="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm">groups</span>
                      八年级 (1) 班
                    </p>
                  </div>
                  <div class="relative group/more">
                    <button
                      class="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    >
                      <span class="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div
                    class="bg-surface-container-low/50 p-3 rounded-2xl border border-outline-variant/5"
                  >
                    <p class="text-xs text-on-surface-variant font-medium mb-1">截止时间</p>
                    <p class="text-sm font-bold flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-sm text-on-surface-variant"
                        >schedule</span
                      >
                      明天 18:00
                    </p>
                  </div>
                  <div class="bg-secondary/5 p-3 rounded-2xl border border-secondary/10">
                    <p class="text-xs text-secondary font-bold mb-1">待批改数量</p>
                    <p class="text-sm font-black flex items-center gap-1.5 text-secondary-dim">
                      <span
                        class="material-symbols-outlined text-sm text-secondary"
                        style="font-variation-settings: 'FILL' 1"
                        >check_circle</span
                      >
                      0 份
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center justify-between gap-4">
                <div class="relative w-28 h-28 flex items-center justify-center">
                  <svg class="w-full h-full -rotate-90">
                    <circle
                      class="text-surface-container-high"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-width="8"
                    ></circle>
                    <circle
                      class="text-secondary"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-dasharray="301.59"
                      stroke-dashoffset="150.8"
                      stroke-linecap="round"
                      stroke-width="8"
                    ></circle>
                  </svg>
                  <div class="absolute flex flex-col items-center">
                    <span class="text-lg font-black text-on-surface">50%</span>
                    <span
                      class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                    >
                      提交率
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <button
                    class="w-full py-2.5 px-4 bg-secondary text-on-secondary rounded-2xl text-sm font-bold opacity-50 cursor-not-allowed"
                  >
                    批改完成
                  </button>
                  <button
                    class="w-full py-2.5 px-4 bg-surface-container-low text-on-surface-variant rounded-2xl text-sm font-bold hover:bg-surface-container transition-all"
                  >
                    查看分析
                  </button>
                </div>
              </div>
            </div>

            <div
              class="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-500 group relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-tertiary"></div>
              <div class="flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <span
                      class="inline-block px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full mb-3 uppercase tracking-wider"
                      >物理类</span
                    >
                    <h3
                      class="text-xl font-headline font-bold text-on-surface group-hover:text-tertiary transition-colors"
                    >
                      初二物理：杠杆原理实验报告
                    </h3>
                    <p class="text-on-surface-variant text-sm mt-1 flex items-center gap-2">
                      <span class="material-symbols-outlined text-sm">groups</span>
                      八年级 (3) 班
                    </p>
                  </div>
                  <div class="relative group/more">
                    <button
                      class="p-2 hover:bg-surface-container-low rounded-full transition-colors"
                    >
                      <span class="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mt-6">
                  <div
                    class="bg-surface-container-low/50 p-3 rounded-2xl border border-outline-variant/5"
                  >
                    <p class="text-xs text-on-surface-variant font-medium mb-1">截止时间</p>
                    <p class="text-sm font-bold flex items-center gap-1.5 text-error">
                      <span class="material-symbols-outlined text-sm">event_busy</span>
                      已截止 (10.12)
                    </p>
                  </div>
                  <div
                    class="bg-tertiary-container/10 p-3 rounded-2xl border border-tertiary-container/20"
                  >
                    <p class="text-xs text-tertiary font-bold mb-1">待批改数量</p>
                    <p
                      class="text-sm font-black flex items-center gap-1.5 text-on-tertiary-container"
                    >
                      <span
                        class="material-symbols-outlined text-sm text-tertiary"
                        style="font-variation-settings: 'FILL' 1"
                        >warning</span
                      >
                      32 份
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex flex-col items-center justify-between gap-4">
                <div class="relative w-28 h-28 flex items-center justify-center">
                  <svg class="w-full h-full -rotate-90">
                    <circle
                      class="text-surface-container-high"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-width="8"
                    ></circle>
                    <circle
                      class="text-secondary"
                      cx="56"
                      cy="56"
                      fill="transparent"
                      r="48"
                      stroke="currentColor"
                      stroke-dasharray="301.59"
                      stroke-dashoffset="15.07"
                      stroke-linecap="round"
                      stroke-width="8"
                    ></circle>
                  </svg>
                  <div class="absolute flex flex-col items-center">
                    <span class="text-lg font-black text-on-surface">95%</span>
                    <span
                      class="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter"
                    >
                      提交率
                    </span>
                  </div>
                </div>
                <div class="flex flex-col gap-2 w-full">
                  <button
                    class="w-full py-2.5 px-4 bg-tertiary text-on-tertiary rounded-2xl text-sm font-bold hover:scale-[1.05] active:scale-95 transition-all shadow-md shadow-tertiary/20"
                  >
                    立即批改
                  </button>
                  <button
                    class="w-full py-2.5 px-4 bg-surface-container-low text-on-surface-variant rounded-2xl text-sm font-bold hover:bg-surface-container transition-all"
                  >
                    查看分析
                  </button>
                </div>
              </div>
            </div>

            <div
              class="border-2 border-dashed border-outline-variant/30 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-surface-container-low/30 hover:border-primary/40 transition-all cursor-pointer group min-h-[250px]"
            >
              <div
                class="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform bg-white shadow-sm"
              >
                <span class="material-symbols-outlined text-3xl text-primary">add_circle</span>
              </div>
              <div class="text-center">
                <p class="font-headline font-bold text-on-surface">发布新作业</p>
                <p class="text-xs text-on-surface-variant mt-1">支持选择题、简答题及多媒体附件</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
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
    'opsz' 24;
  vertical-align: middle;
}
</style>
