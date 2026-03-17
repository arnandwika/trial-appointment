<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">Schedule</h2>
        <p class="text-600">Manage your studio classes schedule</p>
      </div>

      <Button
        :loading="buttonIsLoading"
        size="small"
        label="Create Schedule"
        icon="pi pi-plus"
        @click="$router.push({ name: 'ScheduleForm', params: {routingTo: 'create'} })"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="schedules"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      class="shadow-1"
    >
      <Column field="datetime_schedule" header="Date & Time" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="course_class.name" header="Class Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="trainer.name" header="Trainer Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="course_class.class_capacity" header="Class Capacity" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="used_capacity" header="Used Capacity" :headerStyle="{ justifyContent: 'center' }" />

      <Column header="Status" :headerStyle="{ justifyContent: 'center' }">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.is_active ? 'Active' : 'Inactive'"
            :severity="slotProps.data.is_active ? 'success' : 'danger'"
          />
        </template>
      </Column>

      <Column bodyStyle="width: 130px">
        <template #header>
          <div class="text-center w-full">Actions</div>
        </template>
        <template #body="slotProps">
          <div class="flex justify-content-center gap-2">
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-info-circle"
              text
              @click="getDetailSchedule(slotProps.data.id)"
            />
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-pencil"
              text
              @click="editSchedule(slotProps.data.id)"
            />
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-trash"
              text
              severity="danger"
              @click="deleteSchedule(slotProps.data.id)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
    <Dialog
      v-model:visible="showDetail"
      modal
      dismissableMask
      header="Detail Participants"
      :style="{ width: '800px' }"
      :breakpoints="{
        '960px': '75vw',
        '640px': '95vw'
      }"
    >
      <div v-if="detailSchedule.length === 0" class="text-center p-4">
        No participants yet
      </div>

      <div v-else>
        <DataTable
          :value="detailSchedule"
          :loading="isLoading"
          paginator
          :rows="5"
          responsiveLayout="scroll"
          class="shadow-1"
        >
          <Column field="user_management.name" header="Name"/>
          <Column field="user_management.phone_number" header="Phone Number"/>
          <Column field="user_management.email" header="Email"/>
          <Column field="user_management.gender" header="Gender"/>
        </DataTable>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useAlert } from '@/composables/useAlert'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import dayjs from 'dayjs'

const router = useRouter()
const toast = useToast()
const { confirm } = useAlert()
const store = useStore()

const isLoading = ref(true)
const buttonIsLoading = ref(false)
const schedules = ref(null)
const showDetail = ref(false)
const detailSchedule = ref([])

const getDetailSchedule = async (id) => {
  isLoading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'booking/details', {
      params: {
        schedule_id: id
      },
    })
    detailSchedule.value = res.data.data
  } finally {
    isLoading.value = false
    showDetail.value = true
  }
}

const fetchSchedules = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'schedule')
    res.data.data.forEach(element => {
      element.datetime_schedule = dayjs(element.datetime_schedule).format('DD-MM-YYYY HH:mm')
    })
    schedules.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const editSchedule = (id) => {
  router.push({ name: 'ScheduleForm', params: { routingTo: "update", id: id } })
}

const deleteSchedule = async (id) => {
  confirm('Delete', 'Are you sure you want to deactivate it?').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'schedule/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Schedule deactivated successfully',
          life: 4000
        })
        await fetchSchedules()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Failed to deactivate schedule',
          life: 4000
        })
      }
      buttonIsLoading.value = false
    }
  })
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
        summary: 'Token Expired',
        detail: 'Please log in again',
        life: 4000
      })
    }
    localStorage.removeItem('token')
    store.dispatch('logout')
    router.push('/')
  }
  await fetchSchedules()
})
</script>
