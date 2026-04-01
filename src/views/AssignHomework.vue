<template>
  <div class="flex min-h-screen">
    <StudentTopNavbar />
    <StudentSidebar />

    <!-- Main Workspace -->
    <main
      class="flex-1 lg:ml-72 pt-24 md:pt-28 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8"
    >
      <!-- Left: Question Basket -->
      <section class="md:col-span-5 flex flex-col gap-6">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-extrabold tracking-tight text-primary">题库篮子</h2>
          <div class="flex gap-2">
            <span
              class="bg-primary-container/20 text-primary px-3 py-1 rounded-full text-xs font-bold"
              >数学</span
            >
            <span
              class="bg-secondary-container/20 text-secondary px-3 py-1 rounded-full text-xs font-bold"
              >八年级</span
            >
          </div>
        </div>
        <div class="relative">
          <span
            class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
            data-icon="search"
            >search</span
          >
          <input
            class="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline-variant"
            placeholder="搜索微积分、几何..."
            type="text"
          />
        </div>
        <div
          class="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 scrollbar-hide"
        >
          <!-- Question Card 1 -->
          <div
            class="bouncy-card bg-surface-container-lowest p-5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative group border-2 border-transparent hover:border-primary-container/30 cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-outline">Q-4029</span>
              <div class="flex gap-1">
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
              </div>
            </div>
            <p class="text-on-surface font-medium leading-relaxed mb-4">
              Simplify the expression: (2x + 3)(x - 5) + 4x² - 10.
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-secondary">代数 • 10 分</span>
              <button
                class="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
              >
                <span class="material-symbols-outlined" data-icon="add">add</span>
              </button>
            </div>
          </div>
          <!-- Question Card 2 -->
          <div
            class="bouncy-card bg-surface-container-lowest p-5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative group border-2 border-transparent hover:border-primary-container/30 cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-outline">Q-8812</span>
              <div class="flex gap-1">
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
              </div>
            </div>
            <p class="text-on-surface font-medium leading-relaxed mb-4">
              Calculate the area of a circle with a radius of 7cm. (Use π = 22/7)
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-secondary">几何 • 15 分</span>
              <button
                class="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
              >
                <span class="material-symbols-outlined" data-icon="add">add</span>
              </button>
            </div>
          </div>
          <!-- Question Card 3 -->
          <div
            class="bouncy-card bg-surface-container-lowest p-5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative group border-2 border-transparent hover:border-primary-container/30 cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-outline">Q-1044</span>
              <div class="flex gap-1 text-tertiary">
                <span
                  class="material-symbols-outlined text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
              </div>
            </div>
            <p class="text-on-surface font-medium leading-relaxed mb-4">
              Solve for x: 3x - 12 = 48.
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-secondary">方程 • 5 分</span>
              <button
                class="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
              >
                <span class="material-symbols-outlined" data-icon="add">add</span>
              </button>
            </div>
          </div>
          <!-- Question Card 4 -->
          <div
            class="bouncy-card bg-surface-container-lowest p-5 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative group border-2 border-transparent hover:border-primary-container/30 cursor-grab active:cursor-grabbing"
          >
            <div class="flex justify-between items-start mb-3">
              <span class="text-xs font-bold uppercase tracking-widest text-outline">Q-5521</span>
              <div class="flex gap-1">
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
                <span
                  class="material-symbols-outlined text-tertiary text-sm"
                  data-icon="local_fire_department"
                  style="font-variation-settings: 'FILL' 1"
                  >local_fire_department</span
                >
              </div>
            </div>
            <p class="text-on-surface font-medium leading-relaxed mb-4">
              Find the slope of the line passing through (2, 3) and (6, 11).
            </p>
            <div class="flex justify-between items-center">
              <span class="text-sm font-semibold text-secondary">函数 • 10 分</span>
              <button
                class="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:rotate-90 transition-transform duration-300"
              >
                <span class="material-symbols-outlined" data-icon="add">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <!-- Right: Today's Assignment Sheet -->
      <section class="md:col-span-7">
        <div
          class="bg-surface-container-lowest rounded-lg shadow-[0_40px_100px_rgba(0,0,0,0.05)] min-h-[700px] flex flex-col overflow-hidden"
        >
          <!-- Sheet Header -->
          <div
            class="p-8 border-b border-surface-container-high bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div class="flex justify-between items-start">
              <div>
                <input
                  class="text-3xl font-black text-on-surface bg-transparent border-none p-0 focus:ring-0 w-full mb-1"
                  type="text"
                  value="每周数学冲刺 #4"
                />
                <p class="text-on-surface-variant flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm" data-icon="calendar_today"
                    >calendar_today</span
                  >
                  截止日期: 2023年10月24日 • 二班
                </p>
              </div>
              <div
                class="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl text-center"
              >
                <span class="block text-2xl font-bold">100</span>
                <span class="text-[10px] font-bold uppercase tracking-tighter">分数</span>
              </div>
            </div>
          </div>
          <!-- Assignment Content -->
          <div class="p-8 flex-1 flex flex-col gap-6">
            <!-- Added Question 1 -->
            <div class="flex gap-4 group">
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm"
                >
                  1
                </div>
                <div class="w-1 flex-1 bg-surface-container-high my-2 rounded-full"></div>
              </div>
              <div
                class="flex-1 bg-surface-container-low/50 rounded-xl p-4 flex justify-between items-center group-hover:bg-surface-container-low transition-colors"
              >
                <div>
                  <h4 class="font-bold text-primary mb-1">Pythagorean Theorem Application</h4>
                  <p class="text-sm text-on-surface-variant">
                    Find the hypotenuse of a right-angled triangle with sides 6cm and 8cm.
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-bold text-sm">15 pts</span>
                  <button class="text-error opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-symbols-outlined" data-icon="delete">delete</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- Added Question 2 -->
            <div class="flex gap-4 group">
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm"
                >
                  2
                </div>
                <div class="w-1 flex-1 bg-surface-container-high my-2 rounded-full"></div>
              </div>
              <div
                class="flex-1 bg-surface-container-low/50 rounded-xl p-4 flex justify-between items-center group-hover:bg-surface-container-low transition-colors"
              >
                <div>
                  <h4 class="font-bold text-primary mb-1">Probability Essentials</h4>
                  <p class="text-sm text-on-surface-variant">
                    A bag contains 5 red balls and 3 blue balls. What is the probability...
                  </p>
                </div>
                <div class="flex items-center gap-4">
                  <span class="font-bold text-sm">10 pts</span>
                  <button class="text-error opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="material-symbols-outlined" data-icon="delete">delete</span>
                  </button>
                </div>
              </div>
            </div>
            <!-- Drag & Drop Placeholder -->
            <div
              class="drag-placeholder rounded-xl h-32 flex flex-col items-center justify-center text-outline-variant bg-surface-container-low/30 border-spacing-4 hover:bg-surface-container-low/50 transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-4xl mb-2" data-icon="upload_file"
                >upload_file</span
              >
              <p class="font-bold">拖拽题目到此处或点击 "+" 添加</p>
            </div>
          </div>
          <!-- Empty State Decoration -->
          <div class="px-8 pb-8 opacity-20 pointer-events-none">
            <div class="h-2 w-1/2 bg-surface-container-highest rounded-full mb-4"></div>
            <div class="h-2 w-3/4 bg-surface-container-highest rounded-full mb-4"></div>
          </div>
        </div>
      </section>
    </main>
    <!-- Floating Graphics Decoration -->
    <div class="fixed top-1/4 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10"></div>
    <div
      class="fixed bottom-1/4 -right-12 w-64 h-64 bg-tertiary/5 rounded-full blur-3xl -z-10"
    ></div>
    <!-- Publish Bar (Fixed Glassmorphism Footer) -->
    <footer
      class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl glass-panel rounded-full p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-surface-container-lowest/50 z-[60]"
    >
      <div class="flex items-center gap-8 pl-6">
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary"
          >
            <span class="material-symbols-outlined" data-icon="task_alt">task_alt</span>
          </div>
          <div>
            <span class="block text-lg font-black leading-tight">已选 10 题</span>
            <span class="text-sm text-on-surface-variant font-medium">总分 100</span>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-2 text-outline">
          <span class="material-symbols-outlined" data-icon="timer">timer</span>
          <span class="text-sm font-semibold">预计用时: 45 分钟</span>
        </div>
      </div>
      <div class="flex items-center gap-3 pr-2">
        <button
          class="px-6 py-4 rounded-full font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          保存草稿
        </button>
        <button
          class="bg-primary text-on-primary px-8 py-4 rounded-full font-black text-lg flex items-center gap-3 shadow-[0_10px_20px_rgba(0,100,121,0.3)] hover:scale-105 active:scale-95 transition-all"
        >
          已选 10 题
        </button>
      </div>
    </footer>
    <!-- Side Decoration Items (Purely UI) -->
    <div class="fixed bottom-32 left-8 hidden xl:flex flex-col gap-4 animate-bounce">
      <div
        class="w-14 h-14 bg-secondary-container/40 rounded-lg flex items-center justify-center shadow-inner"
      >
        <span class="material-symbols-outlined text-secondary" data-icon="psychology"
          >psychology</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped></style>
