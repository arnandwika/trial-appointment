<template>
  <div class="w-full overflow-x-auto">
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">Course Classes</h2>
        <p class="text-600">Manage your studio course classes</p>
      </div>

      <Button
        :loading="buttonIsLoading"
        size="small"
        label="Create Course Class"
        icon="pi pi-plus"
        @click="$router.push({ name: 'CourseForm', params: {routingTo: 'create'} })"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="courseClasses"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      scrollable
      scrollHeight="flex"
      class="w-full shadow-1"
    >
      <Column field="name" header="Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column :style="{ maxWidth: '250px', minWidth: '150px' }" field="image_url" header="Image" :headerStyle="{ justifyContent: 'center' }">
        <template #body="slotProps">
          <img
            :src="apiStorage + slotProps.data.image_url"
            alt=""
            class="w-full h-8rem object-fit-cover border-round-top"
          />
        </template>
      </Column>
      <Column field="description" header="Description" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="class_capacity" header="Capacity" :headerStyle="{ justifyContent: 'center' }" />

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
          <Button
            :loading="buttonIsLoading"
            icon="pi pi-pencil"
            text
            @click="editCourseClass(slotProps.data.id)"
          />
          <Button
            :loading="buttonIsLoading"
            icon="pi pi-trash"
            text
            severity="danger"
            @click="deleteCourseClass(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
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

const router = useRouter()
const toast = useToast()
const { confirm } = useAlert()
const store = useStore()

const isLoading = ref(true)
const buttonIsLoading = ref(false)
const courseClasses = ref(null)
const apiStorage = ref(null)

const fetchCourseClasses = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const editCourseClass = (id) => {
  router.push({ name: 'CourseForm', params: { routingTo: "update", id: id } })
}

const deleteCourseClass = async (id) => {
  confirm('Delete', 'Are you sure you want to deactivate it?').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'course-class/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Course class deactivate successfully',
          life: 4000
        })
        await fetchCourseClasses()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Failed to deactivate course class',
          life: 4000
        })
      }
      buttonIsLoading.value = false
    }
  })
}

onMounted(async () => {
  apiStorage.value = process.env.VUE_APP_APPOINTMENT_API_STORAGE
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
})
</script>
