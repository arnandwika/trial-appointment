<template>
  <div>
    <!-- Header -->
    <div class="flex justify-content-between align-items-center mb-4">
      <div class="mr-1">
        <h2 class="text-2xl font-semibold">List Order</h2>
        <p class="text-600">Approve and see all orders</p>
      </div>

      <div class="ml-1">
        <Calendar
          v-model="reportDate"
          dateFormat="dd-mm-yy"
          :maxDate="dateNow"
          placeholder="Date Report"
          selectionMode="range"
          class="mr-2 w-7 md:w-auto"
        />
        <Button
          :loading="buttonIsLoading"
          :disabled="!reportDate"
          icon="pi pi-file"
          severity="success"
          label="Download Report"
          @click="downloadReport()"
        />
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

      <Column header="Actions" :headerStyle="{ justifyContent: 'center' }">
        <template #body="slotProps">
          <Button
            :disabled="slotProps.data.status == 'active'"
            :loading="buttonIsLoading"
            :label="slotProps.data.status == 'active' ? 'APPROVED' : 'APPROVE'"
            size="small"
            :text="slotProps.data.status == 'active'"
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
import Calendar from 'primevue/calendar'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import dayjs from 'dayjs'

const router = useRouter()
const toast = useToast()
const { confirm } = useAlert()
const store = useStore()

const isLoading = ref(true)
const buttonIsLoading = ref(false)
const orders = ref(null)
const reportDate = ref(null)

const downloadReport = async () => {
  try {
    const response = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/report/excel', {
      params: {
        date: reportDate.value
      },
      responseType: "blob"
    })

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.xlsx");
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } finally {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Terjadi kesalahan saat download report',
      life: 4000
    })
    isLoading.value = false
  }
}

const fetchOrders = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders')
    res.data.data.forEach(element => {
      element.order_date = dayjs(element.order_date).format('DD-MM-YYYY HH:MM')
    })
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
        const formData = {
          id: id,
          status: 'active'
        }
        await axios.patch(
          process.env.VUE_APP_APPOINTMENT_API + 'orders/' + id, formData
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
