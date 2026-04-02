<template>
  <div class="flex min-h-screen">
    <StudentSidebar />
    <TeacherTopNavbar profile-route="/teacherprofile" />

    <main class="flex-grow p-6 md:p-10 space-y-10 overflow-y-auto pt-24 md:pt-28 lg:ml-72">
      <header
        class="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-xl px-8 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sticky top-24 z-40"
      >
        <div class="flex items-center gap-4">
          <button
            class="material-symbols-outlined p-2 hover:bg-surface-container rounded-full transition-colors"
            @click="$router.push('/classmanagement')"
          >
            arrow_back
          </button>
          <h1 class="font-headline font-extrabold text-2xl text-cyan-600 tracking-tight">
            学情详情
          </h1>
        </div>
        <div class="flex items-center gap-6">
          <div
            class="hidden md:flex bg-surface-container-low px-4 py-2 rounded-full items-center gap-2"
          >
            <span class="material-symbols-outlined text-outline">search</span>
            <input
              class="bg-transparent border-none focus:ring-0 text-sm w-48"
              placeholder="搜索课程或报告..."
              type="text"
            />
          </div>
          <div class="flex gap-4">
            <span
              class="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer"
            >
              notifications
            </span>
            <span
              class="material-symbols-outlined text-outline-variant hover:text-primary cursor-pointer"
            >
              auto_awesome
            </span>
          </div>
        </div>
      </header>

      <section
        class="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_40px_60px_rgba(0,0,0,0.04)] relative overflow-hidden"
      >
        <div
          class="absolute top-0 right-0 w-64 h-64 bg-primary-container/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
        ></div>
        <div class="relative group">
          <div
            class="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden transform group-hover:scale-105 transition-transform duration-500"
          >
            <img
              class="w-full h-full object-cover"
              data-alt="close up portrait of a cheerful young asian student in casual attire with bright soft sunlight"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBse_jTpUWU9ugHahiL0Q6xcnO7Aco5gYsuxlX9OvlFwkpcEGMQADcDa9YsPopS7WvNEMW56s8OZ2yG7DLmPaaJpRfqzAYb2d0hGbLwHn0fJgLVUReAo9UUwTuH10fxLRa3dz5dB5nSGlGb7wMyGidhR5xU3wtPNDvayazCloIeaMCrGT2_SrrT8t3mNNhBH-BevQTASHE7dkOikmPT3GFKQd7aEvacs4Et2gbhufOqNbXBrTX5DgDNWIIldtJM8TOZLbiiTGDKlatr"
              alt="Student"
            />
          </div>
          <div
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-on-secondary text-xs px-3 py-1 rounded-full font-bold shadow-md"
          >
            LV.15 先锋
          </div>
        </div>
        <div class="flex-grow space-y-2 text-center md:text-left">
          <div class="flex flex-col md:flex-row md:items-center gap-3">
            <h2 class="text-3xl font-headline font-extrabold text-on-surface">林悦悦</h2>
            <span
              class="px-4 py-1 bg-primary-container text-on-primary-container rounded-full text-sm font-semibold"
              >三年级 A 班</span
            >
          </div>
          <p
            class="text-on-surface-variant flex items-center justify-center md:justify-start gap-2"
          >
            <span class="material-symbols-outlined text-sm">schedule</span>
            最近登录: 今天 09:45
          </p>
          <div class="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-tertiary"
            >
              <span class="block text-xs text-outline">总积分</span>
              <span class="font-bold text-tertiary">1,250</span>
            </div>
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-secondary"
            >
              <span class="block text-xs text-outline">完成作业</span>
              <span class="font-bold text-secondary">42/45</span>
            </div>
            <div
              class="px-4 py-2 bg-surface-container-low rounded-lg text-sm border-l-4 border-primary"
            >
              <span class="block text-xs text-outline">平均分</span>
              <span class="font-bold text-primary">92.5</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            发送评语
          </button>
          <button
            class="bg-surface-container text-on-surface px-8 py-3 rounded-full font-bold hover:bg-surface-container-high transition-all"
          >
            下载报告
          </button>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          class="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col"
        >
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-headline font-bold text-lg">学习活跃度趋势</h3>
            <select class="bg-surface text-xs border-none rounded-full px-4 focus:ring-primary">
              <option>近七天</option>
              <option>近一月</option>
            </select>
          </div>
          <div class="flex-grow h-64 relative flex items-end gap-2 group">
            <div
              class="relative flex-grow bg-primary-container/20 rounded-t-lg h-3/4 hover:bg-primary-container/40 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/30 rounded-t-lg h-1/2 hover:bg-primary-container/50 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/25 rounded-t-lg h-4/5 hover:bg-primary-container/45 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/40 rounded-t-lg h-2/3 hover:bg-primary-container/60 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/20 rounded-t-lg h-5/6 hover:bg-primary-container/40 transition-all cursor-pointer group/item border-t-4 border-primary"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/10 rounded-t-lg h-1/4 hover:bg-primary-container/30 transition-all cursor-pointer group/item"
            ></div>
            <div
              class="relative flex-grow bg-primary-container/15 rounded-t-lg h-1/3 hover:bg-primary-container/35 transition-all cursor-pointer group/item"
            ></div>
          </div>
          <div class="flex justify-between mt-4 text-xs text-outline px-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span
            ><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div
          class="bg-surface-container-lowest rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center"
        >
          <h3 class="font-headline font-bold text-lg mb-6 w-full text-left">学科雷达图</h3>
          <div class="relative w-48 h-48 flex items-center justify-center">
            <div class="absolute inset-0 border border-outline-variant/30 rounded-full"></div>
            <div class="absolute inset-4 border border-outline-variant/30 rounded-full"></div>
            <div class="absolute inset-8 border border-outline-variant/30 rounded-full"></div>
            <svg class="w-full h-full transform -rotate-18" viewBox="0 0 100 100">
              <polygon
                fill="rgba(64, 206, 243, 0.4)"
                points="50,10 90,40 80,85 20,85 10,40"
                stroke="#006479"
                stroke-width="1"
              ></polygon>
              <circle cx="50" cy="10" fill="#006479" r="3"></circle>
              <circle cx="90" cy="40" fill="#006479" r="3"></circle>
              <circle cx="80" cy="85" fill="#006479" r="3"></circle>
              <circle cx="20" cy="85" fill="#006479" r="3"></circle>
              <circle cx="10" cy="40" fill="#006479" r="3"></circle>
            </svg>
            <span class="absolute -top-4 text-[10px] font-bold text-primary">语文</span>
            <span class="absolute top-1/4 -right-8 text-[10px] font-bold text-secondary">数学</span>
            <span class="absolute bottom-0 -right-4 text-[10px] font-bold text-tertiary">英语</span>
            <span class="absolute bottom-0 -left-4 text-[10px] font-bold text-on-primary-container">
              科学
            </span>
            <span class="absolute top-1/4 -left-8 text-[10px] font-bold text-error">艺术</span>
          </div>
          <div class="mt-8 w-full space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-on-surface-variant">作业完成率</span>
              <span class="font-bold">98%</span>
            </div>
            <div class="h-3 bg-surface-container-high rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-secondary-fixed to-secondary w-[98%] rounded-full"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section class="bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div class="flex items-center gap-3 mb-6">
            <span
              class="material-symbols-outlined text-tertiary"
              style="font-variation-settings: 'FILL' 1"
              >warning</span
            >
            <h3 class="font-headline font-bold text-lg">近期错题分布</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-center gap-4 group">
              <div
                class="w-12 h-12 bg-tertiary-container/20 rounded-xl flex items-center justify-center text-tertiary font-bold"
              >
                12
              </div>
              <div class="flex-grow">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-semibold">几何图形应用</span>
                  <span class="text-xs text-outline">高频</span>
                </div>
                <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-tertiary w-3/4 rounded-full"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary-container/20 rounded-xl flex items-center justify-center text-primary font-bold"
              >
                08
              </div>
              <div class="flex-grow">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-semibold">古诗词背诵</span>
                  <span class="text-xs text-outline">中等</span>
                </div>
                <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-primary w-2/5 rounded-full"></div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary font-bold"
              >
                03
              </div>
              <div class="flex-grow">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-semibold">英语过去式</span>
                  <span class="text-xs text-outline">低频</span>
                </div>
                <div class="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div class="h-full bg-secondary w-1/5 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <button
            class="w-full mt-6 py-3 border-2 border-dashed border-outline-variant text-outline hover:border-primary hover:text-primary rounded-xl text-sm font-bold transition-colors"
          >
            生成针对性强化练
          </button>
        </section>

        <section class="bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-headline font-bold text-lg">最近作业</h3>
            <button
              class="text-primary text-sm font-bold cursor-pointer hover:underline"
              @click="$router.push('/studenthomeworklist')"
            >
              查看全部
            </button>
          </div>
          <div class="divide-y divide-surface-container-low">
            <div
              class="py-4 flex justify-between items-center hover:bg-surface-container-low transition-all px-2 rounded-lg cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-secondary text-sm">history_edu</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold">数学周测 - 第二单元</h4>
                  <p class="text-xs text-outline">提交于 昨天 18:20</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-headline font-black text-secondary">98</div>
                <div class="text-[10px] text-outline px-2 bg-secondary/10 rounded">优秀</div>
              </div>
            </div>
            <div
              class="py-4 flex justify-between items-center hover:bg-surface-container-low transition-all px-2 rounded-lg cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-primary text-sm">translate</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold">英语阅读理解 A</h4>
                  <p class="text-xs text-outline">提交于 前天 20:05</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-headline font-black text-primary">85</div>
                <div class="text-[10px] text-outline px-2 bg-primary/10 rounded">良好</div>
              </div>
            </div>
            <div
              class="py-4 flex justify-between items-center hover:bg-surface-container-low transition-all px-2 rounded-lg cursor-pointer"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-tertiary text-sm">science</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold">科学实验观察报告</h4>
                  <p class="text-xs text-outline">提交于 3天前</p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-lg font-headline font-black text-tertiary">72</div>
                <div class="text-[10px] text-outline px-2 bg-tertiary/10 rounded">及格</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center">
        <h4 class="font-headline font-bold text-xl mb-2 text-on-primary-container">AI 学情洞察</h4>
        <p class="text-on-surface-variant max-w-2xl mx-auto mb-6">
          林悦悦本周在逻辑思维方面表现优异，数学成绩提升显著。建议加强英语词汇的语境记忆，目前记忆曲线处于波动期。✨
        </p>
        <div class="flex justify-center gap-4">
          <button
            class="bg-white/80 border border-primary-container text-primary px-6 py-2 rounded-full text-sm font-bold hover:bg-white transition-colors"
          >
            查看详细 AI 建议
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
</style>
