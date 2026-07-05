<template>
  <div class="space-y-5">
    <MathTextarea
      label="题干（含拼音）"
      :model-value="modelValue.stem"
      placeholder="请输入含拼音的题干，使用空括号或下划线表示空格"
      :rows="4"
      @update:model-value="updateField('stem', $event)"
    />

    <div>
      <label class="text-sm font-semibold">空格参考答案</label>
      <div class="mt-2 space-y-2">
        <div v-for="(ans, idx) in modelValue.answers" :key="idx" class="flex gap-2">
          <input
            type="text"
            class="flex-1 rounded-xl bg-surface-container-low border px-3 py-2"
            :value="ans"
            @input="(e) => updateAnswer(idx, e.target.value)"
            :placeholder="`第 ${idx + 1} 空答案（可放拼音或汉字）`"
          />
          <button
            v-if="modelValue.answers.length > 1"
            @click="removeAnswer(idx)"
            class="px-3 text-error"
          >
            删除
          </button>
        </div>
        <button @click="addAnswer" class="px-3 py-2 rounded bg-surface-container-low">
          + 添加空
        </button>
      </div>
    </div>

    <MathTextarea
      label="解析"
      :model-value="modelValue.explanation"
      :rows="3"
      @update:model-value="updateField('explanation', $event)"
    />
  </div>
</template>

<script setup>
import MathTextarea from './MathTextarea.vue'
const props = defineProps({
  modelValue: { type: Object, default: () => ({ stem: '', answers: [''], explanation: '' }) },
})
const emit = defineEmits(['update:modelValue'])
const updateField = (field, value) =>
  emit('update:modelValue', { ...props.modelValue, [field]: value })
const updateAnswer = (i, v) => {
  const a = [...props.modelValue.answers]
  a[i] = v
  emit('update:modelValue', { ...props.modelValue, answers: a })
}
const addAnswer = () =>
  emit('update:modelValue', { ...props.modelValue, answers: [...props.modelValue.answers, ''] })
const removeAnswer = (i) => {
  const a = props.modelValue.answers.filter((_, idx) => idx !== i)
  emit('update:modelValue', { ...props.modelValue, answers: a.length ? a : [''] })
}
</script>
