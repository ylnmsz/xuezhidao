<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <MathTextarea
        label="题干（古诗/默写）"
        :model-value="modelValue.stem"
        placeholder="请输入古诗/默写题干，使用 ____ 表示空缺"
        :rows="4"
        @update:model-value="updateField('stem', $event)"
      />
    </div>
    <div class="space-y-2">
      <MathTextarea
        label="参考答案"
        :model-value="modelValue.answer"
        placeholder="填写标准答案"
        :rows="2"
        @update:model-value="updateField('answer', $event)"
      />
    </div>
    <div>
      <MathTextarea
        label="解析"
        :model-value="modelValue.explanation"
        placeholder="可选，填写解析或默写要点"
        :rows="3"
        @update:model-value="updateField('explanation', $event)"
      />
    </div>
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

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
