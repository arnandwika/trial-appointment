<template>
  <header class="navbar">
    <div class="navbar-container container grid">
      <!-- Logo -->
      <div class="logo md:col-3 text-left">
        <img @click="routing('/')" src="@/assets/identity_logo/full_logo.png" class="w-10rem md:w-13rem lg:w-15rem h-auto" alt="Morgen Pilates" />
      </div>

      <!-- Desktop Menu -->
      <nav class="nav-links desktop md:col-6 md:flex justify-content-center flex-wrap">
        <router-link to="/">Home</router-link>
        <router-link to="/course-classes">Course Classes</router-link>
        <router-link to="/schedule">Schedule</router-link>
        <router-link to="/packages">Packages</router-link>
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
        class="clickable-text font-semibold col-offset-4 md:col-offset-0 md:col-3 md:flex justify-content-end flex-wrap"
        v-if="userLogin"
      >
        <span @click="visible = true">{{ userLogin.name }}</span>
      </p>

      <!-- Mobile Hamburger -->
      <Button
        icon="pi pi-bars"
        class="mobile menu-btn"
        text
        @click="toggleMenu"
      />
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-if="mobileOpen" class="mobile-menu">
        <router-link to="/" @click="closeMenu">Home</router-link>
        <router-link to="/course-classes" @click="closeMenu">Course Classes</router-link>
        <router-link to="/schedule" @click="closeMenu">Schedule</router-link>
        <router-link to="/packages" @click="closeMenu">Packages</router-link>

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
    <Dialog
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
      <div
        v-for="order in orders"
        :key="order.id"
        class="p-2">
        <!-- Order Info -->
        <div class="mb-3">
          <div class="font-semibold text-lg">
            {{ order.order_no }}
          </div>
          <div class="text-sm text-600">
            {{ order.user_name }}
          </div>
        </div>

        <Divider />

        <!-- Package List -->
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
    </Dialog>
  </header>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

const router = useRouter()

const toast = useToast()
const store = useStore()
const { openModal } = useLoginModal()

const mobileOpen = ref(false)
const userLogin = computed(() => store.getters.user)
const visible = ref(false)
const loading = ref(true)
const isMobile = ref(false)
const orders = computed(() => store.getters.userTransaction)

const checkScreen = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(async() => {
  checkScreen()
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

    const res2 = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/my-transaction/' + res.data.id)
    store.dispatch('storeUserTransaction', res2.data.data)
    console.log(store.getters.userTransaction)
  } catch (error) {
    if (localStorage.token) {
      toast.add({
        severity: 'error',
        summary: 'Token Habis',
        detail: 'Silakan login kembali',
        life: 3000
      })
    }
    localStorage.removeItem('token')
    store.dispatch('logout')
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen)
})

const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMenu = () => {
  mobileOpen.value = false
}

const openLogin = () => {
  openModal()
}

const routing = (routeTo) => {
  router.push(routeTo)
}

const dialogStyle = computed(() => {
  return isMobile.value
    ? { height: '85vh', width: '100vw', borderRadius: '1rem 1rem 0 0' }
    : { width: '600px' }
})

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
