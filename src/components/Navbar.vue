<template>
  <header class="navbar">
    <div class="navbar-container container grid">
      <!-- Logo -->
      <div class="logo md:col-3 text-left">
        <img @click="routing('/')" src="@/assets/identity_logo/full_logo.png" class="w-10rem md:w-13rem lg:w-15rem h-auto clickable-text" alt="Morgen Pilates" />
      </div>

      <!-- Desktop Menu -->
      <nav class="nav-links desktop md:col-6 md:flex justify-content-center flex-wrap">
        <router-link class="font-semibold" v-if="userLogin ? userLogin.role == 'admin' ? true : false : false" to="/admin">Admin</router-link>
        <router-link class="font-semibold" v-if="userLogin ? userLogin.role == 'member' ? true : false : true" to="/">Home</router-link>
        <router-link class="font-semibold" to="/course-classes">Course Classes</router-link>
        <router-link class="font-semibold" to="/schedule">Schedule</router-link>
        <router-link class="font-semibold" to="/packages">Packages</router-link>
      </nav>

      <!-- Desktop CTA -->
      <div v-if="!userLogin" class="desktop px-5 md:col-3 md:flex justify-content-end flex-wrap">
          <Button
          v-if="!userLogin"
          :loading="loading"
          label="Login"
          outlined
          rounded
          @click="openLogin"
        />
      </div>

      <p
        class="font-semibold col-offset-2 md:col-offset-0 col-3 md:flex justify-content-end flex-wrap"
        v-if="userLogin"
      >
        <span class="clickable-text" @click="toggle($event)">{{ userLogin.name }}<i class="px-1 pi pi-caret-down text-sm"></i></span>
      </p>

      <!-- Mobile Hamburger -->
      <Button
        icon="pi pi-bars"
        :class="userLogin ? 'menu-btn mobile md:hidden' : 'mobile menu-btn col-offset-5'"
        text
        @click.stop="mobileOpen = !mobileOpen"
      />
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="mobileOpen" ref="mobileMenu" class="mobile-menu">
        <router-link class="font-semibold" v-if="userLogin ? userLogin.role == 'admin' ? true : false : false" to="/admin">Admin</router-link>
        <router-link class="font-semibold" v-if="userLogin ? userLogin.role == 'member' ? true : false : true" to="/">Home</router-link>
        <router-link class="font-semibold" to="/course-classes" @click="closeMenu">Course Classes</router-link>
        <router-link class="font-semibold" to="/schedule" @click="closeMenu">Schedule</router-link>
        <router-link class="font-semibold" to="/packages" @click="closeMenu">Packages</router-link>

        <Button
          v-if="!userLogin"
          :loading="loading"
          label="Login"
          class="px-5"
          outlined
          rounded
          @click="openLogin"
        />
      </div>
    </transition>
    <!-- <Dialog
      v-model:visible="visible"
      modal
      :position="isMobile ? 'bottom' : 'center'"
      :style="dialogStyle"
      :breakpoints="{
        '1024px': '70vw',
        '768px': '90vw'
      }"
      header="Order Details"
      dismissableMask
    >
      <Button
        :loading="loading"
        label="Log Out"
        aria-expanded="true"
        severity="danger"
        class="mb-4"
        @click="logout()" />
      <div
        v-for="order in orders"
        :key="order.id"
        class="p-2">

        <div class="mb-3">
          <div class="font-semibold text-lg">
            {{ order.order_no }}
          </div>
          <div class="text-sm text-600">
            {{ order.user_name }}
          </div>
        </div>

        <Divider />


        <div
          v-for="detail in order.order_details"
          :key="detail.id"
          class="py-3 border-bottom-1 surface-border"
        >
          <div class="font-medium">
            {{ detail.package_name }}
          </div>

          <div class="text-sm text-600 mb-2">
            {{ detail.class_name }}
          </div>

          <div class="flex justify-content-between text-sm">
            <span>Total</span>
            <span>{{ detail.total_quota }}</span>
          </div>

          <div class="flex justify-content-between text-sm">
            <span>Used</span>
            <span>{{ detail.used_quota }}</span>
          </div>

          <div class="flex justify-content-between text-sm font-semibold">
            <span>Remaining</span>
            <span>{{ detail.remaining_quota }}</span>
          </div>
        </div>
      </div>
    </Dialog> -->
    <Menu
      ref="menu"
      :model="items"
      :popup="true"
    />
    <Dialog
      v-model:visible="showOwnSchedule"
      modal
      dismissableMask
      header="Class Schedule"
      :style="{ width: '800px' }"
      :breakpoints="{
        '960px': '75vw',
        '640px': '95vw'
      }"
    >
      <div v-if="ownSchedule.length === 0" class="text-center p-4">
        No schedules yet
      </div>

      <div v-else>
        <DataTable
          :value="ownSchedule"
          :loading="loading"
          paginator
          :rows="5"
          responsiveLayout="scroll"
          class="shadow-1"
        >
          <Column field="schedule.datetime_schedule" header="Date Time"/>
          <Column field="schedule.course_class.name" header="Class Name"/>
          <Column field="schedule.trainer.name" header="Trainer"/>
        </DataTable>
      </div>
    </Dialog>
  </header>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()

const toast = useToast()
const store = useStore()
const { openModal } = useLoginModal()

const mobileOpen = ref(false)
const userLogin = computed(() => store.getters.user)
const loading = ref(true)
const isMobile = ref(false)
const mobileMenu = ref(null)
const menu = ref()
const showOwnSchedule = ref(false)
const ownSchedule = ref([])

const toggle = (event) => {
  menu.value.toggle(event)
}

const getOwnSchedule = async () => {
  loading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'booking/mine', {
      params: {
        user_id: userLogin.value.id
      },
    })
    res.data.data.forEach(element => {
      element.schedule.datetime_schedule = dayjs(element.schedule.datetime_schedule).format('DD-MM-YYYY HH:MM')
    })
    ownSchedule.value = res.data.data
  } finally {
    loading.value = false
    showOwnSchedule.value = true
  }
}

const handleClickOutside = (event) => {
  if (
    mobileOpen.value &&
    mobileMenu.value &&
    !mobileMenu.value.contains(event.target)
  ) {
    closeMenu()
  }
}

const logout = () => {
  store.dispatch('logout')
  localStorage.removeItem('token')
  window.location.reload()
}

const items = ref([
  {
    label: 'Account',
    items: [
      {
        label: 'My Order',
        icon: 'pi pi-receipt',
        command: () => router.push('/my-order')
      },
      {
        label: 'My Class Schedule',
        icon: 'pi pi-book',
        command: () => getOwnSchedule()
      },
      {
        label: 'Change Password',
        icon: 'pi pi-lock',
        command: () => router.push('/change-password')
      }
    ]
  },
  {
    label: 'System',
    items: [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: logout
      }
    ]
  }
])

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(async() => {
  checkScreen()
  document.addEventListener("click", handleClickOutside)
  window.addEventListener('resize', checkScreen)
  try {
    const res = await axios.get(
      process.env.VUE_APP_APPOINTMENT_API + 'user',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      },
    )

    store.dispatch('login', res.data)
    loading.value = false
  } catch (error) {
    if (localStorage.token) {
      toast.add({
        severity: 'error',
        summary: 'Token Habis',
        detail: 'Silakan login kembali',
        life: 4000
      })
    }
    localStorage.removeItem('token')
    store.dispatch('logout')
    loading.value = false
  }

  try {
    const res2 = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/my-transaction/' + store.getters.user.id)
    store.dispatch('storeUserTransaction', res2.data.data)
  } catch (error) {
    console.log(error)
  }
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
  window.removeEventListener('resize', checkScreen)
})

// const toggleMenu = () => {
//   mobileOpen.value = !mobileOpen.value
// }

const closeMenu = () => {
  mobileOpen.value = false
}

const openLogin = () => {
  openModal()
}

const routing = (routeTo) => {
  router.push(routeTo)
}

// const dialogStyle = computed(() => {
//   return isMobile.value
//     ? { height: '85vh', width: '100vw', borderRadius: '1rem 1rem 0 0' }
//     : { width: '600px' }
// })

</script>

<style lang="scss" scoped>

.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: $bg-primary;
  border-bottom: 1px solid rgba(0,0,0,.05);
}

.navbar-container {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
}

/* Logo */
.logo {
  font-weight: 600;
  letter-spacing: 2px;
}

/* Links */
.nav-links {
  display: flex;
  gap: 2rem;

  a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
  }
}

/* Desktop / Mobile visibility */
.desktop {
  display: flex;
}

.mobile {
  display: none;
}

/* Mobile menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.25rem;
  background: $bg-primary;

  a {
    font-size: 1.1rem;
    text-decoration: none;
    color: #333;
  }
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: transform .25s ease, opacity .25s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* 🔑 Responsive Breakpoint */
@media (max-width: 768px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: inline-flex;
  }
}
</style>
