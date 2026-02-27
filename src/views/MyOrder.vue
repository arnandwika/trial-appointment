<template>
  <div class="packages min-h-screen flex flex-column">
    <Navbar />
    <section class="flex-1 flex flex-column align-items-center justify-content-center px-3 md:px-6 lg:px-8 py-5">
      <div v-if="!orders || orders.length === 0" class="flex flex-column align-items-center justify-content-center text-center p-6">

        <!-- Icon -->
        <i class="pi pi-inbox text-6xl text-400 mb-4"></i>

        <!-- Title -->
        <div class="text-xl font-semibold mb-2">
          No Orders Found
        </div>

        <!-- Description -->
        <div class="text-600 mb-4">
          There are currently no quota available.
        </div>

        <!-- Optional Action Button -->
        <Button
          label="Create Order"
          icon="pi pi-plus"
          class="p-button-sm"
          @click="routing('packages')"
        />
      </div>
      <div v-if="orders" class="col-12 md:col-8">
        <!-- LOOP ORDERS -->
        <Card
          v-for="order in orders"
          :key="order.id"
          class="mb-5 shadow-2 border-round-2xl order-card"
        >
          <!-- ORDER HEADER -->
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <div>
                <div class="text-lg font-semibold text-900">
                  Order #{{ order.order_no }}
                </div>
                <div class="text-sm text-600">
                  {{ order.user_name }}
                </div>
              </div>

              <Tag v-if="order.status == 'active'" value="ACTIVE" severity="success" />
              <Tag v-if="order.status == 'inactive'" value="INACTIVE" severity="danger" />
            </div>
          </template>

          <template #content>
            <Divider />

            <!-- LOOP ORDER DETAILS -->
            <div
              v-for="detail in order.order_details"
              :key="detail.id"
              class="p-4 border-round-xl mb-4 package-box"
            >
              <!-- PACKAGE HEADER -->
              <div class="flex justify-content-between align-items-start">
                <div>
                  <div class="text-900 font-semibold text-lg">
                    {{ detail.package_name }}
                  </div>
                  <div class="text-600 text-sm">
                    {{ detail.class_name }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-500">Remaining</div>
                  <div class="text-2xl font-bold text-green-500">
                    {{ detail.remaining_quota }}
                  </div>
                </div>
              </div>

              <!-- STATS -->
              <div class="grid text-center mt-4">
                <div class="col-4">
                  <div class="text-500 text-sm">Total</div>
                  <div class="font-semibold">{{ detail.total_quota }}</div>
                </div>

                <div class="col-4">
                  <div class="text-500 text-sm">Used</div>
                  <div class="font-semibold text-orange-500">
                    {{ detail.used_quota }}
                  </div>
                </div>
                <div class="col-4">
                  <div class="text-500 text-sm">Remaining</div>
                  <div class="font-semibold text-green-500">
                    {{ detail.remaining_quota }}
                  </div>
                </div>
              </div>

              <!-- PROGRESS -->
              <div class="mt-4">
                <div class="flex justify-content-between text-sm mb-2">
                  <span class="text-600">Usage Progress</span>
                  <span class="text-600">
                    {{ getPercentage(detail) }}%
                  </span>
                </div>

                <ProgressBar
                  :value="getPercentage(detail)"
                  :showValue="false"
                  style="height: 8px"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast'
import ProgressBar from 'primevue/progressbar'
import { useRouter } from 'vue-router'
import axios from 'axios'

const store = useStore()
const router = useRouter()
const orders = computed(() => store.getters.userTransaction)
const toast = useToast()
const loading = ref(false)

const getPercentage = (detail) => {
  return Math.round((detail.used_quota / detail.total_quota) * 100)
}

onMounted(async() => {
  try {
    const res = await axios.get(
      process.env.VUE_APP_APPOINTMENT_API + 'user',
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.token
        }
      },
    )

    store.dispatch('login', res.data)
    loading.value = false

    const res2 = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/my-transaction/' + store.getters.user.id)
    store.dispatch('storeUserTransaction', res2.data.data)
    console.log(store.getters.userTransaction)
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
    loading.value = false
  }
})

const routing = (routeTo) => {
  router.push(routeTo)
}
</script>

