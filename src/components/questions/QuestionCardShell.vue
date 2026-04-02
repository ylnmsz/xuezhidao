<template>
  <section
    class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-outline-variant/10 relative overflow-hidden"
  >
    <div class="absolute top-0 left-0 w-2 h-full bg-primary-container"></div>
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span class="text-primary font-headline font-bold text-xl">{{ number }}</span>
        </div>
        <div>
          <h2 class="font-headline font-bold text-on-surface text-lg leading-none">
            {{ typeLabel }}
          </h2>
          <p class="text-on-surface-variant text-sm mt-1">
            {{ metaText }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-if="points"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant"
        >
          <span class="material-symbols-outlined text-[16px]" data-icon="star">star</span>
          {{ points }} PTS
        </div>
        <div
          v-if="streak"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-tertiary/10 rounded-full text-xs font-bold text-tertiary"
        >
          <span class="material-symbols-outlined text-[16px]" data-icon="bolt">bolt</span>
          {{ streak }}
        </div>
        <slot name="header-extra"></slot>
      </div>
    </div>

    <div class="space-y-8">
      <slot />
    </div>

    <div v-if="$slots.footer" class="mt-10">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  number: {
    type: [String, Number],
    default: '01',
  },
  typeLabel: {
    type: String,
    default: 'Question',
  },
  metaText: {
    type: String,
    default: '',
  },
  points: {
    type: [String, Number],
    default: '',
  },
  streak: {
    type: String,
    default: '',
  },
})
</script>
