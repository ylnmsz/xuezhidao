<template>
  <div class="flex min-h-screen">
    <StudentSidebar />
    <StudentTopNavbar />

    <main class="flex-1 p-8 overflow-y-auto pt-24 md:pt-28 lg:ml-72">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-primary">班级排行榜</h1>
          <p class="text-on-surface-variant mt-1">查看班级学习进度与优秀学员排名</p>
        </div>
        <div class="flex gap-4 items-center">
          <div
            class="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3 diffused-shadow cursor-pointer hover:bg-white transition-all"
          >
            <span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
            <span class="font-semibold text-on-surface">初三（2）班</span>
            <span class="material-symbols-outlined text-outline" data-icon="expand_more"
              >expand_more</span
            >
          </div>
          <div
            class="bg-surface-container-low px-6 py-3 rounded-full flex items-center gap-3 diffused-shadow cursor-pointer hover:bg-white transition-all"
          >
            <span class="material-symbols-outlined text-primary" data-icon="calendar_month"
              >calendar_month</span
            >
            <span class="font-semibold text-on-surface">本周</span>
            <span class="material-symbols-outlined text-outline" data-icon="expand_more"
              >expand_more</span
            >
          </div>
          <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container">
            <img
              alt="Avatar"
              class="w-full h-full object-cover"
              data-alt="Portrait of a friendly young female teacher with glasses and a professional but approachable smile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHkTyyUqAxP83VkSVPYKqf0kGQLnwiu-_vnGJRG7_8QSaN02hPMK6ovQnUrDAh-iQ1PYs-1fe8nS8tBaTRyYrKmomK8TEWGGu7ayz5-lEm2SnqN6GUi6nT0h9KfYomTf0mm-hgMAkMHpedE0m8ndjOmDH4bqR5u_64DiSKbFI0mTNCh67JN-sf7VgT45jKASQZuAuR1FKfROPf8XUQVskJnYZ5IHVhVxvnU5I-epjBFCrJW5mgkKxjoG-KoN0TOKdEPAWy-rHPi0ef"
            />
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 items-end">
        <div
          class="bg-surface-container-lowest p-8 rounded-lg diffused-shadow flex flex-col items-center relative transition-transform hover:scale-[1.03] duration-300"
        >
          <div
            class="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          >
            <span
              class="material-symbols-outlined text-slate-500"
              data-icon="workspace_premium"
              style="font-variation-settings: 'FILL' 1"
              >workspace_premium</span
            >
          </div>
          <div class="w-24 h-24 rounded-full border-4 border-slate-100 p-1 mb-4 overflow-hidden">
            <img
              alt="Student"
              class="w-full h-full object-cover rounded-full"
              data-alt="Cartoon avatar of a student boy with curly hair and a green sweater, high quality 3d style"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjTZj7PK-nz0OGXVcNmWfdVunjFQmvoXSaEPkFcCS5bnj0v8U8AWS2huu_LOB9JMw2JT-DVcRkAJgoK_MAwTVT1N7tVasmzdIszrE5Wp2MeMmACUSE86kbYQ1kfugMgS5815cUOkpthdx35IkdhXWwPQvwfQPXc0JGtGwqI5yu2w8gml97aCmmAtX8MrxueMbRsyCawLCPZ1Cjz7d0maEn7bo9dcdUcKJ517BaKNYG7xGkUg8gnAVtDQM0CYeTBn0PVybzDulQ4o3R"
            />
          </div>
          <h3 class="text-xl font-bold mb-1">王小明</h3>
          <p class="text-on-surface-variant text-sm mb-4">学霸之光</p>
          <div class="flex gap-4 w-full">
            <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
              <p class="text-xs text-on-surface-variant">积分</p>
              <p class="font-bold text-primary">2,840</p>
            </div>
            <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
              <p class="text-xs text-on-surface-variant">正确率</p>
              <p class="font-bold text-secondary">92%</p>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-primary-container to-white p-10 rounded-lg diffused-shadow flex flex-col items-center relative transform -translate-y-4 transition-transform hover:scale-[1.05] duration-300 z-10 border border-white/50"
        >
          <div
            class="absolute -top-8 left-1/2 -translate-x-1/2 bg-tertiary-container w-16 h-16 rounded-full flex items-center justify-center shadow-xl ring-4 ring-white"
          >
            <span
              class="material-symbols-outlined text-white text-3xl"
              data-icon="stars"
              style="font-variation-settings: 'FILL' 1"
              >stars</span
            >
          </div>
          <div
            class="w-32 h-32 rounded-full border-4 border-tertiary-container p-1 mb-6 overflow-hidden bg-white"
          >
            <img
              alt="Student"
              class="w-full h-full object-cover rounded-full"
              data-alt="Cartoon avatar of a happy student girl with pigtails and a bright yellow shirt, high quality 3d style"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAV4TF3j0bfO4e7l2-MI3GBCIphrUqgc2YUtMDBa7t_HkRm0KemmFLmmMeriijDTiUKb11Nko7YnWFqWZ7bugR3LhV8-Fb-1tJDsIz2Ed6dQopArm1DL4eWMNQBhyBT8sEw9LJt_aqMEHb0ZveNCbHR3sc0X2AD7rD-DOKYfz-CQMRHgxFrqHVw7r24H4r5P0mElwbHyjp6CErIzz6_ZAKq3it0KhoiPbObWp4Id9f6boGREpv55RAntJkO6FM4lAN2QZ5hipBrVuym"
            />
          </div>
          <h3 class="text-2xl font-extrabold mb-1">张雨涵</h3>
          <p class="text-primary font-semibold mb-6 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm" data-icon="bolt">bolt</span>
            学习先锋
          </p>
          <div class="flex gap-6 w-full">
            <div class="flex-1 bg-white/60 backdrop-blur-sm p-4 rounded-3xl text-center shadow-sm">
              <p class="text-xs text-on-surface-variant">积分</p>
              <p class="text-xl font-black text-primary">3,120</p>
            </div>
            <div class="flex-1 bg-white/60 backdrop-blur-sm p-4 rounded-3xl text-center shadow-sm">
              <p class="text-xs text-on-surface-variant">学习时长</p>
              <p class="text-xl font-black text-primary">12.5h</p>
            </div>
          </div>
        </div>

        <div
          class="bg-surface-container-lowest p-8 rounded-lg diffused-shadow flex flex-col items-center relative transition-transform hover:scale-[1.03] duration-300"
        >
          <div
            class="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
          >
            <span
              class="material-symbols-outlined text-tertiary"
              data-icon="military_tech"
              style="font-variation-settings: 'FILL' 1"
              >military_tech</span
            >
          </div>
          <div class="w-24 h-24 rounded-full border-4 border-orange-100 p-1 mb-4 overflow-hidden">
            <img
              alt="Student"
              class="w-full h-full object-cover rounded-full"
              data-alt="Cartoon avatar of a student boy with glasses and a hoodie, high quality 3d style"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBP9KrJmnJeZ53yJVVyQYGQxWhLw8Blqm3LorWZHEtMchqHI5tV2P19MUYyYRYe3TjxKQRyZVcSXIPrrsBAjZLHAO8H4jxEboxXQW2Jf2aKeKaQAqwXocUQWZXKzjeca2T0mRX2hl63T5_SZ-lBkaJTfXZWuQH4AzyOmmLElQKjHHWBpy5UGUC8kx1J2UQLNxKe4OQ2_uoAwEHX3DR6HRgNWOfT_d2In7V7yHmKWVjnikW5FVIM8HczBLR_gwU0olkyCJrcSsotD_pU"
            />
          </div>
          <h3 class="text-xl font-bold mb-1">李思睿</h3>
          <p class="text-on-surface-variant text-sm mb-4">勤奋达人</p>
          <div class="flex gap-4 w-full">
            <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
              <p class="text-xs text-on-surface-variant">积分</p>
              <p class="font-bold text-primary">2,650</p>
            </div>
            <div class="flex-1 bg-surface-container-low p-3 rounded-2xl text-center">
              <p class="text-xs text-on-surface-variant">正确率</p>
              <p class="font-bold text-secondary">88%</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-surface-container-lowest rounded-lg overflow-hidden diffused-shadow">
        <div class="p-6 border-b border-surface-container-low flex justify-between items-center">
          <h2 class="text-xl font-bold text-on-surface">全班排名详情</h2>
          <button
            class="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-semibold hover:scale-105 transition-all flex items-center gap-2"
          >
            <span class="material-symbols-outlined text-sm" data-icon="download">download</span>
            导出报表
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-on-surface-variant text-sm font-semibold">
                <th class="px-8 py-5">排名</th>
                <th class="px-8 py-5">学员</th>
                <th class="px-8 py-5">积分</th>
                <th class="px-8 py-5">学习时长</th>
                <th class="px-8 py-5">正确率</th>
                <th class="px-8 py-5 text-right">学习趋势</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-surface-container-low">
              <tr class="group hover:bg-primary-container/10 transition-colors">
                <td class="px-8 py-5">
                  <span
                    class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant"
                    >4</span
                  >
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
                      <img
                        alt="Student"
                        class="w-full h-full object-cover"
                        data-alt="3d cartoon student avatar"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW9iYosSqZDfbQhZMYyu6YKbZnb6S_JOL2uY5cJTKo6mySTcGe5n493gzSRrD9GODGBzSnPrZwzDDZWAAvI4cfrjH0q7hsQ0FKfvH2mwXkfcNOG1SjuVuapb2DnminjYG3DnJiAZLj43Wu34kqwThmYG2g_-dH4pimE4uVEIeT-emG8ZG0Qvwag9IP9-o4nw5Jm3NzbVyJ90E5gcjoPr5mlnRT4C5HMh_2_PvodxY3lyHvy1UsyuhrjP4XRvbUESkUtVD1QTR0baLU"
                      />
                    </div>
                    <span class="font-semibold text-on-surface">赵志远</span>
                  </div>
                </td>
                <td class="px-8 py-5 font-headline font-bold">2,410</td>
                <td class="px-8 py-5">9.2h</td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div class="bg-secondary h-full" style="width: 85%"></div>
                    </div>
                    <span class="text-sm font-medium">85%</span>
                  </div>
                </td>
                <td class="px-8 py-5 text-right">
                  <span class="material-symbols-outlined text-secondary" data-icon="trending_up"
                    >trending_up</span
                  >
                </td>
              </tr>
              <tr class="group hover:bg-primary-container/10 transition-colors">
                <td class="px-8 py-5">
                  <span
                    class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant"
                    >5</span
                  >
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
                      <img
                        alt="Student"
                        class="w-full h-full object-cover"
                        data-alt="3d cartoon student avatar"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQ-xYnzSnAznX7wGret_InH1GEk-XlVcjZsTP9K09SZAy6FFEQtae-iaTnGYAkS-FzaYnYZE0wOV4-2w8QSjymrIUbuOuYVLOQV1Kqr6vfFt5h-7cXZPNcC4WR16t24V1qON4CtIOU8IvQAzdgLfHIe-kq6ZuxusWUv48bWMdwzKE5K-QiMD-dvlOWN16N_fUgxI50hkKcCfB5Uz4_TPYd1jVPYajzgLDbd6zhQ7becVuJmzjZww8rlpkg__QoJLHIxLy9Jk3jdG2Q"
                      />
                    </div>
                    <span class="font-semibold text-on-surface">刘美含</span>
                  </div>
                </td>
                <td class="px-8 py-5 font-headline font-bold">2,380</td>
                <td class="px-8 py-5">8.8h</td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div class="bg-secondary h-full" style="width: 82%"></div>
                    </div>
                    <span class="text-sm font-medium">82%</span>
                  </div>
                </td>
                <td class="px-8 py-5 text-right">
                  <span class="material-symbols-outlined text-tertiary" data-icon="trending_flat"
                    >trending_flat</span
                  >
                </td>
              </tr>
              <tr class="group hover:bg-primary-container/10 transition-colors">
                <td class="px-8 py-5">
                  <span
                    class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-surface-variant"
                    >6</span
                  >
                </td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high">
                      <img
                        alt="Student"
                        class="w-full h-full object-cover"
                        data-alt="3d cartoon student avatar"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTFg8YOLrVw7g40QI1XOxcXi-fNfMPNlqkrHWDR_Ov956Ng7XJh-nVa8ZPRDz8qU028BK07Eu5D34Pw3mFMKWUb4HGlIPwOuExjUhfDgNEDU3w2d6tcqqKifEaEbexfxXVFdg7hBAfg6u2i9y62ldQ3SSig1xOIHdVn9gmceQmAXn_3nJwFtjDqWLc300Ghvp0R7TZuCvd1iqa88H5gKptHzygrLGgbyxxz--syW5d9QIRFeX0qvCUDgmPeWBjGSCoWTUML_UDoeAL"
                      />
                    </div>
                    <span class="font-semibold text-on-surface">陈子豪</span>
                  </div>
                </td>
                <td class="px-8 py-5 font-headline font-bold">2,150</td>
                <td class="px-8 py-5">7.5h</td>
                <td class="px-8 py-5">
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div class="bg-secondary h-full" style="width: 78%"></div>
                    </div>
                    <span class="text-sm font-medium">78%</span>
                  </div>
                </td>
                <td class="px-8 py-5 text-right">
                  <span class="material-symbols-outlined text-error" data-icon="trending_down"
                    >trending_down</span
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-6 bg-surface-container-low text-center">
          <button class="text-primary font-bold hover:underline transition-all">
            查看全部 45 名学生
          </button>
        </div>
      </div>

      <footer
        class="mt-12 p-8 rounded-lg bg-tertiary-container/10 border border-tertiary-container/20 flex items-center gap-6"
      >
        <div
          class="w-16 h-16 bg-tertiary-container rounded-3xl flex items-center justify-center text-white shrink-0"
        >
          <span
            class="material-symbols-outlined text-3xl"
            data-icon="lightbulb"
            style="font-variation-settings: 'FILL' 1"
            >lightbulb</span
          >
        </div>
        <div>
          <h4 class="font-bold text-on-tertiary-container text-lg">教学建议</h4>
          <p class="text-on-surface-variant">
            本周班级平均正确率提升了
            <span class="text-secondary font-bold">5%</span
            >！建议针对“代数基础”模块对排名前5的学生进行进阶挑战，并对排名后10的学生进行重点辅导。
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
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
.diffused-shadow {
  box-shadow: 0 40px 60px -15px rgba(0, 100, 121, 0.08);
}
</style>
