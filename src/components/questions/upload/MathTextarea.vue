<template>
  <div class="space-y-1">
    <div v-if="label" class="flex items-center justify-between">
      <label class="text-sm font-semibold">{{ label }}</label>
      <button
        type="button"
        class="text-xs text-on-surface-variant hover:text-primary transition-colors"
        @click="splitView = !splitView"
      >
        {{ splitView ? '收起预览' : '并排预览' }}
      </button>
    </div>

    <div :class="splitView ? 'grid grid-cols-2 gap-3' : ''">
      <textarea
        :value="modelValue"
        :rows="rows"
        :placeholder="placeholder"
        class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono text-sm leading-relaxed resize-y"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      ></textarea>

      <div
        v-if="splitView && modelValue"
        class="rounded-xl bg-surface-container border border-outline-variant/20 px-4 py-3 text-sm overflow-auto max-h-64 min-h-[80px]"
      >
        <div class="text-xs text-on-surface-variant mb-1 uppercase tracking-wider">预览</div>
        <div v-html="rendered" class="rendered-content"></div>
      </div>
    </div>

    <div v-if="!splitView && modelValue" class="text-sm text-on-surface-variant">
      <span class="text-xs uppercase tracking-wider">预览</span>
      <div class="mt-1" v-html="rendered"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { renderMathWithHtml } from '@/utils/renderMath.js'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 4 },
  defaultSplit: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const splitView = ref(props.defaultSplit)

const rendered = computed(() => renderMathWithHtml(props.modelValue || ''))
</script>

<style scoped>
.rendered-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
}
.rendered-content :deep(td),
.rendered-content :deep(th) {
  border: 1px solid var(--md-sys-color-outline-variant, #ccc);
  padding: 4px 8px;
  font-size: 0.85em;
}
</style>
