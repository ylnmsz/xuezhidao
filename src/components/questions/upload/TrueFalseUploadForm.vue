<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <MathTextarea
        label="题干 *"
        :model-value="modelValue.stem"
        placeholder="请输入判断题题干"
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
      <label class="text-sm font-semibold">正确答案 *</label>
      <div class="flex gap-3">
        <button
          type="button"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all"
          :class="
            modelValue.answer === true
              ? 'bg-primary text-white'
              : 'bg-surface-container-low text-on-surface-variant'
          "
          @click="updateField('answer', true)"
        >
          正确
        </button>
        <button
          type="button"
          class="px-5 py-2 rounded-full text-sm font-bold transition-all"
          :class="
            modelValue.answer === false
              ? 'bg-error text-white'
              : 'bg-surface-container-low text-on-surface-variant'
          "
          @click="updateField('answer', false)"
        >
          错误
        </button>
      </div>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">解析</label>
      <MathTextarea
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
      answer: true,
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])
const renderMath = (value) => renderMathToHtml(value || '')

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
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
