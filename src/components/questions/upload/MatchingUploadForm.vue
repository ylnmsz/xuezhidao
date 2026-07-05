<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label class="text-sm font-semibold">配对项</label>
      <button
        type="button"
        class="text-sm px-3 py-1 rounded-lg bg-surface-container-low"
        @click.prevent="addPair"
      >
        + 添加配对
      </button>
    </div>
    <div class="space-y-2 mt-3">
      <div v-for="(p, idx) in localPairs" :key="`pair-${idx}`" class="flex gap-2">
        <input
          v-model="localPairs[idx].left"
          class="flex-1 rounded-xl px-3 py-2 border bg-white"
          placeholder="左项"
        />
        <input
          v-model="localPairs[idx].right"
          class="flex-1 rounded-xl px-3 py-2 border bg-white"
          placeholder="右项"
        />
        <button class="text-xs text-error px-3 py-2 rounded-md" @click.prevent="removePair(idx)">
          删除
        </button>
      </div>
    </div>
    <div>
      <MathTextarea
        label="解析/评分要点"
        :model-value="modelValue.explanation"
        :rows="3"
        @update:model-value="updateField('explanation', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MathTextarea from './MathTextarea.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ pairs: [{ left: '', right: '' }], explanation: '' }),
  },
})
const emit = defineEmits(['update:modelValue'])

const localPairs = ref(
  Array.isArray(props.modelValue.pairs)
    ? props.modelValue.pairs.map((p) => ({ ...p }))
    : [{ left: '', right: '' }],
)

watch(
  () => props.modelValue.pairs,
  (v) => {
    localPairs.value = Array.isArray(v) ? v.map((p) => ({ ...p })) : [{ left: '', right: '' }]
  },
)

watch(localPairs, (v) => {
  emit('update:modelValue', { ...props.modelValue, pairs: v })
})

const addPair = () => localPairs.value.push({ left: '', right: '' })
const removePair = (idx) => localPairs.value.splice(idx, 1)

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}
</script>
