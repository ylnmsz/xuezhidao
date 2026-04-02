<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <p class="text-xl md:text-2xl font-headline font-bold text-on-surface leading-snug">
        {{ question }}
      </p>
      <div v-if="imageUrl" class="w-full h-64 rounded-lg overflow-hidden bg-surface-container-low">
        <img :src="imageUrl" alt="question" class="w-full h-full object-cover" />
      </div>
      <p v-if="description" class="text-on-surface-variant leading-relaxed">
        {{ description }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        v-for="option in options"
        :key="option.id"
        class="group flex items-center gap-4 p-5 rounded-lg border-2 transition-all text-left"
        :class="
          modelValue === option.id
            ? 'border-primary-container bg-primary/5'
            : 'border-transparent bg-surface-container-low hover:bg-primary-container/20 hover:border-primary-container'
        "
        @click="$emit('update:modelValue', option.id)"
        type="button"
      >
        <span
          class="w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold"
          :class="
            modelValue === option.id
              ? 'bg-primary-container text-on-primary-container'
              : 'bg-white text-on-surface-variant group-hover:bg-primary-container group-hover:text-white'
          "
        >
          {{ option.label }}
        </span>
        <span class="font-body font-medium text-on-surface">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>
