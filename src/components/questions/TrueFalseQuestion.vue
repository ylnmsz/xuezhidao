<template>
  <div class="space-y-10">
    <p
      class="font-headline text-2xl md:text-3xl font-extrabold text-on-surface leading-tight text-center"
      v-html="renderedQuestion"
    ></p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        class="group relative flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all duration-300"
        :class="
          modelValue === true
            ? 'border-primary-container bg-primary-container/10'
            : 'border-transparent bg-surface-container-low hover:border-primary-container hover:bg-surface-container'
        "
        type="button"
        @click="$emit('update:modelValue', true)"
      >
        <div
          class="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
          :class="
            modelValue === true
              ? 'bg-primary-container text-white'
              : 'bg-primary-container/20 text-primary'
          "
        >
          <span
            class="material-symbols-outlined text-4xl"
            style="font-variation-settings: 'FILL' 1"
          >
            check_circle
          </span>
        </div>
        <span class="font-headline text-xl font-bold text-on-surface">正确</span>
      </button>

      <button
        class="group relative flex flex-col items-center justify-center p-8 rounded-lg border-2 transition-all duration-300"
        :class="
          modelValue === false
            ? 'border-error-container bg-error-container/10'
            : 'border-transparent bg-surface-container-low hover:border-error-container hover:bg-surface-container'
        "
        type="button"
        @click="$emit('update:modelValue', false)"
      >
        <div
          class="w-16 h-16 rounded-full mb-4 flex items-center justify-center"
          :class="
            modelValue === false
              ? 'bg-error-container text-white'
              : 'bg-error-container/20 text-error'
          "
        >
          <span
            class="material-symbols-outlined text-4xl"
            style="font-variation-settings: 'FILL' 1"
          >
            cancel
          </span>
        </div>
        <span class="font-headline text-xl font-bold text-on-surface">错误</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMathToHtml } from '../../utils/renderMath.js'

const props = defineProps({
  question: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: null,
  },
})

defineEmits(['update:modelValue'])

const renderedQuestion = computed(() => renderMathToHtml(props.question))
</script>
