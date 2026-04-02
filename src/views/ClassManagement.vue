<template>
  <div class="flex min-h-screen">
    <TeacherSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />

    <!-- Main Content -->
    <main class="flex-1 lg:ml-72 p-4 md:p-10 space-y-10 pt-24">
      <div class="space-y-12">
        <!-- Class Grid (Bento Style) -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Class Card 1 -->
          <div
            class="lg:col-span-2 relative group overflow-hidden bg-gradient-to-br from-primary-container/40 to-secondary-container/30 p-8 rounded-xl border border-outline-variant/15 hover:shadow-2xl transition-all duration-500"
          >
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex justify-between items-start">
                <div>
                  <span
                    class="bg-white/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary mb-3 inline-block"
                    >初中部</span
                  >
                  <h3 class="text-3xl font-black font-headline text-on-primary-container">
                    初二(3)班
                  </h3>
                  <p class="text-on-surface-variant mt-2">语文核心素养提升班</p>
                </div>
                <div class="flex -space-x-3">
                  <img
                    class="w-10 h-10 rounded-full border-4 border-white object-cover"
                    data-alt="portrait of a young student girl with glasses smiling"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ZUWUVBl_C4dqCzW15_X3-JJWPknL0hHQsl4YaR86WG7wfbzf3XC0Bv4wZyvHJg9lOf_iusm0v8_oD9mz9lDOl7o3zt7RfMQZK8tmR3cOC9OFFpbLzVo1V6UvPjgW4ukTQUNqQUgWTfH00zyjNBeb100xyHi_43PrTFP4J_weT3Px-fCdKj2S5Sk_pxPReB3KYRYdTfDA4OenVult7JYblcERSHPxjhLZr6B6pMFGI-aZmNX8u0x1Yh2su7V1IPJgHsjodzdWQDzu"
                  />
                  <img
                    class="w-10 h-10 rounded-full border-4 border-white object-cover"
                    data-alt="close up of a happy young boy student"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcyQj1SdK3KFyA6g1yoSZ7FQz0i_D7nTCZ_So_BW1aO8Qu5_sETdGS6I9BAG88IkAS6ELm7damzYRr2GFdLOh89etJyVngl5Atzb3D2QbT9KF5srpeS5UGHTXfhUNNI_gHyWx1G2_LUaCCsfO9OXaqcoQ91fIku51PShQERJGS12zjUmj2wewB92aTpNCsSkCMWe8UE4QHAt8DcDP6uqwoWPsIyigW_iSylIGKlrvx91YjPqDwI7rVNEV1eJZiARhUoVyeWC0DFA-V"
                  />
                  <div
                    class="w-10 h-10 rounded-full border-4 border-white bg-primary text-white flex items-center justify-center text-xs font-bold font-headline"
                  >
                    +42
                  </div>
                </div>
              </div>
              <div class="mt-8 grid grid-cols-2 gap-6">
                <div class="bg-white/40 backdrop-blur-lg rounded-lg p-5 border border-white/40">
                  <p class="text-xs font-bold text-on-surface-variant/60 uppercase">本周活跃度</p>
                  <div class="flex items-end justify-between mt-2">
                    <span class="text-4xl font-black text-on-surface">94%</span>
                    <div
                      class="h-12 w-12 rounded-full border-4 border-primary border-r-transparent animate-spin-slow"
                    ></div>
                  </div>
                </div>
                <div class="bg-white/40 backdrop-blur-lg rounded-lg p-5 border border-white/40">
                  <p class="text-xs font-bold text-on-surface-variant/60 uppercase">作业完成率</p>
                  <div class="flex items-end justify-between mt-2">
                    <span class="text-4xl font-black text-on-surface">88%</span>
                    <div class="flex gap-1">
                      <div class="w-1.5 h-6 bg-secondary rounded-full"></div>
                      <div class="w-1.5 h-8 bg-secondary rounded-full"></div>
                      <div class="w-1.5 h-5 bg-secondary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"
            ></div>
          </div>
          <!-- Side Stats Card -->
          <div
            class="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/15 flex flex-col justify-between relative overflow-hidden group"
          >
            <div>
              <h4 class="text-xl font-bold font-headline mb-6">班级动态汇总</h4>
              <div class="space-y-6">
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary"
                  >
                    <span class="material-symbols-outlined">emoji_events</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold">新增 3 位荣誉学员</p>
                    <p class="text-xs text-on-surface-variant">刚刚</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary"
                  >
                    <span class="material-symbols-outlined">auto_graph</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold">平均分提升了 5.2%</p>
                    <p class="text-xs text-on-surface-variant">2小时前</p>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div
                    class="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error"
                  >
                    <span class="material-symbols-outlined">warning</span>
                  </div>
                  <div>
                    <p class="text-sm font-bold">5 位学员作业待批改</p>
                    <p class="text-xs text-on-surface-variant">5小时前</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              class="mt-8 w-full py-4 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all"
              @click="$router.push('/teacherrankings')"
            >
              查看全班排名
            </button>
          </div>
        </section>
        <!-- Student Roster Section -->
        <section class="space-y-6">
          <div class="flex justify-between items-center px-2">
            <h3 class="text-2xl font-bold font-headline flex items-center gap-3">
              学员名单
              <span
                class="text-sm font-normal bg-surface-container-high px-3 py-1 rounded-full text-on-surface-variant"
                >45 位学员</span
              >
            </h3>
            <div class="flex gap-4">
              <div class="relative">
                <span
                  class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  >search</span
                >
                <input
                  class="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary/50 w-64 text-sm"
                  placeholder="搜索学生姓名..."
                  type="text"
                />
              </div>
            </div>
          </div>
          <!-- Custom Roster Layout -->
          <div
            class="bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/10 shadow-sm"
          >
            <div
              class="grid grid-cols-12 gap-4 px-8 py-4 bg-surface-container-low text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider"
            >
              <div class="col-span-4">基本信息</div>
              <div class="col-span-2">等级荣誉</div>
              <div class="col-span-3">学习进度</div>
              <div class="col-span-3 text-right">操作</div>
            </div>
            <!-- Student Row 1 -->
            <div
              class="grid grid-cols-12 gap-4 px-8 py-6 items-center border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-all"
            >
              <div class="col-span-4 flex items-center gap-4">
                <div class="relative">
                  <img
                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    data-alt="portrait of a focused young student boy in a blue sweater"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBigTH5ILP2IUhDkhA8sc1NIznSLFopZBFgG5zAmvEDV3e2awuZt1XWkii_bJ9iy-Plhcnhmxa_yNrMxzo5vcfKxLRx01Vp9prJ7RHME-UvGYdrn7rbstWbp8VCyKJY1XYyzX860YYrNqWHQKudcgUDenomCUA1Z2V72aZzXxgpHT1ZHsJHUTwf3RLFRKvxalQXHIxqrhwP3z3hskxvumNRw_vDO0Zmbo4UUuFI-3EWsddxNyvo_tGCZIj9TusatT-k3eJ6NsaOnIqa"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                <div>
                  <p class="font-bold text-on-surface">李小明</p>
                  <p class="text-xs text-on-surface-variant">ID: 20240901</p>
                </div>
              </div>
              <div class="col-span-2">
                <span
                  class="bg-tertiary-container/20 text-tertiary-dim text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  >Lv.12 知识先锋</span
                >
              </div>
              <div class="col-span-3">
                <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-secondary-fixed-dim to-secondary h-full w-[85%] rounded-full"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-[10px] font-bold text-on-surface-variant"
                    >已完成 24/28 课时</span
                  >
                  <span class="text-[10px] font-bold text-secondary">85%</span>
                </div>
              </div>
              <div class="col-span-3 flex justify-end gap-3">
                <button
                  class="px-4 py-2 rounded-full bg-white border border-outline-variant text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                  @click="$router.push('/messages')"
                >
                  <span class="material-symbols-outlined text-sm">chat_bubble</span>
                  发私信 💬
                </button>
                <button
                  class="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:scale-105 transition-all flex items-center gap-1"
                  @click="$router.push('/studentanalytics')"
                >
                  <span class="material-symbols-outlined text-sm">analytics</span>
                  查看详情 📊
                </button>
              </div>
            </div>
            <!-- Student Row 2 -->
            <div
              class="grid grid-cols-12 gap-4 px-8 py-6 items-center border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-all"
            >
              <div class="col-span-4 flex items-center gap-4">
                <div class="relative">
                  <img
                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    data-alt="portrait of a cheerful schoolgirl with pigtails and a bright backpack"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2HdYv9cHR5diWa7Kj9CE6bg-FU8okVd8tbzX-sn_mnXqwN5t5W5W2xZE62MAv3tIVCn9L-Oh-YUM0BrVTvsrHj7jiJzUOT_GdFQ2RLM8HMYSTNqdPPb_k1tyxtniM7Mq4mQOysVfdbVNcWBjufObV5RNqmiaHj9TPdJ4O-cJ61XHMrR9KEFOgMVG7R6XA9yCSBqtQ_10_3T0LE7vLKq8WQsJjIL5ZS1F6z7ADXCyxfRsUkMKw4IV0bWmhmSabkKwNY0a2CpAX5ne_"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                  ></div>
                </div>
                <div>
                  <p class="font-bold text-on-surface">张诗语</p>
                  <p class="text-xs text-on-surface-variant">ID: 20240915</p>
                </div>
              </div>
              <div class="col-span-2">
                <span
                  class="bg-secondary-container/20 text-on-secondary-container text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  >Lv.10 努力小天才</span
                >
              </div>
              <div class="col-span-3">
                <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-tertiary-fixed-dim to-tertiary-fixed h-full w-[60%] rounded-full"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-[10px] font-bold text-on-surface-variant"
                    >已完成 15/28 课时</span
                  >
                  <span class="text-[10px] font-bold text-tertiary">60%</span>
                </div>
              </div>
              <div class="col-span-3 flex justify-end gap-3">
                <button
                  class="px-4 py-2 rounded-full bg-white border border-outline-variant text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                  @click="$router.push('/messages')"
                >
                  <span class="material-symbols-outlined text-sm">chat_bubble</span>
                  发私信 💬
                </button>
                <button
                  class="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:scale-105 transition-all flex items-center gap-1"
                  @click="$router.push('/studentanalytics')"
                >
                  <span class="material-symbols-outlined text-sm">analytics</span>
                  查看详情 📊
                </button>
              </div>
            </div>
            <!-- Student Row 3 -->
            <div
              class="grid grid-cols-12 gap-4 px-8 py-6 items-center border-b border-outline-variant/10 hover:bg-surface-container-lowest/50 transition-all"
            >
              <div class="col-span-4 flex items-center gap-4">
                <div class="relative">
                  <img
                    class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    data-alt="smiling teenage boy with short black hair wearing a simple white t-shirt"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMRKHHKtbfJzAtiKTr3PHEdSAjqVV_qo4owWw05wco8yNKKvxB3Hw359HTmx7RXqSzZIKwrIteBZoQkNcLH93G9Ko-pq-qfrhcuRZUotEoKyzhIohbcBElrYXHzcq8SZjRJ7x9xLwvc2eDl0WChqBRm8v681hOAi_fBl1AmgjGcaLIZ8rg8kQEwHmDihmhRfVHFjmCEW0mXNUL-cS-hQA-Cqs3y8UBvhDjTGllofy2MXpEA4pvb65aDkYFFl0a3aFZZR8ZqQhBa4zU"
                  />
                  <div
                    class="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-300 border-2 border-white rounded-full"
                  ></div>
                </div>
                <div>
                  <p class="font-bold text-on-surface">王嘉铭</p>
                  <p class="text-xs text-on-surface-variant">ID: 20240922</p>
                </div>
              </div>
              <div class="col-span-2">
                <span
                  class="bg-primary-container/20 text-on-primary-container text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  >Lv.08 进取少年</span
                >
              </div>
              <div class="col-span-3">
                <div class="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-secondary-fixed-dim to-secondary h-full w-[92%] rounded-full"
                  ></div>
                </div>
                <div class="flex justify-between mt-1">
                  <span class="text-[10px] font-bold text-on-surface-variant"
                    >已完成 26/28 课时</span
                  >
                  <span class="text-[10px] font-bold text-secondary">92%</span>
                </div>
              </div>
              <div class="col-span-3 flex justify-end gap-3">
                <button
                  class="px-4 py-2 rounded-full bg-white border border-outline-variant text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1"
                  @click="$router.push('/messages')"
                >
                  <span class="material-symbols-outlined text-sm">chat_bubble</span>
                  发私信 💬
                </button>
                <button
                  class="px-4 py-2 rounded-full bg-primary-container text-on-primary-container text-xs font-bold hover:scale-105 transition-all flex items-center gap-1"
                  @click="$router.push('/studentanalytics')"
                >
                  <span class="material-symbols-outlined text-sm">analytics</span>
                  查看详情 📊
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
  <!-- Mobile Navigation Suppressed for task focus as per guidelines -->
  <!-- Floating Quick Action Button -->
  <button
    class="fixed bottom-8 right-8 w-16 h-16 bg-tertiary shadow-2xl shadow-tertiary/40 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
  >
    <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1"
      >bolt</span
    >
  </button>
</template>

<script setup>
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
</script>

<style scoped></style>
