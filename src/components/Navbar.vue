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
      <div class="desktop px-5 md:col-3 md:flex justify-content-end flex-wrap">
          <Button
          v-if="!userLogin"
          :loading="loading"
          label="Login"
          outlined
          rounded
          @click="openLogin"
        />
      </div>

      <p class="font-semibold col-offset-5" v-if="userLogin">
        {{ userLogin.name }}
      </p>

      <!-- Mobile Hamburger -->
      <Button
        icon="pi pi-bars"
        class="mobile menu-btn col-offset-5"
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
  </header>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import { onMounted, ref, computed } from 'vue'
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
const showExpiredToken = ref(true)
const loading = ref(true)

onMounted(async() => {
  console.log(store.getters.user)
  console.log(userLogin)
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
    showExpiredToken.value = false
    loading.value = false
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
    showExpiredToken.value = true
    loading.value = false
  }
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
