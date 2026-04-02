<template>
  <div class="space-y-8">
    <div class="flex items-start gap-4">
      <div class="bg-primary p-3 rounded-2xl rotate-3">
        <span class="material-symbols-outlined text-white text-3xl">edit_square</span>
      </div>
      <div>
        <h2 class="text-xl font-headline font-bold text-on-surface">{{ title }}</h2>
        <p class="text-on-surface-variant">{{ subtitle }}</p>
      </div>
    </div>

    <div class="leading-[3.2rem] text-xl md:text-2xl font-body text-on-surface-variant">
      <template v-for="(segment, index) in segments" :key="`seg-${index}`">
        <span>{{ segment }}</span>
        <input
          v-if="index < blankCount"
          class="inline-block w-40 md:w-56 h-12 mx-2 px-5 rounded-2xl bg-surface-container border-2 border-transparent focus:border-primary-container focus:bg-white focus:ring-4 focus:ring-primary-container/20 text-on-surface font-headline font-bold transition-all placeholder:text-outline-variant/50 outline-none text-center"
          :placeholder="placeholder"
          type="text"
          :value="modelValue[index] || ''"
          @input="onInput(index, $event.target.value)"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '完成填空',
  },
  subtitle: {
    type: String,
    default: '输入缺失的关键词。',
  },
  segments: {
    type: Array,
    default: () => ['请在这里', '填写内容', '完成题目。'],
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '...',
  },
})

const emit = defineEmits(['update:modelValue'])

const blankCount = props.segments.length - 1

const onInput = (index, value) => {
  const next = [...props.modelValue]
  next[index] = value
  emit('update:modelValue', next)
}
</script>
