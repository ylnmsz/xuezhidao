<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <label class="text-sm font-semibold">题干 *</label>
      <textarea
        :value="modelValue.stem"
        rows="4"
        placeholder="请输入填空题题干（可用 ____ 表示空格）"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('stem', $event.target.value)"
      ></textarea>
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
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      stem: '',
      answers: [''],
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

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
</script>
