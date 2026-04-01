<template>
  <div class="flex h-screen flex-col md:flex-row bg-[#FAFAFA]">
    <StudentSidebar />
    <StudentTopNavbar profile-route="/teacherprofile" />
    <!-- Main Content Area -->
    <main class="flex-1 lg:ml-72 p-6 md:p-12 max-w-7xl mx-auto w-full pt-24 md:pt-28">
      <!-- Header -->
      <header class="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2">
          <button
            class="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            @click="$router.push('/homeworkmanagement')"
          >
            <span class="material-symbols-outlined">arrow_back</span>
            ← 返回作业列表
          </button>
          <h2
            class="text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight"
          >
            每周数学冲刺 #4 - 战况分析 🏆
          </h2>
        </div>
        <div class="flex items-center gap-3 bg-surface-container-low p-2 rounded-full px-6">
          <span
            class="material-symbols-outlined text-secondary"
            style="font-variation-settings: 'FILL' 1"
            >calendar_today</span
          >
          <span class="font-bold text-sm">2023年10月24日</span>
        </div>
      </header>
      <!-- Top Section: Analytics Cards -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- Score Stats -->
        <div
          class="bg-surface-container-lowest p-8 rounded-lg candy-shadow border-b-4 border-primary-container relative overflow-hidden group"
        >
          <div
            class="absolute -top-4 -right-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <h3 class="font-headline font-bold text-lg">平均分概览</h3>
            <span class="material-symbols-outlined text-primary text-3xl">insights</span>
          </div>
          <div class="flex items-end gap-3 h-32 mb-4">
            <div class="w-full bg-surface-container-high rounded-full h-1/2 relative group">
              <div
                class="absolute bottom-0 w-full bg-error-container rounded-full h-full transition-all duration-1000"
              ></div>
            </div>
            <div class="w-full bg-surface-container-high rounded-full h-full relative">
              <div
                class="absolute bottom-0 w-full bg-primary-container rounded-full h-2/3 transition-all duration-1000"
              ></div>
            </div>
            <div class="w-full bg-surface-container-high rounded-full h-full relative">
              <div
                class="absolute bottom-0 w-full bg-secondary-container rounded-full h-5/6 transition-all duration-1000"
              ></div>
            </div>
            <div class="w-full bg-surface-container-high rounded-full h-full relative">
              <div
                class="absolute bottom-0 w-full bg-tertiary-container rounded-full h-3/4 transition-all duration-1000"
              ></div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-4xl font-black text-primary">84.5</span>
            <span class="text-xs font-bold text-on-surface-variant uppercase tracking-widest"
              >班级均分</span
            >
          </div>
        </div>
        <!-- Unsubmitted List -->
        <div
          class="bg-surface-container-lowest p-8 rounded-lg candy-shadow border-b-4 border-outline-variant"
        >
          <div class="flex justify-between items-start mb-6">
            <h3 class="font-headline font-bold text-lg">未提交名单 (4)</h3>
            <span class="material-symbols-outlined text-outline text-3xl">pending_actions</span>
          </div>
          <div class="flex flex-wrap gap-4">
            <div class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-outline transition-all"
              >
                <span class="material-symbols-outlined text-outline-variant">person</span>
              </div>
              <span class="text-xs font-bold">李小明</span>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-outline transition-all"
              >
                <span class="material-symbols-outlined text-outline-variant">person</span>
              </div>
              <span class="text-xs font-bold">王大锤</span>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-outline transition-all"
              >
                <span class="material-symbols-outlined text-outline-variant">person</span>
              </div>
              <span class="text-xs font-bold">赵美美</span>
            </div>
            <div class="flex flex-col items-center gap-2 group">
              <div
                class="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center border-2 border-transparent group-hover:border-outline transition-all"
              >
                <span class="material-symbols-outlined text-outline-variant">person</span>
              </div>
              <span class="text-xs font-bold">周周</span>
            </div>
          </div>
          <button
            class="mt-6 w-full py-3 bg-surface-container-low text-on-surface-variant font-bold rounded-full hover:bg-surface-container transition-colors"
          >
            一键提醒
          </button>
        </div>
        <!-- Common Mistakes -->
        <div
          class="bg-surface-container-lowest p-8 rounded-lg candy-shadow border-b-4 border-tertiary-container relative overflow-hidden"
        >
          <div
            class="absolute -top-10 -right-10 w-32 h-32 bg-tertiary-container/10 rounded-full"
          ></div>
          <div class="flex justify-between items-start mb-6">
            <h3 class="font-headline font-bold text-lg">易错重难点</h3>
            <span
              class="material-symbols-outlined text-tertiary-container text-3xl"
              style="font-variation-settings: 'FILL' 1"
              >local_fire_department</span
            >
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-error/5 rounded-xl border border-error/10">
              <span class="font-black text-error">Q3</span>
              <div class="flex-1">
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-error rounded-full" style="width: 78%"></div>
                </div>
              </div>
              <span class="text-xs font-bold">78% 错率</span>
            </div>
            <div
              class="flex items-center gap-3 p-3 bg-tertiary/5 rounded-xl border border-tertiary/10"
            >
              <span class="font-black text-tertiary">Q7</span>
              <div class="flex-1">
                <div class="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-tertiary rounded-full" style="width: 45%"></div>
                </div>
              </div>
              <span class="text-xs font-bold">45% 错率</span>
            </div>
          </div>
        </div>
      </section>
      <!-- Bottom Section: Student List -->
      <section>
        <div class="flex items-center gap-8 mb-8 border-b-2 border-surface-container">
          <button class="pb-4 text-primary font-bold border-b-4 border-primary px-2 transition-all">
            已批改 (32)
          </button>
          <button
            class="pb-4 text-on-surface-variant font-bold border-b-4 border-transparent px-2 hover:text-primary transition-all"
          >
            待批改 (12)
          </button>
        </div>
        <div class="space-y-6">
          <!-- Individual Student Card - Graded -->
          <div class="bg-surface-container-lowest rounded-lg candy-shadow overflow-hidden group">
            <div class="p-6 flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-4">
                <img
                  alt="Student Avatar"
                  class="w-14 h-14 rounded-full object-cover ring-4 ring-primary-container/20"
                  data-alt="cheerful young boy student with messy hair smiling in a bright classroom setting soft focus"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCt9lsakA1MsrbyoH-f0isxdj-VLKTRIm1x2Db6F2Q2S0Cg7elc0edh6xj6DV3XzWFa5D8v9Iw8tfyxeDUpon0oiAf3RIYdnorwTedH3O2FcyoOiDlNPvQ1XQukpDqMnTWP3eZ9J8WZYOhc2Vje-QOIST4Gil-_SbLBprtlHafrJuErq5WoiMF_YWEl4dCXWyoiLs9GSPGe-4OF3QaUWvwXTqd7vtW8FRyDiPZmoEwQlgxf1ltWQQkzBjeFZmoVmctcCaKVmoJs2Hb"
                />
                <div>
                  <h4 class="font-headline font-bold text-lg">张三</h4>
                  <p class="text-xs font-medium text-on-surface-variant italic">
                    提交于: 10月23日 18:45
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="text-center">
                  <div class="text-2xl font-black text-secondary">95</div>
                  <div class="text-[10px] font-bold text-on-surface-variant uppercase">
                    最终得分
                  </div>
                </div>
                <button
                  class="px-6 py-3 bg-primary-container text-on-primary-container font-bold rounded-full flex items-center gap-2 bouncy-hover"
                >
                  Grade 📝
                  <span class="material-symbols-outlined text-sm">expand_more</span>
                </button>
              </div>
            </div>
          </div>
          <!-- Individual Student Card - Pending/Active Accordion -->
          <div
            class="bg-surface-container-lowest rounded-lg candy-shadow ring-4 ring-primary/10 overflow-hidden"
          >
            <div
              class="p-6 flex items-center justify-between border-b border-surface-container-low flex-wrap gap-4"
            >
              <div class="flex items-center gap-4">
                <img
                  alt="Student Avatar"
                  class="w-14 h-14 rounded-full object-cover ring-4 ring-tertiary-container/20"
                  data-alt="young school girl student with glasses and ponytail focused and smiling brightly high-end portrait"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6c9LMdxwZzapNHIRufm2aFW9XgBj1tN1mF2jAFcFi_NC3TTB_witRa1YkXdf5-_YyUOXnCQystzgyoidzxZQvEvNNHyPLrdDzEqS8N12VjQkCLr14QHwOM_-6-FqzktsfqwUplcly9I-zk2mWdoUDsnFsO_sQlnh4fDTxTPv2G66KN7hLqyfNj2_vDsSkrRUj85_otatfhIfXr8WSrOHs-qGPyvONDarGC5a8ZF3WquVqgIFRxsR9GavBVRE6gG4eU0XHdKJGtPQA"
                />
                <div>
                  <h4 class="font-headline font-bold text-lg">林萌萌</h4>
                  <p class="text-xs font-medium text-on-surface-variant italic">
                    提交于: 10月24日 09:12
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-8">
                <div class="text-center px-4 py-2 bg-surface-container-low rounded-xl">
                  <div class="text-2xl font-black text-on-surface-variant">--</div>
                  <div class="text-[10px] font-bold text-on-surface-variant uppercase">待打分</div>
                </div>
                <button
                  class="px-6 py-3 bg-primary text-on-primary font-bold rounded-full flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  Grade 📝
                  <span class="material-symbols-outlined text-sm">expand_less</span>
                </button>
              </div>
            </div>
            <!-- Expanded View -->
            <div class="p-8 bg-surface-container-lowest">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <!-- Answer Content -->
                <div class="space-y-6">
                  <div
                    class="bg-surface p-6 rounded-lg border-2 border-dashed border-outline-variant/30"
                  >
                    <h5 class="font-bold mb-4 text-primary flex items-center gap-2">
                      <span class="material-symbols-outlined">attachment</span>
                      学生提交的附件 (图片/PDF)
                    </h5>
                    <div
                      class="aspect-video bg-white rounded-lg border shadow-inner flex items-center justify-center overflow-hidden"
                    >
                      <img
                        alt="Handwritten Math Homework"
                        class="w-full h-full object-cover opacity-80"
                        data-alt="handwritten math equations and geometric sketches on graph paper with pencil and ruler soft natural light"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq-reFthaoVyK60q1z3YHBmG755Qh77a2uhyJf-wJ2jdsiB4j9qMz2U3vM3ziW7m84CAYCx47w-3lOJzq1r_HGR7BsQN89k-XWMqPonnL4NKvo8BTtHQocW76LARLaYgC0lbza9fULjsplbWc8jnBVK8yV7q_Q5R59Qb8jxlqioaB6vS-TqXJOCI_wjx-NjI3fobMIFULW_S10ngMMKt76Rq_Y9-JJu0xt2mNEqegBoyqy2H3Y7j3ZGWrX29ZrMQwAnzvfjpQymsyW"
                      />
                    </div>
                  </div>
                  <div class="bg-surface-container-low p-6 rounded-lg">
                    <p class="font-medium text-on-surface leading-relaxed">
                      "老师，这道题关于多项式的合并同类项，我先提取了公因式
                      2x，然后再进行括号内的运算，得出的结果是 2x(x²+3)..."
                    </p>
                  </div>
                </div>
                <!-- Grading Controls -->
                <div class="space-y-8">
                  <div>
                    <label class="block font-headline font-extrabold text-xl mb-4 text-on-surface"
                      >打分 🖋️</label
                    >
                    <div class="flex items-center gap-4">
                      <input
                        class="w-32 h-20 text-4xl font-black text-center text-error border-4 border-error/20 focus:border-error focus:ring-0 rounded-xl bg-error/5 placeholder:text-error/20"
                        placeholder="0-100"
                        type="number"
                      />
                      <span class="text-4xl font-black text-outline-variant">/ 100</span>
                    </div>
                  </div>
                  <div>
                    <label class="block font-bold mb-4">快捷评语</label>
                    <div class="flex flex-wrap gap-3">
                      <button
                        class="px-5 py-2 bg-secondary/10 text-secondary border-2 border-secondary/20 rounded-full font-bold bouncy-hover"
                      >
                        🌟 完美解答
                      </button>
                      <button
                        class="px-5 py-2 bg-tertiary/10 text-tertiary border-2 border-tertiary/20 rounded-full font-bold bouncy-hover"
                      >
                        🤔 思路有点偏
                      </button>
                      <button
                        class="px-5 py-2 bg-primary/10 text-primary border-2 border-primary/20 rounded-full font-bold bouncy-hover"
                      >
                        👍 继续保持
                      </button>
                      <button
                        class="px-5 py-2 bg-error/10 text-error border-2 border-error/20 rounded-full font-bold bouncy-hover"
                      >
                        ✍️ 需要重写
                      </button>
                    </div>
                  </div>
                  <div>
                    <textarea
                      class="w-full rounded-lg border-2 border-surface-container-high bg-surface-container-low p-4 focus:ring-primary focus:border-primary font-medium"
                      placeholder="输入详细评语..."
                      rows="4"
                    ></textarea>
                  </div>
                  <div class="flex gap-4">
                    <button
                      class="flex-1 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
                    >
                      确认并保存
                    </button>
                    <button
                      class="px-8 py-4 bg-surface-container-high text-on-surface-variant font-bold rounded-full hover:bg-surface-container-highest transition-all"
                    >
                      存为草稿
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Student Card - More examples -->
          <div
            class="bg-surface-container-lowest rounded-lg candy-shadow overflow-hidden group opacity-60"
          >
            <div class="p-6 flex items-center justify-between flex-wrap gap-4">
              <div class="flex items-center gap-4">
                <img
                  alt="Student Avatar"
                  class="w-14 h-14 rounded-full object-cover grayscale"
                  data-alt="portrait of a focused teenage male student in a library setting cinematic lighting dark tones"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpEG3MB5YbRSfRItXnooeQil90stUqnJKNeJBFv5oqNPP2F4qO9B2mYveNLYjG4atVYxulPKo0o-WTVcuC_ims6QrBJQCFon3Xdoqo2MtNU_gYiWx8b-740NsnHIj46Vj6Ntb6Ck6WWgiApMSNsKWhg-G6L-RIixq-NwHuFioouA-50pWPEKEwoH4rlm_ITC0bPPGPWSQawqcgNR3RRz3z2y_dz_pp4n7aw6ocRBX2Qdunm-YOgDnR9rYp_qLjhWBfUNVOo_qNCFy0"
                />
                <div>
                  <h4 class="font-headline font-bold text-lg text-on-surface-variant">刘洋</h4>
                  <p class="text-xs font-medium italic">尚未提交</p>
                </div>
              </div>
              <button
                class="px-6 py-3 border-2 border-outline-variant text-on-surface-variant font-bold rounded-full cursor-not-allowed"
              >
                Grade 📝
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
    <!-- Floating Cloud Decors (Asymmetric Playground Style) -->
    <div class="fixed top-20 right-10 -z-10 opacity-10 animate-pulse pointer-events-none">
      <span class="material-symbols-outlined text-[120px]">cloud</span>
    </div>
    <div class="fixed bottom-40 left-80 -z-10 opacity-5 pointer-events-none">
      <span class="material-symbols-outlined text-[180px]">circle</span>
    </div>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped></style>
