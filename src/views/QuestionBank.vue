<template>
  <div class="flex min-h-screen flex-col md:flex-row bg-surface font-body text-on-surface">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />
    <main class="flex-1 min-h-screen lg:ml-72 pt-24 md:pt-28">
      <div class="p-6 md:p-10 space-y-8">
        <header class="space-y-2">
          <h1 class="text-3xl md:text-4xl font-headline font-black text-[#006479]">题库上传</h1>
          <p class="text-on-surface-variant text-sm md:text-base">
            支持单题录入与 CSV 批量导入，保存后自动进入题库。
          </p>
        </header>
        <div class="flex items-center justify-center">
          <div
            class="bg-surface-container-low rounded-full p-1.5 flex gap-2 border border-outline-variant/10 shadow-inner"
          >
            <button
              type="button"
              class="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              :class="
                activeTab === 'single'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/60'
              "
              @click="activeTab = 'single'"
            >
              单题上传
            </button>
            <button
              type="button"
              class="px-6 py-2.5 rounded-full text-sm font-bold transition-all"
              :class="
                activeTab === 'batch'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:bg-white/60'
              "
              @click="activeTab = 'batch'"
            >
              批量上传
            </button>
          </div>
        </div>
        <div class="flex justify-center">
          <section
            class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-4xl"
            v-if="activeTab === 'single'"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-headline font-bold">单题上传</h2>
              <span class="text-xs text-on-surface-variant">必填项 *</span>
            </div>
            <div class="flex flex-wrap gap-3 mb-6">
              <button
                v-for="type in questionTypes"
                :key="type.value"
                type="button"
                class="px-5 py-2 rounded-full text-sm font-bold transition-all"
                :class="
                  questionType === type.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-white/60'
                "
                @click="setQuestionType(type.value)"
              >
                {{ type.label }}
              </button>
            </div>
            <form class="space-y-5" @submit.prevent="submitSingle">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-semibold">学科</label>
                  <select
                    v-model="singleForm.subject"
                    class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">请选择学科</option>
                    <option v-for="subject in subjectOptions" :key="subject" :value="subject">
                      {{ subject }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold">年级</label>
                  <select
                    v-model="singleForm.grade"
                    class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">请选择年级</option>
                    <option v-for="grade in gradeOptions" :key="grade" :value="grade">
                      {{ grade }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold">难度 *</label>
                  <div
                    class="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3"
                    role="radiogroup"
                    aria-label="选择难度"
                    @mouseleave="hoveredDifficulty = 0"
                  >
                    <button
                      v-for="star in 5"
                      :key="star"
                      type="button"
                      class="transition-all"
                      :class="
                        star <= (hoveredDifficulty || singleForm.difficulty)
                          ? 'text-primary'
                          : 'text-on-surface-variant/40'
                      "
                      :aria-checked="singleForm.difficulty === star"
                      role="radio"
                      @mouseenter="hoveredDifficulty = star"
                      @click="singleForm.difficulty = star"
                    >
                      <span class="material-symbols-outlined" data-icon="star">star</span>
                    </button>
                  </div>
                </div>
              </div>
              <SingleChoiceUploadForm v-if="questionType === '单选题'" v-model="detail" />
              <MultiChoiceUploadForm v-if="questionType === '多选题'" v-model="detail" />
              <TrueFalseUploadForm v-if="questionType === '判断题'" v-model="detail" />
              <FillBlankUploadForm v-if="questionType === '填空题'" v-model="detail" />
              <EssayUploadForm v-if="questionType === '问答题'" v-model="detail" />
              <ClozeUploadForm v-if="questionType === '完形填空'" v-model="detail" />
              <ClassicalPoemDictationUploadForm
                v-if="questionType === '古诗默写'"
                v-model="detail"
              />
              <TranslationUploadForm v-if="questionType === '翻译'" v-model="detail" />
              <ProgrammingUploadForm v-if="questionType === '编程题'" v-model="detail" />
              <MatchingUploadForm v-if="questionType === '连线题'" v-model="detail" />
              <EnglishTranslationUploadForm
                v-if="questionType === '翻译题'"
                v-model="detail"
              />
              <EnglishErrorCorrectionUploadForm
                v-if="questionType === '改错题'"
                v-model="detail"
              />
              <template v-if="questionType === '阅读理解'">
                <div class="space-y-4">
                  <div>
                    <label class="text-sm font-semibold">文章</label>
                    <MathTextarea
                      :model-value="detail.passage"
                      placeholder="填写/粘贴文章正文"
                      :rows="6"
                      :default-split="true"
                      @update:model-value="(v) => (detail.passage = v)"
                    />
                  </div>
                  <div>
                    <div class="flex items-center justify-between">
                      <label class="text-sm font-semibold">子题</label>
                      <button
                        type="button"
                        class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
                        @click.prevent="addSingleSubQuestion"
                      >
                        + 添加子题
                      </button>
                    </div>
                    <div class="space-y-4 mt-3">
                      <div
                        v-for="(sq, sIdx) in detail.subQuestions"
                        :key="`single-sub-${sIdx}`"
                        class="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10"
                      >
                        <div class="flex items-center justify-between mb-3 gap-3">
                          <div class="flex items-center gap-3">
                            <div class="text-xs text-on-surface-variant">子题 {{ sIdx + 1 }}</div>
                            <select v-model="sq.type" class="rounded-xl px-3 py-1 bg-white border">
                              <option value="单选题">单选</option>
                              <option value="多选题">多选</option>
                              <option value="判断题">判断</option>
                              <option value="填空题">填空</option>
                              <option value="问答题">问答</option>
                            </select>
                          </div>
                          <div class="flex items-center gap-2">
                            <button
                              type="button"
                              class="text-xs text-error px-2 py-1 rounded-md bg-error-container/10"
                              @click.prevent="removeSingleSubQuestion(sIdx)"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                        <component
                          :is="componentForType(sq.type)"
                          v-model="detail.subQuestions[sIdx]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <p
                v-if="singleMessage"
                class="text-sm"
                :class="singleMessageType === 'success' ? 'text-emerald-600' : 'text-error'"
              >
                {{ singleMessage }}
              </p>
              <div class="flex items-center justify-between gap-4">
                <button
                  type="button"
                  class="px-5 py-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
                  @click="resetSingleForm"
                >
                  清空
                </button>
                <button
                  type="submit"
                  class="px-8 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold shadow-md shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                  :disabled="singleLoading"
                >
                  {{ singleLoading ? '提交中...' : '保存题目' }}
                </button>
              </div>
            </form>
          </section>
          <section
            class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_20px_40px_rgba(0,0,0,0.04)] w-full max-w-3xl"
            v-if="activeTab === 'batch'"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-headline font-bold">批量解析</h3>
              </div>
              <div class="space-y-3">
                <label class="text-sm font-semibold">选择文件</label>
                <input
                  type="file"
                  accept=".docx,.doc,.pdf"
                  class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 text-sm"
                  @change="handleBatchDocxChange"
                />
                <p class="text-xs text-on-surface-variant">当前选择：{{ batchDocxFileName }}（支持 .docx / .doc / .pdf）</p>
                <button
                  type="button"
                  class="w-full px-8 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold shadow-md shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                  :disabled="batchLoading"
                  @click="submitBatchDocx"
                >
                  {{ batchLoading ? (taskStatusMessage || '解析中...') : '解析题目' }}
                </button>
              </div>
              <!-- Progress bar for async processing -->
              <div v-if="batchLoading && taskProgress > 0" class="mt-3">
                <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-all duration-500"
                    :style="{ width: Math.min(taskProgress, 100) + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-on-surface-variant mt-1">{{ taskStatusMessage || '处理中...' }}</p>
              </div>
              <p v-if="batchPreviewError" class="text-sm text-error mt-3">
                {{ batchPreviewError }}
              </p>
              <div v-if="batchPreviewItems.length" class="mt-6 space-y-4">
                <div v-for="(item, index) in groupedBatchPreview" :key="`preview-${index}`">
                  <div
                    class="bg-surface-container-low rounded-xl p-4 border border-outline-variant/10 cursor-pointer hover:border-primary/40 hover:shadow-sm transition"
                    role="button"
                    tabindex="0"
                    @click="startBatchEdit(index)"
                    @keydown.enter.prevent="startBatchEdit(index)"
                    @keydown.space.prevent="startBatchEdit(index)"
                  >
                    <div class="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                      <span>题型：{{ getTypeLabel(resolveParsedItemType(item)) }}</span>
                      <span>学科：{{ item.subject || '未识别' }}</span>
                      <span>年级：{{ item.grade || '未识别' }}</span>
                      <span>难度：{{ item.difficulty }}</span>
                    </div>
                    <template
                      v-if="
                        !['阅读理解', '完形填空'].includes(resolveParsedItemType(item))
                      "
                    >
                      <p class="text-on-surface font-semibold mt-2">
                        <template
                          v-for="(part, partIndex) in splitWithImages(
                            item.stemWithImages || item.stem,
                          )"
                          :key="`stem-${index}-${partIndex}`"
                        >
                          <span v-if="part.type === 'text'" v-html="renderMath(part.value)"></span>
                          <img
                            v-else
                            :src="resolvePreviewUrl(part.url)"
                            alt="stem"
                            class="inline-block align-middle max-w-full h-auto max-h-64 rounded-lg border border-outline-variant/20"
                          />
                        </template>
                      </p>
                      <!-- 复合填空 / 复合问答子题预览 -->
                      <div
                        v-if="Array.isArray(item.subQuestions) && item.subQuestions.length"
                        class="mt-2 space-y-1 pl-3 border-l-2 border-outline-variant/20"
                      >
                        <div
                          v-for="(sq, sIdx) in item.subQuestions"
                          :key="`cfsub-${index}-${sIdx}`"
                          class="text-sm text-on-surface"
                        >
                          <span v-html="renderMath(sq.stemWithImages || sq.stem || '')"></span>
                          <span v-if="sq.answer" class="text-xs text-on-surface-variant ml-2"
                            >— {{ sq.answer }}</span
                          >
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-on-surface font-semibold mt-2">
                        <div class="mb-3">
                          <div class="text-sm text-on-surface-variant uppercase">
                            {{
                              resolveParsedItemType(item) === '阅读理解'
                                ? '文章'
                                : '完形文章'
                            }}
                          </div>
                          <div class="mt-2">
                            <template
                              v-for="(part, partIndex) in splitWithImages(
                                resolveParsedItemType(item) === '阅读理解'
                                  ? item.passageWithImages || item.passage
                                  : item.stemWithImages || item.stem,
                              )"
                              :key="`passage-${index}-${partIndex}`"
                            >
                              <span
                                v-if="part.type === 'text'"
                                v-html="renderReadingPassage(part.value)"
                              ></span>
                              <img
                                v-else
                                :src="resolvePreviewUrl(part.url)"
                                alt="passage"
                                class="inline-block align-middle max-w-full h-auto max-h-64 rounded-lg border border-outline-variant/20"
                              />
                            </template>
                          </div>
                        </div>
                        <div v-if="Array.isArray(item.subQuestions) && item.subQuestions.length">
                          <div class="text-sm text-on-surface-variant mb-2">子题</div>
                          <div class="space-y-2">
                            <div
                              v-for="(sq, sIdx) in item.subQuestions"
                              :key="`subq-${index}-${sIdx}`"
                              class="pl-3 border-l border-outline-variant/10"
                            >
                              <div class="text-xs text-on-surface-variant">
                                {{ getTypeLabel(sq.type) }}
                              </div>
                              <div class="mt-1">
                                <template
                                  v-for="(part, partIndex) in splitWithImages(
                                    sq.stemWithImages || sq.stem,
                                  )"
                                  :key="`substem-${index}-${sIdx}-${partIndex}`"
                                >
                                  <span
                                    v-if="part.type === 'text'"
                                    v-html="renderMath(part.value)"
                                  ></span>
                                  <img
                                    v-else
                                    :src="resolvePreviewUrl(part.url)"
                                    alt="sub-stem"
                                    class="inline-block align-middle max-w-full h-auto max-h-48 rounded-lg border border-outline-variant/20"
                                  />
                                </template>
                              </div>
                              <div v-if="getPreviewOptions(sq).length" class="mt-2 text-sm">
                                <div
                                  v-for="(opt, optIndex) in getPreviewOptions(sq)"
                                  :key="`subopt-${index}-${sIdx}-${optIndex}`"
                                >
                                  <span class="font-semibold">{{ toLabel(optIndex) }}.</span>
                                  <span
                                    v-html="
                                      renderMath(
                                        normalizeOptionText(
                                          getPreviewOptionText(sq, opt, optIndex),
                                          optIndex,
                                        ),
                                      )
                                    "
                                  ></span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>
                    <div
                      v-if="
                        item.stemImageUrl && !hasImagePlaceholder(item.stemWithImages || item.stem)
                      "
                      class="mt-3"
                    >
                      <img
                        :src="resolvePreviewUrl(item.stemImageUrl)"
                        alt="stem"
                        class="max-w-full h-auto max-h-64 rounded-lg border border-outline-variant/20"
                      />
                    </div>
                    <div
                      v-if="
                        getPreviewOptions(item).length &&
                        !(
                          resolveParsedItemType(item) === '完形填空' &&
                          Array.isArray(item.subQuestions) &&
                          item.subQuestions.length
                        )
                      "
                      class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2"
                    >
                      <div
                        v-for="(opt, optIndex) in getPreviewOptions(item)"
                        :key="`opt-${index}-${optIndex}`"
                        class="text-sm text-on-surface-variant"
                      >
                        <div class="flex items-start gap-2">
                          <span class="font-semibold">{{ toLabel(optIndex) }}.</span>
                          <div>
                            <div>
                              <template
                                v-for="(part, partIndex) in splitWithImages(
                                  normalizeOptionText(
                                    getPreviewOptionText(item, opt, optIndex),
                                    optIndex,
                                  ),
                                )"
                                :key="`opt-${index}-${optIndex}-${partIndex}`"
                              >
                                <span
                                  v-if="part.type === 'text'"
                                  v-html="renderMath(part.value)"
                                ></span>
                                <img
                                  v-else
                                  :src="resolvePreviewUrl(part.url)"
                                  alt="option"
                                  class="inline-block align-middle max-w-full h-auto max-h-48 rounded-lg border border-outline-variant/20"
                                />
                              </template>
                            </div>
                            <img
                              v-if="
                                item.optionImages?.[optIndex] &&
                                !hasImagePlaceholder(item.optionsWithImages?.[optIndex])
                              "
                              :src="resolvePreviewUrl(item.optionImages[optIndex])"
                              alt="option"
                              class="mt-2 max-w-full h-auto max-h-48 rounded-lg border border-outline-variant/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="getPreviewAnswers(item).length"
                      class="text-xs text-on-surface-variant mt-3"
                    >
                      <span>答案：</span>
                      <span class="whitespace-pre-wrap">
                        <template
                          v-for="(answerItem, answerIndex) in getPreviewAnswers(item)"
                          :key="`answer-${index}-${answerIndex}`"
                        >
                          <template
                            v-for="(part, partIndex) in splitWithImages(answerItem)"
                            :key="`answer-${index}-${answerIndex}-${partIndex}`"
                          >
                            <span
                              v-if="part.type === 'text'"
                              v-html="renderMathAnswer(part.value)"
                            ></span>
                            <img
                              v-else
                              :src="resolvePreviewUrl(part.url)"
                              alt="answer"
                              class="inline-block align-middle max-w-full h-auto max-h-48 rounded-lg border border-outline-variant/20"
                            />
                          </template>
                          <span v-if="answerIndex < getPreviewAnswers(item).length - 1">，</span>
                        </template>
                      </span>
                    </div>
                  </div>
                  <div v-if="batchEditGroupIndex === index" class="mt-4">
                    <div
                      class="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_18px_30px_rgba(0,0,0,0.04)]"
                    >
                      <div class="flex items-center justify-between mb-6">
                        <div>
                          <h3 class="text-xl font-headline font-bold">编辑题目</h3>
                          <p class="text-xs text-on-surface-variant mt-1">
                            当前题型：{{ getTypeLabel(batchEditType) }}
                          </p>
                        </div>
                        <button
                          type="button"
                          class="text-xs text-on-surface-variant hover:text-on-surface"
                          @click="cancelBatchEdit"
                        >
                          取消编辑
                        </button>
                      </div>
                      <form class="space-y-5" @submit.prevent="submitBatchEdit">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div class="space-y-2">
                            <label class="text-sm font-semibold">学科</label>
                            <select
                              v-model="batchEditForm.subject"
                              class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="">请选择学科</option>
                              <option
                                v-for="subject in subjectOptions"
                                :key="subject"
                                :value="subject"
                              >
                                {{ subject }}
                              </option>
                            </select>
                          </div>
                          <div class="space-y-2">
                            <label class="text-sm font-semibold">年级</label>
                            <select
                              v-model="batchEditForm.grade"
                              class="w-full rounded-xl bg-surface-container-low border border-outline-variant/20 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              <option value="">请选择年级</option>
                              <option v-for="grade in gradeOptions" :key="grade" :value="grade">
                                {{ grade }}
                              </option>
                            </select>
                          </div>
                          <div class="space-y-2">
                            <label class="text-sm font-semibold">难度 *</label>
                            <div
                              class="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3"
                              role="radiogroup"
                              aria-label="选择难度"
                            >
                              <button
                                v-for="star in 5"
                                :key="`edit-star-${star}`"
                                type="button"
                                class="transition-all"
                                :class="
                                  star <= batchEditForm.difficulty
                                    ? 'text-primary'
                                    : 'text-on-surface-variant/40'
                                "
                                :aria-checked="batchEditForm.difficulty === star"
                                role="radio"
                                @click="batchEditForm.difficulty = star"
                              >
                                <span class="material-symbols-outlined" data-icon="star">star</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        <SingleChoiceUploadForm
                          v-if="batchEditType === '单选题'"
                          v-model="batchEditDetail"
                        />
                        <MultiChoiceUploadForm
                          v-if="batchEditType === '多选题'"
                          v-model="batchEditDetail"
                        />
                        <TrueFalseUploadForm
                          v-if="batchEditType === '判断题'"
                          v-model="batchEditDetail"
                        />
                        <FillBlankUploadForm
                          v-if="
                            batchEditType === '填空题' && !batchEditDetail.subQuestions?.length
                          "
                          v-model="batchEditDetail"
                        />
                        <!-- 复合填空（一题多问）编辑视图 -->
                        <template
                          v-if="
                            batchEditType === '填空题' && batchEditDetail.subQuestions?.length
                          "
                        >
                          <div class="space-y-4">
                            <div>
                              <label class="text-sm font-semibold">题干</label>
                              <MathTextarea
                                :model-value="batchEditDetail.stem"
                                placeholder="填写大题题干"
                                :rows="3"
                                :default-split="true"
                                @update:model-value="(v) => (batchEditDetail.stem = v)"
                              />
                            </div>
                            <div>
                              <div class="flex items-center justify-between">
                                <label class="text-sm font-semibold">子题</label>
                                <button
                                  type="button"
                                  class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
                                  @click.prevent="
                                    batchEditDetail.subQuestions.push({
                                      type: '填空题',
                                      stem: '',
                                      answer: '',
                                      explanation: '',
                                    })
                                  "
                                >
                                  + 添加子题
                                </button>
                              </div>
                              <div class="space-y-3 mt-3">
                                <div
                                  v-for="(sq, sIdx) in batchEditDetail.subQuestions"
                                  :key="`cfsub-edit-${sIdx}`"
                                  class="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10"
                                >
                                  <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs text-on-surface-variant"
                                      >子题 {{ sIdx + 1 }}</span
                                    >
                                    <button
                                      type="button"
                                      class="text-xs text-error px-2 py-1 rounded-md bg-error-container/10"
                                      @click.prevent="batchEditDetail.subQuestions.splice(sIdx, 1)"
                                    >
                                      删除
                                    </button>
                                  </div>
                                  <MathTextarea
                                    :model-value="sq.stem"
                                    placeholder="子题题干"
                                    :rows="2"
                                    :default-split="true"
                                    @update:model-value="(v) => (sq.stem = v)"
                                  />
                                  <input
                                    v-model="sq.answer"
                                    type="text"
                                    placeholder="参考答案"
                                    class="mt-2 w-full rounded-xl bg-white border border-outline-variant/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <ClozeUploadForm
                          v-if="batchEditType === '完形填空'"
                          v-model="batchEditDetail"
                        />
                        <EssayUploadForm
                          v-if="batchEditType === '问答题'"
                          v-model="batchEditDetail"
                        />
                        <EnglishTranslationUploadForm
                          v-if="batchEditType === '翻译题'"
                          v-model="batchEditDetail"
                        />
                        <EnglishErrorCorrectionUploadForm
                          v-if="batchEditType === '改错题'"
                          v-model="batchEditDetail"
                        />
                        <template v-if="batchEditType === '阅读理解'">
                          <div class="space-y-4">
                            <div>
                              <label class="text-sm font-semibold">文章</label>
                              <MathTextarea
                                :model-value="batchEditDetail.passage"
                                placeholder="填写/粘贴文章正文"
                                :rows="6"
                                :default-split="true"
                                @update:model-value="(v) => (batchEditDetail.passage = v)"
                              />
                            </div>
                            <div>
                              <div class="flex items-center justify-between">
                                <label class="text-sm font-semibold">子题</label>
                                <button
                                  type="button"
                                  class="text-sm px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container"
                                  @click.prevent="addSubQuestion"
                                >
                                  + 添加子题
                                </button>
                              </div>
                              <div class="space-y-4 mt-3">
                                <div
                                  v-for="(sq, sIdx) in batchEditDetail.subQuestions"
                                  :key="`sub-${sIdx}`"
                                  class="p-4 rounded-lg bg-surface-container-low border border-outline-variant/10"
                                >
                                  <div class="flex items-center justify-between mb-3 gap-3">
                                    <div class="flex items-center gap-3">
                                      <div class="text-xs text-on-surface-variant">
                                        子题 {{ sIdx + 1 }}
                                      </div>
                                      <select
                                        v-model="sq.type"
                                        class="rounded-xl px-3 py-1 bg-white border"
                                      >
                                        <option value="单选题">单选</option>
                                        <option value="多选题">多选</option>
                                        <option value="判断题">判断</option>
                                        <option value="填空题">填空</option>
                                        <option value="问答题">问答</option>
                                      </select>
                                    </div>
                                    <div class="flex items-center gap-2">
                                      <button
                                        type="button"
                                        class="text-xs text-error px-2 py-1 rounded-md bg-error-container/10"
                                        @click.prevent="removeSubQuestion(sIdx)"
                                      >
                                        删除
                                      </button>
                                    </div>
                                  </div>
                                  <component
                                    :is="componentForType(sq.type)"
                                    v-model="batchEditDetail.subQuestions[sIdx]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>
                        <p
                          v-if="batchEditMessage"
                          class="text-sm"
                          :class="
                            batchEditMessageType === 'success' ? 'text-emerald-600' : 'text-error'
                          "
                        >
                          {{ batchEditMessage }}
                        </p>
                        <div class="flex items-center justify-between gap-4">
                          <button
                            type="button"
                            class="px-5 py-3 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
                            @click="cancelBatchEdit"
                          >
                            关闭
                          </button>
                          <button
                            type="button"
                            class="px-5 py-3 rounded-xl text-error bg-error-container/10 hover:bg-error-container/20 transition-colors"
                            @click="deleteBatchItem"
                          >
                            删除题目
                          </button>
                          <button
                            type="submit"
                            class="px-8 py-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold shadow-md shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
                            :disabled="batchEditLoading"
                          >
                            {{ batchEditLoading ? '保存中...' : '保存修改' }}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="groupedBatchPreview.length"
                class="mt-6 border-t border-outline-variant/10 pt-6 flex flex-col items-end gap-3"
              >
                <p
                  v-if="batchSubmitAllMessage"
                  class="text-sm w-full"
                  :class="
                    batchSubmitAllMessageType === 'success' ? 'text-emerald-600' : 'text-error'
                  "
                >
                  {{ batchSubmitAllMessage }}
                </p>
                <button
                  type="button"
                  class="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-md shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  :disabled="batchSubmitAllLoading"
                  @click="submitAllBatch"
                >
                  {{
                    batchSubmitAllLoading
                      ? `上传中...`
                      : `确认上传全部 ${groupedBatchPreview.length} 道题目`
                  }}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { API_BASE } from '@/services/api.js'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { createQuestion, parseQuestionsDocxAsync, getBatchTaskStatus } from '@/services/questionService.js'
import { renderMathWithHtml } from '@/utils/renderMath.js'
import SingleChoiceUploadForm from '@/components/questions/upload/SingleChoiceUploadForm.vue'
import MultiChoiceUploadForm from '@/components/questions/upload/MultiChoiceUploadForm.vue'
import TrueFalseUploadForm from '@/components/questions/upload/TrueFalseUploadForm.vue'
import FillBlankUploadForm from '@/components/questions/upload/FillBlankUploadForm.vue'
import EssayUploadForm from '@/components/questions/upload/EssayUploadForm.vue'
import MathTextarea from '@/components/questions/upload/MathTextarea.vue'
import ClozeUploadForm from '@/components/questions/upload/ClozeUploadForm.vue'
import ClassicalPoemDictationUploadForm from '@/components/questions/upload/ClassicalPoemDictationUploadForm.vue'
import TranslationUploadForm from '@/components/questions/upload/TranslationUploadForm.vue'
import ProgrammingUploadForm from '@/components/questions/upload/ProgrammingUploadForm.vue'
import MatchingUploadForm from '@/components/questions/upload/MatchingUploadForm.vue'
import ShortAnswerUploadForm from '@/components/questions/upload/ShortAnswerUploadForm.vue'
import ReadingComprehensionUploadForm from '@/components/questions/upload/ReadingComprehensionUploadForm.vue'
import EnglishTranslationUploadForm from '@/components/questions/upload/EnglishTranslationUploadForm.vue'
import EnglishErrorCorrectionUploadForm from '@/components/questions/upload/EnglishErrorCorrectionUploadForm.vue'

const activeTab = ref('single')

const questionTypes = [
  { label: '单选题', value: '单选题' },
  { label: '多选题', value: '多选题' },
  { label: '判断题', value: '判断题' },
  { label: '填空题', value: '填空题' },
  { label: '问答题', value: '问答题' },
  { label: '阅读理解', value: '阅读理解' },
  { label: '完形/多空', value: '完形填空' },
  { label: '古诗默写', value: '古诗默写' },
  { label: '翻译', value: '翻译' },
  { label: '编程题', value: '编程题' },
  { label: '英语翻译题', value: '翻译题' },
  { label: '英语改错题', value: '改错题' },
]

const questionType = ref('单选题')

// 兼容 AI 可能返回的英文学科/年级代码 → 统一转为中文
const SUBJECT_MAP = {
  chinese: '语文',
  math: '数学',
  mathematics: '数学',
  english: '英语',
  physics: '物理',
  chemistry: '化学',
  biology: '生物',
  history: '历史',
  politics: '政治',
  political: '政治',
  geography: '地理',
}
const GRADE_MAP = {
  'grade 1': '一年级',
  'grade 2': '二年级',
  'grade 3': '三年级',
  'grade 4': '四年级',
  'grade 5': '五年级',
  'grade 6': '六年级',
  'first grade': '一年级',
  'second grade': '二年级',
  'third grade': '三年级',
  7: '初一',
  8: '初二',
  9: '初三',
  10: '高一',
  11: '高二',
  12: '高三',
  'junior 1': '初一',
  'junior 2': '初二',
  'junior 3': '初三',
  'senior 1': '高一',
  'senior 2': '高二',
  'senior 3': '高三',
}
function normalizeSubject(v) {
  const s = String(v || '').trim()
  return SUBJECT_MAP[s.toLowerCase()] || s
}
function normalizeGrade(v) {
  const s = String(v || '').trim()
  return GRADE_MAP[s.toLowerCase()] || s
}

const subjectOptions = ['语文', '数学', '英语', '政治', '历史', '地理', '物理', '化学', '生物']
const gradeOptions = [
  '一年级',
  '二年级',
  '三年级',
  '四年级',
  '五年级',
  '六年级',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三',
]

const singleForm = ref({
  subject: '',
  grade: '',
  difficulty: 3,
})

const normalizeQuestionType = (value) => {
  const raw = String(value || '').toLowerCase()
  if (raw.includes('english_translation') || raw.includes('翻译题') || raw.includes('英语翻译')) return '翻译题'
  if (raw.includes('english_error') || raw.includes('改错') || raw.includes('error_correction'))
    return '改错题'
  if (raw.includes('reading') || raw.includes('阅读') || raw.includes('阅读理解')) return '阅读理解'
  if (raw.includes('single') || raw.includes('单选')) return '单选题'
  if (raw.includes('multi') || raw.includes('multiple') || raw.includes('多选')) {
    return '多选题'
  }
  if (raw.includes('true') || raw.includes('false') || raw.includes('判断') || raw.includes('判断题')) return '判断题'
  if (raw.includes('fill') || raw.includes('blank') || raw.includes('填空') || raw.includes('填空题')) return '填空题'
  if (raw.includes('cloze') || raw.includes('完形')) return '完形填空'
  if (raw.includes('classical') || raw.includes('默写') || raw.includes('古诗默写')) return '古诗默写'
  if (raw.includes('translation') || raw.includes('翻译')) {
    // 避免匹配到 '翻译题'（english_translation）等更具体的类型
    if (raw.includes('翻译题')) return '翻译题'
    if (raw.includes('改错题')) return '改错题'
    return '翻译'
  }
  if (raw.includes('programming') || raw.includes('编程') || raw.includes('编程题')) return '编程题'
  if (raw.includes('matching') || raw.includes('配对') || raw.includes('连线题')) return '连线题'
  if (raw.includes('essay') || raw.includes('问答') || raw.includes('简答') || raw.includes('问答题')) return '问答题'
  if (
    raw.includes('short') ||
    raw.includes('other') ||
    raw.includes('其它') ||
    raw.includes('其他')
  ) {
    return '其他'
  }
  return '单选题'
}

const getDefaultDetail = (type) => {
  const t = normalizeQuestionType(type)
  if (t === '多选题') {
    return {
      stem: '',
      stemImageUrl: '',
      options: ['', '', '', ''],
      optionImages: ['', '', '', ''],
      correct: ['A'],
      explanation: '',
    }
  }
  if (t === '判断题') {
    return { stem: '', stemImageUrl: '', answer: true, explanation: '' }
  }
  if (t === '填空题') {
    return { stem: '', stemImageUrl: '', answers: [''], explanation: '' }
  }
  if (t === '问答题') {
    return { stem: '', stemImageUrl: '', answer: '', explanation: '' }
  }
  if (t === '阅读理解') {
    return {
      passage: '',
      passageWithImages: '',
      passageImageUrl: '',
      subQuestions: [],
    }
  }
  if (t === '完形填空') {
    return { stem: '', blanks: [''], explanation: '' }
  }
  if (t === '古诗默写') {
    return { stem: '', answer: '', explanation: '' }
  }
  if (t === '翻译') {
    return { stem: '', sourceLang: '', targetLang: '', answer: '', explanation: '' }
  }
  if (t === '编程题') {
    return { stem: '', language: '', codeTemplate: '', answer: '', explanation: '' }
  }
  if (t === '连线题') {
    return { pairs: [{ left: '', right: '' }], explanation: '' }
  }
  if (t === '翻译题') {
    return { stem: '', direction: 'zh_to_en', sentences: [], answer: '', explanation: '' }
  }
  if (t === '改错题') {
    return { stem: '', errorCount: 10, corrections: [], explanation: '' }
  }
  return {
    stem: '',
    stemImageUrl: '',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''],
    correct: 'A',
    explanation: '',
  }
}

const detail = ref(getDefaultDetail(questionType.value))

const singleLoading = ref(false)
const singleMessage = ref('')
const singleMessageType = ref('')

const batchDocxFile = ref(null)
const batchPreviewItems = ref([])
const batchPreviewError = ref('')
const batchLoading = ref(false)

// ── Async task polling ──
const activeTaskId = ref(null)
const pollingTimer = ref(null)
const taskStatusMessage = ref('')
const taskProgress = ref(0)

const groupedBatchPreview = computed(() => {
  return Array.isArray(batchPreviewItems.value) ? batchPreviewItems.value : []
})

const renderMath = (value) => renderMathWithHtml(value || '')
const isCenteredPassageLine = (line) => {
  const text = String(line || '').trim()
  if (!text) return false
  // Standalone labels like A/B/C or （A） are typically centered in exam passages.
  if (/^[A-Z]$/.test(text) || /^[（(]?[A-Z][）)]?$/.test(text)) return true
  // Short title-like lines without sentence punctuation are usually headings.
  if (
    text.length <= 22 &&
    !/[，。！？,.!?：:；;]/.test(text) &&
    /^[\w\u4e00-\u9fa5\s()（）-]+$/.test(text)
  ) {
    return true
  }
  return false
}

const renderReadingPassage = (value) => {
  const source = String(value || '').replace(/\r\n?/g, '\n')
  if (!source.trim()) return ''
  const lines = source.split('\n')
  return lines
    .map((line) => {
      if (!line.trim()) return '<div class="h-2"></div>'
      const content = renderMath(line)
      if (isCenteredPassageLine(line)) {
        return `<p class="my-1 text-center font-semibold">${content}</p>`
      }
      return `<p class="my-1 leading-7 whitespace-pre-wrap">${content}</p>`
    })
    .join('')
}
const renderMathAnswer = (value) => renderMathWithHtml(ensureMathDelimiters(value || ''))
const hoveredDifficulty = ref(0)
const batchEditIndex = ref(null)
const batchEditGroupIndex = ref(null)
const batchEditType = ref('单选题')
const batchEditForm = ref({
  subject: '',
  grade: '',
  difficulty: 3,
})
const batchEditDetail = ref(getDefaultDetail(batchEditType.value))
const batchEditLoading = ref(false)
const batchEditMessage = ref('')
const batchEditMessageType = ref('')
const batchSubmitAllLoading = ref(false)
const batchSubmitAllMessage = ref('')
const batchSubmitAllMessageType = ref('')

const batchDocxFileName = computed(() => batchDocxFile.value?.name || '未选择文件')

const resolvePreviewUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) {
    const base = API_BASE.replace(/\/api\/?$/, '')
    return `${base}${url}`
  }
  return url
}

const toLabel = (index) => String.fromCharCode(65 + index)

const normalizeOptionText = (text, index) => {
  const label = toLabel(index)
  const value = String(text || '')
  return value.replace(new RegExp(`^\\s*${label}\\s*[.、)]?\\s*`), '').trim()
}

const ensureMathDelimiters = (value) => {
  const text = String(value || '').trim()
  if (!text) return ''
  if (text.includes('$')) return text
  if (/[\\^_]/.test(text)) return `$${text}$`
  return text
}

const splitWithImages = (value) => {
  const text = String(value || '')
  const parts = []
  const regex = /\[img:([^\]]+)\]/g
  let lastIndex = 0
  let match
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'image', url: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) })
  }
  return parts.length ? parts : [{ type: 'text', value: text }]
}

const hasImagePlaceholder = (value) => /\[img:[^\]]+\]/.test(String(value || ''))

const getPreviewOptions = (item) => {
  if (!item) return []
  const list = item.optionsWithImages?.length ? item.optionsWithImages : item.options
  if (!Array.isArray(list)) return []
  return list.map((opt) => (opt && typeof opt === 'object' ? String(opt.text || '') : String(opt)))
}

const getPreviewOptionText = (item, opt, optIndex) => {
  if (item?.optionsWithImages?.[optIndex]) return item.optionsWithImages[optIndex]
  if (opt && typeof opt === 'object') return String(opt.text || '')
  return opt
}

const resolveParsedItemType = (item) => {
  const baseType = normalizeQuestionType(item?.type)
  if (!item) return baseType
  const subQuestions = Array.isArray(item.subQuestions) ? item.subQuestions : []
  const passageText = String(
    item.passageWithImages || item.passage || item.stemWithImages || item.stem || '',
  )
  if (subQuestions.length) {
    if (item.passage || item.passageWithImages || baseType === '阅读理解') {
      return '阅读理解'
    }
    // 复合填空 / 复合问答（一题多问）：保留原类型，不误识别为 cloze
    if (baseType === '填空题' || baseType === '问答题') {
      return baseType
    }
    const subTypes = subQuestions.map((sq) => normalizeQuestionType(sq.type))
    if (baseType === '完形填空' || subTypes.some((t) => ['单选题', '填空题'].includes(t))) {
      return '完形填空'
    }
    if (passageText.length > 220 && /[。！？.!?]/.test(passageText)) {
      return '阅读理解'
    }
  }
  return baseType
}

const getPreviewAnswers = (item) => {
  if (!item) return []
  const type = resolveParsedItemType(item)
  if (type === '填空题') {
    if (Array.isArray(item.answers) && item.answers.length) {
      return item.answers.map((answer) => String(answer))
    }
    const raw = String(item.answer || '')
    return raw
      .split('|')
      .map((value) => value.trim())
      .filter(Boolean)
  }
  const answer = String(item.answer || '').trim()
  return answer ? [answer] : []
}

const setSingleMessage = (type, message) => {
  singleMessageType.value = type
  singleMessage.value = message
}

const setBatchEditMessage = (type, message) => {
  batchEditMessageType.value = type
  batchEditMessage.value = message
}

const componentForType = (type) => {
  const t = normalizeQuestionType(type)
  if (t === '单选题') return SingleChoiceUploadForm
  if (t === '多选题') return MultiChoiceUploadForm
  if (t === '判断题') return TrueFalseUploadForm
  if (t === '填空题') return FillBlankUploadForm
  if (t === '完形填空') return ClozeUploadForm
  if (t === '古诗默写') return ClassicalPoemDictationUploadForm
  if (t === '翻译') return TranslationUploadForm
  if (t === '编程题') return ProgrammingUploadForm
  if (t === '连线题') return MatchingUploadForm
  if (t === '阅读理解') return ReadingComprehensionUploadForm
  if (t === '翻译题') return EnglishTranslationUploadForm
  if (t === '改错题') return EnglishErrorCorrectionUploadForm
  if (
    String(type || '')
      .toLowerCase()
      .includes('short') ||
    String(type || '')
      .toLowerCase()
      .includes('other')
  )
    return ShortAnswerUploadForm
  return EssayUploadForm
}

const addSubQuestion = () => {
  if (!batchEditDetail.value.subQuestions) batchEditDetail.value.subQuestions = []
  batchEditDetail.value.subQuestions.push({
    type: '单选题',
    stem: '',
    stemImageUrl: '',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''],
    correct: 'A',
    explanation: '',
    answer: '',
  })
}

const removeSubQuestion = (idx) => {
  if (!Array.isArray(batchEditDetail.value.subQuestions)) return
  batchEditDetail.value.subQuestions.splice(idx, 1)
}

const addSingleSubQuestion = () => {
  if (!detail.value.subQuestions) detail.value.subQuestions = []
  detail.value.subQuestions.push({
    type: '单选题',
    stem: '',
    stemImageUrl: '',
    options: ['', '', '', ''],
    optionImages: ['', '', '', ''],
    correct: 'A',
    explanation: '',
    answer: '',
  })
}

const removeSingleSubQuestion = (idx) => {
  if (!Array.isArray(detail.value.subQuestions)) return
  detail.value.subQuestions.splice(idx, 1)
}

const getTypeLabel = (type) => {
  const found = questionTypes.find((item) => item.value === type)
  return found ? found.label : type
}

const normalizeAnswerList = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  return String(value || '')
    .split(/[,|，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return ['', '', '', '']
  const mapped = options.map((opt) => {
    if (opt && typeof opt === 'object') return String(opt.text || '')
    return String(opt ?? '')
  })
  return mapped.length >= 2 ? mapped : ['', '', '', '']
}

const buildDetailFromItem = (item, type) => {
  const normalizedType = normalizeQuestionType(type || item?.type)
  type = normalizedType
  if (type === '多选题') {
    return {
      stem: item.stemWithImages || item.stem || '',
      stemImageUrl: item.stemImageUrl || '',
      options: normalizeOptions(item.optionsWithImages || item.options),
      optionImages: Array.isArray(item.optionImages) ? item.optionImages : ['', '', '', ''],
      correct: normalizeAnswerList(item.answer || item.correct || ['A']),
      explanation: item.explanation || '',
    }
  }
  if (type === '判断题') {
    const rawAnswer = String(item.answer || '').toLowerCase()
    const answer = rawAnswer === 'false' || rawAnswer.includes('错') ? false : true
    return {
      stem: item.stemWithImages || item.stem || '',
      stemImageUrl: item.stemImageUrl || '',
      answer,
      explanation: item.explanation || '',
    }
  }
  if (type === '填空题') {
    // 复合填空（一题多问）
    if (Array.isArray(item.subQuestions) && item.subQuestions.length) {
      return {
        stem: item.stemWithImages || item.stem || '',
        stemImageUrl: item.stemImageUrl || '',
        subQuestions: item.subQuestions.map((sq) => ({
          type: normalizeQuestionType(sq.type || '填空题'),
          stem: sq.stemWithImages || sq.stem || '',
          answer: sq.answer || '',
          explanation: sq.explanation || '',
        })),
        answers: [],
        explanation: item.explanation || '',
      }
    }
    const answers = Array.isArray(item.answers)
      ? item.answers
      : String(item.answer || '')
          .split(/[|,，\s]+/)
          .map((value) => value.trim())
          .filter(Boolean)
    return {
      stem: item.stemWithImages || item.stem || '',
      stemImageUrl: item.stemImageUrl || '',
      answers: answers.length ? answers : [''],
      explanation: item.explanation || '',
    }
  }
  if (type === '问答题') {
    return {
      stem: item.stemWithImages || item.stem || '',
      stemImageUrl: item.stemImageUrl || '',
      answer: item.answer || '',
      explanation: item.explanation || '',
    }
  }
  if (type === '阅读理解') {
    return {
      passage: item.passageWithImages || item.passage || item.stemWithImages || item.stem || '',
      passageWithImages:
        item.passageWithImages || item.passage || item.stemWithImages || item.stem || '',
      passageImageUrl: item.passageImageUrl || item.stemImageUrl || '',
      subQuestions: Array.isArray(item.subQuestions)
        ? item.subQuestions.map((sq) => ({
            type: normalizeQuestionType(sq.type),
            stem: sq.stemWithImages || sq.stem || '',
            options: normalizeOptions(sq.optionsWithImages || sq.options),
            optionImages: Array.isArray(sq.optionImages) ? sq.optionImages : ['', '', '', ''],
            answer: sq.answer || sq.correct || '',
            explanation: sq.explanation || '',
          }))
        : [],
    }
  }
  if (type === '完形填空') {
    const rawSubQuestions = Array.isArray(item.subQuestions) ? item.subQuestions : []
    const parsedSubQuestions = rawSubQuestions.map((sq) => ({
      type: normalizeQuestionType(sq.type || '单选题'),
      stem: sq.stemWithImages || sq.stem || '',
      options: normalizeOptions(sq.optionsWithImages || sq.options),
      optionImages: Array.isArray(sq.optionImages) ? sq.optionImages : ['', '', '', ''],
      answer: sq.answer || sq.correct || '',
      explanation: sq.explanation || '',
    }))
    const blanks = Array.isArray(item.blanks)
      ? item.blanks.map((b) => (typeof b === 'object' ? String(b.answer || '') : String(b || '')))
      : String(item.answer || '')
          .split(/[|,，\s]+/)
          .map((v) => v.trim())
          .filter(Boolean)
    return {
      stem: item.stemWithImages || item.stem || '',
      blanks: blanks.length ? blanks : [''],
      subQuestions: parsedSubQuestions,
      explanation: item.explanation || '',
    }
  }
  if (type === '翻译题') {
    let parsedContent
    try {
      parsedContent = item.content ? JSON.parse(item.content) : {}
    } catch {
      parsedContent = {}
    }
    return {
      stem: item.stemWithImages || item.stem || parsedContent.stem || '',
      direction: item.direction || parsedContent.direction || 'zh_to_en',
      sentences: Array.isArray(item.sentences)
        ? item.sentences
        : Array.isArray(parsedContent.sentences)
          ? parsedContent.sentences
          : [],
      answer: item.answer || '',
      explanation: item.explanation || '',
    }
  }
  if (type === '改错题') {
    let parsedContent
    try {
      parsedContent = item.content ? JSON.parse(item.content) : {}
    } catch {
      parsedContent = {}
    }
    return {
      stem: item.stemWithImages || item.stem || parsedContent.stem || '',
      errorCount: item.errorCount ?? parsedContent.errorCount ?? 10,
      corrections: Array.isArray(item.corrections)
        ? item.corrections
        : Array.isArray(parsedContent.corrections)
          ? parsedContent.corrections
          : [],
      explanation: item.explanation || '',
    }
  }
  return {
    stem: item.stemWithImages || item.stem || '',
    stemImageUrl: item.stemImageUrl || '',
    options: normalizeOptions(item.optionsWithImages || item.options),
    optionImages: Array.isArray(item.optionImages) ? item.optionImages : ['', '', '', ''],
    correct: String(item.answer || item.correct || 'A').trim() || 'A',
    explanation: item.explanation || '',
  }
}

const startBatchEdit = (groupIndex) => {
  const grouped = groupedBatchPreview.value || []
  const gItem = grouped[groupIndex]
  if (!gItem) return

  // groupedBatchPreview is now a direct reference to batchPreviewItems, so index matches
  const items = batchPreviewItems.value || []
  let origIndex = groupIndex
  if (origIndex < 0 || origIndex >= items.length) {
    origIndex = items.findIndex(
      (it) => it && gItem && (it === gItem || (it.id && it.id === gItem.id)),
    )
  }
  if (origIndex === -1) {
    origIndex = items.findIndex((it) => it && it.stem === gItem.stem)
  }
  if (origIndex === -1) return

  const item = items[origIndex]
  const normalizedType = resolveParsedItemType(item)
  batchEditGroupIndex.value = groupIndex
  batchEditIndex.value = origIndex
  batchEditType.value = normalizedType
  batchEditForm.value = {
    subject: normalizeSubject(item.subject),
    grade: normalizeGrade(item.grade),
    difficulty: Number(item.difficulty) || 3,
  }
  batchEditDetail.value = buildDetailFromItem(item, normalizedType)
  setBatchEditMessage('', '')
}

const cancelBatchEdit = () => {
  batchEditIndex.value = null
  batchEditGroupIndex.value = null
  setBatchEditMessage('', '')
}

const setQuestionType = (type) => {
  questionType.value = type
  detail.value = getDefaultDetail(type)
  setSingleMessage('', '')
}

const resetSingleForm = () => {
  singleForm.value = {
    subject: '',
    grade: '',
    difficulty: 3,
  }
  detail.value = getDefaultDetail(questionType.value)
}

const buildPayload = () => buildPayloadFromDetail(questionType.value, detail.value)

const isBlank = (value) => !value || String(value).trim() === ''
const hasContent = (text, imageUrl) => !isBlank(text) || !isBlank(imageUrl)

const isValidDifficulty = (value) => Number.isInteger(value) && value >= 1 && value <= 5

const validateSingle = () => {
  if (!isValidDifficulty(singleForm.value.difficulty)) {
    return '请选择难度。'
  }

  if (questionType.value === '单选题') {
    if (!hasContent(detail.value.stem, detail.value.stemImageUrl)) return '请填写题干。'
    if (detail.value.options.length < 2) return '至少需要两个选项。'
    if (
      detail.value.options.some(
        (option, index) => !hasContent(option, detail.value.optionImages[index]),
      )
    ) {
      return '请填写完整的选项。'
    }
    if (isBlank(detail.value.correct)) return '请选择正确答案。'
    return ''
  }

  if (questionType.value === '多选题') {
    if (!hasContent(detail.value.stem, detail.value.stemImageUrl)) return '请填写题干。'
    if (detail.value.options.length < 2) return '至少需要两个选项。'
    if (
      detail.value.options.some(
        (option, index) => !hasContent(option, detail.value.optionImages[index]),
      )
    ) {
      return '请填写完整的选项。'
    }
    if (!detail.value.correct.length) return '请选择至少一个正确答案。'
    return ''
  }

  if (questionType.value === '判断题') {
    if (!hasContent(detail.value.stem, detail.value.stemImageUrl)) return '请填写题干。'
    return ''
  }

  if (questionType.value === '填空题') {
    if (!hasContent(detail.value.stem, detail.value.stemImageUrl)) return '请填写题干。'
    if (!detail.value.answers.some((answer) => !isBlank(answer))) return '请填写至少一个答案。'
    return ''
  }

  if (!hasContent(detail.value.stem, detail.value.stemImageUrl)) return '请填写题干。'
  if (isBlank(detail.value.answer)) return '请填写参考答案。'
  return ''
}

// extend validateSingle to support reading_comprehension
const validateSingleExtended = () => {
  if (questionType.value === '阅读理解') {
    return validateDetail('阅读理解', detail.value, singleForm.value.difficulty)
  }
  return validateSingle()
}

const validateDetail = (type, detailValue, difficulty) => {
  if (!isValidDifficulty(difficulty)) return '请选择难度。'
  const t = normalizeQuestionType(type)
  if (t === '阅读理解') {
    if (!hasContent(detailValue.passage, detailValue.passageImageUrl)) return '请填写文章内容。'
    if (!Array.isArray(detailValue.subQuestions) || !detailValue.subQuestions.length)
      return '请添加至少一道子题。'
    for (const sq of detailValue.subQuestions) {
      const err = validateDetail(sq.type || '单选题', sq, difficulty)
      if (err) return `子题校验失败：${err}`
    }
    return ''
  }
  if (t === '单选题') {
    if (!hasContent(detailValue.stem, detailValue.stemImageUrl)) return '请填写题干。'
    if (detailValue.options.length < 2) return '至少需要两个选项。'
    if (
      detailValue.options.some(
        (option, index) => !hasContent(option, detailValue.optionImages[index]),
      )
    ) {
      return '请填写完整的选项。'
    }
    if (isBlank(detailValue.correct)) return '请选择正确答案。'
    return ''
  }
  if (t === '多选题') {
    if (!hasContent(detailValue.stem, detailValue.stemImageUrl)) return '请填写题干。'
    if (detailValue.options.length < 2) return '至少需要两个选项。'
    if (
      detailValue.options.some(
        (option, index) => !hasContent(option, detailValue.optionImages[index]),
      )
    ) {
      return '请填写完整的选项。'
    }
    if (!detailValue.correct.length) return '请选择至少一个正确答案。'
    return ''
  }
  if (t === '判断题') {
    if (!hasContent(detailValue.stem, detailValue.stemImageUrl)) return '请填写题干。'
    return ''
  }
  if (t === '填空题') {
    if (!hasContent(detailValue.stem, detailValue.stemImageUrl)) return '请填写题干。'
    // 复合填空：子题有答案即可，不强制要求顶层 answers
    if (Array.isArray(detailValue.subQuestions) && detailValue.subQuestions.length) return ''
    if (!detailValue.answers.some((answer) => !isBlank(answer))) return '请填写至少一个答案。'
    return ''
  }
  if (t === '完形填空') {
    if (!hasContent(detailValue.stem, '')) return '请填写完形/多空题题干。'
    const hasSubQuestions =
      Array.isArray(detailValue.subQuestions) && detailValue.subQuestions.length > 0
    const hasBlanks = Array.isArray(detailValue.blanks) && detailValue.blanks.length > 0
    if (!hasSubQuestions && !hasBlanks) return '请填写至少一个空格答案或至少一道子题。'
    return ''
  }
  if (t === '古诗默写') {
    if (!hasContent(detailValue.stem, '')) return '请填写古诗题干。'
    if (isBlank(detailValue.answer)) return '请填写参考答案。'
    return ''
  }
  if (t === '翻译') {
    if (!hasContent(detailValue.stem, '')) return '请填写待翻译原文。'
    if (isBlank(detailValue.targetLang)) return '请选择或填写目标语言。'
    return ''
  }
  if (t === '编程题') {
    if (!hasContent(detailValue.stem, '')) return '请填写编程题描述。'
    if (isBlank(detailValue.language)) return '请选择或填写编程语言。'
    return ''
  }
  if (t === '连线题') {
    if (!Array.isArray(detailValue.pairs) || !detailValue.pairs.length)
      return '请添加至少一组配对项。'
    for (const p of detailValue.pairs) {
      if (isBlank(p.left) || isBlank(p.right)) return '配对项不能留空。'
    }
    return ''
  }
  if (t === '翻译题') {
    if (isBlank(detailValue.stem)) return '请填写待翻译原文。'
    if (isBlank(detailValue.answer)) return '请填写参考译文。'
    return ''
  }
  if (t === '改错题') {
    if (isBlank(detailValue.stem)) return '请填写含错误的原文。'
    if (!Array.isArray(detailValue.corrections) || !detailValue.corrections.length)
      return '请添加至少一条改错项。'
    return ''
  }
  if (!hasContent(detailValue.stem, detailValue.stemImageUrl)) return '请填写题干。'
  if (isBlank(detailValue.answer)) return '请填写参考答案。'
  return ''
}

const buildPayloadFromDetail = (type, detailValue) => {
  const t = normalizeQuestionType(type)
  if (t === '单选题') {
    return {
      content: JSON.stringify({
        stem: detailValue.stem.trim(),
        stemImageUrl: detailValue.stemImageUrl || '',
        options: detailValue.options.map((option, index) => ({
          text: option.trim(),
          imageUrl: detailValue.optionImages[index] || '',
        })),
      }),
      answer: String(detailValue.correct).trim(),
      explanation: detailValue.explanation.trim(),
    }
  }
  if (t === '多选题') {
    return {
      content: JSON.stringify({
        stem: detailValue.stem.trim(),
        stemImageUrl: detailValue.stemImageUrl || '',
        options: detailValue.options.map((option, index) => ({
          text: option.trim(),
          imageUrl: detailValue.optionImages[index] || '',
        })),
      }),
      answer: detailValue.correct.map((item) => item.trim()).join(','),
      explanation: detailValue.explanation.trim(),
    }
  }
  if (t === '判断题') {
    return {
      content: JSON.stringify({
        stem: detailValue.stem.trim(),
        stemImageUrl: detailValue.stemImageUrl || '',
      }),
      answer: detailValue.answer ? 'true' : 'false',
      explanation: detailValue.explanation.trim(),
    }
  }
  if (t === '填空题') {
    // 复合填空（一题多问）
    if (Array.isArray(detailValue.subQuestions) && detailValue.subQuestions.length) {
      const subs = detailValue.subQuestions.map((sq) => ({
        type: sq.type || '填空题',
        stem: (sq.stem || '').trim(),
        answer: String(sq.answer || '').trim(),
        explanation: String(sq.explanation || '').trim(),
      }))
      return {
        content: JSON.stringify({
          stem: detailValue.stem.trim(),
          stemImageUrl: detailValue.stemImageUrl || '',
          subQuestions: subs,
        }),
        answer: subs
          .map((sq, i) => (sq.answer ? `${i + 1}.${sq.answer}` : ''))
          .filter(Boolean)
          .join('|'),
        explanation: (detailValue.explanation || '').trim(),
      }
    }
    return {
      content: JSON.stringify({
        stem: detailValue.stem.trim(),
        stemImageUrl: detailValue.stemImageUrl || '',
      }),
      answer: detailValue.answers.filter((answer) => !isBlank(answer)).join('|'),
      explanation: detailValue.explanation.trim(),
    }
  }
  if (t === '阅读理解') {
    return {
      content: JSON.stringify({
        passage: (detailValue.passage || '').trim(),
        passageImageUrl: detailValue.passageImageUrl || '',
        subQuestions: (detailValue.subQuestions || []).map((sq) => ({
          type: sq.type || '单选题',
          stem: (sq.stem || '').trim(),
          options: (sq.options || []).map((opt) => ({ text: String(opt || '').trim() })),
          optionImages: sq.optionImages || [],
          answer: String(sq.answer || '').trim(),
          explanation: String(sq.explanation || '').trim(),
        })),
      }),
      answer: '',
      explanation: '',
    }
  }
  if (t === '完形填空') {
    const subQuestions = Array.isArray(detailValue.subQuestions)
      ? detailValue.subQuestions
          .map((sq) => ({
            type: normalizeQuestionType(sq.type || '单选题'),
            stem: String(sq.stem || '').trim(),
            options: Array.isArray(sq.options)
              ? sq.options.map((opt) => ({ text: String(opt || '').trim() }))
              : [],
            optionImages: Array.isArray(sq.optionImages) ? sq.optionImages : [],
            answer: String(sq.answer || '').trim(),
            explanation: String(sq.explanation || '').trim(),
          }))
          .filter((sq) => sq.stem || sq.options.length)
      : []
    if (subQuestions.length) {
      const answerText = subQuestions
        .map((sq, idx) => {
          const raw = String(sq.answer || '').trim()
          return raw ? `${idx + 1}.${raw}` : ''
        })
        .filter(Boolean)
        .join('|')
      return {
        content: JSON.stringify({
          stem: (detailValue.stem || '').trim(),
          subQuestions,
        }),
        answer: answerText,
        explanation: String(detailValue.explanation || '').trim(),
      }
    }
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
        blanks: Array.isArray(detailValue.blanks)
          ? detailValue.blanks.map((b) => String(b || '').trim())
          : [],
      }),
      answer: Array.isArray(detailValue.blanks) ? detailValue.blanks.join('|') : '',
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '古诗默写') {
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
      }),
      answer: String(detailValue.answer || '').trim(),
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '翻译') {
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
        sourceLang: detailValue.sourceLang || '',
        targetLang: detailValue.targetLang || '',
      }),
      answer: String(detailValue.answer || '').trim(),
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '编程题') {
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
        language: detailValue.language || '',
        codeTemplate: detailValue.codeTemplate || '',
      }),
      answer: String(detailValue.answer || '').trim(),
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '连线题') {
    return {
      content: JSON.stringify({
        pairs: Array.isArray(detailValue.pairs)
          ? detailValue.pairs.map((p) => ({
              left: String(p.left || '').trim(),
              right: String(p.right || '').trim(),
            }))
          : [],
      }),
      answer: '',
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '翻译题') {
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
        direction: detailValue.direction || 'zh_to_en',
        sentences: Array.isArray(detailValue.sentences)
          ? detailValue.sentences.map((s) => String(s || '').trim()).filter(Boolean)
          : [],
      }),
      answer: String(detailValue.answer || '').trim(),
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  if (t === '改错题') {
    return {
      content: JSON.stringify({
        stem: (detailValue.stem || '').trim(),
        errorCount: Number(detailValue.errorCount) || 0,
        corrections: Array.isArray(detailValue.corrections)
          ? detailValue.corrections.map((c) => ({
              lineOrPos: String(c.lineOrPos || '').trim(),
              wrong: String(c.wrong || '').trim(),
              correct: String(c.correct || '').trim(),
              explanation: String(c.explanation || '').trim(),
            }))
          : [],
      }),
      answer: Array.isArray(detailValue.corrections)
        ? detailValue.corrections
            .map((c) => `${c.lineOrPos || ''} ${c.wrong || ''}→${c.correct || ''}`)
            .join('; ')
        : '',
      explanation: String(detailValue.explanation || '').trim(),
    }
  }
  return {
    content: JSON.stringify({
      stem: detailValue.stem.trim(),
      stemImageUrl: detailValue.stemImageUrl || '',
    }),
    answer: detailValue.answer.trim(),
    explanation: detailValue.explanation.trim(),
  }
}

const submitSingle = async () => {
  if (singleLoading.value) return
  const validationError = validateSingleExtended()
  if (validationError) {
    setSingleMessage('error', validationError)
    return
  }

  singleLoading.value = true
  setSingleMessage('', '')
  try {
    const payload = buildPayload()
    await createQuestion({
      subject: singleForm.value.subject || null,
      grade: singleForm.value.grade || null,
      question_type: questionType.value,
      difficulty: singleForm.value.difficulty,
      content: payload.content,
      answer: payload.answer,
      explanation: payload.explanation || null,
    })
    setSingleMessage('success', '题目已保存到题库。')
    resetSingleForm()
  } catch (error) {
    setSingleMessage('error', error?.message || '保存失败，请稍后重试。')
  } finally {
    singleLoading.value = false
  }
}

const handleBatchDocxChange = (event) => {
  const file = event.target.files?.[0]
  batchDocxFile.value = file || null
  batchPreviewItems.value = []
  batchPreviewError.value = ''
}

// ── Async polling ──

const startPolling = (taskId) => {
  activeTaskId.value = taskId
  taskStatusMessage.value = ''
  taskProgress.value = 0
  // Save to sessionStorage so polling survives navigation away and back
  sessionStorage.setItem('batchTaskId', taskId)
  sessionStorage.setItem('batchTaskStartedAt', String(Date.now()))

  pollingTimer.value = setInterval(async () => {
    try {
      const status = await getBatchTaskStatus(taskId)
      console.log('[batch-poll] status:', status)
      taskStatusMessage.value = status.statusMessage || status.status
      taskProgress.value = status.progress || 0

      if (status.status === 'done') {
        stopPolling(true)
        batchPreviewItems.value = Array.isArray(status.result?.items)
          ? JSON.parse(JSON.stringify(status.result.items))
          : []
        if (!batchPreviewItems.value.length) {
          batchPreviewError.value = '未解析到题目，请检查文档内容。'
        }
        batchLoading.value = false
      } else if (status.status === 'error') {
        stopPolling(false)
        batchPreviewError.value = status.error || '解析失败。'
        batchLoading.value = false
      }
    } catch (pollErr) {
      console.warn('[batch-poll] poll error:', pollErr)
    }
  }, 2000) // poll every 2 seconds
}

const stopPolling = (completed) => {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
  if (completed) {
    sessionStorage.removeItem('batchTaskId')
    sessionStorage.removeItem('batchTaskStartedAt')
  }
  if (!completed) {
    // Keep taskId in sessionStorage in case user comes back
  }
  activeTaskId.value = null
}

const submitBatchDocx = async () => {
  if (batchLoading.value) return
  if (!batchDocxFile.value) {
    batchPreviewError.value = '请先选择 .docx / .pdf 文件。'
    return
  }

  batchLoading.value = true
  batchPreviewError.value = ''
  batchPreviewItems.value = []
  try {
    const result = await parseQuestionsDocxAsync(batchDocxFile.value)
    console.log('[batch-docx] async task started:', result)
    startPolling(result.taskId)
  } catch (error) {
    batchPreviewError.value = error?.message || '请求失败，请稍后重试。'
    batchLoading.value = false
  }
}

// Resume polling for a previously started task when the page is revisited
onMounted(() => {
  const savedTaskId = sessionStorage.getItem('batchTaskId')
  if (savedTaskId && !activeTaskId.value) {
    // Check if it's recent enough (within 25 minutes)
    const startedAt = Number(sessionStorage.getItem('batchTaskStartedAt') || 0)
    if (Date.now() - startedAt < 25 * 60 * 1000) {
      console.log('[batch-docx] resuming polling for task:', savedTaskId)
      batchLoading.value = true
      startPolling(savedTaskId)
    } else {
      sessionStorage.removeItem('batchTaskId')
      sessionStorage.removeItem('batchTaskStartedAt')
    }
  }
})

onUnmounted(() => {
  // Don't stop polling on unmount — keep taskId in sessionStorage
  // so it can resume when the user comes back
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
})

const submitAllBatch = async () => {
  if (batchSubmitAllLoading.value || !batchPreviewItems.value.length) return
  batchSubmitAllLoading.value = true
  batchSubmitAllMessage.value = ''
  batchSubmitAllMessageType.value = ''
  let successCount = 0
  let failCount = 0
  const failedItems = []
  const failedReasons = []
  for (const item of batchPreviewItems.value) {
    try {
      const type = resolveParsedItemType(item)
      const detail = buildDetailFromItem(item, type)
      const difficulty = Number(item.difficulty) || 3
      const payload = buildPayloadFromDetail(type, detail)
      await createQuestion({
        subject: item.subject || null,
        grade: item.grade || null,
        question_type: type,
        difficulty,
        content: payload.content,
        answer: payload.answer,
        explanation: payload.explanation || null,
      })
      successCount++
    } catch (error) {
      failCount++
      failedItems.push(item)
      const reason = error?.message || '未知错误'
      failedReasons.push(`${resolveParsedItemType(item)}: ${reason}`)
      try {
        console.warn('[batch-upload] failed item:', {
          type: resolveParsedItemType(item),
          stem: item?.stem || item?.passage || '',
          reason,
        })
      } catch {
        // ignore logging failure
      }
    }
  }
  batchSubmitAllLoading.value = false
  batchPreviewItems.value = failedItems
  batchEditIndex.value = null
  batchEditGroupIndex.value = null
  setBatchEditMessage('', '')
  if (failCount === 0) {
    batchSubmitAllMessageType.value = 'success'
    batchSubmitAllMessage.value = `全部 ${successCount} 道题目已成功上传到题库。`
    try {
      window.alert(`上传成功：全部 ${successCount} 道题目已上传。`)
    } catch {
      // ignore when running in non-browser environment
    }
  } else {
    batchSubmitAllMessageType.value = 'error'
    const firstReason = failedReasons[0] ? ` 首个错误：${failedReasons[0]}` : ''
    batchSubmitAllMessage.value = `上传完成：${successCount} 成功，${failCount} 失败，请检查失败项后重试。${firstReason}`
  }
}

const submitBatchEdit = async () => {
  if (batchEditLoading.value) return
  if (batchEditIndex.value === null) return
  const validationError = validateDetail(
    batchEditType.value,
    batchEditDetail.value,
    batchEditForm.value.difficulty,
  )
  if (validationError) {
    setBatchEditMessage('error', validationError)
    return
  }

  batchEditLoading.value = true
  setBatchEditMessage('', '')
  try {
    const payload = buildPayloadFromDetail(batchEditType.value, batchEditDetail.value)
    await createQuestion({
      subject: batchEditForm.value.subject || null,
      grade: batchEditForm.value.grade || null,
      question_type: batchEditType.value,
      difficulty: batchEditForm.value.difficulty,
      content: payload.content,
      answer: payload.answer,
      explanation: payload.explanation || null,
    })
    let updatedItem = { ...batchPreviewItems.value[batchEditIndex.value] }
    updatedItem.type = batchEditType.value
    updatedItem.difficulty = batchEditForm.value.difficulty
    updatedItem.subject = batchEditForm.value.subject || ''
    updatedItem.grade = batchEditForm.value.grade || ''
    if (batchEditType.value === '阅读理解') {
      updatedItem.passage = batchEditDetail.value.passage
      updatedItem.passageWithImages = batchEditDetail.value.passage
      updatedItem.passageImageUrl = batchEditDetail.value.passageImageUrl || ''
      updatedItem.subQuestions = Array.isArray(batchEditDetail.value.subQuestions)
        ? batchEditDetail.value.subQuestions.map((sq) => ({
            type: sq.type || '单选题',
            stem: sq.stem || '',
            stemWithImages: sq.stem || '',
            stemImageUrl: sq.stemImageUrl || '',
            options: sq.options || [],
            optionsWithImages: sq.options || [],
            optionImages: sq.optionImages || [],
            answer: sq.answer || '',
            explanation: sq.explanation || '',
          }))
        : []
      updatedItem.answer = payload.answer
      updatedItem.explanation = ''
    } else {
      updatedItem.stem = batchEditDetail.value.stem
      updatedItem.stemWithImages = batchEditDetail.value.stem
      updatedItem.stemImageUrl = batchEditDetail.value.stemImageUrl || ''
      updatedItem.options = batchEditDetail.value.options || []
      updatedItem.optionsWithImages = batchEditDetail.value.options || []
      updatedItem.optionImages = batchEditDetail.value.optionImages || []
      updatedItem.answer = payload.answer
      updatedItem.explanation = batchEditDetail.value.explanation || ''
      updatedItem.answers = batchEditDetail.value.answers || []
    }
    batchPreviewItems.value.splice(batchEditIndex.value, 1, updatedItem)
    batchEditIndex.value = null
    batchEditGroupIndex.value = null
    setBatchEditMessage('', '')
  } catch (error) {
    setBatchEditMessage('error', error?.message || '保存失败，请稍后重试。')
  } finally {
    batchEditLoading.value = false
  }
}

const deleteBatchItem = async () => {
  if (batchEditIndex.value === null) return
  try {
    const ok =
      typeof window !== 'undefined'
        ? window.confirm('确定要从预览中删除该题目吗？此操作不会上传题库。')
        : true
    if (!ok) return
  } catch {
    // ignore
  }
  batchPreviewItems.value.splice(batchEditIndex.value, 1)
  batchEditIndex.value = null
  batchEditGroupIndex.value = null
  setBatchEditMessage('', '')
  // update footer message count
  batchSubmitAllMessage.value = ''
}
</script>

<style scoped></style>
