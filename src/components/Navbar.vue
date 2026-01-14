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
        label="Login / Sign Up"
        class="desktop"
        outlined
        rounded
      />

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
          label="Login / Sign Up"
          outlined
          rounded
        />
      </div>
    </transition>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.mobileOpen = !this.mobileOpen
    },
    closeMenu() {
      this.mobileOpen = false
    }
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
