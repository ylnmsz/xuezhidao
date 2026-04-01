<template>
  <div
    class="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
  >
    <div
      class="absolute top-[-10%] left-[-5%] w-96 h-96 opacity-30 floating-cloud"
      style="animation-delay: 0s"
    >
      <div class="w-full h-full bg-white rounded-full blur-3xl"></div>
    </div>
    <div
      class="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] opacity-20 floating-cloud"
      style="animation-delay: 2s"
    >
      <div class="w-full h-full bg-primary-fixed rounded-full blur-3xl"></div>
    </div>
    <div
      class="absolute top-1/4 right-[5%] w-64 h-64 opacity-25 floating-cloud"
      style="animation-delay: 4s"
    >
      <div class="w-full h-full bg-secondary-fixed rounded-full blur-2xl"></div>
    </div>

    <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10">
      <div class="hidden md:flex flex-col items-center justify-center text-center p-8">
        <div class="relative group">
          <img
            alt="Cute mascot help"
            class="w-64 h-64 object-contain transition-transform duration-500 group-hover:scale-110"
            data-alt="A cute 2D flat style blue robot mascot holding a giant magnifying glass, looking curious and helpful, candy-tech aesthetic"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-WajZTvxIWe0Io11vuUwDkKZ1hwL4_BguPCv5bOmHzTpXPf8F_CjovwwiSbmykUgjWqjE_nfunDA-rTljYQU7kBSReAoRPvTtLtxRzJKP60fg9I3rWV7jTauoWxZnSja9y7qPWeyJdtf97VToTmN_SVZ6_pBeq1-xQe_IigH3LrNuePk9miwyUlqlnDXjaRBcOSwXCpr0x2505JTldR4C3W6AQOxhoBzEyWVB4RzTfC1t8lGxqYyK0suLLYtdmihPb9cTDjysFa73"
          />
          <div
            class="absolute -top-4 -right-4 bg-tertiary-container text-on-tertiary-container p-3 rounded-xl shadow-xl rotate-12"
          >
            <span class="material-symbols-outlined text-3xl">psychology</span>
          </div>
        </div>
        <h1 class="font-headline font-extrabold text-4xl text-primary mt-8 tracking-tight">
          找回学习密码
        </h1>
        <p class="text-on-surface-variant mt-4 text-lg max-w-xs">
          别担心，我们的 AI 小助手会帮你找回访问权限，继续你的进阶之旅！
        </p>
      </div>

      <div
        class="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0_40px_60px_rgba(0,0,0,0.06)] border border-outline-variant/10"
      >
        <div class="md:hidden flex justify-center mb-8">
          <span class="font-headline font-black text-2xl text-primary tracking-tight"
            >Xue Zhi Dao</span
          >
        </div>
        <div class="flex justify-between items-center mb-10 relative">
          <div class="absolute top-1/2 left-0 w-full h-[4px] bg-surface-container-high -z-0"></div>
          <div class="relative z-10 flex flex-col items-center gap-2">
            <div
              class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline font-bold step-active transition-all"
            >
              1
            </div>
            <span class="text-xs font-label font-semibold text-primary">身份验证</span>
          </div>
          <div class="relative z-10 flex flex-col items-center gap-2">
            <div
              class="w-10 h-10 rounded-full bg-surface-container-highest text-outline flex items-center justify-center font-headline font-bold transition-all"
            >
              2
            </div>
            <span class="text-xs font-label font-semibold text-outline">重置密码</span>
          </div>
          <div class="relative z-10 flex flex-col items-center gap-2">
            <div
              class="w-10 h-10 rounded-full bg-surface-container-highest text-outline flex items-center justify-center font-headline font-bold transition-all"
            >
              3
            </div>
            <span class="text-xs font-label font-semibold text-outline">完成设置</span>
          </div>
        </div>

        <form class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-label font-bold text-on-surface-variant ml-2">
              绑定邮箱
            </label>
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                >mail</span
              >
              <input
                class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-4 focus:ring-primary-container/30 transition-all placeholder:text-outline-variant"
                placeholder="example@learning.com"
                type="email"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-label font-bold text-on-surface-variant ml-2"
              >验证码</label
            >
            <div class="flex gap-3">
              <div class="relative flex-1">
                <span
                  class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                  >verified_user</span
                >
                <input
                  class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-4 focus:ring-primary-container/30 transition-all placeholder:text-outline-variant"
                  placeholder="6位数字"
                  type="text"
                />
              </div>
              <button
                class="px-6 bg-secondary-container text-on-secondary-container font-label font-bold rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-sm whitespace-nowrap shadow-sm"
                type="button"
              >
                获取验证码
              </button>
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-label font-bold text-on-surface-variant ml-2"
              >新密码</label
            >
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                >lock</span
              >
              <input
                class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-4 focus:ring-primary-container/30 transition-all placeholder:text-outline-variant"
                placeholder="请输入8-16位强密码"
                type="password"
              />
            </div>
          </div>
          <div class="space-y-2">
            <label class="block text-sm font-label font-bold text-on-surface-variant ml-2"
              >确认新密码</label
            >
            <div class="relative">
              <span
                class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                >enhanced_encryption</span
              >
              <input
                class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-4 focus:ring-primary-container/30 transition-all placeholder:text-outline-variant"
                placeholder="请再次输入以确认"
                type="password"
              />
            </div>
          </div>
          <div class="pt-4">
            <button
              class="w-full py-4 bg-tertiary-container text-on-tertiary-fixed font-headline font-black text-lg rounded-full hover:scale-[1.03] active:scale-95 shadow-[0_15px_30px_rgba(254,157,0,0.25)] transition-all flex items-center justify-center gap-2"
              type="submit"
            >
              确认重置
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div class="text-center pt-2">
            <RouterLink
              to="/loginregistrationupdatedowl"
              class="inline-flex items-center gap-1 text-sm font-label font-bold text-primary hover:underline decoration-2 underline-offset-4"
            >
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              返回登录界面
            </RouterLink>
          </div>
        </form>
      </div>
    </div>

    <div class="fixed bottom-10 left-10 flex gap-4 opacity-50">
      <div class="w-3 h-3 rounded-full bg-primary"></div>
      <div class="w-3 h-3 rounded-full bg-secondary"></div>
      <div class="w-3 h-3 rounded-full bg-tertiary"></div>
    </div>
  </div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
.step-active {
  box-shadow: 0 0 20px rgba(64, 206, 243, 0.4);
}
.floating-cloud {
  animation: float 6s ease-in-out infinite;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
