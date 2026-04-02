<template>
  <div class="flex min-h-screen flex-col md:flex-row bg-surface font-body text-on-surface">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />
    <main class="flex-1 min-h-screen lg:ml-72 pt-24 md:pt-28">
      <div class="p-6 md:p-10 space-y-8">
        <header class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-headline font-black text-[#006479]">题库上传</h1>
          <p class="text-on-surface-variant text-sm md:text-base">
            支持单题录入与 CSV 批量导入，保存后自动进入题库。
          </p>
        </header>
        <div class="flex items-center justify-center">
          <div
            class="bg-surface-container-low rounded-full p-1.5 flex gap-2 border border-outline-variant/10 shadow-inner"
          >
            <button
              type="button"
              class="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              :class="
                activeTab === 'single'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/60'
              "
              @click="activeTab = 'single'"
            >
              单题上传
            </button>
            <button
              type="button"
              class="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              :class="
                activeTab === 'batch'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/60'
              "
              @click="activeTab = 'batch'"
            >
              批量上传
            </button>
          </div>
        </div>
        <div class="flex justify-center">
          <section
            class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-4xl"
            v-if="activeTab === 'single'"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-headline font-bold">单题上传</h2>
              <span class="text-xs text-on-surface-variant">必填项 *</span>
            </div>
            <div class="flex flex-wrap gap-3 mb-6">
              <button
                v-for="type in questionTypes"
                :key="type.value"
                type="button"
                class="px-5 py-2 rounded-full text-sm font-bold transition-all"
                :class="
                  questionType === type.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-white/60'
                "
                @click="setQuestionType(type.value)"
              >
                {{ type.label }}
              </button>
            </div>
            <form class="space-y-5" @submit.prevent="submitSingle">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-semibold">学科</label>
                  <select
                    v-model="singleForm.subject"
                    class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">请选择学科</option>
                    <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                      {{ subject }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold">年级</label>
                  <select
                    v-model="singleForm.grade"
                    class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">请选择年级</option>
                    <option v-for="grade in gradeOptions" :key="grade" :value="grade">
                      {{ grade }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold">难度 *</label>
                  <div
                    class="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3"
                    role="radiogroup"
                    aria-label="选择难度"
                    @mouseleave="hoveredDifficulty = 0"
                  >
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="transition-all"
                      :class="
                        star <= (hoveredDifficulty || singleForm.difficulty)
                          ? 'text-primary'
                          : 'text-on-surface-variant/40'
                      "
                      :aria-checked="singleForm.difficulty === star"
                      role="radio"
                      @mouseenter="hoveredDifficulty = star"
                      @click="singleForm.difficulty = star"
                    >
                      <span class="material-symbols-outlined" data-icon="star">star</span>
                    </button>
                  </div>
                </div>
              </div>
              <SingleChoiceUploadForm v-if="questionType === 'single_choice'" v-model="detail" />
              <MultiChoiceUploadForm v-if="questionType === 'multiple_choice'" v-model="detail" />
              <TrueFalseUploadForm v-if="questionType === 'true_false'" v-model="detail" />
              <FillBlankUploadForm v-if="questionType === 'fill_blank'" v-model="detail" />
              <EssayUploadForm v-if="questionType === 'essay'" v-model="detail" />
              <p
                v-if="singleMessage"
                class="text-sm"
                :class="singleMessageType === 'success' ? 'text-emerald-600' : 'text-error'"
              >
                {{ singleMessage }}
              </p>
              <div class="flex items-center justify-between gap-4">
                <button
                  type="button"
                  class="px-5 py-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
                  @click="resetSingleForm"
                >
                  清空
                </button>
                <button
                  type="submit"
                  class="px-8 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold shadow-md shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                  :disabled="singleLoading"
                >
                  {{ singleLoading ? '提交中...' : '保存题目' }}
                </button>
              </div>
            </form>
          </section>
          <section
            class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-3xl"
            v-if="activeTab === 'batch'"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-headline font-bold">批量上传 (CSV)</h2>
              <span class="text-xs text-on-surface-variant">文件字段名：file</span>
            </div>
            <div class="space-y-4">
              <div class="bg-surface-container-low rounded-xl p-4 text-xs text-on-surface-variant">
                <p class="font-semibold text-on-surface">必填列：</p>
                <p>content, question_type, difficulty(1-5), answer</p>
                <p class="mt-3 font-semibold text-on-surface">可选列：</p>
                <p>bank_id, subject, grade, explanation</p>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold">选择 CSV 文件</label>
                <input
                  type="file"
                  accept=".csv"
                  class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 text-sm"
                  @change="handleBatchFileChange"
                />
                <p class="text-xs text-on-surface-variant">当前选择：{{ batchFileName }}</p>
              </div>
              <p
                v-if="batchMessage"
                class="text-sm"
                :class="batchMessageType === 'success' ? 'text-emerald-600' : 'text-error'"
              >
                {{ batchMessage }}
              </p>
              <button
                type="button"
                class="w-full px-8 py-3 rounded-xl bg-primary-container text-on-primary-container font-bold shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                :disabled="batchLoading"
                @click="submitBatch"
              >
                {{ batchLoading ? '上传中...' : '开始导入' }}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { createQuestion, uploadQuestionsCsv } from '@/services/questionService.js'
import SingleChoiceUploadForm from '@/components/questions/upload/SingleChoiceUploadForm.vue'
import MultiChoiceUploadForm from '@/components/questions/upload/MultiChoiceUploadForm.vue'
import TrueFalseUploadForm from '@/components/questions/upload/TrueFalseUploadForm.vue'
import FillBlankUploadForm from '@/components/questions/upload/FillBlankUploadForm.vue'
import EssayUploadForm from '@/components/questions/upload/EssayUploadForm.vue'

const activeTab = ref('single')

const questionTypes = [
  { label: '单选题', value: 'single_choice' },
  { label: '多选题', value: 'multiple_choice' },
  { label: '判断题', value: 'true_false' },
  { label: '填空题', value: 'fill_blank' },
  { label: '问答题', value: 'essay' },
]

const questionType = ref('single_choice')

const subjectOptions = ['语文', '数学', '英语', '政治', '历史', '地理', '物理', '化学', '生物']
const gradeOptions = [
  '一年级',
  '二年级',
  '三年级',
  '四年级',
  '五年级',
  '六年级',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三',
]

const singleForm = ref({
  subject: '',
  grade: '',
  difficulty: 3,
})

const getDefaultDetail = (type) => {
  if (type === 'multiple_choice') {
    return { stem: '', options: ['', '', '', ''], correct: ['A'], explanation: '' }
  }
  if (type === 'true_false') {
    return { stem: '', answer: true, explanation: '' }
  }
  if (type === 'fill_blank') {
    return { stem: '', answers: [''], explanation: '' }
  }
  if (type === 'essay') {
    return { stem: '', answer: '', explanation: '' }
  }
  return { stem: '', options: ['', '', '', ''], correct: 'A', explanation: '' }
}

const detail = ref(getDefaultDetail(questionType.value))

const singleLoading = ref(false)
const singleMessage = ref('')
const singleMessageType = ref('')

const batchFile = ref(null)
const batchLoading = ref(false)
const batchMessage = ref('')
const batchMessageType = ref('')
const hoveredDifficulty = ref(0)

const batchFileName = computed(() => batchFile.value?.name || '未选择文件')

const setSingleMessage = (type, message) => {
  singleMessageType.value = type
  singleMessage.value = message
}

const setBatchMessage = (type, message) => {
  batchMessageType.value = type
  batchMessage.value = message
}

const setQuestionType = (type) => {
  questionType.value = type
  detail.value = getDefaultDetail(type)
  setSingleMessage('', '')
}

const resetSingleForm = () => {
  singleForm.value = {
    subject: '',
    grade: '',
    difficulty: 3,
  }
  detail.value = getDefaultDetail(questionType.value)
}

const buildPayload = () => {
  if (questionType.value === 'single_choice') {
    return {
      content: JSON.stringify({
        stem: detail.value.stem.trim(),
        options: detail.value.options.map((option) => option.trim()),
      }),
      answer: String(detail.value.correct).trim(),
      explanation: detail.value.explanation.trim(),
    }
  }
  if (questionType.value === 'multiple_choice') {
    return {
      content: JSON.stringify({
        stem: detail.value.stem.trim(),
        options: detail.value.options.map((option) => option.trim()),
      }),
      answer: detail.value.correct.map((item) => item.trim()).join(','),
      explanation: detail.value.explanation.trim(),
    }
  }
  if (questionType.value === 'true_false') {
    return {
      content: detail.value.stem.trim(),
      answer: detail.value.answer ? 'true' : 'false',
      explanation: detail.value.explanation.trim(),
    }
  }
  if (questionType.value === 'fill_blank') {
    return {
      content: detail.value.stem.trim(),
      answer: detail.value.answers.filter((answer) => !isBlank(answer)).join('|'),
      explanation: detail.value.explanation.trim(),
    }
  }
  return {
    content: detail.value.stem.trim(),
    answer: detail.value.answer.trim(),
    explanation: detail.value.explanation.trim(),
  }
}

const isBlank = (value) => !value || String(value).trim() === ''

const isValidDifficulty = (value) => Number.isInteger(value) && value >= 1 && value <= 5

const validateSingle = () => {
  if (!isValidDifficulty(singleForm.value.difficulty)) {
    return '请选择难度。'
  }

  if (questionType.value === 'single_choice') {
    if (isBlank(detail.value.stem)) return '请填写题干。'
    if (detail.value.options.length < 2) return '至少需要两个选项。'
    if (detail.value.options.some((option) => isBlank(option))) return '请填写完整的选项。'
    if (isBlank(detail.value.correct)) return '请选择正确答案。'
    return ''
  }

  if (questionType.value === 'multiple_choice') {
    if (isBlank(detail.value.stem)) return '请填写题干。'
    if (detail.value.options.length < 2) return '至少需要两个选项。'
    if (detail.value.options.some((option) => isBlank(option))) return '请填写完整的选项。'
    if (!detail.value.correct.length) return '请选择至少一个正确答案。'
    return ''
  }

  if (questionType.value === 'true_false') {
    if (isBlank(detail.value.stem)) return '请填写题干。'
    return ''
  }

  if (questionType.value === 'fill_blank') {
    if (isBlank(detail.value.stem)) return '请填写题干。'
    if (!detail.value.answers.some((answer) => !isBlank(answer))) return '请填写至少一个答案。'
    return ''
  }

  if (isBlank(detail.value.stem)) return '请填写题干。'
  if (isBlank(detail.value.answer)) return '请填写参考答案。'
  return ''
}

const submitSingle = async () => {
  if (singleLoading.value) return
  const validationError = validateSingle()
  if (validationError) {
    setSingleMessage('error', validationError)
    return
  }

  singleLoading.value = true
  setSingleMessage('', '')
  try {
    const payload = buildPayload()
    await createQuestion({
      subject: singleForm.value.subject || null,
      grade: singleForm.value.grade || null,
      question_type: questionType.value,
      difficulty: singleForm.value.difficulty,
      content: payload.content,
      answer: payload.answer,
      explanation: payload.explanation || null,
    })
    setSingleMessage('success', '题目已保存到题库。')
    resetSingleForm()
  } catch (error) {
    setSingleMessage('error', error?.message || '保存失败，请稍后重试。')
  } finally {
    singleLoading.value = false
  }
}

const handleBatchFileChange = (event) => {
  const file = event.target.files?.[0]
  batchFile.value = file || null
  if (file) {
    setBatchMessage('', '')
  }
}

const submitBatch = async () => {
  if (batchLoading.value) return
  if (!batchFile.value) {
    setBatchMessage('error', '请先选择 CSV 文件。')
    return
  }

  batchLoading.value = true
  setBatchMessage('', '')
  try {
    const result = await uploadQuestionsCsv(batchFile.value)
    setBatchMessage('success', `已导入 ${result?.count || 0} 道题目。`)
    batchFile.value = null
  } catch (error) {
    setBatchMessage('error', error?.message || '上传失败，请检查 CSV 格式。')
  } finally {
    batchLoading.value = false
  }
}
</script>

<style scoped></style>
