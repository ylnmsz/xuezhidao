<template>
  <StudentTopNavbar />
  <StudentSidebar />

  <!-- Main Content Area -->
  <main class="pt-24 pb-12 px-6 md:ml-64 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <!-- Header & Progress Section -->
      <header class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 class="text-4xl font-extrabold font-headline text-on-surface mb-2">我的错题本 📖</h1>
          <p class="text-on-surface-variant font-medium">温故而知新，每一次纠错都是一次成长！</p>
        </div>
        <div
          class="bg-surface-container-lowest p-6 rounded-lg candy-shadow flex items-center gap-6 border border-outline-variant/15"
        >
          <div>
            <div class="flex justify-between text-sm font-bold mb-2">
              <span class="text-on-surface-variant">已消灭错题：24/100</span>
              <span class="text-primary">24%</span>
            </div>
            <div class="w-48 h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-secondary-fixed to-secondary w-[24%] rounded-full"
              ></div>
            </div>
          </div>
          <div class="text-center">
            <span class="block text-2xl font-black text-tertiary">Lv.4</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant"
              >知识猎人</span
            >
          </div>
        </div>
      </header>
      <!-- Candy Filters -->
      <section class="flex flex-wrap gap-3 mb-8">
        <button
          class="px-8 py-3 rounded-full bg-primary-container text-on-primary-container font-bold shadow-md hover:scale-105 transition-all"
        >
          全部
        </button>
        <button
          class="px-8 py-3 rounded-full bg-surface-container-lowest text-on-surface-variant font-bold border border-outline-variant/15 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          数学
        </button>
        <button
          class="px-8 py-3 rounded-full bg-surface-container-lowest text-on-surface-variant font-bold border border-outline-variant/15 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          英语
        </button>
        <button
          class="px-8 py-3 rounded-full bg-surface-container-lowest text-on-surface-variant font-bold border border-outline-variant/15 hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          理综
        </button>
      </section>
      <!-- Mistake Cards Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Mistake Card 1 -->
        <div class="warning-card-bg rounded-lg p-8 candy-shadow relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <span
              class="px-4 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full"
              >数学 · 代数</span
            >
            <div class="flex gap-1">
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
              <span class="material-symbols-outlined text-outline-variant">star</span>
            </div>
          </div>
          <h3 class="text-xl font-bold mb-4 text-on-surface leading-snug">
            已知函数 f(x) = ax² + bx + c 的图像经过点 (1, 0)，求证：...
          </h3>
          <div class="bg-white/60 p-4 rounded-xl border border-error-container/20 mb-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-error font-bold text-sm">close</span>
              <span class="text-sm font-bold text-error">你的答案：</span>
            </div>
            <p class="text-on-surface-variant font-medium pl-6">
              通过求导得出 a+b=0，忽略了常数项 c 的限制条件，导致结果偏差。
            </p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant font-medium">收藏于 2023-10-24</span>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              重新挑战 ⚔️
            </button>
          </div>
        </div>
        <!-- Mistake Card 2 -->
        <div class="warning-card-bg rounded-lg p-8 candy-shadow relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-primary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <span class="px-4 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full"
              >英语 · 语法</span
            >
            <div class="flex gap-1">
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
              <span class="material-symbols-outlined text-outline-variant">star</span>
              <span class="material-symbols-outlined text-outline-variant">star</span>
            </div>
          </div>
          <h3 class="text-xl font-bold mb-4 text-on-surface leading-snug">
            Neither of the candidates _____ fit for the position according to the recruiter.
          </h3>
          <div class="bg-white/60 p-4 rounded-xl border border-error-container/20 mb-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-error font-bold text-sm">close</span>
              <span class="text-sm font-bold text-error">你的答案：</span>
            </div>
            <p class="text-on-surface-variant font-medium pl-6">
              选了 "are"。错误认为 candidates 是复数主语，实则 "Neither" 为单数核心词。
            </p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant font-medium">收藏于 2023-10-22</span>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              重新挑战 ⚔️
            </button>
          </div>
        </div>
        <!-- Mistake Card 3 -->
        <div class="warning-card-bg rounded-lg p-8 candy-shadow relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-secondary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <span
              class="px-4 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full"
              >理综 · 物理</span
            >
            <div class="flex gap-1">
              <span class="material-symbols-outlined text-outline-variant">star</span>
              <span class="material-symbols-outlined text-outline-variant">star</span>
              <span class="material-symbols-outlined text-outline-variant">star</span>
            </div>
          </div>
          <h3 class="text-xl font-bold mb-4 text-on-surface leading-snug">
            一个小球从斜面滑下，忽略摩擦力，求其在 A 点的瞬时速度与加速度...
          </h3>
          <div class="bg-white/60 p-4 rounded-xl border border-error-container/20 mb-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-error font-bold text-sm">close</span>
              <span class="text-sm font-bold text-error">你的答案：</span>
            </div>
            <p class="text-on-surface-variant font-medium pl-6">
              计算加速度时直接套用了重力加速度 g，未进行斜面分力计算。
            </p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant font-medium">收藏于 2023-10-21</span>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              重新挑战 ⚔️
            </button>
          </div>
        </div>
        <!-- Mistake Card 4 -->
        <div class="warning-card-bg rounded-lg p-8 candy-shadow relative overflow-hidden group">
          <div
            class="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <span
              class="px-4 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full"
              >数学 · 几何</span
            >
            <div class="flex gap-1">
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
              <span
                class="material-symbols-outlined filled-icon text-tertiary-fixed-dim"
                style="font-variation-settings: 'FILL' 1"
                >star</span
              >
            </div>
          </div>
          <h3 class="text-xl font-bold mb-4 text-on-surface leading-snug">
            在三棱锥 P-ABC 中，已知侧面都是直角三角形，求侧面与底面所成二面角的余弦值。
          </h3>
          <div class="bg-white/60 p-4 rounded-xl border border-error-container/20 mb-6">
            <div class="flex items-center gap-2 mb-2">
              <span class="material-symbols-outlined text-error font-bold text-sm">close</span>
              <span class="text-sm font-bold text-error">你的答案：</span>
            </div>
            <p class="text-on-surface-variant font-medium pl-6">
              建系坐标找错，导致法向量计算错误，正负号反转。
            </p>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-on-surface-variant font-medium">收藏于 2023-10-18</span>
            <button
              class="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              重新挑战 ⚔️
            </button>
          </div>
        </div>
      </section>
    </div>
  </main>
  <!-- Floating Action Button (FAB) -->
  <button
    class="fixed bottom-10 right-10 w-20 h-20 bg-tertiary-container text-on-tertiary-container rounded-full shadow-[0_20px_50px_rgba(254,157,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50"
  >
    <span class="material-symbols-outlined text-4xl">add</span>
  </button>
  <!-- Decorative Elements (Clouds) -->
  <div
    class="fixed top-40 -left-20 w-64 h-32 bg-white/40 blur-3xl rounded-full -z-10 pointer-events-none"
  ></div>
  <div
    class="fixed bottom-20 -right-20 w-96 h-48 bg-primary-container/20 blur-3xl rounded-full -z-10 pointer-events-none"
  ></div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<script setup></script>

<style scoped></style>
