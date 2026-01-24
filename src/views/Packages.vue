<template>
  <div class="packages">
    <Navbar />
    <div class="grid mx-4 my-3">
      <!-- LEFT SECTION -->
      <div class="col-12 md:col-3">
        <h2 class="text-2xl font-semibold mb-3">
          Morgen Pilates<br>
          Private Packages
        </h2>

        <p class="text-sm line-height-3 mb-3">
          For payment via bank transfer. Please let us know once the transfer
          is complete and provide a copy of the transaction slip by Whatsapp.
        </p>

        <div class="text-sm">
          <strong>Bank Account :</strong><br>
          BCA a/c : 1122334455<br>
        </div>
      </div>

      <!-- RIGHT SECTION -->
      <div class="col-12 md:col-9">
        <div class="grid">
          <!-- LOADING -->
          <template v-if="loading">
            <div
              v-for="i in 3"
              :key="i"
              class="col-12 md:col-4"
            >
              <Skeleton height="18rem" />
            </div>
          </template>

          <!-- PACKAGE CARD -->
          <div
            v-for="item in packages"
            :key="item.id"
            class="col-12 sm:col-6 md:col-4"
          >
            <Card class="h-full">
              <template #title>
                {{ item.title }}
              </template>

              <template #subtitle>
                {{ formatPrice(item.price) }}
              </template>

              <template #content>
                <ul class="text-sm pl-3 line-height-3">
                  <li>One time payment</li>
                  <li>{{ item.quota }} credit(s) for Appointments</li>
                  <li>Location access</li>
                  <li>{{ item.description }}</li>
                </ul>
              </template>

              <template #footer>
                <Button
                  label="Buy now"
                  class="w-full"
                  rounded
                  @click="orderPackage(item.title, item.price)"
                />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import { useAlert } from '@/composables/useAlert'
import Navbar from '@/components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

const packages = ref([])
const loading = ref(true)
const store = useStore()

const { openModal } = useLoginModal()
const { confirm } = useAlert()

const fetchPackages = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'package')
    packages.value = res.data.data
  } finally {
    loading.value = false
  }
}

const orderPackage = async (title, price) => {
  if (!store.getters.user) {
    openModal()
  } else {
    confirm('Buy Package', 'Apakah anda yakin mengajukan pembelian paket ' + title + ' seharga ' + formatPrice(price) + '?')
  }
}

const formatPrice = (price) =>
  'Rp' + price.toLocaleString('id-ID')

onMounted(fetchPackages)
</script>
