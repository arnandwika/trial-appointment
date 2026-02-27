<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Package</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <div class="grid formgrid p-fluid">

        <div class="field col-8">
          <label>Package Title</label>
          <InputText v-model="PACKAGE.title" />
        </div>

        <div class="field col-12 md:col-6">
          <label>Course Class</label>
          <Dropdown
            v-model="PACKAGE.class_id"
            :options="courseClasses"
            optionLabel="name"
            optionValue="id"
            placeholder="Select Course Class"
          />
        </div>

        <div class="field col-8">
          <label>Price</label>
          <InputNumber v-model="PACKAGE.price" />
        </div>

        <div class="field col-8">
          <label>Quota</label>
          <InputNumber v-model="PACKAGE.quota" />
        </div>

        <!-- Description -->
        <div class="field col-12">
          <label>Description</label>
          <Textarea v-model="PACKAGE.description" rows="3" />
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
          @click="id ? updatePackage() : createPackage()"
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
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()

const PACKAGE = ref({
  id: null,
  title: null,
  class_id: null,
  price: null,
  quota: null,
  description: null,
  is_active: false
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const courseClasses = ref(null)

const fetchCourseClasses = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const getPackage = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'package/' + id.value)
    PACKAGE.value = res.data.data
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

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getPackage()
  } else {
    isLoading.value = false
  }
})

const updatePackage = async () => {
  console.log('Update:', PACKAGE.value)
  try {
    const formData = {
      id: PACKAGE.value.id,
      title: PACKAGE.value.title,
      class_id: PACKAGE.value.class_id,
      price: PACKAGE.value.price,
      quota: PACKAGE.value.quota,
      description: PACKAGE.value.description
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'package', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil mengubah paket',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'PackageList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Terjadi kesalahan saat mengubah paket',
      life: 4000
    })
    isLoading.value = false
  }
}

const createPackage = async () => {
  console.log('Create:', PACKAGE.value)
  try {
    const formData = {
      title: PACKAGE.value.title,
      class_id: PACKAGE.value.class_id,
      price: PACKAGE.value.price,
      quota: PACKAGE.value.quota,
      description: PACKAGE.value.description
    }

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'package', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil membuat paket baru',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'PackageList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Terjadi kesalahan saat menyimpan paket',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
