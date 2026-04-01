<template>
  <header
    class="fixed top-0 left-0 lg:left-72 w-full lg:w-[calc(100%-18rem)] flex justify-between items-center px-6 h-20 bg-[#f7f6f1]/80 dark:bg-slate-900/80 backdrop-blur-xl z-40 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-none"
  >
    <div class="flex items-center gap-8">
      <span
        class="text-2xl font-black text-[#006479] dark:text-[#40cef3] tracking-tight font-headline lg:hidden"
      >
        Xue Zhi Dao
      </span>
      <!-- Currency/XP Bars (Game Style) -->
      <div class="hidden md:flex items-center gap-4 lg:pl-4">
        <!-- XP Bar -->
        <div class="flex items-center bg-surface-container-highest rounded-full px-3 py-1 gap-2">
          <span class="material-symbols-outlined text-primary" data-icon="military_tech"
            >military_tech</span
          >
          <div class="w-32 h-3 bg-surface-container rounded-full overflow-hidden">
            <div class="h-full bg-primary w-[65%] rounded-full"></div>
          </div>
          <span class="text-xs font-bold text-primary">LV.12</span>
        </div>
        <!-- Coins Bar -->
        <div class="flex items-center bg-surface-container-highest rounded-full px-3 py-1 gap-2">
          <span class="material-symbols-outlined text-tertiary" data-icon="payments">payments</span>
          <span class="text-sm font-bold text-on-surface">2,450</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <button class="p-2 rounded-full hover:bg-surface-container-high transition-colors">
        <span class="material-symbols-outlined text-on-surface-variant" data-icon="notifications"
          >notifications</span
        >
      </button>
      <div
        class="flex items-center gap-3 bg-surface-container-low p-1 pr-4 rounded-full border border-outline-variant/10"
      >
        <img
          alt="Student Avatar"
          class="w-10 h-10 rounded-full bg-primary-container"
          data-alt="Cute 3D character avatar of a young student with a friendly smile"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe6IM-fOrRbFo4dafI3z5jki3uWSd-EknFRgh_eWmpguGliZJ36IzWOElNNw7GcrSLCCSNTV8h6M8b5H3OwV7R0np9PI0ajRRl51yqszFhwc4PqqqV2wghEgFC57s9DAAe5Bku-YrT0U6b_bVt975AxDMd6JvoYTM9UFy79hEouQs9IC3vuycZ6NnSTzYPwxraJ_tgE4eWInvhXVfWt7cDcuAumAJgALVarP-ovqv42UflDIDM_JeGFzlLFwQscBL09d0Cv6MEszrQ"
        />
        <div class="flex flex-col">
          <span class="text-sm font-bold leading-none">Xiao Ming</span>
          <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Scholar</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup></script>
