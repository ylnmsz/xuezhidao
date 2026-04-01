import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsGrading from '../views/AnalyticsGrading.vue'
import AssignHomework from '../views/AssignHomework.vue'
import ChallengePrep from '../views/ChallengePrep.vue'
import ClassManagement from '../views/ClassManagement.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import HomeworkManagement from '../views/HomeworkManagement.vue'
import ImmersivePractice from '../views/ImmersivePractice.vue'
import LoginRegistrationUpdatedOwl from '../views/LoginRegistrationUpdatedOwl.vue'
import Messages from '../views/Messages.vue'
import QuestionBank from '../views/QuestionBank.vue'
import RegistrationUpdatedImage from '../views/RegistrationUpdatedImage.vue'
import StudentAnalytics from '../views/StudentAnalytics.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import StudentErrorBook from '../views/StudentErrorBook.vue'
import StudentHomeworkList from '../views/StudentHomeworkList.vue'
import StudentProfile from '../views/StudentProfile.vue'
import StudentRankings from '../views/StudentRankings.vue'
import TeacherRankings from '../views/TeacherRankings.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'
import TeacherProfile from '../views/TeacherProfile.vue'
import AiAiAssistant from '../views/AiAiAssistant.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/loginregistrationupdatedowl' },
    { path: '/analyticsgrading', name: 'AnalyticsGrading', component: AnalyticsGrading },
    { path: '/assignhomework', name: 'AssignHomework', component: AssignHomework },
    { path: '/challengeprep', name: 'ChallengePrep', component: ChallengePrep },
    { path: '/classmanagement', name: 'ClassManagement', component: ClassManagement },
    { path: '/forgotpassword', name: 'ForgotPassword', component: ForgotPassword },
    { path: '/homeworkmanagement', name: 'HomeworkManagement', component: HomeworkManagement },
    { path: '/immersivepractice', name: 'ImmersivePractice', component: ImmersivePractice },
    {
      path: '/loginregistrationupdatedowl',
      name: 'LoginRegistrationUpdatedOwl',
      component: LoginRegistrationUpdatedOwl,
    },
    { path: '/messages', name: 'Messages', component: Messages },
    { path: '/questionbank', name: 'QuestionBank', component: QuestionBank },
    {
      path: '/registrationupdatedimage',
      name: 'RegistrationUpdatedImage',
      component: RegistrationUpdatedImage,
    },
    { path: '/studentanalytics', name: 'StudentAnalytics', component: StudentAnalytics },
    { path: '/studentdashboard', name: 'StudentDashboard', component: StudentDashboard },
    { path: '/studenterrorbook', name: 'StudentErrorBook', component: StudentErrorBook },
    { path: '/studenthomeworklist', name: 'StudentHomeworkList', component: StudentHomeworkList },
    { path: '/studentprofile', name: 'StudentProfile', component: StudentProfile },
    { path: '/studentrankings', name: 'StudentRankings', component: StudentRankings },
    { path: '/teacherdashboard', name: 'TeacherDashboard', component: TeacherDashboard },
    { path: '/teacherprofile', name: 'TeacherProfile', component: TeacherProfile },
    { path: '/teacherrankings', name: 'TeacherRankings', component: TeacherRankings },
    { path: '/aiaiassistant', name: 'AiAiAssistant', component: AiAiAssistant },
  ],
})

export default router
