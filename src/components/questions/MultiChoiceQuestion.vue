<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <p class="text-xl md:text-2xl font-headline font-bold text-on-surface leading-relaxed">
        {{ question }}
      </p>
      <p v-if="helper" class="text-on-surface-variant font-medium flex items-center gap-2">
        <span class="material-symbols-outlined text-tertiary" data-icon="info">info</span>
        {{ helper }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button
        v-for="option in options"
        :key="option.id"
        class="group relative rounded-xl p-5 flex items-center gap-5 cursor-pointer transition-all duration-200 border-2"
        :class="
          isSelected(option.id)
            ? 'bg-primary/5 border-primary ring-2 ring-primary/20 scale-[1.01]'
            : 'bg-surface-container-low border-transparent hover:bg-surface-container'
        "
        @click="toggle(option.id)"
        type="button"
      >
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center shadow-sm"
          :class="
            isSelected(option.id)
              ? 'bg-primary text-white'
              : 'bg-white border-2 border-surface-container-high text-on-surface-variant'
          "
        >
          <span class="material-symbols-outlined" data-icon="check_box">check_box</span>
        </div>
        <div class="flex-1">
          <span class="block text-lg font-bold font-headline text-on-surface">
            {{ option.text }}
          </span>
          <span v-if="option.subText" class="text-sm text-on-surface-variant">
            {{ option.subText }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  question: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const isSelected = (id) => props.modelValue.includes(id)

const toggle = (id) => {
  const next = new Set(props.modelValue)
  if (next.has(id)) {
    next.delete(id)
  } else {
    next.add(id)
  }
  emit('update:modelValue', Array.from(next))
}
</script>
