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

        <div class="flex flex-column gap-2">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="sidebar-link"
            :class="{ active: $route.name === item.name }"
          >
            <i :class="item.icon" class="mr-2"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </aside>

      <!-- Mobile Drawer -->
      <Sidebar v-model:visible="sidebarVisible" class="md:hidden">
        <h3 class="mb-4">Admin Panel</h3>

        <div class="flex flex-column gap-2">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="sidebar-link"
            :class="{ active: $route.name === item.name }"
            @click="sidebarVisible = false"
          >
            <i :class="item.icon" class="mr-2"></i>
            <span>{{ item.label }}</span>
          </router-link>
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
  const menuItems = [
  { name: 'AdminDashboard', label: 'Dashboard', to: { name: 'AdminDashboard' }, icon: 'pi pi-home' },
  { name: 'UserList', label: 'User Management', to: { name: 'UserList' }, icon: 'pi pi-users' },
  { name: 'CourseList', label: 'Course Classes', to: { name: 'CourseList' }, icon: 'pi pi-book' },
  { name: 'ScheduleList', label: 'Schedules', to: { name: 'ScheduleList' }, icon: 'pi pi-calendar' },
  { name: 'PackageList', label: 'Packages', to: { name: 'PackageList' }, icon: 'pi pi-box' },
  { name: 'TrainerList', label: 'Trainer', to: { name: 'TrainerList' }, icon: 'pi pi-user' },
  { name: 'ListOrder', label: 'List Order', to: { name: 'ListOrder' }, icon: 'pi pi-check-circle' }
]
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

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar-link:hover {
  background-color: #f3f4f6;
  transform: translateX(4px);
  color: #111827;
}

.sidebar-link.active {
  background-color: #e0e7ff;
  color: #4338ca;
  font-weight: 600;
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
