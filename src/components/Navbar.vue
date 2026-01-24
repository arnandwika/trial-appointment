<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <img src="@/assets/full_logo.png" class="w-10rem md:w-13rem lg:w-15rem h-auto" alt="Morgen Pilates" />
      </div>

      <!-- Desktop Menu -->
      <nav class="nav-links desktop">
        <a href="/">Home</a>
        <a href="/classes">Classes</a>
        <a href="/timetable">Timetable</a>
        <router-link to="/packages">Packages</router-link>
      </nav>

      <!-- Desktop CTA -->
      <Button
        v-if="!userLogin"
        label="Login / Sign Up"
        class="desktop"
        outlined
        rounded
        @click="showLogin = true"
      />

      <p v-if="userLogin">
        {{ userLogin.name }}
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
        <a href="/" @click="closeMenu">Home</a>
        <a href="/classes" @click="closeMenu">Classes</a>
        <a href="/timetable" @click="closeMenu">Timetable</a>
        <a href="/packages" @click="closeMenu">Packages</a>

        <Button
          v-if="!userLogin"
          label="Login / Sign Up"
          outlined
          rounded
          @click="showLogin = true"
        />
      </div>
    </transition>
    <Dialog
      v-model:visible="showLogin"
      modal
      dismissableMask
      :showHeader="false"
      :style="{ width: '70vw', maxWidth: '900px' }"
      :breakpoints="{ '960px': '90vw', '640px': '100vw' }"
      contentClass="p-0 overflow-hidden"
    >
      <div class="flex h-full">

        <!-- LEFT IMAGE / BRAND (hidden on mobile) -->
        <div
          class="hidden md:flex w-6 background-color-primary align-items-center justify-content-center"
        >
          <img
            src="@/assets/logo.png"
            alt="Brand"
            class="max-w-2rem"
          />
        </div>

        <!-- RIGHT FORM -->
        <div class="w-full md:w-6 p-5 flex flex-column justify-content-center">
          <h2 class="text-center mb-4">Log in</h2>

          <!-- Tabs -->
          <!-- <div class="flex justify-content-center gap-4 mb-4">
            <span class="font-semibold border-bottom-2 border-primary pb-2">
              Email address
            </span>
          </div> -->

          <!-- Email -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Email address</label>
            <InputText v-model="email" class="w-full" />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Password</label>
            <Password
              v-model="password"
              toggleMask
              :feedback="false"
              class="w-full"
            />
          </div>

          <!-- Reset -->
          <!-- <div class="text-sm mb-4">
            Forgot password or don’t have one?
            <a class="text-primary cursor-pointer">Reset Password</a>
          </div> -->

          <!-- Login Button -->
          <Button
            :loading="loading"
            label="Login"
            class="w-full my-4"
            :disabled="!email || !password"
            @click="login()"
          />

          <!-- Sign up -->
          <div class="text-center text-sm">
            <p v-if="errorMessage" class="text-color-red mt-2">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useAlert } from '@/composables/useAlert'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const store = useStore()
const { error } = useAlert()

const mobileOpen = ref(false)
const showLogin = ref(false)
const userLogin = ref(null)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

onMounted(async() => {
  if (!store.getters.user) {
    try {
      const res = await axios.get(
        process.env.VUE_APP_APPOINTMENT_API + 'user',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.token
          }
        },
      )

      userLogin.value = res.data
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Token Habis',
        detail: 'Silakan login kembali',
        life: 3000
      })
    }
  } else {
    userLogin.value = store.getters.user
  }
})

const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value
}

const closeMenu = () => {
  mobileOpen.value = false
}

const login = async () => {
  loading.value = true

  try {
    const res = await axios.post(
      process.env.VUE_APP_APPOINTMENT_API + 'auth/login',
      {
        email: email.value,
        password: password.value
      },
    )

    // success response
    store.dispatch('login', res.data.data.user)
    localStorage.setItem('token', res.data.data.token)
    showLogin.value = false
    toast.add({
      severity: 'success',
      summary: 'Berhasil Login',
      detail: 'Selamat datang ' + res.data.data.user.name,
      life: 3000
    })
    loading.value = false
    userLogin.value = res.data.data.user
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Login failed'
    error('Gagal Login', errorMessage)
  }
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
  justify-content: space-between;
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
