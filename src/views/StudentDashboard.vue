<template>
  <StudentTopNavbar />
  <StudentSidebar />
  <!-- Main Canvas -->
  <main class="lg:ml-72 p-4 pt-24 md:p-8 md:pt-28 min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <!-- Welcome Banner & Task Board (Left Column) -->
      <div class="col-span-12 lg:col-span-8 space-y-8">
        <!-- Welcome Card -->
        <section
          class="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dim rounded-lg p-8 text-on-primary shadow-xl h-64 flex items-center"
        >
          <div class="relative z-10 space-y-4">
            <div
              class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold"
            >
              <span
                class="material-symbols-outlined text-tertiary-fixed"
                data-icon="local_fire_department"
                style="font-variation-settings: 'FILL' 1"
                >local_fire_department</span
              >
              连续学习 5 天
            </div>
            <h1 class="text-4xl md:text-5xl font-black font-headline leading-tight">
              早上好，<br />小明！
            </h1>
            <p class="text-on-primary/80 font-medium">
              表现不错！今日目标：再获得 50 经验值即可升级！
            </p>
          </div>
          <!-- Mascot Illustration Area Removed -->
        </section>
        <!-- Task Board -->
        <section>
          <div class="flex justify-between items-end mb-6">
            <div>
              <h3 class="text-2xl font-headline font-bold text-on-surface">我的任务</h3>
              <p class="text-on-surface-variant">不要让学习之火熄灭哦！</p>
            </div>
            <button class="text-primary font-bold flex items-center gap-1 hover:underline">
              查看全部
              <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Task Card 1: Breathing Effect -->
            <div
              class="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 breathing-glow relative group"
            >
              <div class="flex justify-between items-start mb-4">
                <div
                  class="w-12 h-12 bg-primary-container rounded-2xl flex items-center justify-center text-primary"
                >
                  <span class="material-symbols-outlined text-3xl" data-icon="functions"
                    >functions</span
                  >
                </div>
                <span
                  class="bg-error-container text-on-error-container text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter"
                  >0/15 已完成</span
                >
              </div>
              <h4 class="text-lg font-bold mb-1">高等代数 II</h4>
              <p class="text-sm text-on-surface-variant mb-6">第 4 章：二次方程</p>
              <div class="space-y-2 mb-6">
                <div class="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>进度</span>
                  <span>0/15 已完成</span>
                </div>
                <div class="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div class="h-full bg-surface-variant w-[0%] transition-all duration-1000"></div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-tertiary text-white rounded-xl font-black bouncy-hover flex items-center justify-center gap-2"
              >
                去挑战 ⚔️
              </button>
            </div>
            <!-- Task Card 2 -->
            <div
              class="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 group hover:shadow-xl transition-all duration-300"
            >
              <div class="flex justify-between items-start mb-4">
                <div
                  class="w-12 h-12 bg-secondary-container rounded-2xl flex items-center justify-center text-secondary"
                >
                  <span class="material-symbols-outlined text-3xl" data-icon="language"
                    >language</span
                  >
                </div>
                <span
                  class="bg-surface-container-high text-on-surface-variant text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter"
                  >8/10 已完成</span
                >
              </div>
              <h4 class="text-lg font-bold mb-1">英语词汇</h4>
              <p class="text-sm text-on-surface-variant mb-6">第 8 单元：大自然</p>
              <div class="space-y-2 mb-6">
                <div class="flex justify-between text-xs font-bold text-on-surface-variant">
                  <span>进度</span>
                  <span>8/10 已完成</span>
                </div>
                <div class="h-3 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-secondary-fixed-dim to-secondary w-[80%] rounded-full"
                  ></div>
                </div>
              </div>
              <button
                class="w-full py-3 bg-surface-container-highest text-on-surface-variant rounded-xl font-black hover:bg-secondary-container hover:text-on-secondary-container transition-colors flex items-center justify-center gap-2"
              >
                继续学习
              </button>
            </div>
          </div>
        </section>
      </div>
      <!-- Data Planet (Right Column) -->
      <div class="col-span-12 lg:col-span-4 space-y-8">
        <!-- My Battle Power Card -->
        <section
          class="bg-surface-container-lowest rounded-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-outline-variant/5"
        >
          <div class="flex items-center gap-3 mb-8">
            <div
              class="w-10 h-10 bg-tertiary-container/20 rounded-full flex items-center justify-center text-tertiary"
            >
              <span class="material-symbols-outlined" data-icon="insights">insights</span>
            </div>
            <h3 class="text-xl font-headline font-bold text-on-surface">我的战力值</h3>
          </div>
          <!-- Radar/Donut Chart Mockup -->
          <div class="relative w-full aspect-square flex items-center justify-center mb-8">
            <!-- Simulated Radar Chart with Circles -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div
                class="absolute w-[80%] h-[80%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
              <div
                class="absolute w-[60%] h-[60%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
              <div
                class="absolute w-[40%] h-[40%] border-[10px] border-surface-container rounded-full opacity-50"
              ></div>
            </div>
            <!-- Subject Mastery Dots/Visual -->
            <div class="relative z-10 w-full h-full">
              <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="#e3e3dd"
                  stroke-width="8"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="#40cef3"
                  stroke-dasharray="180 251"
                  stroke-linecap="round"
                  stroke-width="8"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="30"
                  stroke="#8bfe32"
                  stroke-dasharray="140 188"
                  stroke-linecap="round"
                  stroke-width="8"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="20"
                  stroke="#fe9d00"
                  stroke-dasharray="80 125"
                  stroke-linecap="round"
                  stroke-width="8"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-4xl font-black font-headline text-on-surface">2,840</span>
                <span class="text-xs font-bold text-on-surface-variant tracking-widest uppercase"
                  >总战力</span
                >
              </div>
            </div>
          </div>
          <!-- Legend -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-primary"></div>
                <span class="text-sm font-semibold">数学</span>
              </div>
              <span class="text-sm font-black text-on-surface">85%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-secondary"></div>
                <span class="text-sm font-semibold">英语</span>
              </div>
              <span class="text-sm font-black text-on-surface">72%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-tertiary"></div>
                <span class="text-sm font-semibold">科学</span>
              </div>
              <span class="text-sm font-black text-on-surface">60%</span>
            </div>
          </div>
        </section>
        <!-- Ranking Preview -->
        <section
          class="bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10"
        >
          <h4 class="font-bold mb-4 flex items-center gap-2">
            <span
              class="material-symbols-outlined text-tertiary"
              data-icon="trophy"
              style="font-variation-settings: 'FILL' 1"
              >trophy</span
            >
            班级排名
          </h4>
          <div class="space-y-4">
            <div
              class="flex items-center gap-4 p-2 rounded-xl bg-surface-container-low border border-primary/20"
            >
              <span class="font-black text-primary w-4">1</span>
              <img
                alt="User"
                class="w-8 h-8 rounded-full bg-white"
                data-alt="Avatar of the user"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1b12XzWOGDLsFDE3VnFbCv4LxAvoxE7VKPdDhEI4I429NGDHk48yqdxhxQKLXha3Zt_F5RzTszuVT5gFkTd3AdtuKC4X-qQwydjI6NoHtG3cxhQK4RD1LObYmnOhIu91K8LfFfxK4hNmKiYcqvqXLWZQ1rIpXG3dvFCHi4liyUd0t_h1D4KIo4EpjjXL2VaMcWfWMLUph-7cu6d8whXyzMInXzV_SbNOjI54d7rzLnad_5HfL2bSWmLjcT2x2Zy4fqqIjhtqXsnAS"
              />
              <span class="font-bold text-sm flex-1">Xiao Ming (�?</span>
              <span class="text-xs font-black text-primary">8.4k</span>
            </div>
            <div class="flex items-center gap-4 p-2 rounded-xl">
              <span class="font-black text-on-surface-variant w-4">2</span>
              <img
                alt="User"
                class="w-8 h-8 rounded-full bg-surface-container"
                data-alt="Avatar of a classmate"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB10S85iwtZY3oAXY5QD-pWtFxah7TvmxIRWTjwxpGZRhATIXZ-0LtjnO1vzYmCFC7GkBDnEnzXSO2W0L35UIuphsRS3_8AkhphrXRItfR60qNKDBORMEuwzFHj0wXyXX2EizKKeNEspEboGrGjow4KLB-0_W88ULgNcdapviRrwhJWl5SMlEE70SlpWqHAW0LXWC7sg47whMCAB2QPuTw6Z7JGhA0sFnogPlIZilkMmv-IAm26RxMlca1bnMxHyEeQPVyIi_7V0IeJ"
              />
              <span class="font-bold text-sm flex-1">Zhang Wei</span>
              <span class="text-xs font-bold text-on-surface-variant">8.2k</span>
            </div>
            <div class="flex items-center gap-4 p-2 rounded-xl">
              <span class="font-black text-on-surface-variant w-4">3</span>
              <img
                alt="User"
                class="w-8 h-8 rounded-full bg-surface-container"
                data-alt="Avatar of a classmate"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMaYq9zpp5UQjxV7LlArmUkLlnFzybXNle5b7E7uyw-yagHpVtIWfmCuF9b7ibf53JC1hTtJcxIgHf-b2i4-Rkmgkxr5o2aZrFoOnHprCm5m-v7jbSqTNv6ZgnVG5co2aCemW7URTrYotdk662y-eyVdXj-8hSn7jb8eamT-g0-Ec57ibsYJsP0jfKUW8nAA7I4_vDV79BwPUX8IILxByHpYFOw-zhUnI74WOebTSJOqcaTvh7sy0jOnRVMTBCXrLCXoqXREypPf7m"
              />
              <span class="font-bold text-sm flex-1">Li Hua</span>
              <span class="text-xs font-bold text-on-surface-variant">7.9k</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </main>
  <!-- Floating Action Button (Optional for dashboard context) -->
  <button
    class="fixed bottom-8 right-8 w-16 h-16 bg-tertiary text-white rounded-full shadow-2xl flex items-center justify-center bouncy-hover z-50"
  >
    <span class="material-symbols-outlined text-3xl" data-icon="edit_note">edit_note</span>
  </button>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped></style>
