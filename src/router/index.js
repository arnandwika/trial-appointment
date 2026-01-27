import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Packages from '@/views/Packages.vue'
import CourseClasses from '@/views/CourseClasses.vue'
import Schedule from '@/views/Schedule.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/packages',
    name: 'packages',
    component: Packages
  },
  {
    path: '/course-classes',
    name: 'course-classes',
    component: CourseClasses
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: Schedule
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
