import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Packages from '@/views/Packages.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
