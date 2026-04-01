<template>

<main class="flex flex-col md:flex-row min-h-screen overflow-hidden">
<!-- Left Side: Illustration Area -->
<section class="relative hidden md:flex w-1/2 flex-col items-center justify-center bg-gradient-to-br from-primary via-primary-dim to-primary p-12 overflow-hidden">
<!-- Decorative Elements -->
<div class="absolute top-20 left-20 floating-cloud opacity-60">
<span class="material-symbols-outlined text-surface-container-lowest text-6xl">cloud</span>
</div>
<div class="absolute bottom-40 right-20 floating-cloud opacity-40" style="animation-delay: -2s;">
<span class="material-symbols-outlined text-surface-container-lowest text-8xl">cloud</span>
</div>
<!-- Symbols & Stars -->
<div class="absolute top-1/4 right-1/4 jumping-star">
<span class="material-symbols-outlined text-tertiary-fixed text-4xl" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<div class="absolute bottom-1/4 left-1/3 jumping-star" style="animation-delay: -1s;">
<span class="material-symbols-outlined text-secondary-fixed text-3xl" style="font-variation-settings: 'FILL' 1;">favorite</span>
</div>
<div class="absolute top-1/2 left-10 text-primary-container/30 font-headline text-7xl font-bold select-none">∑</div>
<div class="absolute top-1/3 right-10 text-primary-container/30 font-headline text-8xl font-bold select-none">π</div>
<div class="absolute bottom-20 left-20 text-primary-container/30 font-headline text-6xl font-bold select-none">∫</div>
<!-- Main Character Wrapper -->
<div class="relative z-10 floating-cloud flex flex-col items-center">
<div class="relative w-80 h-80 rounded-full bg-primary-container/20 flex items-center justify-center backdrop-blur-sm border-4 border-primary-container/30">
<img alt="Cute 2D scholar owl illustration" class="w-64 h-64 object-cover rounded-xl shadow-2xl" data-alt="A cute, 2D flat vector illustration of a scholar owl wearing round glasses and a graduation cap, reading a book in a playful, minimalist style with soft candy colors." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoHK3KC3-1VgNbW_dTfc2Ut3b5vIn419dC6NIitHeMiljl3xMX2Nw6uhz_pEkxTWzB1jdg_1sHM4YWoeW2xydlVIA3jIVRFzR9U9pTxt7xoUvr46b9lN61jlofI74ZrL6QgzUOLT25VDHj_JqgJY1zcSRuGn9hQo3y7TOrre0U-JUFs_-IWei1vGE0abTXwOEqOgMEauHHEGvRcI1tpOS_KgfQD8jZYewxuImHaIrAHdkMt_KSoEarjYjqLoJWaCDsKPOQDXa8niES"/>
</div>
<div class="mt-8 text-center">
<h2 class="font-headline text-3xl font-extrabold text-on-primary">智慧在等待</h2>
<p class="text-on-primary/80 mt-2 max-w-sm">在学之道的每一页开启知识秘籍。</p>
</div>
</div>
</section>
<!-- Right Side: Login Form Area -->
<section class="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-surface">
<div class="w-full max-w-md space-y-10">
<!-- Branding -->
<div class="text-center md:text-left">
<h1 class="text-4xl font-black font-headline tracking-tight text-primary">
                        Xue Zhi Dao
                    </h1>
<p class="text-2xl font-bold font-headline text-on-surface mt-2">欢迎来到学之道！ 🌍</p>
<p class="text-on-surface-variant mt-2">求学之路，始于足下。</p>
</div>
<!-- Tabs Selection -->
<div class="grid grid-cols-2 gap-4">
<button class="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border-4 border-primary rounded-lg bouncy-hover shadow-[0_10px_30px_rgba(0,100,121,0.1)] group transition-all">
<span class="text-4xl mb-2 group-hover:scale-125 transition-transform">👨‍🎓</span>
<span class="font-headline font-bold text-primary">我是学生</span>
</button>
<button class="flex flex-col items-center justify-center p-6 bg-surface-container-low border-4 border-transparent rounded-lg bouncy-hover hover:border-secondary-container transition-all group opacity-70 hover:opacity-100">
<span class="text-4xl mb-2 group-hover:scale-125 transition-transform">👩‍🏫</span>
<span class="font-headline font-bold text-on-surface-variant">我是老师</span>
</button>
</div>
<!-- Form Fields -->
<form class="space-y-6" @submit.prevent="$router.push('/studentdashboard')">
<div class="space-y-2">
<label class="block text-sm font-bold font-headline text-on-surface-variant ml-2">电子邮箱</label>
<div class="group relative">
<input class="w-full px-6 py-4 rounded-full bg-surface-container-low border-none focus:ring-4 focus:ring-primary-container transition-all outline-none text-on-surface placeholder:text-outline" placeholder="student@xuezhidao.com" type="email"/>
<div class="absolute inset-0 rounded-full pointer-events-none border-2 border-transparent group-focus-within:border-primary-container/50 -m-[2px]"></div>
</div>
</div>
<div class="space-y-2">
<div class="flex justify-between items-center ml-2">
<label class="text-sm font-bold font-headline text-on-surface-variant">密码</label>
<a class="text-xs font-bold text-primary hover:underline" href="#">忘记密码？</a>
</div>
<div class="group relative">
<input class="w-full px-6 py-4 rounded-full bg-surface-container-low border-none focus:ring-4 focus:ring-secondary-container transition-all outline-none text-on-surface placeholder:text-outline" placeholder="••••••••" type="password"/>
<div class="absolute inset-0 rounded-full pointer-events-none border-2 border-transparent group-focus-within:border-secondary-container/50 -m-[2px]"></div>
</div>
</div>
<div class="flex items-center space-x-2 ml-2">
<input class="w-5 h-5 rounded border-surface-container-highest text-primary focus:ring-primary-container" id="remember" type="checkbox"/>
<label class="text-sm font-medium text-on-surface-variant" for="remember">保持登录</label>
</div>
<!-- CTA Button -->
<button class="w-full py-5 bg-primary-container text-on-primary-container font-headline font-black text-xl rounded-full shadow-lg shadow-primary-container/30 shake-hover bouncy-hover transition-all flex items-center justify-center gap-3 active:scale-95" type="submit">开启学习之旅 🚀</button>
</form>
<!-- Footer Social/Links -->
<div class="space-y-6 pt-4">
<div class="relative">
<div class="absolute inset-0 flex items-center"><div class="w-full border-t border-surface-container-highest"></div></div>
<div class="relative flex justify-center text-sm"><span class="px-4 bg-surface text-on-surface-variant font-medium">或者通过以下方式继续</span></div>
</div>
<div class="grid grid-cols-2 gap-4">
<button class="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest rounded-full border border-outline-variant/10 hover:bg-surface-container-low transition-colors bouncy-hover">
<img alt="Google" class="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrkpNeqo_qcKp5vit9IuQt638SYT7cuo-XIhLNyOvPxnp5VqZp21FMwSXUshQ2-_ufxqjNcBqMmPnsStWjiCR9PlEiEj4-fh8l2jwQ7Bsp3BQLtDqftu2v3QEIcSU10EaGYgbju9qkEBBZIjbmaqQhOkMfZfLwisjFajrSUPkatL-NebkBR7fpl931Lj6ezTKWAys2jW0os4KVM1bJDUs343nKwCIFF8MPirOo6Hw0GNFd_MmBK6MLX4kARbpWKZB3pI6H37TLINaB"/>
<span class="font-bold text-sm">Google</span>
</button>
<button class="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest rounded-full border border-outline-variant/10 hover:bg-surface-container-low transition-colors bouncy-hover">
<img alt="Apple" class="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCd7OnncCFNc740KlO_1rPqB-eDjhk6-tTtzsAs_O9v1lgjdr6GWLVNinoYIE_gqUvk4Le5JIZTZfW_ZUksUrNF3kVM19M_FmZHT0D9a6kunFjYdcNsktoMzB2DRT6PEPu9x0fN4E-RBv4hSE-DLEpBibWJXxHt10BVkgtfktiMzEWEEd0JEdTSHkzz-l3XOjWQSJPNqPjamjPu7wkTV4Vz4QcKHjmapfmUAceJZ6v09LezLoK0aph_pB0z3ADUsWEl07N9U7gy04lg"/>
<span class="font-bold text-sm">Apple</span>
</button>
</div>
<p class="text-center text-sm text-on-surface-variant">新用户？ <a class="text-primary font-bold hover:underline" href="#">立即注册</a></p>
</div>
</div>
</section>
</main>
<!-- Visual Accents -->
<div class="fixed top-10 right-10 jumping-star opacity-20 pointer-events-none">
<span class="material-symbols-outlined text-tertiary text-6xl">temp_preferences_custom</span>
</div>
<div class="fixed bottom-10 left-10 floating-cloud opacity-10 pointer-events-none">
<span class="material-symbols-outlined text-primary text-9xl">school</span>
</div>

</template>

<script setup>
</script>

<style scoped>
</style>

