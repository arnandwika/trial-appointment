<template>
  <div>
    <!-- PAGE TITLE -->
    <div class="mb-5">
      <h2 class="text-2xl font-semibold">Admin Dashboard</h2>
      <p class="text-600">Overview of your studio performance</p>
    </div>

    <!-- SUMMARY CARDS -->
    <div class="grid mb-5">
      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Total Courses</div>
          <div class="text-3xl font-bold">{{ stats.totalCourses }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Total Schedules</div>
          <div class="text-3xl font-bold">{{ stats.totalSchedules }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Total Packages</div>
          <div class="text-3xl font-bold">{{ stats.totalPackages }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Active Orders</div>
          <div class="text-3xl font-bold text-primary">
            {{ stats.activeOrders }}
          </div>
        </div>
      </div>
    </div>

    <!-- TABLE SECTION -->
    <div class="grid">

      <!-- UPCOMING CLASSES -->
      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="text-lg font-semibold">Upcoming Classes</h3>
          </div>

          <DataTable
            :value="upcomingClasses"
            responsiveLayout="scroll"
            :rows="5"
          >
            <Column field="name" header="Class" />
            <Column field="instructor" header="Instructor" />
            <Column field="time" header="Time" />
            <Column field="remaining" header="Remaining Slots" />
          </DataTable>
        </div>
      </div>

      <!-- RECENT ORDERS -->
      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="text-lg font-semibold">Recent Orders</h3>
          </div>

          <DataTable
            :value="recentOrders"
            responsiveLayout="scroll"
            :rows="5"
          >
            <Column field="order_no" header="Order No" />
            <Column field="user" header="User" />
            <Column field="package" header="Package" />
            <Column field="status" header="Status" />
          </DataTable>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const router = useRouter()
const toast = useToast()
const store = useStore()

const stats = ref({
  totalCourses: 12,
  totalSchedules: 45,
  totalPackages: 8,
  activeOrders: 21
})

const upcomingClasses = ref([
  {
    name: 'Morning Pilates',
    instructor: 'Sarah',
    time: '08:00 AM',
    remaining: 4
  },
  {
    name: 'Yoga Flow',
    instructor: 'Daniel',
    time: '10:00 AM',
    remaining: 6
  }
])

const recentOrders = ref([
  {
    order_no: 'ORD-001',
    user: 'John Doe',
    package: '10 Class Package',
    status: 'Active'
  },
  {
    order_no: 'ORD-002',
    user: 'Jane Smith',
    package: 'Unlimited Monthly',
    status: 'Pending'
  }
])

onMounted(async () => {
  try {
    const res = await axios.get(
      process.env.VUE_APP_APPOINTMENT_API + 'user',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      },
    )

    if (res.data.role != 'admin') router.push('/')
    store.dispatch('login', res.data)
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
    router.push('/')
  }
  // TODO: call API here
})
</script>
