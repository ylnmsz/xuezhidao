<template>
  <div class="bg-surface text-on-surface min-h-screen flex items-center justify-center p-4 md:p-8">
    <main
      class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden bg-white/40 backdrop-blur-md rounded-xl shadow-2xl"
    >
      <section
        class="hidden md:flex flex-col justify-center items-center p-12 bg-candy-gradient relative overflow-hidden"
      >
        <div class="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div
          class="absolute bottom-20 right-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"
        ></div>
        <div class="relative z-10 text-center">
          <div class="mb-8 inline-block">
            <img
              alt="Friendly space-traveling cat robot illustration"
              class="w-64 h-64 object-contain"
              data-alt="A cute, 2D flat vector illustration of a friendly space-traveling cat wearing glasses, holding a glowing lightbulb and a book, surrounded by colorful math symbols. Soft candy colors."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUkArjB1DYg7ebVwqouqX2aceYEJQYaCiJm1gOmuDWdQzBasxAhkWBiTHvPkNRwFqEikxWtzPgMp7mQHT5bZUzKEOsWrDwRarnMLb9kHAQSczRyjnjEF8tP2qfLt8ZN0pP5c-2GA4Kbl62QSoozttRna8GOwFXmWkfJKtyyxnMJFlJoaPFFT2VuW7_Kr-AxXIcdP_qMBkjgm6IwPYKdWI6nreB7mIW2xGeacPEv0CRErgrqzB9C4TrHhWCbVOKymz335YAcM8iffp"
            />
          </div>
          <h1 class="text-4xl font-extrabold text-white tracking-tight mb-4">学之道 Xue Zhi Dao</h1>
          <p class="text-on-primary/80 text-lg max-w-md font-medium">
            开启你的智慧之旅，让学习变得像游戏一样有趣。
          </p>
        </div>
        <div class="absolute inset-0 pointer-events-none opacity-30">
          <div class="absolute top-1/4 left-10 w-20 h-10 bg-white rounded-full blur-md"></div>
          <div class="absolute bottom-1/4 right-10 w-32 h-12 bg-white rounded-full blur-lg"></div>
        </div>
      </section>

      <section class="bg-surface-container-lowest p-8 md:p-12 flex flex-col justify-center">
        <div class="max-w-md mx-auto w-full">
          <header class="mb-8">
            <h2 class="text-3xl font-bold text-on-surface mb-2">创建新账号</h2>
            <p class="text-on-surface-variant font-medium">加入 100,000+ 学习者的行列</p>
          </header>

          <div class="flex p-1.5 bg-surface-container-low rounded-lg mb-8">
            <button
              class="flex-1 py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              :class="
                role === 'student'
                  ? 'bg-white shadow-sm text-primary font-bold'
                  : 'text-on-surface-variant font-semibold hover:bg-white/50'
              "
              type="button"
              @click="role = 'student'"
            >
              <span class="material-symbols-outlined text-xl" data-icon="school">school</span>
              我是学生
            </button>
            <button
              class="flex-1 py-3 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              :class="
                role === 'teacher'
                  ? 'bg-white shadow-sm text-primary font-bold'
                  : 'text-on-surface-variant font-semibold hover:bg-white/50'
              "
              type="button"
              @click="role = 'teacher'"
            >
              <span class="material-symbols-outlined text-xl" data-icon="history_edu"
                >history_edu</span
              >
              我是老师
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="handleRegister">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-on-surface-variant ml-2 tracking-wide"
                >真实姓名</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline"
                  data-icon="person"
                  >person</span
                >
                <input
                  class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline-variant font-medium"
                  placeholder="输入您的姓名"
                  type="text"
                  v-model.trim="name"
                />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-on-surface-variant ml-2 tracking-wide"
                >电子邮箱</label
              >
              <div class="relative">
                <span
                  class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline"
                  data-icon="mail"
                  >mail</span
                >
                <input
                  class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline-variant font-medium"
                  placeholder="example@xuezhidao.com"
                  type="email"
                  v-model.trim="email"
                />
              </div>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-on-surface-variant ml-2 tracking-wide"
                >手机号码</label
              >
              <div class="flex gap-3">
                <div class="relative flex-1">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline"
                    data-icon="smartphone"
                    >smartphone</span
                  >
                  <input
                    class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline-variant font-medium"
                    placeholder="138 **** 8888"
                    type="tel"
                    v-model.trim="phone"
                  />
                </div>
                <button
                  class="px-4 bg-primary-container text-on-primary-container font-bold rounded-lg text-sm hover:brightness-95 transition-all"
                  type="button"
                >
                  发送验证码
                </button>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-on-surface-variant ml-2 tracking-wide"
                  >设置密码</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline"
                    data-icon="lock"
                    >lock</span
                  >
                  <input
                    class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline-variant font-medium"
                    placeholder="••••••••"
                    type="password"
                    v-model="password"
                  />
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="text-xs font-bold text-on-surface-variant ml-2 tracking-wide"
                  >确认密码</label
                >
                <div class="relative">
                  <span
                    class="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline"
                    data-icon="verified_user"
                    >verified_user</span
                  >
                  <input
                    class="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container text-on-surface placeholder:text-outline-variant font-medium"
                    placeholder="••••••••"
                    type="password"
                    v-model="confirmPassword"
                  />
                </div>
              </div>
            </div>
            <p v-if="errorMessage" class="text-sm text-error font-semibold">
              {{ errorMessage }}
            </p>
            <div class="flex items-center gap-2 px-2 py-2">
              <input
                id="terms"
                class="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                type="checkbox"
              />
              <label class="text-xs text-on-surface-variant" for="terms">
                我已阅读并同意 <span class="text-primary font-semibold">服务协议</span> 与
                <span class="text-primary font-semibold">隐私政策</span>
              </label>
            </div>
            <button
              class="w-full py-4 bg-primary-container text-on-primary-container text-lg font-extrabold rounded-lg custom-shadow flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              type="submit"
              :disabled="isSubmitting"
            >
              立即注册 🚀
            </button>
          </form>
          <footer class="mt-8 text-center">
            <p class="text-on-surface-variant font-medium">
              已有账号？
              <RouterLink
                to="/loginregistrationupdatedowl"
                class="text-primary font-bold hover:underline ml-1"
              >
                立即登录
              </RouterLink>
            </p>
          </footer>
        </div>
      </section>
    </main>

    <div
      class="fixed -top-24 -left-24 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px] -z-10"
    ></div>
    <div
      class="fixed -bottom-24 -right-24 w-96 h-96 bg-tertiary-container/15 rounded-full blur-[100px] -z-10"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/services/authService.js'

const router = useRouter()
const role = ref('student')
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = '请完整填写姓名、邮箱和密码。'
    return
  }
  if (password.value.length < 8) {
    errorMessage.value = '密码至少 8 位。'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次密码不一致。'
    return
  }

  isSubmitting.value = true
  try {
    const data = await register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value,
    })
    localStorage.setItem('auth_token', data.token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    const target = data.user?.role === 'teacher' ? '/teacherdashboard' : '/studentdashboard'
    router.push(target)
  } catch (error) {
    errorMessage.value = error.message || '注册失败，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}
.bg-candy-gradient {
  background: linear-gradient(135deg, #40cef3 0%, #006479 100%);
}
.custom-shadow {
  box-shadow: 0 40px 60px rgba(0, 0, 0, 0.06);
}
</style>
