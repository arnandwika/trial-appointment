<template>
  <div class="packages min-h-screen flex flex-column">
    <Navbar />
    <div class="flex flex-1 flex-column align-items-center justify-content-center px-1 md:px-3 py-3">
      <div class="flex flex-column align-items-center justify-content-center">

        <div class="field col-11">
          <label>Password</label>
          <Password
            v-model="user.password"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div class="field col-11">
          <label>Confirm Password</label>
          <Password
            v-model="user.confirm_password"
            toggleMask
            :feedback="false"
            class="w-full"
            inputClass="w-full"
          />
          <small v-if="passwordMismatch" class="p-error">
            Password does not match
          </small>
        </div>

        <div class="flex justify-content-end gap-2 mt-4">
          <Button
            :loading="isLoading"
            size="small"
            label="Save"
            icon="pi pi-check"
            @click="updateUser()"
          />
        </div>

      </div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

// const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()

const user = ref({
  password: null,
  confirm_password: null,
})
// const routingTo = ref(null)
const isLoading = ref(true)

const passwordMismatch = computed(() => {
  return (
    user.value.confirm_password &&
    user.value.password !== user.value.confirm_password
  )
})

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
  isLoading.value = false
})

const updateUser = async () => {
  console.log('Update:', user.value)
  if (passwordMismatch.value) return
  try {
    isLoading.value = true
    const formData = {
      password: user.value.password
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + store.getters.user.id, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'home' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to change password',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
