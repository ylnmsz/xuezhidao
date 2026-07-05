<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <MathTextarea
        label="题干 *"
        :model-value="modelValue.stem"
        placeholder="请输入多选题题干"
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
      <label class="text-sm font-semibold">选项 *</label>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(option, index) in modelValue.options" :key="`opt-${index}`">
          <div class="flex gap-2">
            <input
              :value="option"
              type="text"
              :placeholder="`选项 ${optionLabels[index]}`"
              class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
              @input="updateOption(index, $event.target.value)"
              @paste="handleOptionPaste(index, $event)"
            />
            <button
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-xl text-error hover:bg-error-container/10"
              :disabled="modelValue.options.length <= 2"
              @click="removeOption(index)"
              aria-label="删除选项"
            >
              ×
            </button>
          </div>
          <div v-if="option" class="mt-2 text-xs text-on-surface-variant">
            <span class="uppercase tracking-wider">预览</span>
            <div class="mt-1" v-html="renderMath(option)"></div>
          </div>
          <div class="mt-2 flex items-center gap-3">
            <label
              class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-[11px] font-semibold text-on-surface-variant cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span class="material-symbols-outlined text-sm" data-icon="image">image</span>
              选图片
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleOptionImageChange(index, $event)"
              />
            </label>
            <div v-if="modelValue.optionImages[index]" class="flex items-center gap-2">
              <img
                :src="resolveUrl(modelValue.optionImages[index])"
                alt="option"
                class="w-12 h-12 rounded-lg object-cover border border-outline-variant/20"
              />
              <button
                type="button"
                class="text-[10px] text-on-surface-variant hover:text-error"
                @click="updateOptionImage(index, '')"
              >
                移除
              </button>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        class="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-semibold text-on-surface-variant hover:text-on-surface"
        @click="addOption"
      >
        + 添加选项
      </button>
      <p v-if="optionUploadError" class="text-xs text-error">{{ optionUploadError }}</p>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">正确答案 *</label>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="label in optionLabels"
          :key="label"
          class="flex items-center gap-2 text-sm font-semibold bg-surface-container-low px-4 py-2 rounded-full"
        >
          <input
            type="checkbox"
            :value="label"
            :checked="modelValue.correct.includes(label)"
            class="accent-primary"
            @change="toggleCorrect(label, $event.target.checked)"
          />
          {{ label }}
        </label>
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
import { computed, ref } from 'vue'
import { API_BASE } from '@/services/api.js'
import { uploadQuestionImage } from '@/services/questionService.js'
import { renderMathToHtml } from '@/utils/renderMath.js'
import MathTextarea from './MathTextarea.vue'

const optionLabels = computed(() => props.modelValue.options.map((_, index) => toLabel(index)))
const renderMath = (value) => renderMathToHtml(value || '')

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      stem: '',
      stemImageUrl: '',
      options: ['', '', '', ''],
      optionImages: ['', '', '', ''],
      correct: ['A'],
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const updateOption = (index, value) => {
  const nextOptions = [...props.modelValue.options]
  nextOptions[index] = value
  emit('update:modelValue', { ...props.modelValue, options: nextOptions })
}

const updateOptionImage = (index, value) => {
  const nextImages = [...props.modelValue.optionImages]
  nextImages[index] = value
  emit('update:modelValue', { ...props.modelValue, optionImages: nextImages })
}

const addOption = () => {
  const nextOptions = [...props.modelValue.options, '']
  const nextImages = [...props.modelValue.optionImages, '']
  emit('update:modelValue', {
    ...props.modelValue,
    options: nextOptions,
    optionImages: nextImages,
  })
}

const removeOption = (index) => {
  if (props.modelValue.options.length <= 2) return
  const nextOptions = props.modelValue.options.filter((_, i) => i !== index)
  const nextImages = props.modelValue.optionImages.filter((_, i) => i !== index)
  const nextLabels = nextOptions.map((_, i) => toLabel(i))
  const nextCorrect = props.modelValue.correct.filter((label) => nextLabels.includes(label))
  emit('update:modelValue', {
    ...props.modelValue,
    options: nextOptions,
    optionImages: nextImages,
    correct: nextCorrect,
  })
}

const toggleCorrect = (label, checked) => {
  const next = new Set(props.modelValue.correct)
  if (checked) {
    next.add(label)
  } else {
    next.delete(label)
  }
  emit('update:modelValue', { ...props.modelValue, correct: Array.from(next) })
}

const stemUploadError = ref('')
const optionUploadError = ref('')

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

const handleOptionImageChange = async (index, event) => {
  const file = event.target.files?.[0]
  if (!file) return
  optionUploadError.value = ''
  try {
    const result = await uploadQuestionImage(file)
    updateOptionImage(index, result.url)
  } catch (error) {
    optionUploadError.value = error?.message || '图片上传失败。'
  }
}

const handleOptionPaste = async (index, event) => {
  const file = getClipboardImage(event)
  if (!file) return
  event.preventDefault()
  optionUploadError.value = ''
  try {
    const result = await uploadQuestionImage(file)
    updateOptionImage(index, result.url)
  } catch (error) {
    optionUploadError.value = error?.message || '图片上传失败。'
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

function toLabel(index) {
  return String.fromCharCode(65 + index)
}
</script>
