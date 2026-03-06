<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Trainer</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <div class="grid formgrid p-fluid">

        <div class="field col-8">
          <label>Name</label>
          <InputText v-model="trainer.name" />
        </div>

        <div class="field col-8">
          <label>Class Name</label>
          <Dropdown
            v-model="trainer.class_id"
            :options="courseClasses"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Course Class"
          />
        </div>

        <div class="field col-8">
          <label>Phone Number</label>
          <InputText v-model="trainer.phone_number" />
        </div>

        <div class="field col-8">
          <label>Email</label>
          <InputText v-model="trainer.email" />
        </div>

        <!-- Description -->
        <div class="field col-8">
          <label>Gender</label>
          <Dropdown
            v-model="trainer.gender"
            :options="genders"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Gender"
          />
        </div>

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
          @click="id ? updateTrainer() : createTrainer()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()

const trainer = ref({
  id: null,
  name: null,
  class_id: null,
  phone_number: null,
  email: null,
  gender: null,
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)
const courseClasses = ref(null)

const genders = ref([
  {
    value: 'male',
    name: 'Male'
  },
  {
    value: 'female',
    name: 'Female'
  }
])

const fetchCourseClasses = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const getTrainer = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'trainer/' + id.value)
    trainer.value = res.data.data
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

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getTrainer()
  } else {
    isLoading.value = false
  }
})

const updateTrainer = async () => {
  console.log('Update:', trainer.value)
  try {
    const formData = {
      name: trainer.value.name,
      class_id: trainer.value.class_id,
      phone_number: trainer.value.phone_number,
      gender: trainer.value.gender,
      email: trainer.value.email,
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'trainer/' + trainer.value.id, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Trainer updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'TrainerList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to update trainer',
      life: 4000
    })
    isLoading.value = false
  }
}

const createTrainer = async () => {
  console.log('Create:', trainer.value)
  try {
    const formData = {
      name: trainer.value.name,
      class_id: trainer.value.class_id,
      phone_number: trainer.value.phone_number,
      gender: trainer.value.gender,
      email: trainer.value.email,
    }

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'trainer', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Trainer created successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'TrainerList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to create trainer',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
