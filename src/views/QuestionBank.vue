<template>
  <div class="flex min-h-screen flex-col md:flex-row">
    <!-- SideNavBar Shared Component Implementation -->
    <StudentSidebar />
    <StudentTopNavbar profile-route="/teacherprofile" />
    <!-- Main Content Canvas -->
    <main class="flex-1 flex flex-col min-h-screen lg:ml-72 pt-24 md:pt-28">
      <!-- Question Bank Management Interface -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden p-6 gap-6">
        <!-- Left Panel: Folder Tree -->
        <section class="w-full lg:w-80 flex flex-col gap-4">
          <div class="bg-surface-container-low rounded-lg p-6 flex-1 overflow-y-auto">
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-headline font-bold text-on-surface">题库分类</h3>
              <button
                class="material-symbols-outlined text-primary hover:bg-primary-container/20 rounded-full p-1"
                data-icon="create_new_folder"
              >
                create_new_folder
              </button>
            </div>
            <div class="space-y-3">
              <!-- Folder Item -->
              <div class="group cursor-pointer">
                <div
                  class="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors"
                >
                  <span
                    class="material-symbols-outlined text-tertiary-fixed text-3xl"
                    data-icon="folder"
                    style="font-variation-settings: 'FILL' 1"
                    >folder</span
                  >
                  <span
                    class="font-bold text-sm text-on-surface-variant group-hover:text-primary transition-colors"
                    >📁 代数</span
                  >
                </div>
                <div class="ml-8 mt-2 space-y-1 border-l-2 border-outline-variant/20">
                  <div
                    class="flex items-center gap-3 p-2 ml-3 rounded-lg bg-primary-container/10 text-primary border-r-4 border-primary"
                  >
                    <span class="material-symbols-outlined text-lg" data-icon="description"
                      >description</span
                    >
                    <span class="text-xs font-bold">线性方程</span>
                  </div>
                  <div
                    class="flex items-center gap-3 p-2 ml-3 rounded-lg hover:bg-white text-on-surface-variant"
                  >
                    <span class="material-symbols-outlined text-lg" data-icon="description"
                      >description</span
                    >
                    <span class="text-xs font-bold text-slate-500">多项式</span>
                  </div>
                </div>
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <span
                  class="material-symbols-outlined text-secondary text-3xl"
                  data-icon="folder"
                  style="font-variation-settings: 'FILL' 1"
                  >folder</span
                >
                <span class="font-bold text-sm text-on-surface-variant">📁 几何</span>
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer"
              >
                <span
                  class="material-symbols-outlined text-primary-container text-3xl"
                  data-icon="folder"
                  style="font-variation-settings: 'FILL' 1"
                  >folder</span
                >
                <span class="font-bold text-sm text-on-surface-variant">📁 语法</span>
              </div>
              <div
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer opacity-60"
              >
                <span
                  class="material-symbols-outlined text-tertiary text-3xl"
                  data-icon="folder"
                  style="font-variation-settings: 'FILL' 1"
                  >folder</span
                >
                <span class="font-bold text-sm text-on-surface-variant">📁 词汇</span>
              </div>
            </div>
          </div>
          <div class="bg-primary/5 rounded-lg p-6 border border-primary/10">
            <div class="flex items-center gap-3 mb-2">
              <span class="material-symbols-outlined text-primary" data-icon="cloud_done"
                >cloud_done</span
              >
              <p class="text-xs font-bold text-primary">所有更改已保存</p>
            </div>
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full w-3/4"></div>
            </div>
            <p class="text-[10px] mt-2 text-slate-400 font-medium">
              存储空间：已使用 2.0GB 中的 1.2GB
            </p>
          </div>
        </section>
        <!-- Right Panel: Question Entry -->
        <section class="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
          <div
            class="bg-surface-container-lowest rounded-lg asymmetric-shadow p-8 flex flex-col gap-8 min-h-fit"
          >
            <!-- Question Type Toggle -->
            <div class="flex items-center justify-center">
              <div
                class="bg-surface-container-low p-1.5 rounded-full flex gap-1 border border-outline-variant/10"
              >
                <button
                  class="px-8 py-2.5 rounded-full text-sm font-bold bg-white text-primary shadow-sm transition-all scale-105"
                >
                  单选题
                </button>
                <button
                  class="px-8 py-2.5 rounded-full text-sm font-bold text-on-surface-variant hover:bg-white/50 transition-all"
                >
                  多选题
                </button>
                <button
                  class="px-8 py-2.5 rounded-full text-sm font-bold text-on-surface-variant hover:bg-white/50 transition-all"
                >
                  填空题
                </button>
              </div>
            </div>
            <!-- Question Stem Area -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="font-headline font-bold text-on-surface text-lg">题目题干</label>
                <div class="flex gap-2">
                  <button
                    class="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-lg text-slate-400 text-sm"
                    data-icon="image"
                  >
                    image
                  </button>
                  <button
                    class="material-symbols-outlined p-2 hover:bg-surface-container-low rounded-lg text-slate-400 text-sm"
                    data-icon="functions"
                  >
                    functions
                  </button>
                </div>
              </div>
              <div
                class="w-full min-h-[120px] bg-surface-container-low rounded-lg p-6 border-2 border-transparent focus-within:border-primary-container focus-within:bg-white transition-all outline-none"
              >
                <p class="text-on-surface-variant leading-relaxed">
                  请解出下列线性方程中的
                  <span
                    class="font-mono bg-white px-2 py-0.5 rounded border border-surface-container-high italic"
                    >x</span
                  >：<br /><br />
                  <span class="text-xl font-headline font-bold text-primary">3x + 12 = 48</span>
                </p>
              </div>
            </div>
            <!-- Options Section -->
            <div class="space-y-4">
              <label class="font-headline font-bold text-on-surface text-lg">题目题干</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Option A -->
                <div class="relative group">
                  <div
                    class="flex items-center bg-surface-container-low rounded-lg p-4 gap-4 border-2 border-transparent hover:border-primary-container transition-all"
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-primary"
                    >
                      A
                    </div>
                    <input
                      class="bg-transparent border-none focus:ring-0 w-full font-medium text-on-surface-variant"
                      type="text"
                      value="x = 10"
                    />
                    <button
                      class="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors"
                      data-icon="check_circle"
                    >
                      check_circle
                    </button>
                  </div>
                </div>
                <!-- Option B - Correct Answer Selected -->
                <div class="relative group">
                  <div
                    class="flex items-center bg-white rounded-lg p-4 gap-4 border-2 border-secondary shadow-lg shadow-secondary/10 transition-all"
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center font-bold text-on-secondary-container"
                    >
                      B
                    </div>
                    <input
                      class="bg-transparent border-none focus:ring-0 w-full font-bold text-secondary"
                      type="text"
                      value="x = 12"
                    />
                    <button
                      class="material-symbols-outlined text-secondary"
                      data-icon="check_circle"
                      style="font-variation-settings: 'FILL' 1"
                    >
                      check_circle
                    </button>
                  </div>
                </div>
                <!-- Option C -->
                <div class="relative group">
                  <div
                    class="flex items-center bg-surface-container-low rounded-lg p-4 gap-4 border-2 border-transparent hover:border-primary-container transition-all"
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-primary"
                    >
                      C
                    </div>
                    <input
                      class="bg-transparent border-none focus:ring-0 w-full font-medium text-on-surface-variant"
                      type="text"
                      value="x = 15"
                    />
                    <button
                      class="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors"
                      data-icon="check_circle"
                    >
                      check_circle
                    </button>
                  </div>
                </div>
                <!-- Option D -->
                <div class="relative group">
                  <div
                    class="flex items-center bg-surface-container-low rounded-lg p-4 gap-4 border-2 border-transparent hover:border-primary-container transition-all"
                  >
                    <div
                      class="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-primary"
                    >
                      D
                    </div>
                    <input
                      class="bg-transparent border-none focus:ring-0 w-full font-medium text-on-surface-variant"
                      type="text"
                      value="x = 24"
                    />
                    <button
                      class="material-symbols-outlined text-outline-variant group-hover:text-secondary transition-colors"
                      data-icon="check_circle"
                    >
                      check_circle
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <!-- Explanation Area -->
            <div class="space-y-3">
              <label class="font-headline font-bold text-on-surface text-lg">题目题干</label>
              <div
                class="w-full min-h-[100px] bg-surface-container-low rounded-lg p-6 border-2 border-transparent focus-within:border-primary-container focus-within:bg-white transition-all outline-none"
              >
                <p class="text-on-surface-variant italic text-sm">
                  第一步：等式两边同时减去 12 (3x = 36)。 <br />
                  第二步：等式两边同时除以 3 (x = 12)。
                </p>
              </div>
            </div>
          </div>
          <!-- Sticky Footer -->
          <footer class="flex items-center justify-between gap-4 p-4">
            <div class="flex gap-3">
              <button
                class="px-8 py-4 bg-surface-container-high text-on-surface-variant font-headline font-bold rounded-xl hover:bg-surface-variant transition-colors flex items-center gap-2"
              >
                <span class="material-symbols-outlined" data-icon="visibility">visibility</span>
                预览
              </button>
              <button
                class="px-8 py-4 bg-tertiary-container text-on-tertiary-container font-headline font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <span class="material-symbols-outlined" data-icon="auto_awesome">auto_awesome</span>
                AI 润色
              </button>
            </div>
            <div class="flex gap-4">
              <button class="px-6 py-4 text-outline font-bold hover:text-error transition-colors">
                舍弃草稿
              </button>
              <button
                class="px-12 py-4 bg-secondary-container text-on-secondary-container font-headline font-black text-lg rounded-xl shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                <span class="material-symbols-outlined" data-icon="save">save</span> 保存到题库
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped></style>
