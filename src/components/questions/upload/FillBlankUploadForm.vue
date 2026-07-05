<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <MathTextarea
        label="题干 *"
        :model-value="modelValue.stem"
        placeholder="请输入填空题题干（可用 ____ 表示空格）"
        :rows="4"
        :default-split="true"
        @update:model-value="updateField('stem', $event)"
        @paste.capture="handleStemPaste"
      />
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">题干图片</label>
      <div class="flex flex-wrap items-center gap-3">
        <label
          class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low text-on-surface-variant text-sm font-semibold cursor-pointer hover:bg-surface-container transition-colors"
        >
          <span class="material-symbols-outlined text-base" data-icon="image">image</span>
          选择图片
          <input type="file" accept="image/*" class="hidden" @change="handleStemImageChange" />
        </label>
        <span class="text-xs text-on-surface-variant">支持 JPG/PNG/GIF</span>
      </div>
      <div v-if="modelValue.stemImageUrl" class="flex items-center gap-3">
        <img
          :src="resolveUrl(modelValue.stemImageUrl)"
          alt="stem"
          class="w-24 h-24 rounded-xl object-cover border border-outline-variant/20"
        />
        <button
          type="button"
          class="text-xs text-on-surface-variant hover:text-error"
          @click="updateField('stemImageUrl', '')"
        >
          移除图片
        </button>
      </div>
      <p v-if="stemUploadError" class="text-xs text-error">{{ stemUploadError }}</p>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">标准答案 *</label>
      <div class="space-y-3">
        <div
          v-for="(answer, index) in modelValue.answers"
          :key="`blank-${index}`"
          class="flex gap-3"
        >
          <input
            :value="answer"
            type="text"
            :placeholder="`第 ${index + 1} 空答案`"
            class="flex-1 rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            @input="updateAnswer(index, $event.target.value)"
          />
          <button
            v-if="modelValue.answers.length > 1"
            type="button"
            class="px-4 rounded-xl text-error hover:bg-error-container/10"
            @click="removeAnswer(index)"
          >
            删除
          </button>
        </div>
        <div
          v-for="(answer, index) in modelValue.answers"
          :key="`blank-preview-${index}`"
          class="text-xs text-on-surface-variant"
        >
          <span class="uppercase tracking-wider">预览</span>
          <div class="mt-1" v-html="renderMath(answer)"></div>
        </div>
        <button
          type="button"
          class="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-semibold text-on-surface-variant hover:text-on-surface"
          @click="addAnswer"
        >
          + 添加空
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <MathTextarea
        label="解析"
        :model-value="modelValue.explanation"
        placeholder="可选，填写解析"
        :rows="3"
        @update:model-value="updateField('explanation', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { API_BASE } from '@/services/api.js'
import { uploadQuestionImage } from '@/services/questionService.js'
import { renderMathToHtml } from '@/utils/renderMath.js'
import MathTextarea from './MathTextarea.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      stem: '',
      stemImageUrl: '',
      answers: [''],
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])
const renderMath = (value) => renderMathToHtml(value || '')

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const updateAnswer = (index, value) => {
  const next = [...props.modelValue.answers]
  next[index] = value
  emit('update:modelValue', { ...props.modelValue, answers: next })
}

const addAnswer = () => {
  emit('update:modelValue', { ...props.modelValue, answers: [...props.modelValue.answers, ''] })
}

const removeAnswer = (index) => {
  const next = props.modelValue.answers.filter((_, i) => i !== index)
  emit('update:modelValue', { ...props.modelValue, answers: next.length ? next : [''] })
}

const stemUploadError = ref('')

const resolveUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) {
    const base = API_BASE.replace(/\/api\/?$/, '')
    return `${base}${url}`
  }
  return url
}

const handleStemImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  stemUploadError.value = ''
  try {
    const result = await uploadQuestionImage(file)
    updateField('stemImageUrl', result.url)
  } catch (error) {
    stemUploadError.value = error?.message || '图片上传失败。'
  }
}

const handleStemPaste = async (event) => {
  const file = getClipboardImage(event)
  if (!file) return
  event.preventDefault()
  stemUploadError.value = ''
  try {
    const result = await uploadQuestionImage(file)
    updateField('stemImageUrl', result.url)
  } catch (error) {
    stemUploadError.value = error?.message || '图片上传失败。'
  }
}

const getClipboardImage = (event) => {
  const items = event?.clipboardData?.items
  if (!items) return null
  for (const item of items) {
    if (item.type?.startsWith('image/')) {
      return item.getAsFile()
    }
  }
  return null
}
</script>
