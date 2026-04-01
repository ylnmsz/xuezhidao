<template>
  <div class="bg-surface font-body text-on-surface flex min-h-screen overflow-hidden">
    <StudentSidebar />
    <StudentTopNavbar />

    <main class="flex-1 flex flex-col md:flex-row h-full overflow-hidden lg:ml-72 pt-24 md:pt-28">
      <section
        class="w-full md:w-80 bg-surface-container-low border-r border-outline-variant/10 flex flex-col h-full overflow-hidden"
      >
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h1 class="font-headline font-extrabold text-2xl tracking-tight text-on-surface">
              私信
            </h1>
            <button
              class="p-2 bg-surface-container-highest rounded-full text-on-surface-variant hover:scale-110 transition-transform"
            >
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full ring-2 ring-primary-container ring-offset-2 p-0.5"
            >
              <img
                alt="Student Story"
                class="rounded-full bg-secondary-container"
                data-alt="Stylized illustrated avatar of a female student with a bright yellow background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzE-7jxPHybMhPFjSynJzNINrTKZM3m-9A0dW9W6OilNbaVeYXSF2QwK0DkSaW1ww77cHgEZ7cm6wSf-CGZFNCMwABRT8b3Pc3QevtcOPQqrN8TzheEmnLojJrIoZy1BNiVI42pGLjL7Df1of5yoowd0cAhsf_SukIvdIKVcH0jasaRJU4oA-uqqdc1WV6EqMBPLarEzhh9m6qk7UsU3jEybaXLRSG3kzsPDeO2jWg0OhSPmnbeUCSpxBcmZFU01u0XI7OfrlGEFdb"
              />
            </div>
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full ring-2 ring-tertiary-container ring-offset-2 p-0.5"
            >
              <img
                alt="Student Story"
                class="rounded-full bg-primary-container"
                data-alt="Stylized illustrated avatar of a male student with a soft blue background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOOXYpxVJjBBYJgaNX7QzKaKxnlaVxvyf_3uMrr1TsVaZPpWhgyxMFvgZhf7oBIAEPn01A2tHsdwG6XdL1tOjMUygW0hIK0Wv7itAog3wDra_mNCGWM0AYnzjhVbUWeeuM4ErTQp9uEewhOYRZmStBqITy3XKsfJo9FRiTCZMi9EZ3f3z4yCeVmJ1L1kBhRKwHpCJPk5NYlgFMUBoM65Ek19PbV9hPodROv1yIDMsuT0OlBXUN8TGNUYp0OLCiJfGEUCK7bt91iB8X"
              />
            </div>
            <div
              class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-outline-variant/20 p-0.5"
            >
              <img
                alt="Student Story"
                class="rounded-full bg-surface-container-high"
                data-alt="Stylized illustrated avatar of a female student with a neutral gray background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB03PZMHLQnlmuQNzVzZ5tA4R45x4Slbb8YLdk4SLfUPIFQyKqjUd7VVlLrI6tZvnq72Xle9fAXEyb_e8bzxGPeLEXS7PODVsxhOhVSgZlW6VJcGb-WhSCHapb7fMCzrT8YJqWVvvL3KoJiZAlIPV9N-n1v4atDNWVU_lTNSG1iikh_sr3CLNn_3DUgcw-euNMqGIBWo69fkTC68Ihal9sPchzf0TggcCbx3gb0asP8Bx4WpYU2ZerPbPzeuh4k6NB0JZg-iiTOqr_F"
              />
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2 pb-10">
          <div
            class="p-4 bg-surface-container-lowest rounded-lg soft-glow flex items-center gap-4 cursor-pointer border-l-4 border-primary"
          >
            <div class="relative">
              <img
                alt="Lily"
                class="w-14 h-14 rounded-2xl bg-secondary-container"
                data-alt="A cheerful student illustration with high ponytail and glasses"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLys3bcUhNsmbI7QXTtTiJ8PSzn5R-mVMKpyuqo_ptNJCDgu5OVA5xteeRMGOX8Hkx_kZid2w1St57IcrXTi-JyOk_0t1-5DFyyMnokOWQlut1Wh4qs8Mdy0wAd-ucA1IzAXDdHT4Jsh--4BYVRN4zCfbKaW0p-sR-D24u60A5Y04k-gHJdLYKZzDp-yXzpy-Mh_09b-UmX7nT9BbeiKPUqR0t8K1b20_B6xU-28HUI1PENNH4tZgUkgoJCl9rAUw1bSLruiO1RSj9"
              />
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <h3 class="font-headline font-bold text-on-surface truncate">李小华</h3>
                <span class="text-[10px] text-on-surface-variant font-medium">14:20</span>
              </div>
              <p class="text-sm text-on-surface-variant truncate">老师，这次的数学作业我...</p>
            </div>
            <div
              class="w-5 h-5 bg-tertiary-container text-[10px] font-bold text-white flex items-center justify-center rounded-full"
            >
              2
            </div>
          </div>
          <div
            class="p-4 hover:bg-surface-container-highest rounded-lg flex items-center gap-4 cursor-pointer transition-colors"
          >
            <div class="relative">
              <img
                alt="Tom"
                class="w-14 h-14 rounded-2xl bg-primary-container"
                data-alt="Cartoon avatar of a young boy with messy hair and a curious expression"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmZO0bnlSZ9eJC3HVkEwyQoyhdiaU-4NUdMcFNW1IY4xEvE6l4yojndloo06Hb3KtuMupVN3p8nHxSd1b19qvQUE9IPm9ZSEl1jcfteJzGdcdwG4PM3lN4K7H2O2qD8nVrAeG6p_OHoCfvtiCruZuqPf_7c3TzW4hgaB4291bTJnRHk3yYGL_6Qsj_zIr3pfAZBMsnQegKwvyjg-AO6Blj3RM96VdbLCvUHc2P248qD_Gsv1BLKIs_NUT--JBlk2kJy-JUuGZ0bLZd"
              />
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-outline-variant rounded-full border-2 border-white shadow-sm"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <h3 class="font-headline font-semibold text-on-surface truncate">张大明</h3>
                <span class="text-[10px] text-on-surface-variant">昨天</span>
              </div>
              <p class="text-sm text-on-surface-variant truncate">谢谢老师！我已经理解了！</p>
            </div>
          </div>
          <div
            class="p-4 hover:bg-surface-container-highest rounded-lg flex items-center gap-4 cursor-pointer transition-colors"
          >
            <div class="relative">
              <img
                alt="Sasha"
                class="w-14 h-14 rounded-2xl bg-tertiary-container/30"
                data-alt="Chibi style student avatar with a red hat and cheerful face"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLE6TGyeV0VCzLLQ1yEp_lyJCOn7uvG1AzXP9kqdD0mmd0Ave4y_18MMHswN96blaeXMuOGuNRXyh0FLlDiB0QYr4wVqzHx3ctSKZe3t4V423C6kMoypMuzp3zm-b8VSySj0oCII7lJ5ftbDOwPk66_uUUsHI16jLDvUv-1emU_52iPg15rQplqgogvYSzrSYjHIu6za9gEtpJVnsNuYZxqmdoeB75CYaW_GQNhKSQe9h3Z6QXe_tp_SULSttFj0sIjKUMD1WMCZke"
              />
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-white shadow-sm"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-center mb-1">
                <h3 class="font-headline font-semibold text-on-surface truncate">王美美</h3>
                <span class="text-[10px] text-on-surface-variant">10:45</span>
              </div>
              <p class="text-sm text-on-surface-variant truncate">图片已发送给您，请查收。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="flex-1 flex flex-col h-full bg-surface">
        <header
          class="h-20 px-8 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-secondary-container rounded-2xl overflow-hidden shadow-sm">
              <img
                alt="Lily Header"
                data-alt="Student profile photo with soft lighting and candy-colored background"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZWp07ai7m_iqFR8ldzDysjydP1LB5S_vSxzp1pIIGAHWr4iPgvaztjexUhhbshgrKzeNNZu2TBVGih-dYZAQdtB2DVyHUbNJWPtyfM7NtyCFmPYl3AdgLLpKiGSL5O421gVUrwzoFF8FjSr1vnv6B59Qz9xIRatlRv1Cm_Qle5XvzRnjF_KSKMSiqiAn0Oct5nLKjF7IDKgzvWWUTznOeBQs03-1XajA4vj1gEn7xqVFkVsHkSJ9QvQeJrwSZL8PC6Qk9g94JoQvH"
              />
            </div>
            <div>
              <h2 class="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                李小华
                <span
                  class="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                  >LV.15 优等生</span
                >
              </h2>
              <div class="flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-secondary rounded-full"></div>
                <span class="text-xs text-on-surface-variant">正在线学习《初级奥数》</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="hidden lg:flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-2.5 rounded-full font-headline font-bold text-sm shadow-md hover:scale-105 transition-transform active:scale-95"
            >
              <span class="material-symbols-outlined text-lg">notifications_active</span>
              发送作业提醒
            </button>
            <button
              class="p-3 bg-surface-container-low text-on-surface-variant rounded-2xl hover:bg-surface-container-high transition-colors"
            >
              <span class="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-surface/50">
          <div class="flex justify-center">
            <span
              class="text-xs font-medium text-on-surface-variant/60 bg-surface-container-high px-4 py-1 rounded-full"
            >
              今天 14:02
            </span>
          </div>
          <div class="flex items-end gap-3 max-w-[80%]">
            <img
              alt="Lily"
              class="w-10 h-10 rounded-xl bg-secondary-container shadow-sm"
              data-alt="Small student icon"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvdoU51Ia8SruvhtnEgbJDf05bhooY3jPs8jIEvkDwMTokEKRs4DfoqVdqihAqX7g_GWw64k6vJFsFDNlf-2VP9zjkR4Vdu3x4yYPOa4V9yhmpXYVJDrFSGuehr0d5izfwolfVS00jn0OD3BbdB1_VberxXAbQt2xoZBSxfUzB8G1SqlCYgvDsGgIuU7hJrNRBPkpvdqd9nsm97o7TrlySTWPIM3gFYIwprTr1kD48x4WpvGVgsZYDtrn2qoTI9HNijK3PiKULPTFN"
            />
            <div>
              <div class="bg-white p-5 rounded-t-[2rem] rounded-br-[2rem] rounded-bl-md soft-glow">
                <p class="text-on-surface leading-relaxed">
                  老师好！请问刚才课上讲的那个二次函数公式，b^2-4ac
                  这里的判别式如果小于0，图像是不是就不和x轴相交了呀？🤔
                </p>
              </div>
              <span class="text-[10px] text-on-surface-variant mt-2 inline-block ml-1">14:05</span>
            </div>
          </div>
          <div class="flex flex-row-reverse items-end gap-3 max-w-[80%] ml-auto">
            <div
              class="w-10 h-10 rounded-xl bg-primary-container shadow-sm flex items-center justify-center overflow-hidden"
            >
              <img
                alt="Teacher"
                data-alt="Teacher avatar icon"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU50Duu2F7YnPQTIy8tSiOKJaSwTrvn7b0Na_7USH6VbOMFZW3C8metyex1fzO9Q7zdaK2gS4cUtSgQlvJy4q4b5T33UD5EJXk_ODd_8JYUbg9uK3820PB0LDsVmWEkz4QMs8nWx1xydM8iAEsf5C5POQsmBJLfLi-Do9l2uDDCLFyd7hHNY48lO4CD07R_AsxDLVMZRcVC28Nyp7AGnmv88eMyokB6w9YbLAmp9A_EVBn6n9Osr36xELtqIpBk2Xu8jdMigbGVaHk"
              />
            </div>
            <div class="flex flex-col items-end">
              <div
                class="bg-secondary-container/30 backdrop-blur-sm p-5 rounded-t-[2rem] rounded-bl-[2rem] rounded-br-md soft-glow border border-secondary/10"
              >
                <p class="text-on-surface leading-relaxed text-right">
                  没错！小华观察得很仔细。判别式小于0意味着方程没有实数根，反映在图像上就是抛物线完全在x轴上方或下方，没有交点。👏
                </p>
              </div>
              <span class="text-[10px] text-on-surface-variant mt-2 mr-1">14:15</span>
            </div>
          </div>
          <div class="flex items-end gap-3 max-w-[80%]">
            <img
              alt="Lily"
              class="w-10 h-10 rounded-xl bg-secondary-container"
              data-alt="Small student icon"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu7onVOWFzC1HZbNHDkFrENk1SsBHjabu67n6IMdpX_jCHBQG52yy8pT1SD50PXpi2NSEmhaT1aFXw1Hq00_X_-Lbmi-gnsrFTyWDb2NyCU_2IX0nmCsVamWotmslkLzaGVqvqMIc7YrAYE25HxElhS7NlQ4YJkGGD00Wvd-MtH9351wzeZLWMeqOar11UJxc4d6QokxbdDdjs-J5MeVV-9O_REYbF7Tcz1VDW2jkZQ7V-fEV9nOQazvPHEsF3k77ctujAKIOadg0r"
            />
            <div>
              <div class="bg-white p-5 rounded-t-[2rem] rounded-br-[2rem] rounded-bl-md soft-glow">
                <p class="text-on-surface">太棒了！我这就去把这道思考题补齐，老师辛苦了！✨</p>
              </div>
              <span class="text-[10px] text-on-surface-variant mt-2 inline-block ml-1">14:20</span>
            </div>
          </div>
          <div class="flex flex-row-reverse items-end gap-3 max-w-[80%] ml-auto">
            <div class="w-10 h-10 rounded-xl bg-primary-container shadow-sm"></div>
            <div class="flex flex-col items-end">
              <div
                class="bg-on-tertiary p-3 rounded-2xl soft-glow flex items-center gap-4 border border-tertiary-container/20"
              >
                <div
                  class="w-12 h-12 bg-tertiary-container/20 rounded-xl flex items-center justify-center"
                >
                  <span class="material-symbols-outlined text-tertiary">picture_as_pdf</span>
                </div>
                <div class="pr-2">
                  <p class="text-xs font-bold text-on-tertiary-container">二次函数拓展练习.pdf</p>
                  <p class="text-[10px] text-on-tertiary-container/60">1.2 MB</p>
                </div>
              </div>
              <span class="text-[10px] text-on-surface-variant mt-2 mr-1">刚刚 · 已送达</span>
            </div>
          </div>
        </div>

        <footer class="p-6 bg-white/60 backdrop-blur-xl border-t border-outline-variant/10">
          <div
            class="max-w-4xl mx-auto bg-surface-container-lowest rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl shadow-slate-200/50"
          >
            <div class="flex items-center gap-1 pl-2">
              <button
                class="w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <span class="material-symbols-outlined">sentiment_satisfied</span>
              </button>
              <button
                class="w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <span class="material-symbols-outlined">add_circle</span>
              </button>
            </div>
            <input
              class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 placeholder:text-on-surface-variant/40 font-medium"
              placeholder="输入消息内容..."
              type="text"
            />
            <div class="flex items-center gap-1 pr-1">
              <button
                class="w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center text-on-surface-variant"
              >
                <span class="material-symbols-outlined">mic</span>
              </button>
              <button
                class="bg-primary hover:bg-primary-dim w-12 h-12 rounded-full flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 hover:scale-105 transition-all active:scale-95"
              >
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1"
                  >send</span
                >
              </button>
            </div>
          </div>
          <p class="text-center text-[10px] text-on-surface-variant/40 mt-3 font-medium">
            学之道老师端 · 沟通让学习更有趣
          </p>
        </footer>
      </section>
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
  vertical-align: middle;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #adada9;
  border-radius: 10px;
}
.soft-glow {
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.04);
}
</style>
