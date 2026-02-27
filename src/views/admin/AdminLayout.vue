<template>
  <Navbar />
  <div class="admin-layout flex flex-column">

    <section class="flex-1 grid surface-100">
      <!-- Mobile Topbar -->
      <div class="mobile-header md:hidden flex justify-content-between align-items-center p-3 shadow-1">
        <div class="font-semibold">Admin Panel</div>
        <Button icon="pi pi-bars" text @click="sidebarVisible = true" />
      </div>

      <!-- Sidebar Desktop -->
      <aside class="sidebar hidden md:flex">
        <h3 class="mb-4">Admin Panel</h3>

        <router-link to="/admin">Dashboard</router-link>
        <router-link to="/admin/course-classes">Course Classes</router-link>
        <router-link to="/admin/schedules">Schedules</router-link>
        <router-link to="/admin/packages">Packages</router-link>
        <router-link to="/admin/order-approval">Order Approval</router-link>
        <router-link to="/admin/users">User Management</router-link>
      </aside>

      <!-- Mobile Drawer -->
      <Sidebar v-model:visible="sidebarVisible" class="md:hidden">
        <h3 class="mb-4">Admin Panel</h3>

        <div class="flex flex-column gap-3">
          <router-link @click="sidebarVisible=false" to="/admin">Dashboard</router-link>
          <router-link @click="sidebarVisible=false" to="/admin/courses">Courses</router-link>
          <router-link @click="sidebarVisible=false" to="/admin/schedules">Schedules</router-link>
          <router-link @click="sidebarVisible=false" to="/admin/packages">Packages</router-link>
        </div>
      </Sidebar>

      <!-- Content -->
      <main class="content">
        <router-view />
      </main>
    </section>
    <Footer />
  </div>
</template>

<script setup>
  import Navbar from '@/components/Navbar.vue'
  import Footer from '@/components/Footer.vue'
  import { ref } from 'vue'
  import Sidebar from 'primevue/sidebar'
  import Button from 'primevue/button'

  const sidebarVisible = ref(false)
</script>

<style scoped>
.admin-layout {
  min-height: 82.5vh;
}
.sidebar {
  width: 180px;
  padding: 1.5rem;
  background: #f4f4f4;
  flex-direction: column;
  gap: 1rem;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 100%;
}

/* Mobile layout */
@media (max-width: 768px) {
  .admin-wrapper {
    flex-direction: column;
  }

  .content {
    padding: 1rem;
  }
}
</style>
