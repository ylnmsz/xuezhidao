<template>
  <div class="bg-background text-on-background min-h-screen bg-blobs pb-36">
    <input
      ref="avatarInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleAvatarSelected"
    />

    <nav
      class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md font-['Plus_Jakarta_Sans'] font-bold tracking-tight docked full-width top-0 sticky z-40 shadow-[0_20px_50px_rgba(0,180,216,0.08)]"
    >
      <div
        class="flex justify-between items-center w-full px-4 md:px-8 py-4 max-w-screen-2xl mx-auto gap-4"
      >
        <div class="flex items-center gap-4 min-w-0">
          <button
            class="hover:scale-105 transition-transform duration-300 ease-out active:scale-95 flex items-center justify-center p-2 rounded-full bg-surface-container-low text-primary"
            @click="router.back()"
          >
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div class="min-w-0">
            <h1 class="text-2xl font-black text-cyan-700 dark:text-cyan-300">教师资料</h1>
            <p class="text-xs text-on-surface-variant font-medium mt-1">
              {{
                isEditing
                  ? '编辑模式已开启，可修改头像、基本资料和偏好设置'
                  : '查看并维护教师个人资料'
              }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 md:gap-6">
          <div class="hidden md:flex gap-8 items-center text-slate-500">
            <RouterLink
              to="/teacherdashboard"
              class="text-cyan-700 dark:text-cyan-300 border-b-4 border-cyan-400 dark:border-cyan-500 pb-1"
            >
              Dashboard
            </RouterLink>
            <RouterLink to="/classmanagement" class="hover:text-cyan-500 transition-colors">
              Classes
            </RouterLink>
            <RouterLink to="/questionbank" class="hover:text-cyan-500 transition-colors">
              Curriculum
            </RouterLink>
          </div>
          <div class="flex items-center gap-3 border-l pl-4 md:pl-6 border-outline-variant/30">
            <button
              class="relative hover:scale-105 transition-transform p-2 text-slate-500"
              @click="toggleNotifications"
            >
              <span class="material-symbols-outlined">notifications</span>
              <span
                v-if="unreadCount"
                class="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-error text-white text-[10px] leading-5 text-center"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            <button
              class="hover:scale-105 transition-transform p-2 text-slate-500"
              @click="enterEditMode"
            >
              <span class="material-symbols-outlined">edit</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <transition name="slide-panel">
      <aside
        v-if="isNotificationsOpen"
        class="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 bg-white/95 backdrop-blur-2xl shadow-[-20px_0_60px_rgba(0,0,0,0.12)] border-l border-outline-variant/20"
      >
        <div class="h-full flex flex-col">
          <div
            class="flex items-center justify-between px-6 py-5 border-b border-outline-variant/15"
          >
            <div>
              <h2 class="text-xl font-black text-on-surface">通知中心</h2>
              <p class="text-sm text-on-surface-variant mt-1">点击未读消息可标记为已读</p>
            </div>
            <button
              class="p-2 rounded-full hover:bg-surface-container"
              @click="toggleNotifications"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            <button
              v-for="item in notifications"
              :key="item.id"
              class="w-full text-left p-4 rounded-2xl border transition-all"
              :class="
                item.read_at
                  ? 'bg-surface-container-low border-outline-variant/10'
                  : 'bg-primary-container/10 border-primary/20 hover:bg-primary-container/20'
              "
              @click="handleNotificationClick(item)"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-on-surface">{{ item.title }}</p>
                  <p class="text-sm text-on-surface-variant mt-1 leading-6">
                    {{ item.body || '暂无详情' }}
                  </p>
                </div>
                <span
                  v-if="!item.read_at"
                  class="mt-1 w-2.5 h-2.5 rounded-full bg-primary shrink-0"
                ></span>
              </div>
              <p class="text-xs text-on-surface-variant mt-3">
                {{ formatDateTime(item.created_at) }}
              </p>
            </button>

            <div
              v-if="!notifications.length && !loading.notifications"
              class="p-8 text-center rounded-2xl bg-surface-container-low text-on-surface-variant"
            >
              暂无通知
            </div>
          </div>

          <div class="px-6 py-5 border-t border-outline-variant/15">
            <button
              class="w-full py-3 rounded-full border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors"
              @click="router.push('/messages')"
            >
              前往消息中心
            </button>
          </div>
        </div>
      </aside>
    </transition>

    <div
      v-if="isNotificationsOpen"
      class="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
      @click="toggleNotifications"
    ></div>

    <main class="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div
        v-if="feedback.message"
        class="mb-6 px-5 py-4 rounded-2xl border text-sm font-medium flex items-center justify-between gap-4"
        :class="
          feedback.type === 'error'
            ? 'bg-error/10 text-error border-error/20'
            : feedback.type === 'success'
              ? 'bg-secondary/10 text-secondary border-secondary/20'
              : 'bg-primary/10 text-primary border-primary/20'
        "
      >
        <span>{{ feedback.message }}</span>
        <button class="opacity-70 hover:opacity-100" @click="feedback.message = ''">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <section
            class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_rgba(0,100,121,0.04)] transition-all duration-500"
          >
            <div class="flex flex-col items-center text-center">
              <div class="relative group">
                <img
                  :alt="`${displayName}头像`"
                  class="w-32 h-32 rounded-full border-4 border-primary-container object-cover"
                  :src="displayAvatar"
                />
                <button
                  class="absolute bottom-0 right-0 bg-primary-container p-2 rounded-full shadow-lg hover:scale-110 transition-transform disabled:opacity-60"
                  :disabled="loading.avatar"
                  @click="openAvatarPicker"
                >
                  <span class="material-symbols-outlined text-white text-sm">
                    {{ loading.avatar ? 'progress_activity' : 'photo_camera' }}
                  </span>
                </button>
              </div>

              <div class="w-full mt-6 space-y-4">
                <div>
                  <label
                    class="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2"
                  >
                    教师姓名
                  </label>
                  <input
                    v-model.trim="form.name"
                    :disabled="!isEditing"
                    class="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-center font-bold text-on-surface outline-none transition-all disabled:cursor-default disabled:opacity-100 disabled:border-transparent"
                    placeholder="请输入教师姓名"
                  />
                </div>

                <p class="text-on-surface-variant font-medium">ID: {{ displayId }}</p>

                <div class="grid grid-cols-1 gap-3 text-left">
                  <div>
                    <label
                      class="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2"
                    >
                      学校
                    </label>
                    <input
                      v-model.trim="form.school"
                      :disabled="!isEditing"
                      class="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition-all disabled:cursor-default disabled:opacity-100 disabled:border-transparent"
                      placeholder="请输入学校名称"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2"
                    >
                      个性签名
                    </label>
                    <textarea
                      v-model.trim="form.signature"
                      :disabled="!isEditing"
                      rows="3"
                      class="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition-all resize-none disabled:cursor-default disabled:opacity-100 disabled:border-transparent"
                      placeholder="写一句你的教学理念"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap justify-center gap-2 mt-5">
                <span
                  class="px-3 py-1 bg-primary-container/20 text-primary font-bold rounded-full text-xs"
                >
                  {{ displayGradesLabel }}
                </span>
                <span
                  class="px-3 py-1 bg-secondary-container/20 text-secondary font-bold rounded-full text-xs"
                >
                  {{ displaySchool }}
                </span>
              </div>

              <p class="mt-5 italic text-on-surface-variant text-sm leading-relaxed">
                "{{ displaySignature }}"
              </p>

              <button
                class="mt-8 w-full py-3 px-6 bg-surface-container-low text-primary font-bold rounded-2xl hover:bg-primary-container/10 transition-colors active:scale-95 disabled:opacity-60"
                :disabled="loading.avatar"
                @click="openAvatarPicker"
              >
                {{ loading.avatar ? '上传中...' : '更换头像' }}
              </button>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_rgba(0,0,0,0.02)] transition-all duration-500"
          >
            <h3 class="text-xl font-headline font-bold mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-tertiary">security</span>
              账户安全
            </h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center py-2 gap-4">
                <span class="text-on-surface-variant text-sm">绑定手机</span>
                <span class="text-on-surface font-semibold text-right">{{ displayPhone }}</span>
              </div>
              <div class="flex justify-between items-center py-2 gap-4">
                <span class="text-on-surface-variant text-sm">工作邮箱</span>
                <span class="text-on-surface font-semibold text-right break-all">{{
                  displayEmail
                }}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-on-surface-variant text-sm">实名状态</span>
                <span class="flex items-center gap-1 text-secondary font-bold text-sm">
                  <span
                    class="material-symbols-outlined text-sm"
                    style="font-variation-settings: 'FILL' 1"
                    >check_circle</span
                  >
                  已实名
                </span>
              </div>
              <RouterLink
                to="/forgotpassword"
                class="block text-center mt-6 text-primary font-bold text-sm underline underline-offset-4 hover:text-primary-dim"
              >
                修改登录密码
              </RouterLink>
              <button
                class="mt-4 w-full flex items-center justify-between py-3 text-error hover:text-error transition-colors"
                @click="handleLogout"
              >
                <span class="font-bold">退出登录</span>
                <span class="material-symbols-outlined">logout</span>
              </button>
            </div>
          </section>
        </div>

        <div class="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section
              class="bg-primary-container/10 p-6 rounded-[2rem] border border-primary-container/20 flex items-center gap-4"
            >
              <div
                class="bg-primary-container w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <span class="material-symbols-outlined text-3xl">schedule</span>
              </div>
              <div>
                <p class="text-primary-dim text-sm font-bold uppercase tracking-wider">本周授课</p>
                <p class="text-2xl font-black text-on-primary-container">
                  {{ weeklyStudyHours }} 小时
                </p>
              </div>
            </section>
            <section
              class="bg-secondary-container/10 p-6 rounded-[2rem] border border-secondary-container/20 flex items-center gap-4"
            >
              <div
                class="bg-secondary-container w-14 h-14 rounded-2xl flex items-center justify-center text-secondary shadow-lg"
              >
                <span class="material-symbols-outlined text-3xl">assignment</span>
              </div>
              <div>
                <p class="text-secondary-dim text-sm font-bold uppercase tracking-wider">
                  已发布作业
                </p>
                <p class="text-2xl font-black text-on-secondary-container">
                  {{ publishedHomework }} 份
                </p>
              </div>
            </section>
          </div>

          <section
            class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <div class="grid md:grid-cols-2 gap-10">
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <h4 class="font-bold text-on-surface">批改完成率</h4>
                  <span class="text-primary font-black text-xl">{{ accuracyPercent }}%</span>
                </div>
                <div class="h-4 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-300"
                    :style="{ width: `${accuracyPercent}%` }"
                  ></div>
                </div>
              </div>
              <div class="space-y-2">
                <h4 class="font-bold text-on-surface">班级满意度</h4>
                <div class="flex items-center gap-2 text-tertiary-fixed">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="material-symbols-outlined"
                    :class="star <= filledStars ? '' : 'text-on-surface-variant/30'"
                    :style="star <= filledStars ? 'font-variation-settings: \'FILL\' 1' : ''"
                  >
                    star
                  </span>
                  <span class="ml-2 text-on-surface-variant font-bold text-lg">{{
                    satisfactionScore
                  }}</span>
                </div>
              </div>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <div class="flex justify-between items-center mb-8 gap-4">
              <div>
                <h3 class="text-xl font-headline font-bold">班级管理</h3>
                <p class="text-on-surface-variant text-sm">
                  当前共负责 {{ classCount }} 个教学班级
                </p>
              </div>
              <RouterLink
                to="/classmanagement"
                class="px-5 py-2 rounded-full border-2 border-primary-container text-primary font-bold text-sm hover:bg-primary-container/5 transition-all whitespace-nowrap"
              >
                查看全部
              </RouterLink>
            </div>
            <div class="space-y-4">
              <button
                v-for="item in visibleClasses"
                :key="item.id"
                class="group w-full flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary-container/20 text-left"
                @click="openClassManagement(item)"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <div
                    class="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-colors shrink-0"
                  >
                    {{ getClassBadge(item, visibleClasses.indexOf(item)) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-on-surface truncate">{{ item.name }}</p>
                    <p class="text-xs text-on-surface-variant mt-1">
                      {{ item.meta || formatDateTime(item.created_at) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <button
                    class="w-8 h-8 rounded-full text-error hover:bg-error/10 flex items-center justify-center"
                    @click.stop="confirmDeleteClass(item, $event)"
                    title="解散班级"
                  >
                    <span class="material-symbols-outlined">close</span>
                  </button>
                  <span class="material-symbols-outlined text-outline-variant">chevron_right</span>
                </div>
              </button>
            </div>
          </section>

          <section
            class="bg-surface-container-lowest p-8 rounded-[2rem] shadow-[0_40px_60px_rgba(0,0,0,0.02)]"
          >
            <h3 class="text-xl font-headline font-bold mb-8">教学偏好与通知</h3>
            <div class="space-y-10">
              <div>
                <div class="flex items-center justify-between gap-4 mb-4">
                  <label class="block text-sm font-bold text-on-surface-variant"
                    >擅长题型标签</label
                  >
                  <button
                    class="px-4 py-2 border-2 border-dashed border-outline-variant text-outline-variant rounded-full text-sm font-bold flex items-center gap-1 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
                    :disabled="!isEditing"
                    @click="showTagInput"
                  >
                    <span class="material-symbols-outlined text-sm">add</span> 添加
                  </button>
                </div>

                <div v-if="isTagInputVisible" class="flex gap-3 mb-4">
                  <input
                    v-model.trim="draftTag"
                    class="flex-1 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm outline-none"
                    placeholder="输入标签后按回车"
                    @keydown.enter.prevent="addTag"
                  />
                  <button
                    class="px-5 rounded-2xl bg-primary text-white font-bold hover:opacity-90 transition-opacity"
                    @click="addTag"
                  >
                    确认
                  </button>
                </div>

                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="tag in expertiseTags"
                    :key="tag"
                    class="px-4 py-2 bg-tertiary-container/10 text-tertiary font-bold rounded-full text-sm border border-tertiary-container/30 flex items-center gap-2"
                  >
                    {{ tag }}
                    <button
                      v-if="isEditing"
                      class="material-symbols-outlined text-base opacity-70 hover:opacity-100"
                      @click="removeTag(tag)"
                    >
                      close
                    </button>
                  </span>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-8">
                <div>
                  <label class="block text-sm font-bold text-on-surface-variant mb-4">
                    负责年级范围
                  </label>
                  <div class="flex flex-wrap gap-4">
                    <button
                      v-for="grade in gradeOptions"
                      :key="grade"
                      class="flex-1 min-w-[88px] text-center py-3 rounded-2xl border-2 font-bold transition-all"
                      :class="
                        selectedGrades.includes(grade)
                          ? 'border-primary-container bg-primary-container/10 text-primary'
                          : 'border-outline-variant text-on-surface-variant'
                      "
                      @click="toggleGrade(grade)"
                    >
                      {{ grade }}
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-on-surface-variant mb-4">
                    消息通知订阅
                  </label>
                  <div class="flex flex-col gap-4">
                    <button
                      v-for="option in notificationOptions"
                      :key="option.key"
                      class="flex items-center justify-between p-4 rounded-2xl border transition-all text-left"
                      :class="
                        notificationPrefs[option.key]
                          ? 'border-secondary/20 bg-secondary/10'
                          : 'border-outline-variant/20 bg-surface-container-low'
                      "
                      @click="toggleNotificationPreference(option.key)"
                    >
                      <span class="text-sm font-medium text-on-surface">{{ option.label }}</span>
                      <span
                        class="w-11 h-6 rounded-full p-1 flex items-center transition-colors"
                        :class="
                          notificationPrefs[option.key] ? 'bg-secondary' : 'bg-outline-variant'
                        "
                      >
                        <span
                          class="w-4 h-4 bg-white rounded-full transition-transform"
                          :class="notificationPrefs[option.key] ? 'translate-x-5' : 'translate-x-0'"
                        ></span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <footer
      class="fixed bottom-0 left-0 w-full z-30 bg-white/90 backdrop-blur-2xl px-4 md:px-8 py-5 shadow-[0_-15px_40px_rgba(0,0,0,0.04)] rounded-t-[2.5rem]"
    >
      <div class="max-w-7xl mx-auto flex justify-end items-center gap-4">
        <button
          class="px-7 md:px-10 py-4 bg-surface-container text-on-surface font-extrabold uppercase tracking-widest text-sm rounded-full hover:bg-surface-container-high transition-all active:scale-95 disabled:opacity-60"
          :disabled="(!hasChanges && !isEditing) || loading.saving"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          class="px-8 md:px-12 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-extrabold uppercase tracking-widest text-sm rounded-full shadow-[0_10px_30px_rgba(0,100,121,0.3)] hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,100,121,0.4)] transition-all active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
          :disabled="loading.saving || loading.avatar || !hasChanges"
          @click="saveProfile"
        >
          {{ loading.saving ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </footer>

    <div class="md:hidden">
      <nav
        class="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.04)]"
      >
        <RouterLink
          to="/teacherdashboard"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">grid_view</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Home
          </span>
        </RouterLink>
        <RouterLink
          to="/classmanagement"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">group</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Students
          </span>
        </RouterLink>
        <RouterLink
          to="/analyticsgrading"
          class="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-2 hover:bg-neutral-100 dark:hover:bg-slate-800 rounded-full w-16"
        >
          <span class="material-symbols-outlined">insights</span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Insights
          </span>
        </RouterLink>
        <RouterLink
          to="/teacherprofile"
          class="flex flex-col items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 rounded-full px-6 py-2 transform scale-110 -translate-y-1"
        >
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">
            account_circle
          </span>
          <span class="font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase mt-1">
            Account
          </span>
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '@/services/api.js'
import { listNotifications, markNotificationAsRead } from '@/services/notificationService.js'
import { listClasses, deleteClass } from '@/services/questionService.js'
import {
  clearUser,
  getMe,
  getStoredUser,
  saveUser,
  updateMe,
  uploadAvatar,
} from '@/services/userService.js'

const router = useRouter()

const FALLBACK_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBio8Ta8BRczgOqmfYounc7e6QpjjTlQnHdU5HfUE2cZ1HbShaL9c4L27Wgnq6IMxub44Ab-DFlnC1pM3jiZ9AIPWN-oaarXOi41uMZ3U9ilNlJRsm5EeYhwsp8jRoTm0zgwuz63e_m3bxnoNjnT0m_L5-kITQ3i1PmDT5mRivIYQO3X6UEph24aJ5kd5Bl6SH1-JOF-CGQQEiK9zefeG95HGuLgRfiV8oGCr8lBDa8P6hBEhJJP9_aqnIP_IUljLSQozKyy70nbzP2'
const DEFAULT_TAGS = ['函数解析', '立体几何', '概率统计']
const DEFAULT_NOTIFICATION_PREFS = { app: true, sms: false, email: true }
const gradeOptions = ['高一', '高二', '高三']
const notificationOptions = [
  { key: 'app', label: 'APP推送' },
  { key: 'sms', label: '短信通知' },
  { key: 'email', label: '邮件提醒' },
]
const fallbackClasses = [
  { id: 'fallback-1', name: '高三 (01) 班 - 尖子生数学', meta: '演示班级 · 点击进入班级管理' },
  { id: 'fallback-2', name: '高二 (04) 班 - 代数进阶', meta: '演示班级 · 点击进入班级管理' },
  { id: 'fallback-3', name: '高一 (12) 班 - 趣味逻辑', meta: '演示班级 · 点击进入班级管理' },
]

const user = ref(getStoredUser())
const form = ref(createFormState(user.value))
const selectedGrades = ref(parseGradeValue(user.value?.grade))
const expertiseTags = ref([...DEFAULT_TAGS])
const notificationPrefs = ref({ ...DEFAULT_NOTIFICATION_PREFS })
const notifications = ref([])
const classes = ref([])
const isEditing = ref(false)
const isNotificationsOpen = ref(false)
const draftTag = ref('')
const isTagInputVisible = ref(false)
const avatarInput = ref(null)
const snapshot = ref('')
const feedback = ref({ type: 'info', message: '' })
const loading = ref({ page: false, saving: false, avatar: false, notifications: false })

function createFormState(source) {
  return {
    name: source?.name || '',
    signature: source?.signature || '',
    school: source?.school || '',
    avatar_url: source?.avatar_url || '',
  }
}

function resolveAvatarUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) {
    const base = API_BASE.replace(/\/api\/?$/, '')
    return `${base}${url}`
  }
  return url
}

function parseGradeValue(value) {
  return String(value || '')
    .split(/[、,，/|\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildPreferencesKey(id) {
  return `teacher_profile_preferences_${id || 'guest'}`
}

function loadPreferences(id) {
  try {
    const raw = localStorage.getItem(buildPreferencesKey(id))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function savePreferences(id) {
  localStorage.setItem(
    buildPreferencesKey(id),
    JSON.stringify({
      expertiseTags: expertiseTags.value,
      notificationPrefs: notificationPrefs.value,
    }),
  )
}

function normalizeState() {
  return JSON.stringify({
    form: {
      name: form.value.name.trim(),
      signature: form.value.signature.trim(),
      school: form.value.school.trim(),
      avatar_url: form.value.avatar_url || '',
    },
    selectedGrades: [...selectedGrades.value].sort(),
    expertiseTags: [...expertiseTags.value].map((item) => item.trim()).sort(),
    notificationPrefs: { ...notificationPrefs.value },
  })
}

function syncFromUser(source) {
  form.value = createFormState(source)
  selectedGrades.value = parseGradeValue(source?.grade)

  const prefs = loadPreferences(source?.id)
  expertiseTags.value =
    Array.isArray(prefs?.expertiseTags) && prefs.expertiseTags.length
      ? prefs.expertiseTags
      : [...DEFAULT_TAGS]
  notificationPrefs.value = {
    ...DEFAULT_NOTIFICATION_PREFS,
    ...(prefs?.notificationPrefs || {}),
  }

  draftTag.value = ''
  isTagInputVisible.value = false
  snapshot.value = normalizeState()
}

function setFeedback(type, message) {
  feedback.value = { type, message }
}

const displayName = computed(() => form.value.name.trim() || user.value?.name || '未登录用户')
const displayEmail = computed(() => user.value?.email || '—')
const displayId = computed(() => user.value?.id || '—')
const displayPhone = computed(() => user.value?.phone || '—')
const displayAvatar = computed(
  () => resolveAvatarUrl(form.value.avatar_url || user.value?.avatar_url) || FALLBACK_AVATAR,
)
const displaySignature = computed(() => form.value.signature.trim() || '专注教学，点亮每个学生。')
const displaySchool = computed(() => form.value.school.trim() || '学校未填写')
const displayGradesLabel = computed(() =>
  selectedGrades.value.length ? `负责年级 · ${selectedGrades.value.join(' / ')}` : '负责年级未设置',
)
const weeklyStudyHours = computed(() => {
  const val = Number(user.value?.weekly_study_hours)
  return Number.isFinite(val) ? val : 0
})
const publishedHomework = computed(() => {
  const val = Number(user.value?.homework_done)
  return Number.isFinite(val) ? val : 0
})
const accuracyPercent = computed(() => {
  const value = Number(user.value?.accuracy)
  if (Number.isFinite(value) && value > 0) {
    return Math.max(0, Math.min(100, Math.round(value)))
  }
  return 0
})
const filledStars = computed(() => Math.round(accuracyPercent.value / 20))
const satisfactionScore = computed(() => (accuracyPercent.value / 20).toFixed(1))
const unreadCount = computed(() => notifications.value.filter((item) => !item.read_at).length)
const visibleClasses = computed(() => classes.value)
const classCount = computed(() => visibleClasses.value.length)
const hasChanges = computed(() => normalizeState() !== snapshot.value)

function enterEditMode() {
  isEditing.value = true
  setFeedback('info', '已进入编辑模式')
}

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
}

function openAvatarPicker() {
  if (!isEditing.value) {
    isEditing.value = true
  }
  avatarInput.value?.click()
}

async function handleAvatarSelected(event) {
  const file = event.target?.files?.[0]
  if (!file) return

  loading.value.avatar = true
  try {
    const result = await uploadAvatar(file)
    form.value.avatar_url = result.url
    isEditing.value = true
    setFeedback('success', '头像已上传，点击“保存修改”后同步到个人资料')
  } catch (error) {
    setFeedback('error', error.message || '头像上传失败')
  } finally {
    loading.value.avatar = false
    if (event.target) {
      event.target.value = ''
    }
  }
}

function showTagInput() {
  if (!isEditing.value) return
  isTagInputVisible.value = true
}

function addTag() {
  if (!isEditing.value) return
  const value = draftTag.value.trim()
  if (!value) return
  if (expertiseTags.value.includes(value)) {
    setFeedback('info', '该标签已存在')
    return
  }
  expertiseTags.value = [...expertiseTags.value, value]
  draftTag.value = ''
  isTagInputVisible.value = false
}

function removeTag(tag) {
  expertiseTags.value = expertiseTags.value.filter((item) => item !== tag)
}

function toggleGrade(grade) {
  if (!isEditing.value) return
  selectedGrades.value = selectedGrades.value.includes(grade)
    ? selectedGrades.value.filter((item) => item !== grade)
    : [...selectedGrades.value, grade]
}

function toggleNotificationPreference(key) {
  if (!isEditing.value) return
  notificationPrefs.value = {
    ...notificationPrefs.value,
    [key]: !notificationPrefs.value[key],
  }
}

function getClassBadge(item, index) {
  const match = item.name?.match(/[A-Za-z]\d+/)
  return match?.[0] || `C${index + 1}`
}

function formatDateTime(value) {
  if (!value) return '暂无时间信息'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '暂无时间信息'
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function openClassManagement() {
  router.push('/classmanagement')
}

async function confirmDeleteClass(item, evt) {
  // prevent row click
  if (evt && evt.stopPropagation) evt.stopPropagation()
  const ok = window.confirm(`确定要解散班级 “${item.name}” 吗？此操作不可撤销。`)
  if (!ok) return
  try {
    await deleteClass(item.id)
    setFeedback('success', '班级已解散')
    // refresh list
    await fetchClassesForTeacher()
  } catch (error) {
    setFeedback('error', error.message || '解散班级失败')
  }
}

function handleCancel() {
  syncFromUser(user.value)
  isEditing.value = false
  setFeedback('info', '已撤销未保存的修改')
}

async function saveProfile() {
  loading.value.saving = true
  try {
    const payload = {
      name: form.value.name.trim(),
      signature: form.value.signature.trim() || null,
      school: form.value.school.trim() || null,
      avatar_url: form.value.avatar_url || null,
      grade: selectedGrades.value.join('、') || null,
    }

    const updated = await updateMe(payload)
    user.value = updated
    saveUser(updated)
    window.dispatchEvent(new CustomEvent('user:updated', { detail: updated }))
    savePreferences(updated.id)
    syncFromUser(updated)
    isEditing.value = false
    setFeedback('success', '个人资料已保存')
  } catch (error) {
    setFeedback('error', error.message || '保存失败，请稍后重试')
  } finally {
    loading.value.saving = false
  }
}

async function fetchNotifications() {
  if (!user.value?.id) return
  loading.value.notifications = true
  try {
    const data = await listNotifications({ userId: user.value.id })
    notifications.value = data.items || []
  } catch {
    notifications.value = []
  } finally {
    loading.value.notifications = false
  }
}

async function handleNotificationClick(item) {
  if (item.read_at) return
  try {
    const updated = await markNotificationAsRead(item.id)
    notifications.value = notifications.value.map((current) =>
      current.id === updated.id ? updated : current,
    )
  } catch (error) {
    setFeedback('error', error.message || '更新通知状态失败')
  }
}

async function fetchClassesForTeacher() {
  if (!user.value?.id) return
  try {
    const data = await listClasses({ teacherId: user.value.id })
    classes.value = data.items || []
  } catch {
    classes.value = []
  }
}

function handleLogout() {
  clearUser()
  sessionStorage.clear()
  router.push('/loginregistrationupdatedowl')
}

onMounted(async () => {
  loading.value.page = true
  try {
    const data = await getMe()
    user.value = data
    saveUser(data)
  } catch {
    // Keep local cached user when API fails.
  } finally {
    syncFromUser(user.value)
    await Promise.all([fetchClassesForTeacher(), fetchNotifications()])
    loading.value.page = false
  }
})
</script>

<style scoped>
.bg-blobs {
  background-image:
    radial-gradient(circle at 10% 20%, rgba(64, 206, 243, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(139, 254, 50, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(254, 157, 0, 0.05) 0%, transparent 50%);
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(24px);
  opacity: 0;
}
</style>
