<template>

<!-- Background Decorative Elements (The Tactile Playground) -->
<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
<div class="absolute top-[10%] left-[5%] opacity-20 cloud-float" style="animation-delay: -2s;">
<span class="material-symbols-outlined text-[120px] text-primary-fixed">cloud</span>
</div>
<div class="absolute top-[60%] right-[10%] opacity-15 cloud-float" style="animation-duration: 25s; animation-delay: -5s;">
<span class="material-symbols-outlined text-[180px] text-secondary-fixed">cloud</span>
</div>
<div class="absolute bottom-[5%] left-[20%] opacity-10 jelly-float">
<span class="material-symbols-outlined text-[80px] text-tertiary-fixed">star</span>
</div>
</div>
<!-- Top Navigation Bar -->
<header class="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl h-20 px-6 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
<!-- Exit Challenge -->
<button class="flex items-center gap-2 group px-5 py-2.5 rounded-full bg-surface-container-low hover:bg-error-container hover:text-on-error-container transition-all duration-300 transform hover:scale-105 active:scale-95">
<span class="material-symbols-outlined text-lg">close</span>
<span class="font-headline font-bold">退出挑战</span>
</button>
<!-- Jelly Timer -->
<div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-2.5 bg-surface-container-lowest rounded-full shadow-lg border-2 border-primary-container/20">
<span class="material-symbols-outlined text-primary" data-icon="timer">timer</span>
<span class="font-headline font-extrabold text-2xl tracking-tighter text-error shake-timer">00:42</span>
</div>
<!-- Progress Slots -->
<div class="flex items-center gap-4">
<div class="flex gap-1.5 p-2 bg-surface-container-low rounded-full">
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-on-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-on-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shadow-sm">
<span class="material-symbols-outlined text-on-secondary-container text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
<div class="w-8 h-8 rounded-full bg-surface-container-highest/50 flex items-center justify-center">
<div class="w-2 h-2 rounded-full bg-outline-variant/30"></div>
</div>
<div class="w-8 h-8 rounded-full bg-surface-container-highest/50 flex items-center justify-center">
<div class="w-2 h-2 rounded-full bg-outline-variant/30"></div>
</div>
</div>
<div class="hidden md:flex flex-col items-end">
<span class="font-headline font-bold text-sm text-primary">练习等级 4</span>
<span class="text-xs text-on-surface-variant font-medium">已掌握 3/10</span>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto flex flex-col items-center">
<!-- Question Progress Bar -->
<div class="w-full max-w-3xl mb-12">
<div class="flex justify-between items-center mb-4">
<span class="bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-sm font-headline font-bold">第 4 题</span>
<span class="text-on-surface-variant font-medium text-sm">目标：科学大师</span>
</div>
<div class="h-4 w-full bg-surface-container-high rounded-full overflow-hidden p-1">
<div class="h-full w-[40%] bg-gradient-to-r from-primary to-primary-container rounded-full relative">
<div class="absolute right-0 top-0 h-full w-4 bg-white/20 skew-x-12"></div>
</div>
</div>
</div>
<!-- Question Area: White Card -->
<div class="w-full max-w-4xl bg-surface-container-lowest rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.06)] p-10 md:p-16 relative overflow-hidden">
<!-- Decorative Corner Decor -->
<div class="absolute -top-10 -right-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-3xl"></div>
<div class="relative z-10 space-y-12">
<!-- Question Text -->
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center shadow-md rotate-3">
<span class="material-symbols-outlined text-on-tertiary-container" data-icon="lightbulb">lightbulb</span>
</div>
<h2 class="text-on-surface-variant font-headline font-bold uppercase tracking-widest text-sm">单选题</h2>
</div>
<h1 class="font-headline font-extrabold text-3xl md:text-4xl text-on-surface leading-tight">哪一层大气包含保护我们免受紫外线辐射的臭氧层？</h1>
</div>
<!-- Options Bento Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Option A -->
<button class="group relative flex items-center p-6 bg-surface-container-low hover:bg-primary-container/20 rounded-lg transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 text-left">
<div class="w-14 h-14 flex-shrink-0 bg-surface-container-lowest rounded-md shadow-sm flex items-center justify-center font-headline font-black text-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">A</div>
<div class="ml-5">
<span class="font-body font-bold text-lg text-on-surface">对流层</span>
</div>
<div class="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
</button>
<!-- Option B (Selected State Example) -->
<button class="group relative flex items-center p-6 bg-primary-container rounded-lg transition-all duration-300 transform scale-[1.03] -translate-y-2 text-left ring-4 ring-primary/20 shadow-xl">
<div class="w-14 h-14 flex-shrink-0 bg-primary rounded-md shadow-sm flex items-center justify-center font-headline font-black text-xl text-white">B</div>
<div class="ml-5">
<span class="font-body font-bold text-lg text-on-primary-container">平流层</span>
</div>
<div class="absolute right-6">
<span class="material-symbols-outlined text-on-primary-container" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
</button>
<!-- Option C -->
<button class="group relative flex items-center p-6 bg-surface-container-low hover:bg-primary-container/20 rounded-lg transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 text-left">
<div class="w-14 h-14 flex-shrink-0 bg-surface-container-lowest rounded-md shadow-sm flex items-center justify-center font-headline font-black text-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">C</div>
<div class="ml-5">
<span class="font-body font-bold text-lg text-on-surface">中间层</span>
</div>
<div class="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
</button>
<!-- Option D -->
<button class="group relative flex items-center p-6 bg-surface-container-low hover:bg-primary-container/20 rounded-lg transition-all duration-300 transform hover:scale-[1.03] hover:-translate-y-2 text-left">
<div class="w-14 h-14 flex-shrink-0 bg-surface-container-lowest rounded-md shadow-sm flex items-center justify-center font-headline font-black text-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">D</div>
<div class="ml-5">
<span class="font-body font-bold text-lg text-on-surface">外层</span>
</div>
<div class="absolute right-6 opacity-0 group-hover:opacity-100 transition-opacity">
<span class="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
</button>
</div>
</div>
</div>
<!-- Feedback Area (Oops state) -->
<div class="mt-12 w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.02]">
<div class="bg-tertiary-container/10 border-2 border-tertiary-container/30 rounded-lg p-6 flex gap-5 items-start">
<div class="p-3 bg-tertiary-container rounded-lg shadow-inner">
<span class="material-symbols-outlined text-on-tertiary-container text-3xl">psychology_alt</span>
</div>
<div class="space-y-1">
<h4 class="font-headline font-bold text-tertiary text-lg">哎呀，再想想哦！💡</h4>
<p class="text-on-surface-variant font-body leading-relaxed">臭氧层主要存在于 <strong class="text-on-surface">平流层</strong>，它位于对流层之上。它吸收了太阳 97–99% 的中频紫外线！</p>
</div>
</div>
</div>
<!-- Action Buttons -->
<div class="mt-16 flex flex-col md:flex-row items-center gap-6">
<button class="px-12 py-5 bg-primary text-white rounded-full font-headline font-extrabold text-xl shadow-[0_15px_30px_rgba(0,100,121,0.25)] hover:bg-primary-dim hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3">
<span>核对答案</span>
<span class="material-symbols-outlined">rocket_launch</span>
</button>
<button class="px-10 py-5 bg-surface-container-lowest text-on-surface-variant rounded-full font-headline font-bold text-lg shadow-sm hover:bg-surface-container-high transition-all">跳过</button>
</div>
</main>
<!-- Decorative Footer Elements -->
<footer class="mt-20 relative h-64 w-full flex items-end justify-center overflow-hidden">
<div class="absolute bottom-0 w-[150%] h-32 bg-primary-container/10 rounded-t-[100%] blur-2xl"></div>
<div class="relative z-10 flex gap-12 pb-10 opacity-50">
<div class="jelly-float" style="animation-delay: -1s;">
<img alt="decorative rocket" class="w-12 h-12" data-alt="cute 3D rocket icon with vibrant candy colors and soft shadows on a transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAevDF9dYTZO90bjfKa-gLvphFdgHXM03mvYqdQYCOkmnqf0za-rKEEw4vu5suoKpC16P4hIa9-DgVzsYhCvkpe2jLl_Y8bQ40kpFMAf3HC4S8gjv8XPPdionRlpm6hKEmK-N-MeK-5LP2qi_U8c9FMCuHzxoa_fIL5sloeOuhaeGGd2C2vm8vjBNAEuFqm_olCX6woj1NKkywV2IuyPsg0pCVTBjHXOYibogmBf5TNm_rqmJh35Ge-z-o1bIEzTZeyW5_DIPrhKL6u"/>
</div>
<div class="jelly-float" style="animation-delay: -3s;">
<img alt="decorative book" class="w-12 h-12" data-alt="cute 3D stack of books with vibrant candy colors and soft shadows on a transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYWSIU0lJj2HcAMe3iQldq5jnXwuMs3lLL2kkaV0IkxLk1_yWOUwfZTR6XPxhWFL-_o9R7qsJNJaXX7qk29DPPA6I7TKmeLKVAa2Fc_yYDaq_czq6alxueSf24SZvmYmqivWZuaeYMVX6t7JbF0xf5wMTmWQOB0Q7VhJzY7rL90JlSBexuZAZzugzN5kC27RSClNrUoH96eDWXRZtk0iBzwto4eNQadA5TT0sYtsET8V9TUUDATrTNWKDCIN5qKgwIliiFjEpnGyJ5"/>
</div>
<div class="jelly-float" style="animation-delay: -2s;">
<img alt="decorative stars" class="w-12 h-12" data-alt="cute 3D magic stars icon with vibrant candy colors and soft shadows on a transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYLi9i1jwQRZ8GK8p3vjjZXYROA-sicYWlgD2PuTP9FZpZ2GzPCOpzIF5sKejrPherqsdU7eLyfmDZHnSPQRaij69mc8kbGdhPg259IDM_Z-hWKuY-rzRzcVOoJdf0GO-Z_Q0BwUapbY4fihI6MySwTSnLvlcwbpCsFl-tGeA_9NKwGwdsXKeuQ6mPA9PMRgzLJt3xBoj-T0bGnA4eANfBud4foj9zJ_J9z0dKRhkNMFlsxYxjuYeVS-Vvdv5Kgp4rrU9iKSeq7RgS"/>
</div>
</div>
</footer>

</template>

<script setup>
</script>

<style scoped>
</style>
