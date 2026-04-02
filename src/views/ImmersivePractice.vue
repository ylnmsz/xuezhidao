<template>
  <div class="bg-surface text-on-surface min-h-screen selection:bg-primary-container">
    <StudentTopNavbar />
    <StudentSidebar />

    <main class="max-w-[1440px] mx-auto px-4 sm:px-8 py-10 pt-24 lg:ml-72">
      <div class="flex flex-col gap-12">
        <section
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1
              class="text-4xl sm:text-5xl font-black text-on-surface tracking-tight leading-tight"
            >
              练习中心
            </h1>
            <p class="text-on-surface-variant mt-2 text-lg">选择题型/难度/题量，生成你的专属练习</p>
          </div>
          <div class="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-primary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >timer</span
              >
              <span class="text-xs text-on-surface-variant font-medium">练习时长</span>
              <span class="font-bold text-on-surface">45m</span>
            </div>
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-tertiary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >bolt</span
              >
              <span class="text-xs text-on-surface-variant font-medium">连续打卡</span>
              <span class="font-bold text-on-surface">12d</span>
            </div>
            <div
              class="bg-surface-container-lowest p-4 rounded-lg candy-shadow flex flex-col items-center justify-center min-w-[100px]"
            >
              <span
                class="material-symbols-outlined text-secondary mb-1"
                style="font-variation-settings: 'FILL' 1"
                >auto_stories</span
              >
              <span class="text-xs text-on-surface-variant font-medium">完成题数</span>
              <span class="font-bold text-on-surface">128</span>
            </div>
          </div>
        </section>

        <section class="bg-surface-container-low p-8 rounded-lg space-y-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">quiz</span>
                <h3 class="font-headline font-bold">题型选择</h3>
              </div>
              <div class="flex flex-wrap gap-3">
                <button
                  class="px-5 py-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 font-medium active:scale-95 transition-all"
                  type="button"
                >
                  单选题
                </button>
                <button
                  class="px-5 py-3 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-primary/50 transition-all active:scale-95"
                  type="button"
                >
                  多选题
                </button>
                <button
                  class="px-5 py-3 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-primary/50 transition-all active:scale-95"
                  type="button"
                >
                  判断题
                </button>
                <button
                  class="px-5 py-3 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-primary/50 transition-all active:scale-95"
                  type="button"
                >
                  填空题
                </button>
                <button
                  class="px-5 py-3 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/20 hover:border-primary/50 transition-all active:scale-95"
                  type="button"
                >
                  问答题
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">military_tech</span>
                <h3 class="font-headline font-bold">难度选择</h3>
              </div>
              <div class="flex bg-surface-container-highest/30 p-1.5 rounded-full w-fit">
                <button
                  class="px-8 py-2 rounded-full font-bold text-sm bg-white text-on-surface shadow-sm transition-all"
                  type="button"
                >
                  简单
                </button>
                <button
                  class="px-8 py-2 rounded-full font-bold text-sm text-on-surface-variant hover:text-on-surface transition-all"
                  type="button"
                >
                  中等
                </button>
                <button
                  class="px-8 py-2 rounded-full font-bold text-sm text-on-surface-variant hover:text-on-surface transition-all"
                  type="button"
                >
                  困难
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-2 text-on-surface-variant">
              <span class="material-symbols-outlined text-xl">filter_list</span>
              <h3 class="font-headline font-bold">学科选择</h3>
            </div>
            <div class="flex flex-wrap gap-3">
              <span
                class="px-6 py-2.5 rounded-full bg-secondary-container text-on-secondary-container font-bold border-2 border-secondary/20 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2"
              >
                数学 <span class="material-symbols-outlined text-sm">check</span>
              </span>
              <span
                class="px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all"
                >语文</span
              >
              <span
                class="px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all"
                >英语</span
              >
              <span
                class="px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all"
                >物理</span
              >
              <span
                class="px-6 py-2.5 rounded-full bg-surface-container-lowest text-on-surface border-2 border-transparent hover:border-primary/30 cursor-pointer transition-all"
                >化学</span
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-on-surface-variant">
                  <span class="material-symbols-outlined text-xl">tune</span>
                  <h3 class="font-headline font-bold">题量选择</h3>
                </div>
                <span class="font-bold text-primary">20 题</span>
              </div>
              <input
                class="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
                max="100"
                min="10"
                step="10"
                type="range"
              />
              <div class="flex justify-between text-xs font-bold text-outline">
                <span>10</span>
                <span>30</span>
                <span>50</span>
                <span>70</span>
                <span>100</span>
              </div>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-2 text-on-surface-variant">
                <span class="material-symbols-outlined text-xl">alarm</span>
                <h3 class="font-headline font-bold">时间模式</h3>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-bold text-on-surface">不限时</span>
                <button
                  class="relative inline-flex h-8 w-14 items-center rounded-full bg-primary transition-colors focus:outline-none"
                  type="button"
                >
                  <span
                    class="translate-x-7 inline-block h-6 w-6 transform rounded-full bg-white transition-transform"
                  ></span>
                </button>
                <span class="font-bold text-primary">限时 (30min)</span>
              </div>
            </div>
          </div>

          <div
            class="pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-sm font-bold text-on-surface-variant">已选条件:</span>
              <span
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-lg font-bold"
                >单选题</span
              >
              <span
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-lg font-bold"
                >简单</span
              >
              <span
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-lg font-bold"
                >数学</span
              >
              <span
                class="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs rounded-lg font-bold"
                >20题</span
              >
            </div>
            <button
              class="flex items-center gap-2 text-error text-sm font-bold hover:bg-error/5 px-4 py-2 rounded-full transition-all"
              type="button"
            >
              <span class="material-symbols-outlined text-lg">delete</span>
              一键清空
            </button>
          </div>
        </section>

        <section class="space-y-6">
          <div class="flex justify-between items-end">
            <h2 class="text-2xl font-black text-on-surface">为你推荐</h2>
            <button class="text-primary font-bold text-sm hover:underline" type="button">
              查看更多
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              class="group bg-surface-container-lowest p-6 rounded-lg candy-shadow border border-transparent hover:border-primary/20 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
              >
                <span
                  class="material-symbols-outlined text-7xl"
                  style="font-variation-settings: 'FILL' 1"
                >
                  calculate
                </span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                  数学专项
                </span>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-colors"
                >
                  star
                </span>
              </div>
              <h4 class="font-headline font-bold text-lg mb-2">数学 · 中等 · 20题</h4>
              <div class="flex gap-4 mb-6 text-xs text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  45min
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  难度: 适中
                </div>
              </div>
              <button
                class="w-full py-3 bg-primary-container text-on-primary-container rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/10"
                type="button"
              >
                一键开始
              </button>
            </div>

            <div
              class="group bg-surface-container-lowest p-6 rounded-lg candy-shadow border border-transparent hover:border-tertiary/20 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
              >
                <span
                  class="material-symbols-outlined text-7xl"
                  style="font-variation-settings: 'FILL' 1"
                >
                  language
                </span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span class="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">
                  英语听力
                </span>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-tertiary transition-colors"
                >
                  star
                </span>
              </div>
              <h4 class="font-headline font-bold text-lg mb-2">英语 · 困难 · 15题</h4>
              <div class="flex gap-4 mb-6 text-xs text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  30min
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  难度: 极高
                </div>
              </div>
              <button
                class="w-full py-3 bg-tertiary-container text-on-tertiary-container rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-tertiary/10"
                type="button"
              >
                一键开始
              </button>
            </div>

            <div
              class="group bg-surface-container-lowest p-6 rounded-lg candy-shadow border border-transparent hover:border-secondary/20 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden"
            >
              <div
                class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"
              >
                <span
                  class="material-symbols-outlined text-7xl"
                  style="font-variation-settings: 'FILL' 1"
                >
                  history_edu
                </span>
              </div>
              <div class="flex items-center justify-between mb-4">
                <span
                  class="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold"
                >
                  快速巩固
                </span>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-secondary transition-colors"
                >
                  star
                </span>
              </div>
              <h4 class="font-headline font-bold text-lg mb-2">语文 · 简单 · 30题</h4>
              <div class="flex gap-4 mb-6 text-xs text-on-surface-variant">
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  20min
                </div>
                <div class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">trending_up</span>
                  难度: 轻松
                </div>
              </div>
              <button
                class="w-full py-3 bg-secondary-container text-on-secondary-container rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md shadow-secondary/10"
                type="button"
              >
                一键开始
              </button>
            </div>
          </div>
        </section>

        <section class="flex flex-col items-center gap-8 py-10">
          <div class="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
            <button
              class="flex-1 py-5 bg-primary text-white rounded-xl text-xl font-black shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              type="button"
            >
              <span class="material-symbols-outlined text-3xl">play_circle</span>
              开始练习
            </button>
            <button
              class="px-8 py-5 bg-white text-on-surface-variant rounded-xl font-bold border-2 border-outline-variant/10 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <span class="material-symbols-outlined">save</span>
              保存为模板
            </button>
          </div>
          <div class="flex gap-8 text-on-surface-variant font-bold text-sm">
            <button
              class="flex items-center gap-2 hover:text-primary transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined text-lg">history</span>
              进入历史练习
            </button>
            <button
              class="flex items-center gap-2 hover:text-error transition-colors"
              type="button"
            >
              <span class="material-symbols-outlined text-lg">error_outline</span>
              错题专项入口
            </button>
          </div>
        </section>

        <section class="bg-surface-container-lowest/50 p-8 rounded-lg">
          <h3 class="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <span class="material-symbols-outlined">analytics</span>
            最近练习记录
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-surface-container-low transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary"
                >
                  <span class="material-symbols-outlined text-xl">calculate</span>
                </div>
                <div>
                  <p class="font-bold text-on-surface">初中代数综合练习</p>
                  <p class="text-xs text-on-surface-variant">2023.10.24 14:20 · 20 题</p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="hidden sm:block text-right">
                  <p class="text-xs text-on-surface-variant">准确率</p>
                  <p class="font-black text-secondary">90%</p>
                </div>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-all"
                >
                  chevron_right
                </span>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-surface-container-low transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-tertiary/5 flex items-center justify-center text-tertiary"
                >
                  <span class="material-symbols-outlined text-xl">translate</span>
                </div>
                <div>
                  <p class="font-bold text-on-surface">英语词汇专项检测</p>
                  <p class="text-xs text-on-surface-variant">2023.10.23 18:45 · 50 题</p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="hidden sm:block text-right">
                  <p class="text-xs text-on-surface-variant">准确率</p>
                  <p class="font-black text-primary-dim">75%</p>
                </div>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-all"
                >
                  chevron_right
                </span>
              </div>
            </div>
            <div
              class="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-surface-container-low transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-secondary/5 flex items-center justify-center text-secondary"
                >
                  <span class="material-symbols-outlined text-xl">menu_book</span>
                </div>
                <div>
                  <p class="font-bold text-on-surface">古诗词默写练习</p>
                  <p class="text-xs text-on-surface-variant">2023.10.22 09:12 · 10 题</p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="hidden sm:block text-right">
                  <p class="text-xs text-on-surface-variant">准确率</p>
                  <p class="font-black text-tertiary">100%</p>
                </div>
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary transition-all"
                >
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <div
      class="fixed top-20 right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"
    ></div>
    <div
      class="fixed bottom-20 left-[-10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"
    ></div>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>
