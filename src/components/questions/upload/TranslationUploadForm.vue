<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <MathTextarea
        label="原文（待翻译）"
        :model-value="modelValue.stem"
        placeholder="请输入需要翻译的句子或段落"
        :rows="4"
        @update:model-value="updateField('stem', $event)"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-semibold">源语言</label>
        <input
          v-model="modelValue.sourceLang"
          class="w-full rounded-xl px-3 py-2 border bg-white"
        />
      </div>
      <div>
        <label class="text-sm font-semibold">目标语言</label>
        <input
          v-model="modelValue.targetLang"
          class="w-full rounded-xl px-3 py-2 border bg-white"
        />
      </div>
    </div>
    <div class="space-y-2">
      <MathTextarea
        label="参考译文"
        :model-value="modelValue.answer"
        placeholder="填写参考译文"
        :rows="4"
        @update:model-value="updateField('answer', $event)"
      />
    </div>
    <div>
      <MathTextarea
        label="解析/评分要点"
        :model-value="modelValue.explanation"
        placeholder="可选，填写评分要点或译法说明"
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
    default: () => ({ stem: '', sourceLang: '', targetLang: '', answer: '', explanation: '' }),
  },
})
const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
