<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
    <div class="lg:col-span-5 space-y-6">
      <div
        class="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border-b-4 border-surface-container-high"
      >
        <div class="flex items-center gap-2 mb-4 text-primary">
          <span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
          <h2 class="font-headline font-bold text-lg">阅读材料</h2>
        </div>
        <div class="space-y-4 text-on-surface leading-relaxed">
          <p v-for="(para, index) in context" :key="`para-${index}`">{{ para }}</p>
        </div>
      </div>

      <div
        class="bg-primary-container/10 p-6 rounded-2xl border-2 border-primary-container/30 relative overflow-hidden"
      >
        <div class="relative z-10">
          <h3 class="text-primary font-headline font-extrabold text-xl mb-3">写作任务</h3>
          <p class="text-on-surface-variant font-medium leading-relaxed">{{ prompt }}</p>
        </div>
      </div>
    </div>

    <div class="lg:col-span-7">
      <div class="bg-surface-container-lowest p-1 rounded-2xl shadow-xl">
        <div class="flex items-center justify-between px-6 py-4 border-b border-surface-container">
          <div class="flex gap-2">
            <button class="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
              <span class="material-symbols-outlined" data-icon="format_bold">format_bold</span>
            </button>
            <button class="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
              <span class="material-symbols-outlined" data-icon="format_italic">format_italic</span>
            </button>
            <button class="p-2 hover:bg-surface-container-low rounded-lg text-on-surface-variant">
              <span class="material-symbols-outlined" data-icon="spellcheck">spellcheck</span>
            </button>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider"
              >Word Count</span
            >
            <span class="text-xl font-headline font-black text-primary"
              >{{ wordCount }} / {{ maxWords }}</span
            >
          </div>
        </div>
        <div class="p-2">
          <textarea
            class="w-full min-h-[320px] p-6 text-lg leading-loose font-body text-on-surface placeholder:text-surface-variant bg-transparent border-none focus:ring-0 resize-none"
            :placeholder="placeholder"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          ></textarea>
        </div>
        <div
          class="flex justify-between items-center px-6 py-6 bg-surface-container-low/50 rounded-b-2xl border-t border-surface-container"
        >
          <button
            class="flex items-center gap-2 text-on-surface-variant font-headline font-bold px-4 py-2 hover:text-primary transition-colors"
          >
            <span class="material-symbols-outlined" data-icon="save">save</span>
            保存草稿
          </button>
          <div class="flex gap-4">
            <button
              class="px-8 py-3 bg-primary-container text-on-primary-container rounded-xl font-headline font-extrabold shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-all"
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  context: {
    type: Array,
    default: () => [],
  },
  prompt: {
    type: String,
    default: '',
  },
  modelValue: {
    type: String,
    default: '',
  },
  maxWords: {
    type: Number,
    default: 150,
  },
  placeholder: {
    type: String,
    default: '开始作答...',
  },
})

defineEmits(['update:modelValue'])

const wordCount = computed(() => props.modelValue.trim().split(/\s+/).filter(Boolean).length)
</script>
