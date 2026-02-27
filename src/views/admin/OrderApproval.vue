<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="text-2xl font-semibold">Order Approval</h2>
        <p class="text-600">Approve member ordering your package</p>
      </div>
    </div>

    <!-- Table -->
    <DataTable
      :value="orders"
      :loading="isLoading"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      class="shadow-1"
    >
      <Column field="order_no" header="Order Code" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="user_name" header="Member Name" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="total_amount" header="Amount" :headerStyle="{ justifyContent: 'center' }" />
      <Column field="order_date" header="Order Date" :headerStyle="{ justifyContent: 'center' }" />

      <Column header="Actions" :headerStyle="{ display: 'flex', justifyContent: 'center' }" :bodyStyle="{ display: 'flex', justifyContent: 'center' }">
        <template #body="slotProps">
          <Button
            :loading="buttonIsLoading"
            icon="pi pi-trash"
            label="APPROVE"
            @click="approveOrder(slotProps.data.id)"
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
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()
const { confirm } = useAlert()
const store = useStore()

const isLoading = ref(true)
const buttonIsLoading = ref(false)
const orders = ref(null)

const fetchOrders = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders')
    orders.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const approveOrder = async (id) => {
  confirm('Approve', 'Apakah anda yakin ingin menyetujui transaksi ini? Pastikan member sudah mengirimkan bukti transfer').then (async (result) => {
    if (result.isConfirmed) {
      buttonIsLoading.value = true
      try {
        await axios.delete(
          process.env.VUE_APP_APPOINTMENT_API + 'SESUAIKAN/' + id
        )
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Berhasil menyetujui dan mengaktifkan paket member',
          life: 4000
        })
      } catch (e) {
        toast.add({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Terjadi kesalahan saat menyetujui dan mengaktifkan paket member',
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
        summary: 'Token Habis',
        detail: 'Silakan login kembali',
        life: 4000
      })
    }
    localStorage.removeItem('token')
    store.dispatch('logout')
    router.push('/')
  }
  await fetchOrders()
})
</script>
