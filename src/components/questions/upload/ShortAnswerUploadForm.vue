<template>
  <div class="space-y-4">
    <MathTextarea
      label="题干"
      :model-value="modelValue.stem"
      placeholder="请输入题干"
      :rows="4"
      @update:model-value="updateField('stem', $event)"
    />

    <div>
      <label class="text-sm font-semibold">参考答案</label>
      <input
        type="text"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 mt-2"
        :value="modelValue.answer"
        placeholder="填写参考答案（简答）"
        @input="(e) => updateField('answer', e.target.value)"
      />
    </div>

    <MathTextarea
      label="解析"
      :model-value="modelValue.explanation"
      placeholder="可选，填写解析"
      :rows="3"
      @update:model-value="updateField('explanation', $event)"
    />
  </div>
</template>

<script setup>
import MathTextarea from './MathTextarea.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ stem: '', answer: '', explanation: '' }),
  },
})
const emit = defineEmits(['update:modelValue'])
const updateField = (field, value) =>
  emit('update:modelValue', { ...props.modelValue, [field]: value })
</script>
