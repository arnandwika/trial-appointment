<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Schedule</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <div class="grid formgrid p-fluid">

        <div class="field col-12 md:col-6">
          <label>Course Class</label>
          <Dropdown
            v-model="schedule.class_id"
            :options="courseClasses"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Course Class"
          />
        </div>

        <div class="field col-12 md:col-6">
          <label>Trainer</label>
          <Dropdown
            v-model="schedule.trainer_id"
            :options="trainer"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Trainer"
          />
        </div>

        <div class="field col-12 md:col-6 flex flex-column gap-2">
          <label for="schedule_at">Schedule At</label>
          <Calendar
            v-model="schedule.datetime_schedule"
            showTime
            hourFormat="24"
            dateFormat="dd-mm-yy"
            selectionMode="multiple"
            :minDate="dateNow"
            class="w-full"
          />
        </div>

        <!-- Active -->
        <!-- <div class="field col-12 md:col-6 flex align-items-center">
          <Checkbox v-model="courseClass.is_active" binary />
          <label class="ml-2">Active</label>
        </div> -->

      </div>

      <!-- Actions -->
      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          size="small"
          label="Cancel"
          severity="secondary"
          @click="$router.back()"
        />
        <Button
          :loading="isLoading"
          size="small"
          label="Save"
          icon="pi pi-check"
          @click="id ? updateSchedule() : createSchedule()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Dropdown from 'primevue/dropdown'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import dayjs from 'dayjs'
dayjs.locale('id')

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()
const dateNow = ref(new Date());

const schedule = ref({
  id: null,
  class_id: null,
  trainer_id: null,
  datetime_schedule: null
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const courseClasses = ref(null)
const trainer = ref(null)

const fetchCourseClasses = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const fetchTrainer = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'trainer')
    trainer.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const getSchedule = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'schedule/' + id.value)
    schedule.value = res.data.data
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

  await fetchCourseClasses()
  await fetchTrainer()

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getSchedule()
  } else {
    isLoading.value = false
  }
})

const updateSchedule = async () => {
  console.log('Update:', schedule.value)
  try {
    const formData = {
      id: schedule.value.id,
      class_id: schedule.value.class_id,
      trainer_id: schedule.value.trainer_id,
      datetime_schedule: dayjs(schedule.value.datetime_schedule).format('YYYY-MM-DD HH:mm:ss'),
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'schedule', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil mengubah jadwal',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'ScheduleList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Terjadi kesalahan saat mengubah jadwal',
      life: 4000
    })
    isLoading.value = false
  }
}

const createSchedule = async () => {
  console.log('Create:', schedule.value)
  let formattedDate = []
  schedule.value.datetime_schedule.forEach(element => {
    formattedDate.push(dayjs(element).format('YYYY-MM-DD HH:mm:ss'))
  })
  const formData = {
      class_id: schedule.value.class_id,
      trainer_id: schedule.value.trainer_id,
      datetime_schedule: formattedDate,
    }
  console.log('Create:', JSON.stringify(formData))
  // try {
  //   const formData = {
  //     class_id: schedule.value.class_id,
  //     trainer_id: schedule.value.trainer_id,
  //     datetime_schedule: dayjs(schedule.value.datetime_schedule).format('YYYY-MM-DD HH:mm:ss'),
  //   }

  //   await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'schedule', formData)
  //   toast.add({
  //     severity: 'success',
  //     summary: 'Success',
  //     detail: 'Berhasil membuat jadwal baru',
  //     life: 4000
  //   })
  //   isLoading.value = false
  //   router.push({ name: 'ScheduleList' })
  // } catch (e) {
  //   toast.add({
  //     severity: 'error',
  //     summary: 'Error',
  //     detail: 'Terjadi kesalahan saat menyimpan jadwal',
  //     life: 4000
  //   })
  //   isLoading.value = false
  // }
}
</script>
