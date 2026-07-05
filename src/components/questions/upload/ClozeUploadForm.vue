<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <MathTextarea
        label="题干/文章"
        :model-value="modelValue.stem"
        placeholder="请输入完形填空或语法填空正文"
        :rows="8"
        @update:model-value="updateField('stem', $event)"
      />
    </div>

    <div class="flex items-center gap-2">
      <button
        type="button"
        class="px-4 py-2 rounded-full text-sm font-semibold"
        :class="
          editorMode === 'blanks'
            ? 'bg-white text-primary shadow-sm'
            : 'bg-surface-container-low text-on-surface-variant'
        "
        @click="setEditorMode('blanks')"
      >
        空格答案模式
      </button>
      <button
        type="button"
        class="px-4 py-2 rounded-full text-sm font-semibold"
        :class="
          editorMode === 'subQuestions'
            ? 'bg-white text-primary shadow-sm'
            : 'bg-surface-container-low text-on-surface-variant'
        "
        @click="setEditorMode('subQuestions')"
      >
        子题模式
      </button>
    </div>

    <div v-if="editorMode === 'blanks'">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold">空格答案</label>
        <button
          type="button"
          class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
          @click.prevent="addBlank"
        >
          + 添加空格
        </button>
      </div>
      <div class="space-y-2 mt-3">
        <div v-for="(b, idx) in localBlanks" :key="`blank-${idx}`" class="flex gap-2">
          <input
            v-model="localBlanks[idx]"
            class="flex-1 rounded-xl px-3 py-2 border bg-white"
            :placeholder="`第 ${idx + 1} 空答案`"
          />
          <button class="text-xs text-error px-3 py-2 rounded-md" @click.prevent="removeBlank(idx)">
            删除
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold">子题</label>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
            @click.prevent="addSubQuestion('单选题')"
          >
            + 单选子题
          </button>
          <button
            type="button"
            class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
            @click.prevent="addSubQuestion('填空题')"
          >
            + 填空子题
          </button>
        </div>
      </div>
      <div class="space-y-4 mt-3">
        <div
          v-for="(sq, idx) in localSubQuestions"
          :key="`sub-question-${idx}`"
          class="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="text-xs text-on-surface-variant">子题 {{ idx + 1 }}</div>
              <select
                v-model="sq.type"
                class="rounded-xl px-3 py-1 bg-white border"
                @change="normalizeSubQuestion(idx)"
              >
                <option value="单选题">单选</option>
                <option value="填空题">填空</option>
              </select>
            </div>
            <button
              type="button"
              class="text-xs text-error px-2 py-1 rounded-md bg-error-container/10"
              @click.prevent="removeSubQuestion(idx)"
            >
              删除
            </button>
          </div>

          <div class="space-y-3">
            <input
              v-model="sq.stem"
              class="w-full rounded-xl px-3 py-2 border bg-white"
              placeholder="子题题干，例如 36 或 36.(name)"
            />

            <template v-if="sq.type === '单选题'">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  v-for="(opt, optIdx) in sq.options"
                  :key="`sub-opt-${idx}-${optIdx}`"
                  v-model="sq.options[optIdx]"
                  class="rounded-xl px-3 py-2 border bg-white"
                  :placeholder="`${String.fromCharCode(65 + optIdx)} 选项`"
                />
              </div>
              <div class="flex items-center gap-3">
                <label class="text-sm text-on-surface-variant">答案</label>
                <select v-model="sq.answer" class="rounded-xl px-3 py-2 border bg-white">
                  <option value="">未填写</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            </template>

            <template v-else>
              <input
                v-model="sq.answer"
                class="w-full rounded-xl px-3 py-2 border bg-white"
                placeholder="填写该空答案"
              />
            </template>

            <textarea
              v-model="sq.explanation"
              rows="2"
              class="w-full rounded-xl px-3 py-2 border bg-white"
              placeholder="解析（可选）"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div>
      <MathTextarea
        label="解析"
        :model-value="modelValue.explanation"
        placeholder="可选，填写整体解析"
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
    default: () => ({ stem: '', blanks: [''], subQuestions: [], explanation: '' }),
  },
})

const emit = defineEmits(['update:modelValue'])

const localBlanks = ref(
  Array.isArray(props.modelValue.blanks) ? [...props.modelValue.blanks] : [''],
)
const localSubQuestions = ref(
  Array.isArray(props.modelValue.subQuestions)
    ? props.modelValue.subQuestions.map((sq) => ({
        type: sq.type || '单选题',
        stem: sq.stem || '',
        options:
          Array.isArray(sq.options) && sq.options.length
            ? sq.options.map((opt) =>
                opt && typeof opt === 'object' ? String(opt.text || '') : String(opt || ''),
              )
            : ['', '', '', ''],
        answer: sq.answer || '',
        explanation: sq.explanation || '',
      }))
    : [],
)

const editorMode = ref(localSubQuestions.value.length ? 'subQuestions' : 'blanks')

watch(
  () => props.modelValue.blanks,
  (v) => {
    localBlanks.value = Array.isArray(v) && v.length ? [...v] : ['']
  },
)

watch(
  () => props.modelValue.subQuestions,
  (v) => {
    localSubQuestions.value = Array.isArray(v)
      ? v.map((sq) => ({
          type: sq.type || '单选题',
          stem: sq.stem || '',
          options:
            Array.isArray(sq.options) && sq.options.length
              ? sq.options.map((opt) =>
                  opt && typeof opt === 'object' ? String(opt.text || '') : String(opt || ''),
                )
              : ['', '', '', ''],
          answer: sq.answer || '',
          explanation: sq.explanation || '',
        }))
      : []
    if (Array.isArray(v) && v.length) {
      editorMode.value = 'subQuestions'
    }
  },
)

watch(
  localBlanks,
  (v) => {
    emit('update:modelValue', { ...props.modelValue, blanks: [...v] })
  },
  { deep: true },
)

watch(
  localSubQuestions,
  (v) => {
    emit('update:modelValue', {
      ...props.modelValue,
      subQuestions: v.map((sq) => ({
        type: sq.type,
        stem: sq.stem,
        options: sq.type === '单选题' ? sq.options : [],
        answer: sq.answer,
        explanation: sq.explanation,
      })),
    })
  },
  { deep: true },
)

const updateField = (field, value) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value })
}

const addBlank = () => {
  localBlanks.value.push('')
}

const removeBlank = (idx) => {
  localBlanks.value.splice(idx, 1)
  if (!localBlanks.value.length) localBlanks.value.push('')
}

const setEditorMode = (mode) => {
  editorMode.value = mode
  if (mode === 'subQuestions' && !localSubQuestions.value.length) {
    addSubQuestion('填空题')
  }
  if (mode === 'blanks') {
    if (!localBlanks.value.length) {
      localBlanks.value.push('')
    }
    if (localSubQuestions.value.length) {
      localSubQuestions.value = []
    }
  }
  if (mode === 'blanks' && !localBlanks.value.length) {
    localBlanks.value.push('')
  }
}

const addSubQuestion = (type) => {
  localSubQuestions.value.push({
    type,
    stem: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
  })
}

const removeSubQuestion = (idx) => {
  localSubQuestions.value.splice(idx, 1)
}

const normalizeSubQuestion = (idx) => {
  const sq = localSubQuestions.value[idx]
  if (!sq) return
  if (sq.type === '单选题' && (!Array.isArray(sq.options) || sq.options.length < 4)) {
    sq.options = ['', '', '', '']
  }
}
</script>
