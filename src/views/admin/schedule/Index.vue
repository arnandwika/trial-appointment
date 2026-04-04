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
      <Column field="show_datetime_schedule" header="Date & Time" :headerStyle="{ justifyContent: 'center' }" />
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
              icon="pi pi-copy"
              text
              @click="openCopyModal(slotProps.data)"
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
    <Dialog
      v-model:visible="copyDialog"
      header="Copy Schedule"
      modal
      :style="{ width: '40rem' }"
      :breakpoints="{
        '1024px': '50vw',
        '768px': '70vw',
        '640px': '90vw'
      }"
      :contentStyle="{ maxHeight: '70vh', overflow: 'auto' }"
    >
      <div class="flex flex-column gap-3">
        <div>
          <label>Class</label>
          <InputText
            :value="copySource?.course_class.name"
            disabled
            class="w-full"
          />
        </div>

        <div>
          <label>Trainer</label>
          <InputText
            :value="copySource?.trainer.name"
            disabled
            class="w-full"
          />
        </div>

        <div>
          <label>Existing Dates</label>

          <ul class="p-3">
            <li
              v-for="date in filteredScheduleDates"
              :key="date"
            >
              {{ formatDate(date) }}
            </li>
          </ul>
        </div>

        <div>
          <label>New Hour</label>

          <Calendar
            v-model="newHour"
            timeOnly
            hourFormat="24"
            class="w-full"
          />
        </div>

      </div>

      <template #footer>
        <Button
          label="Cancel"
          class="p-button-text"
          @click="copyDialog=false"
        />

        <Button
          label="Create"
          icon="pi pi-check"
          @click="submitCopy"
        />

      </template>
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
import Calendar from 'primevue/calendar'
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

const copyDialog = ref(false)
const copySource = ref(null)
const filteredScheduleDates = ref([])
const newHour = ref(null)

const formatDate = (date) => {
  return dayjs(date).format('DD-MM-YYYY')
}

const openCopyModal = (row) => {

  copySource.value = row

  filteredScheduleDates.value = [
    ...new Set(
      schedules.value
        .filter(s =>
          s.class_id === row.class_id &&
          s.trainer_id === row.trainer_id
        )
        .map(s => dayjs(s.datetime_schedule).format('YYYY-MM-DD'))
    )
  ]
  console.log(filteredScheduleDates)

  copyDialog.value = true
}

const generateDatetimeSchedule = () => {

  if (!newHour.value) return []

  const hour = dayjs(newHour.value).hour()
  const minute = dayjs(newHour.value).minute()

  return filteredScheduleDates.value.map(date => {

    return dayjs(date)
      .hour(hour)
      .minute(minute)
      .second(0)
      .format('YYYY-MM-DD HH:mm:ss')

  })

}

const submitCopy = async () => {
  buttonIsLoading.value = true
  const datetimeSchedule = generateDatetimeSchedule()

  try {

    const formData = {
      class_id: copySource.value.class_id,
      trainer_id: copySource.value.trainer_id,
      datetime_schedule: datetimeSchedule
    }

    await axios.post(
      process.env.VUE_APP_APPOINTMENT_API + 'schedule',
      formData
    )

    copyDialog.value = false

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Schedule copied successfully',
      life: 4000
    })

    await fetchSchedules()

  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to copy schedule',
      life: 4000
    })
    console.error(err)
  }
  buttonIsLoading.value = false
}

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
      element.show_datetime_schedule = dayjs(element.datetime_schedule).format('DD-MM-YYYY HH:mm')
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
