<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Course Class</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <div class="grid formgrid p-fluid">

        <!-- Name -->
        <div class="field col-8">
          <label>Course Name</label>
          <InputText v-model="courseClass.name" />
        </div>

        <!-- Image -->
        <div class="field col-12">
          <label>Image</label>
          <!-- Image Preview -->
          <div
            v-if="courseClass.preview_url"
            class="mb-3 border-round overflow-hidden"
            style="max-width: 300px"
          >
            <img
              :src="courseClass.preview_url"
              class="w-full border-round"
              style="object-fit: cover; max-height: 200px"
            />
          </div>

          <!-- Upload Area -->
          <div class="flex align-items-center gap-3 flex-wrap">
            <FileUpload
              mode="basic"
              accept="image/*"
              :auto="false"
              chooseLabel="Choose Image"
              class="p-button-sm"
              @select="onSelect"
            />

            <Button
              v-if="courseClass.preview_url"
              icon="pi pi-times"
              severity="danger"
              text
              label="Remove"
              @click="removeImage"
            />
          </div>

          <small class="text-500">
            Max size 2MB. JPG, PNG recommended.
          </small>
        </div>

        <!-- Duration -->
        <div class="field col-8">
          <label>Class Capacity</label>
          <InputNumber v-model="courseClass.class_capacity" />
        </div>

        <!-- Description -->
        <div class="field col-12">
          <label>Description</label>
          <Textarea v-model="courseClass.description" rows="3" />
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
          @click="id ? updateCourseClass() : createCourseClass()"
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
// import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()

const courseClass = ref({
  id: null,
  name: null,
  image_file: null,
  image_name: null,
  preview_url: null,
  class_capacity: null,
  description: null,
  is_active: false
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const getCourseClass = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class/' + id.value)
    courseClass.value = res.data.data
    courseClass.value.preview_url = URL.createObjectURL(courseClass.value.image_file)
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

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getCourseClass()
  } else {
    isLoading.value = false
  }
})

const onSelect = (event) => {
  const file = event.files[0]

  if (!file) return

  // Preview
  courseClass.value.preview_url = URL.createObjectURL(file)
  courseClass.value.image_file = file
  courseClass.value.image_name = file.name
}

const removeImage = () => {
  courseClass.value.preview_url = null
  courseClass.value.image_file = null
  courseClass.value.image_name = null
}

const updateCourseClass = async () => {
  console.log('Update:', courseClass.value)
  try {
    const formData = new FormData()

    formData.append('id', courseClass.value.id)
    formData.append('name', courseClass.value.name)
    if (courseClass.value.image_name) formData.append('image_file', courseClass.value.image_file)
    formData.append('description', courseClass.value.description)
    formData.append('class_capacity', courseClass.value.class_capacity)

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'course-class', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil mengubah kelas',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'CourseList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Terjadi kesalahan saat mengubah kelas',
      life: 4000
    })
    isLoading.value = false
  }
}

const createCourseClass = async () => {
  console.log('Create:', courseClass.value)
  try {
    const formData = new FormData()

    formData.append('name', courseClass.value.name)
    formData.append('image_file', courseClass.value.image_file)
    formData.append('description', courseClass.value.description)
    formData.append('class_capacity', courseClass.value.class_capacity)

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'course-class', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Berhasil membuat kelas baru',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'CourseList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Terjadi kesalahan saat menyimpan kelas',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
