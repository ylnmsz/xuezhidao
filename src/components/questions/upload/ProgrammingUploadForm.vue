<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <MathTextarea
        label="题干（编程题描述）"
        :model-value="modelValue.stem"
        placeholder="请输入编程题描述与输入输出要求"
        :rows="5"
        @update:model-value="updateField('stem', $event)"
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-semibold">语言</label>
        <input
          v-model="modelValue.language"
          class="w-full rounded-xl px-3 py-2 border bg-white"
          placeholder="例如：Python、C++"
        />
      </div>
      <div>
        <label class="text-sm font-semibold">代码模板（可选）</label>
        <input
          v-model="modelValue.codeTemplate"
          class="w-full rounded-xl px-3 py-2 border bg-white"
        />
      </div>
    </div>
    <div class="space-y-2">
      <MathTextarea
        label="参考答案/示例输出"
        :model-value="modelValue.answer"
        placeholder="填写参考输出或解题思路"
        :rows="4"
        @update:model-value="updateField('answer', $event)"
      />
    </div>
    <div>
      <MathTextarea
        label="解析/评分要点"
        :model-value="modelValue.explanation"
        placeholder="可选，填写评分要点或复杂度要求"
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
    default: () => ({ stem: '', language: '', codeTemplate: '', answer: '', explanation: '' }),
  },
})
const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
