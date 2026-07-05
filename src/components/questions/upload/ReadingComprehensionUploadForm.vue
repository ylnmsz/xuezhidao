<template>
  <div class="space-y-4">
    <MathTextarea
      label="文章/材料"
      :model-value="modelValue.passage"
      :rows="6"
      @update:model-value="updateField('passage', $event)"
    />

    <div>
      <label class="text-sm font-semibold">子题（JSON 列表）</label>
      <textarea
        class="w-full mt-2 rounded-xl bg-surface-container-low border px-3 py-2"
        :value="subJson"
        @input="onJsonChange($event.target.value)"
        rows="6"
      ></textarea>
      <p class="text-xs text-on-surface-variant mt-2">
        说明：子题为 JSON 数组，格式示例：[
        {"type":"单选题","stem":"...","options":["A","B"],"answer":"A"} ]
      </p>
    </div>

    <MathTextarea
      label="解析/评分要点"
      :model-value="modelValue.explanation"
      :rows="3"
      @update:model-value="updateField('explanation', $event)"
    />
  </div>
</template>

<script setup>
import MathTextarea from './MathTextarea.vue'
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: { type: Object, default: () => ({ passage: '', subQuestions: [], explanation: '' }) },
})
const emit = defineEmits(['update:modelValue'])

const subJson = ref(JSON.stringify(props.modelValue.subQuestions || [], null, 2))
watch(
  () => props.modelValue.subQuestions,
  (v) => {
    subJson.value = JSON.stringify(v || [], null, 2)
  },
)

const updateField = (field, value) =>
  emit('update:modelValue', { ...props.modelValue, [field]: value })
const onJsonChange = (val) => {
  subJson.value = val
  try {
    const parsed = JSON.parse(val)
    updateField('subQuestions', parsed)
  } catch (e) {
    // ignore parse errors until valid
  }
}
</script>
