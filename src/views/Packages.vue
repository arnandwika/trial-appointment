<template>
  <div class="packages min-h-screen flex flex-column">
    <Navbar />
    <div class="flex-1 grid mx-4 my-3">
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
                  label="Buy Package"
                  class="w-full"
                  rounded
                  @click="addToCart(item)"
                />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <!-- FLOATING CART -->
    <div class="floating-cart" @click="showCart = true">
      <i class="pi pi-shopping-cart"></i>
      <Badge
        v-if="cartCount > 0"
        :value="cartCount"
        severity="danger"
        class="cart-badge"
      />
    </div>

    <Dialog
      v-model:visible="showCart"
      modal
      header="Your Cart"
      :style="{ width: '400px' }"
      :breakpoints="{
        '960px': '75vw',
        '640px': '95vw'
      }"
    >
      <div v-if="cart.length === 0" class="text-center p-4">
        Cart is empty
      </div>

      <div v-else>
        <div
          v-for="item in cart"
          :key="item.id"
          class="flex justify-content-between align-items-center mb-3"
        >
        <div>
            <strong>{{ item.title }}</strong>
            <div class="text-sm text-gray-500">
              ${{ item.price }} × {{ item.qty }}
            </div>
          </div>

          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            @click="removeFromCart(item.id)"
          />
        </div>

        <Divider />
        <Button
          label="Checkout"
          icon="pi pi-check"
          class="w-full"
          :loading="loading"
          @click="checkout"
        />
      </div>
    </Dialog>
    <Footer />
  </div>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
// import { useAlert } from '@/composables/useAlert'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const packages = ref([])
const cart = ref([])
const showCart = ref(false)
const loading = ref(true)
const store = useStore()
const toast = useToast()

const { openModal } = useLoginModal()
// const { confirm } = useAlert()

const fetchPackages = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'package')
    packages.value = res.data.data
  } finally {
    loading.value = false
  }
}

const formatPrice = (price) =>
  'Rp' + price.toLocaleString('id-ID')

const addToCart = (pkg) => {
  if (!store.getters.user) {
    openModal()
  } else {
    const existing = cart.value.find(i => i.id === pkg.id)

    if (existing) {
      existing.qty++
    } else {
      cart.value.push({ ...pkg, qty: 1 })
    }

    // animateToCart(event.target)
  }
}

/* SIMPLE FLY ANIMATION */
// const animateToCart = (button) => {
//   const cartEl = document.querySelector('.floating-cart')
//   if (!cartEl) return

//   const clone = button.cloneNode(true)
//   const rect = button.getBoundingClientRect()
//   const cartRect = cartEl.getBoundingClientRect()

//   clone.style.position = 'fixed'
//   clone.style.left = rect.left + 'px'
//   clone.style.top = rect.top + 'px'
//   clone.style.zIndex = 9999
//   clone.style.transition = 'all 0.6s ease-in-out'
//   clone.style.pointerEvents = 'none'

//   document.body.appendChild(clone)

//   requestAnimationFrame(() => {
//     clone.style.left = cartRect.left + 'px'
//     clone.style.top = cartRect.top + 'px'
//     clone.style.opacity = '0'
//     clone.style.transform = 'scale(0.2)'
//   })

//   setTimeout(() => document.body.removeChild(clone), 700)
// }

const cartCount = computed(() =>
  cart.value.reduce((sum, i) => sum + i.qty, 0)
)

const removeFromCart = (id) => {
  cart.value = cart.value.filter(i => i.id !== id)
}

const checkout = async () => {
  loading.value = true
  let total_amount = 0
  let total_quota = 0
  cart.value.forEach(element => {
    total_amount += parseInt(element.price)
    total_quota += parseInt(element.quota)
  })
  try {
    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'orders', {
      order_details: cart.value.map(i => ({
        package_id: i.id,
        class_id: i.class_id,
        package_name: i.title,
        class_name: i.course_class.name,
        total_quota: total_quota,
        used_quota: 0,
      })),
      user_id: store.getters.user.id,
      user_name: store.getters.user.name,
      total_amount: total_amount
    })

    cart.value = []
    showCart.value = false
    toast.add({
      severity: 'success',
      summary: 'Berhasil Membeli Paket',
      life: 3000
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Gagal Membeli Paket',
      life: 3000
    })
    console.log(e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPackages)
</script>

<style scoped>
.floating-cart {
  z-index: 1100;
  position: fixed;
  right: 24px;
  bottom: 55px;
  width: 56px;
  height: 56px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.cart-badge {
  z-index: 1200;
  position: absolute;
  top: -4px;
  right: -4px;
}
</style>
