import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsGrading from '../views/AnalyticsGrading.vue'
import AssignHomework from '../views/AssignHomework.vue'
import ChallengePrep from '../views/ChallengePrep.vue'
import ClassManagement from '../views/ClassManagement.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import HomeworkManagement from '../views/HomeworkManagement.vue'
import ImmersivePractice from '../views/ImmersivePractice.vue'
import PracticeSession from '../views/PracticeSession.vue'
import LoginRegistrationUpdatedOwl from '../views/LoginRegistrationUpdatedOwl.vue'
import Messages from '../views/Messages.vue'
import QuestionBank from '../views/QuestionBank.vue'
import RegistrationUpdatedImage from '../views/RegistrationUpdatedImage.vue'
import StudentAnalytics from '../views/StudentAnalytics.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import StudentErrorBook from '../views/StudentErrorBook.vue'
import StudentClasses from '../views/StudentClasses.vue'
import StudentHomeworkList from '../views/StudentHomeworkList.vue'
import StudentProfile from '../views/StudentProfile.vue'
import StudentRankings from '../views/StudentRankings.vue'
import TeacherRankings from '../views/TeacherRankings.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'
import TeacherGrading from '../views/TeacherGrading.vue'
import TeacherProfile from '../views/TeacherProfile.vue'
import AiAiAssistant from '../views/AiAiAssistant.vue'
import { getStoredUser } from '../services/userService.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/loginregistrationupdatedowl' },
    {
      path: '/analyticsgrading',
      name: 'AnalyticsGrading',
      component: AnalyticsGrading,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/assignhomework',
      name: 'AssignHomework',
      component: AssignHomework,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/challengeprep',
      name: 'ChallengePrep',
      component: ChallengePrep,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/classmanagement',
      name: 'ClassManagement',
      component: ClassManagement,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    { path: '/forgotpassword', name: 'ForgotPassword', component: ForgotPassword },
    {
      path: '/homeworkmanagement',
      name: 'HomeworkManagement',
      component: HomeworkManagement,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/immersivepractice',
      name: 'ImmersivePractice',
      component: ImmersivePractice,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/practice-session',
      name: 'PracticeSession',
      component: PracticeSession,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/loginregistrationupdatedowl',
      name: 'LoginRegistrationUpdatedOwl',
      component: LoginRegistrationUpdatedOwl,
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages,
      meta: { requiresAuth: true },
    },
    {
      path: '/questionbank',
      name: 'QuestionBank',
      component: QuestionBank,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/registrationupdatedimage',
      name: 'RegistrationUpdatedImage',
      component: RegistrationUpdatedImage,
    },
    {
      path: '/studentanalytics',
      name: 'StudentAnalytics',
      component: StudentAnalytics,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studentdashboard',
      name: 'StudentDashboard',
      component: StudentDashboard,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studentclasses',
      name: 'StudentClasses',
      component: StudentClasses,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studenterrorbook',
      name: 'StudentErrorBook',
      component: StudentErrorBook,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studenthomeworklist',
      name: 'StudentHomeworkList',
      component: StudentHomeworkList,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studentprofile',
      name: 'StudentProfile',
      component: StudentProfile,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/studentrankings',
      name: 'StudentRankings',
      component: StudentRankings,
      meta: { requiresAuth: true, role: 'student' },
    },
    {
      path: '/teacherdashboard',
      name: 'TeacherDashboard',
      component: TeacherDashboard,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/teachergrading',
      name: 'TeacherGrading',
      component: TeacherGrading,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/teacherprofile',
      name: 'TeacherProfile',
      component: TeacherProfile,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/teacherrankings',
      name: 'TeacherRankings',
      component: TeacherRankings,
      meta: { requiresAuth: true, role: 'teacher' },
    },
    {
      path: '/aiaiassistant',
      name: 'AiAiAssistant',
      component: AiAiAssistant,
      meta: { requiresAuth: true, role: 'student' },
    },
  ],
})

router.beforeEach((to) => {
  const user = getStoredUser()
  const role = user?.role

  if (to.meta?.requiresAuth && !role) {
    return { path: '/loginregistrationupdatedowl' }
  }

  if (to.meta?.role && role && to.meta.role !== role) {
    return { path: role === 'teacher' ? '/teacherdashboard' : '/studentdashboard' }
  }

  if (
    (to.path === '/loginregistrationupdatedowl' || to.path === '/registrationupdatedimage') &&
    role
  ) {
    return { path: role === 'teacher' ? '/teacherdashboard' : '/studentdashboard' }
  }

  return true
})

export default router
