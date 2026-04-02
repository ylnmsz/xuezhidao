<template>
  <div class="space-y-5">
    <div class="space-y-2">
      <label class="text-sm font-semibold">题干 *</label>
      <textarea
        :value="modelValue.stem"
        rows="4"
        placeholder="请输入判断题题干"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
        @input="updateField('stem', $event.target.value)"
      ></textarea>
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
      answer: true,
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
