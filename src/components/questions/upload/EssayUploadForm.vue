<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <label class="text-sm font-semibold">题干 *</label>
      <textarea
        :value="modelValue.stem"
        rows="4"
        placeholder="请输入问答题题干"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('stem', $event.target.value)"
      ></textarea>
    </div>
    <div class="space-y-2">
      <label class="text-sm font-semibold">参考答案 *</label>
      <textarea
        :value="modelValue.answer"
        rows="4"
        placeholder="请输入参考答案"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('answer', $event.target.value)"
      ></textarea>
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
      answer: '',
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
