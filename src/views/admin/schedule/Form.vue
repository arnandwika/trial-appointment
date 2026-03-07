<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Schedule</h2>

    <Form @submit="handleSubmit" validate-on-input :initial-values="id ? initialValues : undefined" v-slot="{ values }">
      <div class="surface-card p-4 border-round shadow-2">
        <div class="grid formgrid p-fluid">

          <div class="field col-12 md:col-6">
            <label>Course Class</label>
            <Field name="class_id" rules="required" v-slot="{ field, errors }">
              <Dropdown
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                :options="courseClasses"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Course Class"
              />
              <ErrorMessage name="class_id" class="p-error" />
            </Field>
          </div>

          <div class="field col-12 md:col-6">
            <label>Trainer</label>
            <Field name="trainer_id" rules="required" v-slot="{ field, errors }">
              <Dropdown
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                :options="filteredTrainer(values.class_id)"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Trainer"
              />
              <ErrorMessage name="trainer_id" class="p-error" />
            </Field>
          </div>

          <div class="field col-12 md:col-6 flex flex-column gap-2">
            <label for="schedule_at">Schedule At</label>
            <Field name="datetime_schedule" rules="required" v-slot="{ field, errors }">
              <Calendar
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                showTime
                hourFormat="24"
                dateFormat="dd-mm-yy"
                :selectionMode="id ? 'single' : 'multiple'"
                :minDate="dateNow"
                class="w-full"
              />
              <ErrorMessage name="datetime_schedule" class="p-error" />
            </Field>
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
            type="submit"
          />
        </div>
      </div>
    </Form>
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

const initialValues = ref({
  id: null,
  class_id: null,
  trainer_id: null,
  datetime_schedule: null
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const courseClasses = ref(null)
const trainer = ref([])
const filteredTrainer = (class_id) => {
  console.log(class_id)
  return trainer.value.filter(obj => obj.class_id == class_id)
}

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

const handleSubmit = (values) => {
  if (id.value) {
    updateSchedule(values)
  } else {
    createSchedule(values)
  }
}

const getSchedule = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'schedule/' + id.value)
    res.data.data.class_id = parseInt(res.data.data.class_id)
    res.data.data.trainer_id = parseInt(res.data.data.trainer_id)
    res.data.data.datetime_schedule = new Date(res.data.data.datetime_schedule)
    initialValues.value = res.data.data
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
        summary: 'Token Expired',
        detail: 'Please log in again',
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

const updateSchedule = async (values) => {
  console.log('Update:', values)
  try {
    const formData = {
      class_id: values.class_id,
      trainer_id: values.trainer_id,
      datetime_schedule: dayjs(values.datetime_schedule).format('YYYY-MM-DD HH:mm:ss'),
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'schedule/' + id.value, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Schedule updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'ScheduleList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to update schedule',
      life: 4000
    })
    isLoading.value = false
  }
}

const createSchedule = async (values) => {
  console.log('Create:', values)
  let formattedDate = []
  values.datetime_schedule.forEach(element => {
    formattedDate.push(dayjs(element).format('YYYY-MM-DD HH:mm:ss'))
  })
  try {
    const formData = {
      class_id: values.class_id,
      trainer_id: values.trainer_id,
      datetime_schedule: formattedDate,
    }

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'schedule', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Schedule created successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'ScheduleList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to create schedule',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
