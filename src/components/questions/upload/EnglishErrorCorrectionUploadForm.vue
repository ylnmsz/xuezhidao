<template>
  <div class="space-y-4">
    <!-- original passage -->
    <MathTextarea
      label="含错误的原文段落 *"
      :model-value="modelValue.stem"
      placeholder="粘贴包含错误的英文段落（保留原文，不要提前修改）"
      :rows="7"
      @update:model-value="updateField('stem', $event)"
    />

    <!-- error count -->
    <div class="flex items-center gap-3">
      <label class="text-sm font-semibold shrink-0">要求改错数量</label>
      <input
        type="number"
        min="0"
        max="20"
        :value="modelValue.errorCount"
        class="w-20 rounded-xl px-3 py-2 border border-outline-variant/20 bg-white text-sm text-center"
        @input="updateField('errorCount', Number($event.target.value) || 0)"
      />
      <span class="text-xs text-on-surface-variant">（设为 0 表示不限）</span>
    </div>

    <!-- corrections list -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-semibold">改错答案列表 *</label>
        <button
          type="button"
          class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
          @click="addCorrection"
        >
          + 添加改错项
        </button>
      </div>
      <div
        v-for="(c, idx) in modelValue.corrections"
        :key="idx"
        class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/10"
      >
        <div>
          <label class="text-xs text-on-surface-variant">位置</label>
          <input
            :value="c.lineOrPos"
            class="mt-1 w-full rounded-xl px-2 py-1.5 border border-outline-variant/20 bg-white text-xs"
            placeholder="第1行 / 句子5"
            @input="updateCorrection(idx, 'lineOrPos', $event.target.value)"
          />
        </div>
        <div>
          <label class="text-xs text-on-surface-variant">原错误词</label>
          <input
            :value="c.wrong"
            class="mt-1 w-full rounded-xl px-2 py-1.5 border border-outline-variant/20 bg-white text-xs"
            placeholder="wrong word"
            @input="updateCorrection(idx, 'wrong', $event.target.value)"
          />
        </div>
        <div>
          <label class="text-xs text-on-surface-variant">修改后</label>
          <input
            :value="c.correct"
            class="mt-1 w-full rounded-xl px-2 py-1.5 border border-outline-variant/20 bg-white text-xs"
            placeholder="correct word"
            @input="updateCorrection(idx, 'correct', $event.target.value)"
          />
        </div>
        <div class="flex flex-col justify-between">
          <label class="text-xs text-on-surface-variant">说明（可选）</label>
          <div class="flex gap-2 mt-1">
            <input
              :value="c.explanation"
              class="flex-1 rounded-xl px-2 py-1.5 border border-outline-variant/20 bg-white text-xs"
              placeholder="语法说明"
              @input="updateCorrection(idx, 'explanation', $event.target.value)"
            />
            <button
              type="button"
              class="text-xs text-error px-2 py-1 rounded-md bg-error-container/10 hover:bg-error-container/20 shrink-0"
              @click="removeCorrection(idx)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
      <p
        v-if="!modelValue.corrections || !modelValue.corrections.length"
        class="text-xs text-on-surface-variant"
      >
        尚未添加改错项
      </p>
    </div>

    <!-- explanation -->
    <MathTextarea
      label="整体解析（可选）"
      :model-value="modelValue.explanation"
      placeholder="可选，填写整体解析说明"
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
    default: () => ({
      stem: '',
      errorCount: 10,
      corrections: [],
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const addCorrection = () => {
  const corrections = [
    ...(props.modelValue.corrections || []),
    { lineOrPos: '', wrong: '', correct: '', explanation: '' },
  ]
  emit('update:modelValue', { ...props.modelValue, corrections })
}

const removeCorrection = (idx) => {
  const corrections = (props.modelValue.corrections || []).filter((_, i) => i !== idx)
  emit('update:modelValue', { ...props.modelValue, corrections })
}

const updateCorrection = (idx, field, value) => {
  const corrections = (props.modelValue.corrections || []).map((c, i) =>
    i === idx ? { ...c, [field]: value } : c,
  )
  emit('update:modelValue', { ...props.modelValue, corrections })
}
</script>
