<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">User Management</h2>
        <p class="text-600">Manage your admin and member account</p>
      </div>

      <Button
        :loading="buttonIsLoading"
        size="small"
        label="Create User"
        icon="pi pi-plus"
        @click="$router.push({ name: 'UserForm', params: {routingTo: 'create'} })"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="users"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      class="shadow-1"
    >
      <Column field="name" header="Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="role" header="Role" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="phone_number" header="Phone Number" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="email" header="Email" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="gender" header="Gender" :headerStyle="{ justifyContent: 'center' }" />

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
            @click="editUser(slotProps.data.id)"
          />
          <Button
            :loading="buttonIsLoading"
            icon="pi pi-trash"
            text
            severity="danger"
            @click="deleteUser(slotProps.data.id)"
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
const users = ref(null)

const fetchUsers = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'user-management')
    users.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const editUser = (id) => {
  router.push({ name: 'UserForm', params: { routingTo: "update", id: id } })
}

const deleteUser = async (id) => {
  confirm('Delete', 'Are you sure you want deactivate it?').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deactivated successfully',
          life: 4000
        })
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Failed to deactivate user',
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
  await fetchUsers()
})
</script>
