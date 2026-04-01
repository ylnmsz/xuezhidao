<template>
  <StudentTopNavbar />
  <StudentSidebar />

  <main class="lg:ml-72 p-6 md:p-10 pt-24 md:pt-28 min-h-screen">
    <div class="max-w-7xl mx-auto w-full">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 class="text-4xl font-headline font-extrabold text-on-surface mb-2 tracking-tight">
            我的作业
          </h2>
          <p class="text-on-surface-variant font-medium">
            今天还有 <span class="text-primary font-bold">3</span> 项任务待完成，加油哦！🚀
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            class="px-6 py-2.5 bg-primary-container text-on-primary-container rounded-full font-headline font-bold text-sm shadow-md shadow-primary/10 bouncy-hover active-squish"
          >
            全部
          </button>
          <button
            class="px-6 py-2.5 bg-surface-container-lowest text-on-surface-variant rounded-full font-headline font-bold text-sm hover:bg-white transition-colors bouncy-hover active-squish"
          >
            数学
          </button>
          <button
            class="px-6 py-2.5 bg-surface-container-lowest text-on-surface-variant rounded-full font-headline font-bold text-sm hover:bg-white transition-colors bouncy-hover active-squish"
          >
            语文
          </button>
          <button
            class="px-6 py-2.5 bg-surface-container-lowest text-on-surface-variant rounded-full font-headline font-bold text-sm hover:bg-white transition-colors bouncy-hover active-squish"
          >
            未完成
          </button>
          <div class="w-px h-8 bg-outline-variant/30 mx-1"></div>
          <button
            class="p-2.5 bg-surface-container-lowest text-on-surface-variant rounded-xl bouncy-hover active-squish"
          >
            <span class="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div
          class="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 diffuse-shadow relative overflow-hidden group"
        >
          <div class="absolute top-0 right-0 p-8">
            <span
              class="px-4 py-1.5 bg-error-container/10 text-error-dim rounded-full text-xs font-bold uppercase tracking-wider"
              >今日截止</span
            >
          </div>
          <div class="flex flex-col h-full justify-between gap-8">
            <div>
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold"
                  >数学</span
                >
                <span class="text-on-surface-variant text-sm font-medium">· 预计耗时 45 分钟</span>
              </div>
              <h3 class="text-3xl font-headline font-extrabold text-on-surface leading-tight mb-4">
                第三单元：勾股定理综合练习题
              </h3>
              <p class="text-on-surface-variant max-w-lg">
                完成课本第 45-48 页的所有习题，并上传解题过程照片。注意第 5 题的分类讨论思想。
              </p>
            </div>
            <div class="space-y-6">
              <div class="space-y-2">
                <div class="flex justify-between text-sm font-bold">
                  <span class="text-on-surface">完成进度</span>
                  <span class="text-primary">65%</span>
                </div>
                <div class="w-full h-4 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-primary-fixed rounded-full"
                    style="width: 65%"
                  ></div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-on-surface-variant">
                  <span class="material-symbols-outlined text-xl">calendar_today</span>
                  <span class="text-sm font-semibold">截止于：23:59</span>
                </div>
                <button
                  class="px-10 py-4 bg-primary-container text-on-primary-container font-headline font-bold rounded-full bouncy-hover active-squish shadow-xl shadow-primary/20 flex items-center gap-2"
                  @click="$router.push('/challengeprep')"
                >
                  继续学习
                  <span class="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          class="lg:col-span-4 bg-secondary-container/10 rounded-xl p-8 diffuse-shadow border-2 border-secondary/5 group"
        >
          <div class="flex flex-col h-full justify-between gap-6">
            <div>
              <div
                class="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:rotate-6 transition-transform"
              >
                <span class="material-symbols-outlined text-3xl">auto_stories</span>
              </div>
              <span
                class="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-sm font-bold mb-4 inline-block"
                >语文</span
              >
              <h3 class="text-xl font-headline font-extrabold text-on-surface leading-snug">
                《荷塘月色》背诵与默写
              </h3>
            </div>
            <div class="pt-6 border-t border-outline-variant/10">
              <div class="flex items-center justify-between mb-4">
                <span class="text-on-surface-variant text-sm"
                  >状态：<span class="text-secondary font-bold">未开始</span></span
                >
                <span class="text-on-surface-variant text-xs font-medium">明日截止</span>
              </div>
              <button
                class="w-full py-4 bg-white text-secondary font-headline font-bold rounded-xl bouncy-hover active-squish shadow-lg shadow-secondary/5 border border-secondary/10"
                @click="$router.push('/challengeprep')"
              >
                去完成
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-surface-container-lowest rounded-xl p-6 diffuse-shadow group">
            <div class="flex justify-between items-start mb-4">
              <div
                class="px-3 py-1 bg-tertiary-container/20 text-tertiary-dim rounded-lg text-xs font-bold"
              >
                英语
              </div>
              <span
                class="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors"
                >more_vert</span
              >
            </div>
            <h4 class="font-headline font-bold text-lg text-on-surface mb-2">Unit 4 Words Quiz</h4>
            <p class="text-on-surface-variant text-sm mb-6">掌握本单元核心词汇及短语用法...</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-on-surface-variant/60">完成度 0%</span>
              <button
                class="text-primary font-bold text-sm flex items-center gap-1 bouncy-hover"
                @click="$router.push('/challengeprep')"
              >
                开始挑战 <span class="material-symbols-outlined text-sm">bolt</span>
              </button>
            </div>
          </div>

          <div
            class="bg-surface-container-low/50 rounded-xl p-6 opacity-80 border-2 border-dashed border-outline-variant/20"
          >
            <div class="flex justify-between items-start mb-4">
              <div
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-bold"
              >
                物理
              </div>
              <div class="flex items-center gap-1 text-secondary">
                <span
                  class="material-symbols-outlined text-lg"
                  style="font-variation-settings: 'FILL' 1"
                  >check_circle</span
                >
                <span class="text-xs font-bold">已完成</span>
              </div>
            </div>
            <h4 class="font-headline font-bold text-lg text-on-surface mb-2">力与运动实验报告</h4>
            <p class="text-on-surface-variant text-sm mb-6">已于昨日 16:45 提交</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-secondary">得分：98/100</span>
              <button
                class="text-on-surface-variant font-bold text-sm flex items-center gap-1 bouncy-hover"
                @click="$router.push('/studentanalytics')"
              >
                查看详情 <span class="material-symbols-outlined text-sm">visibility</span>
              </button>
            </div>
          </div>

          <div class="bg-surface-container-low/50 rounded-xl p-6 opacity-60">
            <div class="flex justify-between items-start mb-4">
              <div
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-lg text-xs font-bold"
              >
                历史
              </div>
              <div class="flex items-center gap-1 text-error">
                <span class="material-symbols-outlined text-lg">history_toggle_off</span>
                <span class="text-xs font-bold">已逾期</span>
              </div>
            </div>
            <h4 class="font-headline font-bold text-lg text-on-surface mb-2">中国古代史思维导图</h4>
            <p class="text-on-surface-variant text-sm mb-6">截止时间已过 2 天</p>
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-error">不可重新提交</span>
              <button class="text-on-surface-variant/40 font-bold text-sm cursor-not-allowed">
                无法操作
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <button
    class="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full diffuse-shadow flex items-center justify-center bouncy-hover active-squish z-50"
  >
    <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'wght' 700"
      >add</span
    >
  </button>
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
.diffuse-shadow {
  box-shadow: 0 40px 60px -20px rgba(0, 100, 121, 0.08);
}
.bouncy-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.active-squish:active {
  transform: scale(0.95);
}
</style>
