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
          <div class="text-3xl font-bold">{{ totalCourseClass }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Total Schedules</div>
          <div class="text-3xl font-bold">{{ totalSchedule }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Total Packages</div>
          <div class="text-3xl font-bold">{{ totalPackage }}</div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="p-4 border-round surface-card shadow-2">
          <div class="text-500 mb-2">Active Orders</div>
          <div class="text-3xl font-bold text-primary">
            {{ activeOrders }}
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
            :value="upcomingSchedules"
            responsiveLayout="scroll"
            :rows="2"
          >
            <Column field="datetime_schedule" header="Date & Time" />
            <Column field="course_class.name" header="Class Name" />
            <Column field="trainer.name" header="Trainer Name" />
            <Column field="course_class.class_capacity" header="Class Capacity" />
            <Column field="used_capacity" header="Used Capacity" />
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
            :rows="2"
          >
            <Column field="order_no" header="Order Code" />
            <Column field="user_name" header="Member Name" />
            <Column field="total_amount" header="Amount" />
            <Column field="order_date" header="Order Date" />
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

const isLoading = ref(true)

const totalCourseClass = ref(null)
const totalSchedule = ref(null)
const totalPackage = ref(null)
const activeOrders = ref(null)

const upcomingSchedules = ref([])

const recentOrders = ref([])

const fetchDashboard = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'dashboard')
    totalCourseClass.value = res.data.data.total_course_class
    totalPackage.value = res.data.data.total_package
    totalSchedule.value = res.data.data.total_schedule
    activeOrders.value = res.data.data.active_orders
    upcomingSchedules.value = res.data.data.upcoming_schedules
    recentOrders.value = res.data.data.recent_orders
  } finally {
    isLoading.value = false
  }
}

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
  await fetchDashboard()
})
</script>
