<template>
  <div class="space-y-4">
    <!-- direction selector -->
    <div class="flex gap-3">
      <button
        v-for="dir in directions"
        :key="dir.value"
        type="button"
        class="px-4 py-1.5 rounded-full text-sm font-semibold transition-all border"
        :class="
          modelValue.direction === dir.value
            ? 'bg-primary text-on-primary border-primary shadow-sm'
            : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
        "
        @click="updateField('direction', dir.value)"
      >
        {{ dir.label }}
      </button>
    </div>

    <!-- stem / original text -->
    <MathTextarea
      label="原文（待翻译）*"
      :model-value="modelValue.stem"
      :placeholder="stemPlaceholder"
      :rows="5"
      @update:model-value="updateField('stem', $event)"
    />

    <!-- sentence-by-sentence list -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="text-sm font-semibold">逐句原文（可选，拆分题组）</label>
        <button
          type="button"
          class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
          @click="addSentence"
        >
          + 添加句子
        </button>
      </div>
      <div
        v-for="(sentence, idx) in modelValue.sentences"
        :key="idx"
        class="flex items-center gap-2 mb-2"
      >
        <span class="text-xs text-on-surface-variant w-5 shrink-0">{{ idx + 1 }}.</span>
        <input
          :value="sentence"
          class="flex-1 rounded-xl px-3 py-2 border border-outline-variant/20 bg-white text-sm"
          :placeholder="`第 ${idx + 1} 句`"
          @input="updateSentence(idx, $event.target.value)"
        />
        <button
          type="button"
          class="text-xs text-error hover:text-error/80"
          @click="removeSentence(idx)"
        >
          删除
        </button>
      </div>
    </div>

    <!-- reference answer -->
    <MathTextarea
      label="参考译文 *"
      :model-value="modelValue.answer"
      :placeholder="answerPlaceholder"
      :rows="4"
      @update:model-value="updateField('answer', $event)"
    />

    <!-- explanation -->
    <MathTextarea
      label="评分要点 / 解析"
      :model-value="modelValue.explanation"
      placeholder="可选，填写评分要点或注意事项"
      :rows="3"
      @update:model-value="updateField('explanation', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MathTextarea from './MathTextarea.vue'

const directions = [
  { label: '中译英', value: 'zh_to_en' },
  { label: '英译中', value: 'en_to_zh' },
]

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      stem: '',
      direction: 'zh_to_en',
      sentences: [],
      answer: '',
      explanation: '',
    }),
  },
})

const emit = defineEmits(['update:modelValue'])

const stemPlaceholder = computed(() =>
  props.modelValue.direction === 'zh_to_en'
    ? '请输入中文原文'
    : 'Enter the English passage to translate',
)
const answerPlaceholder = computed(() =>
  props.modelValue.direction === 'zh_to_en'
    ? 'Enter the reference English translation'
    : '请输入参考中文译文',
)

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const addSentence = () => {
  const sentences = [...(props.modelValue.sentences || []), '']
  emit('update:modelValue', { ...props.modelValue, sentences })
}

const removeSentence = (idx) => {
  const sentences = (props.modelValue.sentences || []).filter((_, i) => i !== idx)
  emit('update:modelValue', { ...props.modelValue, sentences })
}

const updateSentence = (idx, value) => {
  const sentences = [...(props.modelValue.sentences || [])]
  sentences[idx] = value
  emit('update:modelValue', { ...props.modelValue, sentences })
}
</script>
