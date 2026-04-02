<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <label class="text-sm font-semibold">题干 *</label>
      <textarea
        :value="modelValue.stem"
        rows="4"
        placeholder="请输入单选题题干"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('stem', $event.target.value)"
      ></textarea>
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
        </div>
      </div>
      <button
        type="button"
        class="px-4 py-2 rounded-xl bg-surface-container-low text-sm font-semibold text-on-surface-variant hover:text-on-surface"
        @click="addOption"
      >
        + 添加选项
      </button>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">正确答案 *</label>
      <select
        :value="modelValue.correct"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @change="updateField('correct', $event.target.value)"
      >
        <option v-for="label in optionLabels" :key="label" :value="label">{{ label }}</option>
      </select>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">解析</label>
      <textarea
        :value="modelValue.explanation"
        rows="3"
        placeholder="可选，填写解析"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('explanation', $event.target.value)"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const optionLabels = computed(() => props.modelValue.options.map((_, index) => toLabel(index)))

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      stem: '',
      options: ['', '', '', ''],
      correct: 'A',
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

const addOption = () => {
  const nextOptions = [...props.modelValue.options, '']
  emit('update:modelValue', { ...props.modelValue, options: nextOptions })
}

const removeOption = (index) => {
  if (props.modelValue.options.length <= 2) return
  const nextOptions = props.modelValue.options.filter((_, i) => i !== index)
  const nextLabels = nextOptions.map((_, i) => toLabel(i))
  const nextCorrect = nextLabels.includes(props.modelValue.correct)
    ? props.modelValue.correct
    : nextLabels[0]
  emit('update:modelValue', {
    ...props.modelValue,
    options: nextOptions,
    correct: nextCorrect,
  })
}

function toLabel(index) {
  return String.fromCharCode(65 + index)
}
</script>
