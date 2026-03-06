<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">Package</h2>
        <p class="text-600">Manage your studio bundling package</p>
      </div>

      <Button
        :loading="buttonIsLoading"
        size="small"
        label="Create Package"
        icon="pi pi-plus"
        @click="$router.push({ name: 'PackageForm', params: {routingTo: 'create'} })"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="packages"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      class="shadow-1"
    >
      <Column field="title" header="Title" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="course_class.name" header="Class Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="price" header="Price" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="description" header="Description" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="quota" header="quota" :headerStyle="{ justifyContent: 'center' }" />

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
              icon="pi pi-pencil"
              text
              @click="editPackage(slotProps.data.id)"
            />
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-trash"
              text
              severity="danger"
              @click="deletePackage(slotProps.data.id)"
            />
          </div>
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
const packages = ref(null)

const fetchPackages = async () => {
  isLoading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'package')
    packages.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const editPackage = (id) => {
  router.push({ name: 'PackageForm', params: { routingTo: "update", id: id } })
}

const deletePackage = async (id) => {
  confirm('Delete', 'Are you sure you want to deactivate it?').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'package/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Package deactivated successfully',
          life: 4000
        })
        await fetchPackages()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Failed to deactivate package',
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
  await fetchPackages()
})
</script>
