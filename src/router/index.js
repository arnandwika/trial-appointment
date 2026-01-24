import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Packages from '@/views/Packages.vue'
import Classes from '@/views/Classes.vue'
import Timetable from '@/views/Timetable.vue'

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
    path: '/classes',
    name: 'classes',
    component: Classes
  },
  {
    path: '/timetable',
    name: 'timetable',
    component: Timetable
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
