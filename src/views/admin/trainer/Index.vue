<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">Trainer</h2>
        <p class="text-600">Manage your trainer account</p>
      </div>

      <Button
        :loading="buttonIsLoading"
        size="small"
        label="Create Trainer"
        icon="pi pi-plus"
        @click="$router.push({ name: 'TrainerForm', params: {routingTo: 'create'} })"
      />
    </div>

    <!-- Table -->
    <DataTable
      :value="trainers"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      class="shadow-1"
    >
      <Column field="name" header="Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="course_classes.name" header="Class Name" :headerStyle="{ justifyContent: 'center' }" />
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
          <div class="flex justify-content-center gap-2">
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-pencil"
              text
              @click="editTrainer(slotProps.data.id)"
            />
            <Button
              :loading="buttonIsLoading"
              icon="pi pi-trash"
              text
              severity="danger"
              @click="deleteTrainer(slotProps.data.id)"
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
const trainers = ref(null)

const fetchTrainers = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'trainer')
    trainers.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const editTrainer = (id) => {
  router.push({ name: 'TrainerForm', params: { routingTo: "update", id: id } })
}

const deleteTrainer = async (id) => {
  confirm('Delete', 'Are you sure you want deactivate it?').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'trainer/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Trainer deactivated successfully',
          life: 4000
        })
        await fetchTrainers()
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Failed to deactivate trainer',
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
  await fetchTrainers()
})
</script>
