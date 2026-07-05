<template>
  <div class="bg-surface font-body text-on-surface flex min-h-screen overflow-hidden">
    <StudentSidebar v-if="currentUser?.role === 'student'" />
    <TeacherSidebar v-else />
    <StudentTopNavbar v-if="currentUser?.role === 'student'" />
    <TeacherTopNavbar v-else profile-route="/teacherprofile" />

    <main class="flex-1 flex flex-col md:flex-row h-full overflow-hidden lg:ml-72 pt-24 md:pt-28">
      <!-- Loading -->
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-32 gap-6">
        <span class="material-symbols-outlined text-6xl text-primary animate-pulse" data-icon="chat">chat</span>
        <p class="text-lg text-on-surface-variant font-medium">加载中...</p>
      </div>

      <template v-else>
        <!-- Conversations List (Left Panel) -->
        <section class="w-full md:w-80 bg-surface-container-low border-r border-outline-variant/10 flex flex-col h-full overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h1 class="font-headline font-extrabold text-2xl tracking-tight text-on-surface">私信</h1>
              <span class="text-xs text-on-surface-variant font-medium">{{ conversations.length }} 个会话</span>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 space-y-1 pb-10">
            <!-- Empty conversations -->
            <div v-if="conversations.length === 0 && !newConversationUser" class="flex flex-col items-center justify-center py-16 gap-3 text-on-surface-variant">
              <span class="material-symbols-outlined text-4xl" data-icon="forum">forum</span>
              <p class="text-sm font-medium">暂无消息</p>
              <p class="text-xs">点击学生列表的"私信"按钮开始对话</p>
            </div>

            <!-- New conversation (not yet in conversations list) -->
            <div
              v-if="newConversationUser"
              class="p-4 rounded-lg flex items-center gap-4 cursor-pointer border-l-4 border-primary bg-surface-container-lowest"
              @click="selectConversation(newConversationUser)"
            >
              <div class="relative">
                <img :src="avatarSrc(newConversationUser)" class="w-14 h-14 rounded-2xl object-cover" alt="" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="font-headline font-bold text-on-surface truncate">{{ newConversationUser.name }}</h3>
                </div>
                <p class="text-sm text-on-surface-variant truncate">点击开始对话</p>
              </div>
            </div>

            <!-- Conversation list items -->
            <div
              v-for="conv in conversations"
              :key="conv.other_user_id"
              class="p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-colors"
              :class="selectedUserId === conv.other_user_id ? 'bg-surface-container-lowest border-l-4 border-primary' : 'hover:bg-surface-container-highest border-l-4 border-transparent'"
              @click="selectConversation(conv)"
            >
              <div class="relative">
                <img :src="avatarSrc(conv)" class="w-14 h-14 rounded-2xl object-cover" alt="" />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  :class="conv.role === 'teacher' ? 'bg-secondary' : 'bg-primary'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="font-headline font-bold text-sm text-on-surface truncate">{{ conv.name }}</h3>
                  <span class="text-[10px] text-on-surface-variant font-medium whitespace-nowrap ml-2">{{ formatTime(conv.last_message_at) }}</span>
                </div>
                <p class="text-xs text-on-surface-variant truncate">{{ conv.last_message }}</p>
              </div>
              <div v-if="conv.unread_count > 0" class="w-5 h-5 bg-tertiary-container text-[10px] font-bold text-white flex items-center justify-center rounded-full shrink-0">
                {{ conv.unread_count > 99 ? '99+' : conv.unread_count }}
              </div>
            </div>
          </div>
        </section>

        <!-- Conversation View (Right Panel) -->
        <section class="flex-1 flex flex-col h-full bg-surface">
          <!-- No conversation selected -->
          <div v-if="!selectedUserId" class="flex-1 flex flex-col items-center justify-center text-on-surface-variant gap-4">
            <span class="material-symbols-outlined text-6xl" data-icon="chat_bubble_outline">chat_bubble_outline</span>
            <p class="text-lg font-medium">选择一个对话</p>
            <p class="text-sm">从左侧列表选择或点击学生头像发起私信</p>
          </div>

          <template v-else>
            <!-- Conversation Header -->
            <header class="h-20 px-6 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-30 shadow-sm">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm shrink-0">
                  <img :src="avatarSrc(otherUserInfo)" class="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h2 class="font-headline font-bold text-lg text-on-surface">{{ otherUserInfo?.name || '用户' }}</h2>
                  <p class="text-xs text-on-surface-variant">{{ otherUserInfo?.role === 'teacher' ? '教师' : '学生' }}</p>
                </div>
              </div>
            </header>

            <!-- Messages Area -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-6 bg-surface/50">
              <div v-if="messages.length === 0" class="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
                <span class="material-symbols-outlined text-4xl" data-icon="sms">sms</span>
                <p class="text-sm">发送第一条消息开始对话</p>
              </div>

              <template v-for="(msg, idx) in messages" :key="msg.id">
                <!-- Date divider -->
                <div v-if="showDateDivider(idx)" class="flex justify-center">
                  <span class="text-xs font-medium text-on-surface-variant/60 bg-surface-container-high px-4 py-1 rounded-full">
                    {{ formatDate(msg.created_at) }}
                  </span>
                </div>

                <!-- Message bubble -->
                <div class="flex items-end gap-3 max-w-[80%]" :class="msg.sender_id === currentUser?.id ? 'flex-row-reverse ml-auto' : ''">
                  <img
                    v-if="msg.sender_id !== currentUser?.id"
                    :src="avatarSrc({ avatar_url: msg.sender_avatar, name: msg.sender_name })"
                    class="w-8 h-8 rounded-xl shrink-0 object-cover"
                    alt=""
                  />
                  <div class="flex flex-col" :class="msg.sender_id === currentUser?.id ? 'items-end' : ''">
                    <div
                      class="p-4 rounded-2xl"
                      :class="msg.sender_id === currentUser?.id
                        ? 'bg-secondary-container/30 backdrop-blur-sm border border-secondary/10 rounded-br-md'
                        : 'bg-white rounded-bl-md soft-glow'"
                    >
                      <p class="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
                    </div>
                    <span class="text-[10px] text-on-surface-variant mt-1" :class="msg.sender_id === currentUser?.id ? 'mr-1' : 'ml-1'">
                      {{ formatTime(msg.created_at) }}
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <!-- Message Input -->
            <footer class="p-4 bg-white/60 backdrop-blur-xl border-t border-outline-variant/10">
              <form @submit.prevent="sendMsg" class="max-w-4xl mx-auto bg-surface-container-lowest rounded-[2.5rem] p-2 flex items-center gap-2 shadow-2xl shadow-slate-200/50">
                <input
                  v-model="messageText"
                  class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 placeholder:text-on-surface-variant/40 font-medium text-sm"
                  placeholder="输入消息内容..."
                  type="text"
                  ref="messageInput"
                />
                <button
                  type="submit"
                  :disabled="!messageText.trim() || sending"
                  class="bg-primary hover:bg-primary-dim w-12 h-12 rounded-full flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 hover:scale-105 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">send</span>
                </button>
              </form>
            </footer>
          </template>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import StudentTopNavbar from '@/components/layout/StudentTopNavbar.vue'
import TeacherTopNavbar from '@/components/layout/TeacherTopNavbar.vue'
import StudentSidebar from '@/components/layout/StudentSidebar.vue'
import TeacherSidebar from '@/components/layout/TeacherSidebar.vue'
import { getConversations, getConversation, sendMessage } from '@/services/questionService.js'
import { getStoredUser } from '@/services/userService.js'
import { getUserById } from '@/services/questionService.js'
import { markMessagesRead } from '@/services/questionService.js'
import { API_BASE } from '@/services/api.js'

const route = useRoute()
const currentUser = getStoredUser()

const loading = ref(true)
const conversations = ref([])
const selectedUserId = ref(null)
const messages = ref([])
const otherUserInfo = ref(null)
const messageText = ref('')
const sending = ref(false)
const newConversationUser = ref(null)

const messagesContainer = ref(null)
const messageInput = ref(null)

function resolveAvatarUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${API_BASE.replace(/\/api\/?$/, '')}${url}`
  return url
}

function avatarSrc(item) {
  if (!item) return ''
  if (item.avatar_url) return resolveAvatarUrl(item.avatar_url)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || item.student_name || '?')}&background=0891b2&color=fff&bold=true`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const days = Math.floor(diff / 86400000)
  if (days === 0) return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return d.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return '今天'
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return '昨天'
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', year: 'numeric' })
}

function showDateDivider(idx) {
  if (idx === 0) return true
  const prev = new Date(messages.value[idx - 1].created_at)
  const curr = new Date(messages.value[idx].created_at)
  return prev.toDateString() !== curr.toDateString()
}

async function selectConversation(conv) {
  const userId = conv.other_user_id || conv.id
  selectedUserId.value = userId
  otherUserInfo.value = {
    id: userId,
    name: conv.name,
    avatar_url: conv.avatar_url,
    role: conv.role,
  }
  await loadMessages(userId)
  // Mark messages from this user as read
  markMessagesRead(userId).catch(() => {})
  // Notify the sidebar to refresh unread count
  window.dispatchEvent(new CustomEvent('messages-read'))
  // Update local unread count
  const convItem = conversations.value.find(c => c.other_user_id === userId)
  if (convItem) convItem.unread_count = 0
}

async function loadMessages(userId) {
  try {
    const data = await getConversation(userId)
    messages.value = data.messages || []
    // Cache other user info from response
    if (data.otherUser) {
      otherUserInfo.value = data.otherUser
    }
    await nextTick()
    scrollToBottom()
    // Focus input
    messageInput.value?.focus()
  } catch {
    messages.value = []
  }
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

async function sendMsg() {
  const text = messageText.value.trim()
  if (!text || !selectedUserId.value || sending.value) return
  sending.value = true
  try {
    const msg = await sendMessage(selectedUserId.value, text)
    messages.value.push(msg)
    messageText.value = ''
    await nextTick()
    scrollToBottom()

    // Update conversations list — add to top or update last_message
    const existing = conversations.value.find(c => c.other_user_id === selectedUserId.value)
    if (existing) {
      existing.last_message = msg.content
      existing.last_message_at = msg.created_at
      // Move to top
      const idx = conversations.value.indexOf(existing)
      conversations.value.splice(idx, 1)
      conversations.value.unshift(existing)
    } else {
      // Reload conversations to get the new entry
      const convs = await getConversations()
      conversations.value = convs.items || []
    }
  } catch (e) {
    alert('发送失败，请重试')
  } finally {
    sending.value = false
  }
}

async function fetchData() {
  loading.value = true
  try {
    const [convs] = await Promise.all([
      getConversations(),
    ])
    conversations.value = convs.items || []

    // Check if ?userId=X query param exists
    const targetUserId = route.query.userId
    if (targetUserId) {
      // Look for existing conversation or fetch user info
      const existing = conversations.value.find(c => c.other_user_id === targetUserId)
      if (existing) {
        await selectConversation(existing)
      } else {
        // New conversation — fetch user info
        try {
          const userData = await getUserById(targetUserId)
          newConversationUser.value = { id: targetUserId, name: userData.name, avatar_url: userData.avatar_url, role: userData.role }
          await selectConversation(newConversationUser.value)
        } catch {
          // User not found
        }
      }
    } else if (conversations.value.length > 0) {
      // Auto-select first conversation
      await selectConversation(conversations.value[0])
    }
  } catch {
    // silently fail
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
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
</style>
