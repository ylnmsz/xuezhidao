<template>
  <div class="bg-surface text-on-surface min-h-screen selection:bg-primary-container font-body">
    <StudentTopNavbar />
    <StudentSidebar />

    <!-- ============= 答题模式 ============= -->
    <template v-if="mode === 'taking'">
      <!-- 顶部工具栏 -->
      <div
        class="fixed top-16 left-0 right-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/10 h-16 flex items-center px-4 sm:px-8 lg:pl-80"
      >
        <div class="flex items-center justify-between w-full max-w-7xl mx-auto">
          <!-- 左侧：返回 + 标题 -->
          <div class="flex items-center gap-4">
            <button
              class="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-surface-container transition-all"
              type="button"
              @click="confirmExit"
            >
              <span class="material-symbols-outlined text-on-surface-variant">arrow_back</span>
            </button>
            <div>
              <h2 class="font-headline font-bold text-on-surface text-sm leading-tight">答题练习</h2>
              <p class="text-xs text-on-surface-variant">{{ questions.length }} 题 · {{ difficultyLabel }}</p>
            </div>
          </div>

          <!-- 中间：进度 -->
          <div class="hidden md:flex items-center gap-4 flex-1 max-w-md mx-6">
            <div class="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500 ease-out"
                :class="answeredCount === questions.length ? 'bg-secondary' : 'bg-primary'"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <span class="text-xs font-bold text-on-surface-variant whitespace-nowrap">
              {{ answeredCount }}/{{ questions.length }}
            </span>
          </div>

          <!-- 右侧：计时器 + 功能按钮 -->
          <div class="flex items-center gap-3">
            <!-- 计时器 -->
            <div
              class="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
              :class="timerUrgent ? 'bg-error/10 text-error animate-pulse' : 'bg-surface-container text-on-surface-variant'"
            >
              <span class="material-symbols-outlined text-lg">{{ timedMode ? 'timer' : 'schedule' }}</span>
              <span>{{ formattedTime }}</span>
            </div>

            <!-- 全屏 -->
            <button
              class="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-surface-container transition-all text-on-surface-variant"
              type="button"
              @click="toggleFullscreen"
            >
              <span class="material-symbols-outlined text-lg">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
            </button>

            <!-- 交卷按钮（桌面） -->
            <button
              class="hidden sm:flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              type="button"
              @click="confirmSubmit"
            >
              <span class="material-symbols-outlined text-lg">assignment_turned_in</span>
              交卷
            </button>
          </div>
        </div>
      </div>

      <main class="pt-32 pb-20 lg:ml-72 flex">
        <!-- ===== 左边题目区 ===== -->
        <div class="flex-1 max-w-4xl mx-auto px-4 sm:px-8">
          <!-- 题目卡片 -->
          <transition name="slide-fade" mode="out-in">
            <div :key="currentIndex" class="space-y-8">
              <!-- 题目头部信息 -->
              <div class="flex flex-wrap items-center gap-3">
                <span
                  class="px-4 py-1.5 rounded-full text-xs font-bold"
                  :class="typeClass(currentQuestion?.question_type)"
                >
                  <span class="material-symbols-outlined text-sm align-text-bottom mr-1">{{ typeIcon(currentQuestion?.question_type) }}</span>
                  {{ typeLabel(currentQuestion?.question_type) }}
                </span>
                <span
                  class="px-3 py-1.5 rounded-full text-xs font-bold"
                  :class="diffClass(currentQuestion?.difficulty)"
                >
                  {{ diffLabel(currentQuestion?.difficulty) }}
                </span>
                <span class="text-xs text-on-surface-variant font-medium">
                  第 {{ currentIndex + 1 }} / {{ questions.length }} 题
                </span>
              </div>

              <!-- 题目内容 -->
              <div class="bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-sm border border-outline-variant/5">
                <!-- 题号装饰 -->
                <div class="flex items-center gap-3 mb-8">
                  <div
                    class="w-12 h-12 rounded-2xl flex items-center justify-center font-headline font-bold text-xl shadow-sm"
                    :class="answerState(currentQuestion?.id) === 'correct' ? 'bg-secondary/20 text-secondary' : answerState(currentQuestion?.id) === 'wrong' ? 'bg-error/20 text-error' : 'bg-primary/10 text-primary'"
                  >
                    {{ String(currentIndex + 1).padStart(2, '0') }}
                  </div>
                  <div>
                    <p class="font-headline font-bold text-on-surface">题目</p>
                    <p class="text-xs text-on-surface-variant">{{ typeLabel(currentQuestion?.question_type) }}</p>
                  </div>
                </div>

                <!-- 题干（KaTeX 渲染，填空题下面有独立渲染，避免重复） -->
                <div
                  v-if="currentQuestion?.question_type !== '填空题'"
                  class="text-xl md:text-2xl font-headline font-bold text-on-surface leading-relaxed mb-6 practice-content"
                  v-html="renderedStem"
                ></div>

                <!-- 题目图片 -->
                <div
                  v-if="currentQuestion?.stem_image_url"
                  class="w-full max-h-80 rounded-xl overflow-hidden mb-6 bg-surface-container-low"
                >
                  <img
                    :src="resolveImageUrl(currentQuestion.stem_image_url)"
                    alt="题目图片"
                    class="w-full h-full object-contain"
                  />
                </div>

                <!-- 题型交互区域 -->
                <div class="mt-8">
                  <!-- 单选题 -->
                  <div v-if="currentQuestion?.question_type === '单选题'" class="space-y-4">
                    <div
                      v-for="option in parsedOptions"
                      :key="option.id"
                      class="flex items-center gap-4 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all"
                      :class="getSelectedOption(option.id)
                        ? 'border-primary bg-primary/5 shadow-sm shadow-primary/10'
                        : 'border-transparent bg-surface-container-low hover:bg-surface-container hover:border-outline-variant/30'"
                      @click="setAnswer(currentQuestion.id, option.id)"
                    >
                      <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold text-sm transition-all shrink-0"
                        :class="getSelectedOption(option.id)
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-on-surface-variant border border-outline-variant/20'"
                      >
                        {{ option.label }}
                      </div>
                      <span class="font-medium text-on-surface" v-html="option.rendered"></span>
                    </div>
                  </div>

                  <!-- 多选题 -->
                  <div v-else-if="currentQuestion?.question_type === '多选题'" class="space-y-4">
                    <div class="flex items-center gap-2 mb-4 text-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-base">info</span>
                      多选题 — 可选择一个或多个选项
                    </div>
                    <div
                      v-for="option in parsedOptions"
                      :key="option.id"
                      class="flex items-center gap-4 p-4 md:p-5 rounded-xl border-2 cursor-pointer transition-all"
                      :class="isMultiSelected(option.id)
                        ? 'border-secondary bg-secondary/5 shadow-sm shadow-secondary/10'
                        : 'border-transparent bg-surface-container-low hover:bg-surface-container hover:border-outline-variant/30'"
                      @click="toggleMulti(currentQuestion.id, option.id)"
                    >
                      <div
                        class="w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold text-sm transition-all shrink-0"
                        :class="isMultiSelected(option.id)
                          ? 'bg-secondary text-white shadow-md'
                          : 'bg-white text-on-surface-variant border border-outline-variant/20'"
                      >
                        <span v-if="isMultiSelected(option.id)" class="material-symbols-outlined text-lg">check</span>
                        <span v-else>{{ option.label }}</span>
                      </div>
                      <span class="font-medium text-on-surface" v-html="option.rendered"></span>
                    </div>
                  </div>

                  <!-- 判断题 -->
                  <div v-else-if="currentQuestion?.question_type === '判断题'" class="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
                    <button
                      class="flex-1 flex items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all font-headline font-bold text-lg"
                      :class="getSelectedOption('true')
                        ? 'border-secondary bg-secondary/10 text-secondary shadow-lg'
                        : 'border-transparent bg-surface-container-low text-on-surface-variant hover:border-secondary/30 hover:text-secondary'"
                      @click="setAnswer(currentQuestion.id, 'true')"
                    >
                      <span class="material-symbols-outlined text-3xl">check_circle</span>
                      正确
                    </button>
                    <button
                      class="flex-1 flex items-center justify-center gap-3 p-8 rounded-2xl border-2 transition-all font-headline font-bold text-lg"
                      :class="getSelectedOption('false')
                        ? 'border-error bg-error/10 text-error shadow-lg'
                        : 'border-transparent bg-surface-container-low text-on-surface-variant hover:border-error/30 hover:text-error'"
                      @click="setAnswer(currentQuestion.id, 'false')"
                    >
                      <span class="material-symbols-outlined text-3xl">cancel</span>
                      错误
                    </button>
                  </div>

                  <!-- 填空题 -->
                  <div v-else-if="currentQuestion?.question_type === '填空题'" class="space-y-6">
                    <div class="text-xl md:text-2xl font-headline font-bold text-on-surface leading-relaxed practice-content" v-html="fillBlankRenderedStem"></div>
                    <div class="space-y-4">
                      <div
                        v-for="(blank, bi) in fillBlankInputs"
                        :key="bi"
                        class="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl"
                      >
                        <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-headline font-bold text-sm shrink-0">
                          {{ bi + 1 }}
                        </span>
                        <input
                          type="text"
                          class="flex-1 p-3 rounded-lg bg-surface-container-lowest border-2 border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-lg font-body text-on-surface placeholder-on-surface-variant transition-all"
                          :placeholder="'填空 ' + (bi + 1)"
                          :value="fillBlankValues[bi] || ''"
                          @input="setFillBlank(bi, $event.target.value)"
                        />
                      </div>
                      <p v-if="fillBlankInputs.length === 0" class="text-on-surface-variant text-sm">请在下方输入答案</p>
                    </div>
                    <div class="flex items-start gap-3 text-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-base">edit</span>
                      <span>{{ fillBlankInputs.length > 0 ? `共 ${fillBlankInputs.length} 个填空` : '请在下方输入答案' }}</span>
                    </div>
                  </div>

                  <!-- 问答题 / 主观题 -->
                  <div v-else-if="currentQuestion?.question_type === '问答题' || currentQuestion?.question_type === '简答题'" class="space-y-4">
                    <textarea
                      class="w-full min-h-[200px] p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-body text-on-surface placeholder-on-surface-variant transition-all"
                      :placeholder="'请输入你的' + (currentQuestion?.question_type === '问答题' ? '作答' : '答案')"
                      :value="getAnswer(currentQuestion?.id) || ''"
                      @input="setAnswer(currentQuestion.id, $event.target.value)"
                    ></textarea>
                    <div class="flex justify-between text-xs text-on-surface-variant">
                      <span>{{ wordCount }} 字</span>
                      <span v-if="currentQuestion?.question_type === '问答题'">主观题将由老师批改</span>
                      <span v-else>短答案题将自动比较</span>
                    </div>
                  </div>

                  <!-- 其他题型 -->
                  <div v-else class="space-y-4">
                    <div class="p-5 bg-surface-container-low rounded-xl text-sm text-on-surface-variant">
                      <span class="material-symbols-outlined text-base align-text-bottom mr-2">info</span>
                      {{ typeLabel(currentQuestion?.question_type) }} — 请在下方输入你的答案
                    </div>
                    <textarea
                      class="w-full min-h-[150px] p-5 rounded-xl bg-surface-container-low border border-outline-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y font-body text-on-surface placeholder-on-surface-variant"
                      placeholder="输入答案..."
                      :value="getAnswer(currentQuestion?.id) || ''"
                      @input="setAnswer(currentQuestion.id, $event.target.value)"
                    ></textarea>
                  </div>
                </div>

                <!-- 解析（仅在回答后显示提示） -->
                <div v-if="getAnswer(currentQuestion?.id)" class="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div class="flex items-center gap-2 text-sm text-primary font-bold">
                    <span class="material-symbols-outlined text-base">lightbulb</span>
                    已作答 — 可继续修改
                  </div>
                </div>
              </div>

              <!-- 导航按钮 -->
              <div class="flex items-center justify-between gap-4">
                <button
                  class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  :class="currentIndex > 0
                    ? 'bg-surface-container-low text-on-surface hover:bg-surface-container-higher'
                    : 'bg-surface-container-lowest text-outline'"
                  :disabled="currentIndex === 0"
                  type="button"
                  @click="prevQuestion"
                >
                  <span class="material-symbols-outlined">navigate_before</span>
                  上一题
                </button>

                <button
                  v-if="currentIndex < questions.length - 1"
                  class="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  type="button"
                  @click="nextQuestion"
                >
                  下一题
                  <span class="material-symbols-outlined">navigate_next</span>
                </button>

                <button
                  v-else
                  class="flex items-center gap-2 px-8 py-3 rounded-xl font-bold bg-secondary text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20 sm:hidden"
                  type="button"
                  @click="confirmSubmit"
                >
                  <span class="material-symbols-outlined">assignment_turned_in</span>
                  交卷
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- ===== 右侧导航面板 ===== -->
        <aside
          class="hidden lg:block w-64 shrink-0 mr-6"
          :style="{ position: 'sticky', top: '8rem', alignSelf: 'start' }"
        >
          <div class="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/5">
            <h3 class="font-headline font-bold text-sm text-on-surface mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">grid_view</span>
              答题卡
            </h3>
            <div class="grid grid-cols-5 gap-2">
              <button
                v-for="(q, idx) in questions"
                :key="q.id"
                class="w-full aspect-square rounded-xl text-xs font-bold transition-all relative"
                :class="navItemClass(idx)"
                type="button"
                @click="goToQuestion(idx)"
              >
                {{ idx + 1 }}
                <span
                  v-if="isAnswered(q.id) && idx !== currentIndex"
                  class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-surface-container-lowest"
                  :class="isAnswered(q.id) ? 'bg-secondary' : 'bg-surface-container-highest'"
                ></span>
              </button>
            </div>

            <!-- 图例 -->
            <div class="mt-4 space-y-1.5 text-xs text-on-surface-variant">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-secondary/30 border border-secondary/50"></span>
                <span>已作答</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-primary/20 border border-primary/30"></span>
                <span>当前题目</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-surface-container-highest border border-outline-variant/30"></span>
                <span>未作答</span>
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-on-surface-variant">已答</span>
                <span class="font-bold text-on-surface">{{ answeredCount }}/{{ questions.length }}</span>
              </div>
              <div class="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-primary transition-all duration-500"
                  :style="{ width: progressPercent + '%' }"
                ></div>
              </div>
              <button
                class="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                type="button"
                @click="confirmSubmit"
              >
                <span class="material-symbols-outlined text-lg">assignment_turned_in</span>
                交卷
              </button>
            </div>
          </div>
        </aside>
      </main>
    </template>

    <!-- ============= 结果模式 ============= -->
    <template v-if="mode === 'results'">
      <main class="pt-24 pb-20 lg:ml-72">
        <div class="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <!-- 结果头部 -->
          <div class="text-center py-8">
            <div class="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4"
              :class="resultScore >= 80 ? 'bg-secondary/20' : resultScore >= 60 ? 'bg-primary/20' : 'bg-error/20'">
              <span class="material-symbols-outlined text-5xl"
                :class="resultScore >= 80 ? 'text-secondary' : resultScore >= 60 ? 'text-primary' : 'text-error'"
                style="font-variation-settings: 'FILL' 1">
                {{ resultScore >= 80 ? 'emoji_events' : resultScore >= 60 ? 'sentiment_satisfied' : 'sentiment_dissatisfied' }}
              </span>
            </div>
            <h1 class="text-3xl md:text-4xl font-black text-on-surface mb-2">
              {{ resultScore >= 80 ? '太棒了！' : resultScore >= 60 ? '继续加油！' : '别灰心！' }}
            </h1>
            <p class="text-on-surface-variant">{{ resultScore >= 80 ? '掌握得很扎实！' : resultScore >= 60 ? '还有提升空间！' : '多加练习一定能进步！' }}</p>
          </div>

          <!-- 分数卡片 -->
          <div class="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-sm border border-outline-variant/5">
            <div class="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <!-- 环形进度 -->
              <div class="relative w-40 h-40 shrink-0">
                <svg class="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" stroke-width="10"
                    class="text-surface-container-highest" />
                  <circle cx="80" cy="80" r="68" fill="none" stroke="currentColor" stroke-width="10"
                    stroke-linecap="round"
                    :stroke-dasharray="427.26"
                    :stroke-dashoffset="427.26 - (427.26 * resultScore / 100)"
                    :class="resultScore >= 80 ? 'text-secondary' : resultScore >= 60 ? 'text-primary' : 'text-error'"
                    class="transition-all duration-1000 ease-out" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-4xl font-black" :class="resultScore >= 80 ? 'text-secondary' : resultScore >= 60 ? 'text-primary' : 'text-error'">
                    {{ resultScore }}
                  </span>
                  <span class="text-xs text-on-surface-variant font-medium">分</span>
                </div>
              </div>

              <!-- 统计详情 -->
              <div class="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center">
                  <span class="block text-2xl font-black text-secondary">{{ result.correctCount }}</span>
                  <span class="text-xs text-on-surface-variant">正确</span>
                </div>
                <div class="text-center">
                  <span class="block text-2xl font-black text-error">{{ result.wrongCount }}</span>
                  <span class="text-xs text-on-surface-variant">错误</span>
                </div>
                <div class="text-center">
                  <span class="block text-2xl font-black text-primary">{{ result.totalQuestions }}</span>
                  <span class="text-xs text-on-surface-variant">总题数</span>
                </div>
                <div class="text-center">
                  <span class="block text-2xl font-black text-tertiary">+{{ result.pointsEarned || 0 }}</span>
                  <span class="text-xs text-on-surface-variant">获得积分</span>
                </div>
              </div>
            </div>

            <!-- 用时 -->
            <div class="mt-8 pt-6 border-t border-outline-variant/10 flex items-center justify-center gap-8 text-sm text-on-surface-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">schedule</span>
                用时 {{ formattedTime }}
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">check_circle</span>
                正确率 {{ resultScore }}%
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-base">stars</span>
                获得 +{{ result.pointsEarned || 0 }} 积分
              </div>
            </div>
          </div>

          <!-- 逐题回顾 -->
          <div class="space-y-4">
            <h3 class="text-xl font-bold text-on-surface flex items-center gap-2">
              <span class="material-symbols-outlined">reviews</span>
              题目回顾
            </h3>
            <div
              v-for="(r, idx) in result.results"
              :key="r.questionId"
              class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/5 transition-all hover:shadow-sm"
              :class="r.correct ? 'border-l-4 border-l-secondary' : r.correct === false ? 'border-l-4 border-l-error' : 'border-l-4 border-l-primary/40'"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-xl flex items-center justify-center font-headline font-bold shrink-0"
                  :class="r.correct ? 'bg-secondary/20 text-secondary' : r.correct === false ? 'bg-error/20 text-error' : 'bg-primary/10 text-primary'"
                >
                  <span v-if="r.correct" class="material-symbols-outlined">check</span>
                  <span v-else-if="r.correct === false" class="material-symbols-outlined">close</span>
                  <span v-else class="material-symbols-outlined">hourglass</span>
                </div>
                <div class="flex-1 min-w-0">
                  <!-- 题干 -->
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <span class="text-xs font-bold text-on-surface-variant">第 {{ idx + 1 }} 题</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="typeClass(r.questionType)">{{ typeLabel(r.questionType) }}</span>
                    <span v-if="r.needsManual" class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary">待批改</span>
                  </div>

                  <!-- 题目内容预览 -->
                  <div class="text-sm text-on-surface mb-3 line-clamp-2" v-html="renderMathInline(r.content)"></div>

                  <!-- 答案对比 -->
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center gap-2">
                      <span class="text-on-surface-variant">你的答案:</span>
                      <span class="font-bold" :class="r.correct ? 'text-secondary' : r.correct === false ? 'text-error' : 'text-on-surface'">
                        {{ formatAnswer(r.studentAnswer) || '未作答' }}
                      </span>
                    </div>
                    <div v-if="!r.correct && r.correctAnswer" class="flex items-center gap-2">
                      <span class="text-on-surface-variant">正确答案:</span>
                      <span class="font-bold text-secondary">{{ formatAnswer(r.correctAnswer) }}</span>
                    </div>
                  </div>

                  <!-- 解析 -->
                  <div v-if="r.explanation" class="mt-4 p-4 bg-surface-container-low rounded-xl">
                    <div class="flex items-center gap-2 text-sm text-on-surface-variant font-bold mb-2">
                      <span class="material-symbols-outlined text-base">lightbulb</span>
                      解析
                    </div>
                    <p class="text-sm text-on-surface leading-relaxed" v-html="renderMathInline(r.explanation)"></p>
                  </div>

                  <!-- 加入错题本按钮 -->
                  <button
                    v-if="r.correct === false"
                    class="mt-3 flex items-center gap-1.5 text-xs text-error font-bold hover:text-error/80 transition-colors"
                    type="button"
                    @click="addToErrorBook(r)"
                  >
                    <span class="material-symbols-outlined text-sm">bookmark_add</span>
                    加入错题本
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="flex flex-col sm:flex-row items-center gap-4 pt-4 pb-12">
            <button
              class="flex-1 w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3"
              type="button"
              @click="retryPractice"
            >
              <span class="material-symbols-outlined text-2xl">refresh</span>
              再来一次
            </button>
            <button
              class="flex-1 w-full sm:w-auto px-8 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold hover:bg-surface-container-higher transition-all flex items-center justify-center gap-3"
              type="button"
              @click="$router.push('/immersivepractice')"
            >
              <span class="material-symbols-outlined text-2xl">auto_stories</span>
              返回练习中心
            </button>
            <button
              class="flex-1 w-full sm:w-auto px-8 py-4 bg-surface-container-low text-on-surface rounded-xl font-bold hover:bg-surface-container-higher transition-all flex items-center justify-center gap-3"
              type="button"
              @click="$router.push('/studenterrorbook')"
            >
              <span class="material-symbols-outlined text-2xl">cancel</span>
              查看错题本
            </button>
          </div>
        </div>
      </main>
    </template>

    <!-- 背景装饰 -->
    <div class="fixed top-20 right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    <div class="fixed bottom-20 left-[-10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

    <!-- ===== 退出确认弹窗 ===== -->
    <div
      v-if="showExitDialog"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showExitDialog = false"
    >
      <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center mb-6">
          <span class="material-symbols-outlined text-5xl text-error mb-3" style="font-variation-settings: 'FILL' 1">exit_to_app</span>
          <h3 class="text-xl font-bold text-on-surface">确认退出？</h3>
          <p class="text-sm text-on-surface-variant mt-2">当前练习进度将不会保存</p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 py-3 bg-surface-container-low rounded-xl font-bold text-on-surface hover:bg-surface-container-higher transition-all"
            type="button"
            @click="showExitDialog = false"
          >
            继续答题
          </button>
          <button
            class="flex-1 py-3 bg-error text-white rounded-xl font-bold hover:bg-error/90 transition-all"
            type="button"
            @click="exitPractice"
          >
            确认退出
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 交卷确认弹窗 ===== -->
    <div
      v-if="showSubmitDialog"
      class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="showSubmitDialog = false"
    >
      <div class="bg-surface-container-lowest rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center mb-6">
          <span class="material-symbols-outlined text-5xl text-primary mb-3" style="font-variation-settings: 'FILL' 1">assignment_turned_in</span>
          <h3 class="text-xl font-bold text-on-surface">确认交卷？</h3>
          <p class="text-sm text-on-surface-variant mt-2">
            已答 {{ answeredCount }}/{{ questions.length }} 题
            <span v-if="unansweredCount > 0" class="text-error block mt-1">
              还有 {{ unansweredCount }} 题未作答
            </span>
          </p>
        </div>
        <div class="flex gap-4">
          <button
            class="flex-1 py-3 bg-surface-container-low rounded-xl font-bold text-on-surface hover:bg-surface-container-higher transition-all"
            type="button"
            @click="showSubmitDialog = false"
          >
            继续答题
          </button>
          <button
            class="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
            type="button"
            :disabled="submitting"
            @click="handleSubmit"
          >
            <span v-if="submitting" class="flex items-center justify-center gap-2">
              <span class="material-symbols-outlined animate-spin text-lg">refresh</span>
              批改中...
            </span>
            <span v-else>确认交卷</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ===== 底部快捷键提示 ===== -->
    <div
      v-if="mode === 'taking'"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-4 px-5 py-2.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full shadow-sm border border-outline-variant/10 text-xs text-on-surface-variant"
    >
      <span><kbd class="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold">←</kbd> <kbd class="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold">→</kbd> 切换题目</span>
      <span class="w-px h-4 bg-outline-variant/20"></span>
      <span><kbd class="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold">1</kbd>-<kbd class="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold">{{ questions.length }}</kbd> 跳转题目</span>
      <span class="w-px h-4 bg-outline-variant/20"></span>
      <span><kbd class="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold">Ctrl + Enter</kbd> 交卷</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import { listQuestions, createErrorItem, getAssignmentPrep } from '@/services/questionService.js'
import { submitPractice } from '@/services/practiceService.js'
import { renderMathToHtml, renderMathWithHtml } from '@/utils/renderMath.js'

const route = useRoute()
const router = useRouter()

// ============================================================
// 状态
// ============================================================
const mode = ref('taking') // 'taking' | 'results'
const questions = ref([])
const answers = ref({}) // { [questionId]: answerValue }
const currentIndex = ref(0)
const submitting = ref(false)
const showExitDialog = ref(false)
const showSubmitDialog = ref(false)
const timedMode = ref(false)
const isFullscreen = ref(false)
const result = ref(null)
const resultScore = ref(0)

// 计时器
const elapsed = ref(0) // 秒
const timeLimit = ref(1800) // 30min = 1800s
let timerInterval = null

// ============================================================
// 计算属性
// ============================================================
const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

const answeredCount = computed(() => {
  return questions.value.filter((q) => answers.value[q.id] !== undefined && answers.value[q.id] !== null && answers.value[q.id] !== '').length
})

const unansweredCount = computed(() => questions.value.length - answeredCount.value)

const progressPercent = computed(() => {
  if (questions.value.length === 0) return 0
  return Math.round((answeredCount.value / questions.value.length) * 100)
})

const difficultyLabel = computed(() => {
  const diff = route.query.difficulty || ''
  if (!diff) return '全部难度'
  const n = parseInt(diff)
  if (n >= 1 && n <= 5) return '⭐'.repeat(n)
  return diff
})

const formattedTime = computed(() => {
  const total = timedMode.value ? Math.max(0, timeLimit.value - elapsed.value) : elapsed.value
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const timerUrgent = computed(() => {
  return timedMode.value && timeLimit.value - elapsed.value <= 300
})

const wordCount = computed(() => {
  const ans = getAnswer(currentQuestion.value?.id)
  return ans ? String(ans).length : 0
})

// ============================================================
// 解析选项
// ============================================================
const parsedOptions = computed(() => {
  const q = currentQuestion.value
  if (!q) return []
  const content = q.content || ''
  const opts = parseOptionsFromContent(content)
  if (opts.length > 0) return opts
  // Fallback: generate generic A/B/C/D options
  if (q.question_type === '单选题' || q.question_type === '多选题') {
    return [
      { id: 'A', label: 'A', text: '选项 A' },
      { id: 'B', label: 'B', text: '选项 B' },
      { id: 'C', label: 'C', text: '选项 C' },
      { id: 'D', label: 'D', text: '选项 D' },
    ]
  }
  return opts
})

const renderedStem = computed(() => {
  const q = currentQuestion.value
  if (!q) return ''
  const stem = getStemFromContent(q.content || '')
  const withImages = convertImagePlaceholders(stem)
  return renderMathWithHtml(withImages)
})

// 填空题渲染
const fillBlankRenderedStem = computed(() => {
  const q = currentQuestion.value
  if (!q) return ''
  const stem = getStemFromContent(q.content || '')
  const withImages = convertImagePlaceholders(stem)
  return renderMathWithHtml(withImages)
})

const fillBlankInputs = computed(() => {
  const q = currentQuestion.value
  if (!q) return []
  const blanks = detectBlanks(q.content || '')
  return blanks.length > 0 ? blanks : ['']
})

const fillBlankValues = computed(() => {
  const q = currentQuestion.value
  if (!q) return []
  const val = answers.value[q.id]
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    return val.split(/[,，、\n]/).map((s) => s.trim()).filter(Boolean)
  }
  return []
})

function setFillBlank(index, value) {
  const q = currentQuestion.value
  if (!q) return
  const arr = [...fillBlankValues.value]
  arr[index] = value
  answers.value = { ...answers.value, [q.id]: arr }
}

// ============================================================
// 方法：答案管理
// ============================================================
function getAnswer(qId) {
  return answers.value[qId]
}

function setAnswer(qId, value) {
  answers.value = { ...answers.value, [qId]: value }
}

function getSelectedOption(optionId) {
  const q = currentQuestion.value
  if (!q) return false
  return answers.value[q.id] === optionId
}

function isMultiSelected(optionId) {
  const q = currentQuestion.value
  if (!q) return false
  const selected = answers.value[q.id]
  return Array.isArray(selected) && selected.includes(optionId)
}

function toggleMulti(qId, optionId) {
  const current = answers.value[qId]
  const arr = Array.isArray(current) ? [...current] : []
  const idx = arr.indexOf(optionId)
  if (idx >= 0) {
    arr.splice(idx, 1)
  } else {
    arr.push(optionId)
  }
  answers.value = { ...answers.value, [qId]: arr }
}

function isAnswered(qId) {
  const v = answers.value[qId]
  if (v === undefined || v === null) return false
  if (Array.isArray(v)) return v.length > 0
  return String(v).trim() !== ''
}

// ============================================================
// 方法：导航
// ============================================================
function prevQuestion() {
  if (currentIndex.value > 0) currentIndex.value--
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) currentIndex.value++
}

function goToQuestion(idx) {
  if (idx >= 0 && idx < questions.value.length) currentIndex.value = idx
}

function confirmExit() {
  showExitDialog.value = true
}

function exitPractice() {
  showExitDialog.value = false
  router.push('/immersivepractice')
}

function confirmSubmit() {
  showSubmitDialog.value = true
}

// ============================================================
// 方法：交卷
// ============================================================
async function handleSubmit() {
  submitting.value = true
  showSubmitDialog.value = false
  try {
    const answersPayload = questions.value.map((q) => ({
      questionId: q.id,
      answer: answers.value[q.id] || null,
    }))

    const isHomework = Boolean(route.query.assignmentId)
    const res = await submitPractice({
      answers: answersPayload,
      elapsed_seconds: elapsed.value,
      assignmentId: route.query.assignmentId || undefined,
    })

    if (isHomework) {
      // 作业模式：交卷后直接退出，不显示成绩
      // 成绩由老师批改后公布
      stopTimer()
      router.push('/studenthomeworklist')
      return
    }

    // 练习模式：显示答题结果
    result.value = res
    resultScore.value = res.score || 0
    mode.value = 'results'
    stopTimer()
  } catch (e) {
    console.error('Submit failed:', e)
    alert('提交失败: ' + e.message)
  } finally {
    submitting.value = false
  }
}

function retryPractice() {
  // Reset state
  answers.value = {}
  currentIndex.value = 0
  mode.value = 'taking'
  result.value = null
  resultScore.value = 0
  elapsed.value = 0
  startTimer()
}

// ============================================================
// 方法：错题本
// ============================================================
async function addToErrorBook(r) {
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || '{}')
    await createErrorItem({
      user_id: user.id,
      question_id: r.questionId,
      note: '练习回顾',
    })
    alert('已加入错题本！')
  } catch (e) {
    console.error('Failed to add to error book:', e)
    alert('添加失败: ' + e.message)
  }
}

// ============================================================
// 方法：计时器
// ============================================================
function startTimer() {
  stopTimer()
  timerInterval = setInterval(() => {
    elapsed.value++
    if (timedMode.value && elapsed.value >= timeLimit.value) {
      // Time's up - auto submit
      clearInterval(timerInterval)
      alert('时间到！')
      submitPractice()
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// ============================================================
// 方法：全屏
// ============================================================
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
    }).catch(() => {})
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch(() => {})
  }
}

// ============================================================
// 键盘快捷键
// ============================================================
function handleKeydown(e) {
  if (mode.value !== 'taking') return
  if (showExitDialog.value || showSubmitDialog.value) return

  // Ignore if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      prevQuestion()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextQuestion()
      break
    case 'Enter':
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        confirmSubmit()
      }
      break
    default:
      // Number keys to jump to question
      const num = parseInt(e.key)
      if (num >= 1 && num <= 9 && num <= questions.value.length) {
        goToQuestion(num - 1)
      }
      break
  }
}

// Listen for blank input changes
// (handled by @input on the blank input elements)

// ============================================================
// 初始化
// ============================================================
onMounted(async () => {
  const assignmentId = route.query.assignmentId

  try {
    let items = []

    if (assignmentId) {
      // Load only questions belonging to this assignment
      const prep = await getAssignmentPrep(assignmentId)
      const qIds = Array.isArray(prep.question_ids) ? prep.question_ids : []
      if (qIds.length === 0) {
        alert('该作业没有包含任何题目')
        router.push('/studenthomeworklist')
        return
      }
      const resp = await listQuestions({ ids: qIds.join(',') })
      items = resp.items || []
    } else {
      // Original flow: load questions by filter params
      const params = {
        limit: route.query.limit || 10,
      }
      if (route.query.question_type) params.question_type = route.query.question_type
      if (route.query.difficulty) params.difficulty = route.query.difficulty
      if (route.query.subject) params.subject = route.query.subject
      timedMode.value = route.query.timed === 'true'

      const resp = await listQuestions(params)
      items = resp.items || []
    }

    if (items.length === 0) {
      alert('没有找到符合条件的题目，请返回重试')
      router.push('/immersivepractice')
      return
    }
    questions.value = items
    startTimer()

    // Set up event listeners
    window.addEventListener('keydown', handleKeydown)
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
    })
  } catch (e) {
    console.error('Failed to load questions:', e)
    alert('加载题目失败: ' + e.message)
    router.push('/immersivepractice')
  }
})

onUnmounted(() => {
  stopTimer()
  window.removeEventListener('keydown', handleKeydown)
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  }
})

// ============================================================
// 工具函数：题目内容解析（支持 JSON 和纯文本两种格式）
// ============================================================

/**
 * 尝试将 content 解析为 JSON，失败返回 null
 */
function tryParseJson(content) {
  if (!content) return null
  try {
    return JSON.parse(content)
  } catch {
    return null
  }
}

/**
 * 从 content 中提取题干文本
 * JSON 格式: { "stem": "..." } 或 { "passage": "...", "subQuestions": [...] }
 * 纯文本格式: "题干\nA. 选项A\nB. 选项B..."
 */
function getStemFromContent(content) {
  if (!content) return ''

  // JSON 格式
  const parsed = tryParseJson(content)
  if (parsed) {
    if (parsed.stem) return parsed.stem
    if (parsed.passage) return parsed.passage
    return ''
  }

  // 纯文本：截取选项标记之前的部分
  const match = content.match(/(?:^|\n)\s*[A-Za-z][.、)）]\s*/)
  if (match) {
    return content.slice(0, match.index).trim()
  }
  return content.trim()
}

/**
 * 从 content 中提取选项列表
 * JSON 格式: { "options": [{ "text": "..." }, ...] }
 * 纯文本格式: "A. xxx\nB. xxx\nC. xxx\nD. xxx"
 */
function parseOptionsFromContent(content) {
  if (!content) return []

  // JSON 格式
  const parsed = tryParseJson(content)
  if (parsed) {
    if (Array.isArray(parsed.options) && parsed.options.length >= 2) {
      return parsed.options.map((opt, i) => {
        const label = String.fromCharCode(65 + i) // A, B, C, ...
        const text = typeof opt === 'object' ? (opt.text || '') : String(opt)
        return {
          id: label,
          label,
          text,
          rendered: renderMathWithHtml(convertImagePlaceholders(text)),
        }
      })
    }
    // 子题（复合题型如阅读理解、完形填空）
    if (Array.isArray(parsed.subQuestions) && parsed.subQuestions.length > 0) {
      const sq = parsed.subQuestions[0]
      if (Array.isArray(sq.options) && sq.options.length >= 2) {
        return sq.options.map((opt, i) => {
          const label = String.fromCharCode(65 + i)
          const text = typeof opt === 'object' ? (opt.text || '') : String(opt)
          return { id: label, label, text, rendered: renderMathWithHtml(convertImagePlaceholders(text)) }
        })
      }
    }
    return []
  }

  // 纯文本格式: 行首匹配 "A. xxx" / "A、xxx" / "A) xxx"
  const pattern = /(?:^|\n)\s*([A-Za-z])[.、)）]\s*/g
  const matches = [...content.matchAll(pattern)]

  if (matches.length < 2) return []

  const options = []
  for (let i = 0; i < matches.length; i++) {
    const label = matches[i][1].toUpperCase()
    const start = matches[i].index + matches[i][0].length
    const end = i < matches.length - 1 ? matches[i + 1].index : content.length
    const text = content.slice(start, end).trim()
    if (text) {
      options.push({ id: label, label, text, rendered: renderMathWithHtml(convertImagePlaceholders(text)) })
    }
  }
  return options
}

/**
 * 检测填空题的空白数量
 * 支持: ___ , [填空] , ( ) , （ ） 等
 */
function detectBlanks(content) {
  if (!content) return []
  // 对 JSON 内容，先提取题干文本再检测
  const stem = getStemFromContent(content)
  const pattern = /_{3,}|\[填空\]|\(\s*\)|（\s*）/g
  const matches = stem.match(pattern)
  return matches || []
}

/**
 * 导航面板样式
 */
function navItemClass(idx) {
  const q = questions.value[idx]
  if (!q) return 'bg-surface-container-highest text-on-surface-variant'
  const isCurrent = idx === currentIndex.value
  const answered = isAnswered(q.id)

  if (isCurrent) return 'bg-primary/20 text-primary border-2 border-primary/30 font-bold scale-110 shadow-sm'
  if (answered) return 'bg-secondary/20 text-secondary border border-secondary/20'
  return 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-hover border border-transparent'
}

/**
 * 答题状态（用于结果页）
 */
function answerState(qId) {
  if (mode.value !== 'results' || !result.value) return ''
  const r = result.value.results.find((item) => item.questionId === qId)
  if (!r) return ''
  if (r.correct) return 'correct'
  if (r.correct === false) return 'wrong'
  return 'pending'
}

// ============================================================
// 类型/样式映射
// ============================================================
function typeLabel(type) {
  const known = ['单选题', '多选题', '判断题', '填空题', '问答题', '简答题', '阅读理解', '连线题', '翻译题', '改错题', '编程题']
  return known.includes(type) ? type : '未知题型'
}

function typeIcon(type) {
  const map = {
    单选题: 'radio_button_checked',
    多选题: 'check_box',
    判断题: 'toggle_on',
    填空题: 'edit_note',
    问答题: 'notes',
    简答题: 'short_text',
    阅读理解: 'menu_book',
    连线题: 'link',
    翻译题: 'translate',
    改错题: 'find_replace',
    编程题: 'code',
  }
  return map[type] || 'quiz'
}

function typeClass(type) {
  const map = {
    单选题: 'bg-primary/10 text-primary',
    多选题: 'bg-secondary/10 text-secondary',
    判断题: 'bg-tertiary/10 text-tertiary',
    填空题: 'bg-secondary-fixed-dim/20 text-secondary-fixed-dim',
    问答题: 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim',
    简答题: 'bg-primary-dim/20 text-primary-dim',
    阅读理解: 'bg-primary/10 text-primary',
    连线题: 'bg-secondary/10 text-secondary',
    翻译题: 'bg-tertiary/10 text-tertiary',
    改错题: 'bg-error/10 text-error',
    编程题: 'bg-primary-dim/20 text-primary-dim',
  }
  return map[type] || 'bg-surface-container-high text-on-surface-variant'
}

function diffLabel(diff) {
  if (!diff) return '未知'
  const n = parseInt(diff)
  if (n >= 1 && n <= 5) return '⭐'.repeat(n)
  return String(diff)
}

function diffClass(diff) {
  const n = parseInt(diff)
  if (n >= 1 && n <= 5) {
    const colors = ['bg-secondary/10 text-secondary', 'bg-secondary/10 text-secondary', 'bg-primary/10 text-primary', 'bg-error/10 text-error', 'bg-error/10 text-error']
    return colors[n - 1]
  }
  return 'bg-surface-container-high text-on-surface-variant'
}

function formatAnswer(ans) {
  if (ans === null || ans === undefined) return ''
  if (Array.isArray(ans)) return ans.join(', ')
  if (ans === 'true') return '正确'
  if (ans === 'false') return '错误'
  return String(ans)
}

function renderMathInline(text) {
  return renderMathWithHtml(convertImagePlaceholders(text || ''))
}

function resolveImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  const base = (import.meta.env.VITE_API_BASE || 'http://localhost:4000/api').replace(/\/api\/?$/, '')
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * 将文本中的 [img:URL] 占位符转换为 <img> 标签
 */
function convertImagePlaceholders(text) {
  if (!text) return ''
  return text.replace(/\[img:([^\]]+)\]/g, (_, url) => {
    const resolved = resolveImageUrl(url.trim())
    return `<img src="${resolved}" alt="题目图片" class="max-w-full h-auto rounded-lg my-2" />`
  })
}
</script>

<style scoped>
/* 题目切换动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 环形进度条动画 */
@keyframes fillProgress {
  from {
    stroke-dashoffset: 427.26;
  }
}

/* 交卷按钮脉冲 */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
}

/* 答题卡格子 */
.grid > button {
  font-size: 0.75rem;
  user-select: none;
}

/* 防止长文本/公式撑爆容器 */
.space-y-8 > .bg-surface-container-lowest {
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
}

/* 两行截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* KaTeX 内容样式 + 防止公式溢出 */
.practice-content {
  overflow-wrap: break-word;
  word-break: break-word;
  overflow: hidden;
}
.practice-content :deep(.katex) {
  font-size: 1.1em;
  white-space: normal;
}
.practice-content :deep(.katex-display) {
  margin: 1em 0;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.practice-content :deep(.katex .katex-html) {
  overflow-wrap: break-word;
  word-break: break-word;
}

/* 动画旋转 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
