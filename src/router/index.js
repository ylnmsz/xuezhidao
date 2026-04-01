import { createRouter, createWebHistory } from 'vue-router'
import AnalyticsGrading from '../views/AnalyticsGrading.vue'
import AssignHomework from '../views/AssignHomework.vue'
import ClassManagement from '../views/ClassManagement.vue'
import ImmersivePractice from '../views/ImmersivePractice.vue'
import LoginRegistrationUpdatedOwl from '../views/LoginRegistrationUpdatedOwl.vue'
import QuestionBank from '../views/QuestionBank.vue'
import StudentDashboard from '../views/StudentDashboard.vue'
import StudentErrorBook from '../views/StudentErrorBook.vue'
import TeacherDashboard from '../views/TeacherDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/loginregistrationupdatedowl' },
    { path: '/analyticsgrading', name: 'AnalyticsGrading', component: AnalyticsGrading },
    { path: '/assignhomework', name: 'AssignHomework', component: AssignHomework },
    { path: '/classmanagement', name: 'ClassManagement', component: ClassManagement },
    { path: '/immersivepractice', name: 'ImmersivePractice', component: ImmersivePractice },
    { path: '/loginregistrationupdatedowl', name: 'LoginRegistrationUpdatedOwl', component: LoginRegistrationUpdatedOwl },
    { path: '/questionbank', name: 'QuestionBank', component: QuestionBank },
    { path: '/studentdashboard', name: 'StudentDashboard', component: StudentDashboard },
    { path: '/studenterrorbook', name: 'StudentErrorBook', component: StudentErrorBook },
    { path: '/teacherdashboard', name: 'TeacherDashboard', component: TeacherDashboard }
  ]
})

export default router
