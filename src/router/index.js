import { createRouter, createWebHistory } from 'vue-router'
// import { useStore } from 'vuex'
// import store from '@/store'
// import { useToast } from 'primevue/usetoast'
// import { computed } from 'vue'
import Home from '@/views/Home.vue'
import Packages from '@/views/Packages.vue'
import CourseClasses from '@/views/CourseClasses.vue'
import Schedule from '@/views/Schedule.vue'
import MyOrder from '@/views/MyOrder.vue'

import AdminDashboard from '@/views/admin/Dashboard.vue'
import AdminLayout from '@/views/admin/AdminLayout.vue'

import ListOrder from '@/views/admin/ListOrder.vue'

import CourseList from '@/views/admin/course_classes/Index.vue'
import CourseForm from '@/views/admin/course_classes/Form.vue'

import ScheduleList from '@/views/admin/schedule/Index.vue'
import ScheduleForm from '@/views/admin/schedule/Form.vue'

import PackageList from '@/views/admin/package/Index.vue'
import PackageForm from '@/views/admin/package/Form.vue'

import UserList from '@/views/admin/user_management/Index.vue'
import UserForm from '@/views/admin/user_management/Form.vue'

// const store = useStore()
// const toast = useToast()

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
  {
    path: '/my-order',
    name: 'my-order',
    component: MyOrder
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      role: 'admin'
    },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'list-order',
        name: 'ListOrder',
        component: ListOrder
      },
      {
        path: 'course-classes',
        name: 'CourseList',
        component: CourseList
      },
      {
        path: 'course-classes/:routingTo/:id?',
        name: 'CourseForm',
        component: CourseForm
      },
      {
        path: 'schedules',
        name: 'ScheduleList',
        component: ScheduleList
      },
      {
        path: 'schedules/:routingTo/:id?',
        name: 'ScheduleForm',
        component: ScheduleForm
      },
      {
        path: 'packages',
        name: 'PackageList',
        component: PackageList
      },
      {
        path: 'packages/:routingTo/:id?',
        name: 'PackageForm',
        component: PackageForm
      },
      {
        path: 'users',
        name: 'UserList',
        component: UserList
      },
      {
        path: 'users/:routingTo/:id?',
        name: 'UserForm',
        component: UserForm
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   const userLogin = computed(() => store.getters.user)

//   if (to.meta.role) {
//     if (userLogin.value) {
//       if (to.meta.role != userLogin.value.role) return next('/')
//     } else {
//       return next('/')
//     }
//   }

//   next()
// })

export default router
