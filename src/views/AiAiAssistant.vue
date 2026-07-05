<template>
  <div class="flex min-h-screen">
    <StudentSidebar />
    <StudentTopNavbar />

    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      accept="image/*,.pdf"
      @change="handleFileSelected"
    />

    <main class="flex-1 p-4 md:p-10 space-y-8 pt-24 md:pt-28 lg:ml-72">
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">
            AI 题目助手
          </h1>
          <p class="text-on-surface-variant max-w-lg">
            上传教材图片或手写笔记，让 AI 为您精准识别并自动生成高质量题目。
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="bouncy-hover flex items-center gap-2 bg-surface-container-lowest px-6 py-3 rounded-full text-on-surface font-semibold shadow-sm border border-outline-variant/10"
            @click="showHistory"
          >
            <span class="material-symbols-outlined" data-icon="history">history</span>
            <span>生成历史</span>
          </button>
        </div>
      </header>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div
          class="lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 relative overflow-hidden group"
        >
          <div class="absolute inset-0 cloud-pattern opacity-40"></div>
          <div
            @click="triggerFileUpload"
            class="relative z-10 border-4 border-dashed border-primary-container/40 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-container transition-all group-hover:bg-primary-container/5"
          >
            <div
              class="w-24 h-24 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-container/20 bouncy-hover"
            >
              <span class="material-symbols-outlined text-5xl" data-icon="add_a_photo"
                >add_a_photo</span
              >
            </div>
            <h3 class="font-headline text-xl font-bold mb-2">拖拽或点击上传</h3>
            <p class="text-on-surface-variant mb-6">
              支持 JPG, PNG, PDF 格式，AI 将自动分析画面文字
            </p>
            <div class="flex gap-4">
              <span class="px-4 py-1 bg-surface-container text-xs font-bold rounded-full"
                >手写识别已开启</span
              >
              <span class="px-4 py-1 bg-surface-container text-xs font-bold rounded-full"
                >高精度 OCR</span
              >
            </div>
          </div>
        </div>
        <div class="lg:col-span-5 bg-surface-container-low rounded-xl p-6 flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-headline font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary" data-icon="visibility"
                >visibility</span
              >
              识别预览区
            </h4>
            <span class="text-xs font-bold px-2 py-1 rounded"
              :class="uploadedFile ? 'bg-secondary/10 text-secondary' : 'bg-secondary/10 text-secondary'"
            >{{ uploadedFile ? '已上传' : '等待上传' }}</span>
          </div>
          <div
            class="flex-1 bg-surface-container-highest rounded-lg border-2 border-outline-variant/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden"
          >
            <template v-if="previewUrl">
              <img :src="previewUrl" class="w-full h-full object-contain rounded-lg" alt="Preview" />
              <span class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{{ uploadedFileName }}</span>
            </template>
            <template v-else>
              <div class="opacity-20 flex flex-col items-center">
                <span class="material-symbols-outlined text-6xl" data-icon="image">image</span>
                <p class="mt-2 font-medium">暂无预览内容</p>
              </div>
              <div
                class="absolute w-full h-full pointer-events-none flex items-center justify-center"
              >
                <div
                  class="absolute w-32 h-32 border-2 border-primary/10 rounded-full animate-ping"
                ></div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <div
          class="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-lg shadow-sm border border-outline-variant/10"
        >
          <div class="flex items-center gap-2">
            <button
              class="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-bold text-sm transition-all"
              @click="filterType = 'all'"
            >
              全部题型
            </button>
            <button
              class="px-5 py-2 rounded-full hover:bg-surface-container text-on-surface-variant font-bold text-sm transition-all"
              @click="filterType = 'single'"
            >
              单选题
            </button>
            <button
              class="px-5 py-2 rounded-full hover:bg-surface-container text-on-surface-variant font-bold text-sm transition-all"
              @click="filterType = 'multi'"
            >
              多选题
            </button>
            <button
              class="px-5 py-2 rounded-full hover:bg-surface-container text-on-surface-variant font-bold text-sm transition-all"
              @click="filterType = 'fill'"
            >
              填空题
            </button>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-sm text-on-surface-variant">
              <span>难度系数:</span>
              <div class="flex text-tertiary">
                <span
                  class="material-symbols-outlined text-sm"
                  data-icon="star"
                  style="font-variation-settings: 'FILL' 1"
                  >star</span
                >
                <span
                  class="material-symbols-outlined text-sm"
                  data-icon="star"
                  style="font-variation-settings: 'FILL' 1"
                  >star</span
                >
                <span
                  class="material-symbols-outlined text-sm"
                  data-icon="star"
                  style="font-variation-settings: 'FILL' 1"
                  >star</span
                >
                <span class="material-symbols-outlined text-sm" data-icon="star">star</span>
                <span class="material-symbols-outlined text-sm" data-icon="star">star</span>
              </div>
            </div>
            <button
              class="bg-secondary-container text-on-secondary-container font-bold px-6 py-2 rounded-full bouncy-hover flex items-center gap-2"
              @click="regenerateQuestions"
            >
              <span class="material-symbols-outlined" data-icon="auto_fix_high">auto_fix_high</span>
              重新生成
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-transparent hover:border-primary-fixed transition-all group"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-2">
                <span
                  class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  >单选题</span
                >
                <div class="flex text-tertiary-fixed scale-75 origin-left">
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span class="material-symbols-outlined" data-icon="star">star</span>
                </div>
              </div>
              <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteCard(0)">
                <span class="material-symbols-outlined" data-icon="delete">delete</span>
              </button>
            </div>
            <h5 class="font-headline font-bold text-lg mb-4 leading-snug">
              根据识别内容，下列关于“光合作用”的描述中，哪一项是错误的？
            </h5>
            <div class="space-y-2 mb-6">
              <div
                class="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg group-hover:bg-primary-container/10 transition-colors"
              >
                <span
                  class="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm"
                  >A</span
                >
                <span class="text-sm">光合作用主要在叶绿体中进行。</span>
              </div>
              <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <span
                  class="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm"
                  >B</span
                >
                <span class="text-sm">氧气是光合作用的产物之一。</span>
              </div>
              <div
                class="flex items-center gap-3 p-3 bg-secondary-container/20 rounded-lg border border-secondary/20"
              >
                <span
                  class="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shadow-sm"
                  >C</span
                >
                <span class="text-sm font-medium"> 光合作用仅在有光照的情况下发生呼吸作用。 </span>
                <span
                  class="material-symbols-outlined text-secondary ml-auto"
                  data-icon="check_circle"
                  style="font-variation-settings: 'FILL' 1"
                  >check_circle</span
                >
              </div>
              <div class="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <span
                  class="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-xs shadow-sm"
                  >D</span
                >
                <span class="text-sm">二氧化碳是该过程的原料。</span>
              </div>
            </div>
            <button
              class="w-full py-2 border-2 border-dashed border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              @click="editQuestion(0)"
            >
              编辑题目详情
            </button>
          </div>

          <div
            class="bg-surface-container-lowest p-6 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-transparent hover:border-primary-fixed transition-all"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex gap-2">
                <span
                  class="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded uppercase"
                  >填空题</span
                >
                <div class="flex text-tertiary-fixed scale-75 origin-left">
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                  <span
                    class="material-symbols-outlined"
                    data-icon="star"
                    style="font-variation-settings: 'FILL' 1"
                    >star</span
                  >
                </div>
              </div>
              <button class="text-on-surface-variant hover:text-error transition-colors" @click="deleteCard(1)">
                <span class="material-symbols-outlined" data-icon="delete">delete</span>
              </button>
            </div>
            <h5 class="font-headline font-bold text-lg mb-4 leading-snug">
              请填写缺失的化学反应方程式：
            </h5>
            <p class="text-on-surface p-4 bg-surface-container rounded-lg font-mono mb-4 italic">
              6CO2 + 6H2O + (光能) → ________ + 6O2
            </p>
            <div class="p-4 bg-secondary/5 rounded-lg border-l-4 border-secondary mb-6">
              <p class="text-xs font-bold text-secondary mb-1">参考答案：</p>
              <p class="text-sm font-medium">C6H12O6 (葡萄糖)</p>
            </div>
            <button
              class="w-full py-2 border-2 border-dashed border-outline-variant rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              @click="editQuestion(1)"
            >
              编辑题目详情
            </button>
          </div>
        </div>

        <div class="mt-12 flex justify-center pb-12">
          <button
            class="group relative px-12 py-5 bg-primary text-on-primary rounded-full font-headline font-extrabold text-xl shadow-[0_20px_50px_rgba(0,100,121,0.3)] bouncy-hover flex items-center gap-4 overflow-hidden"
            @click="addToQuestionBank"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <span
              class="relative z-10 material-symbols-outlined text-2xl"
              data-icon="database"
              style="font-variation-settings: 'FILL' 1"
              >database</span
            >
            <span class="relative z-10">一键加入题库</span>
            <div
              class="relative z-10 ml-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
            >
              <span class="material-symbols-outlined text-sm" data-icon="arrow_forward"
                >arrow_forward</span
              >
            </div>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'

const filterType = ref('all')
const fileInputRef = ref(null)
const previewUrl = ref('')
const uploadedFile = ref(null)
const uploadedFileName = ref('')

function triggerFileUpload() {
  fileInputRef.value?.click()
}

function handleFileSelected(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploadedFile.value = file
  uploadedFileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result || ''
  }
  reader.readAsDataURL(file)
}

function showHistory() {
  alert('功能开发中 — 生成历史功能即将上线')
}

function regenerateQuestions() {
  if (!uploadedFile.value) {
    alert('请先上传教材图片或笔记')
    return
  }
  alert('功能开发中 — AI 将重新生成题目')
}

function deleteCard(index) {
  alert('功能开发中 — 删除功能即将上线')
}

function editQuestion(index) {
  alert('功能开发中 — 题目编辑功能即将上线')
}

function addToQuestionBank() {
  if (!uploadedFile.value) {
    alert('请先上传教材图片，AI 生成题目后方可加入题库')
    return
  }
  alert('功能开发中 — 一键加入题库功能即将上线')
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
}
.cloud-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='40' viewBox='0 0 80 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 20c0-5.5 4.5-10 10-10 1.2 0 2.3.2 3.3.6C24.8 6.5 29.1 4 34 4c6.6 0 12 5.4 12 12 0 .4 0 .8-.1 1.2 2.3 1 3.9 3.3 3.9 6 0 3.9-3.1 7-7 7H17c-3.9 0-7-3.1-7-7z' fill='%2340cef3' fill-opacity='0.08'/%3E%3C/svg%3E");
}
.bouncy-hover:hover {
  transform: scale(1.05);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(24px);
}
</style>
