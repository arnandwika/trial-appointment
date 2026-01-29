<template>
  <Dialog
      v-model:visible="showLogin"
      modal
      dismissableMask
      :showHeader="false"
      :style="{ width: '70vw', maxWidth: '900px' }"
      :breakpoints="{ '960px': '90vw', '640px': '100vw' }"
      contentClass="p-0 overflow-hidden"
    >
      <div class="flex h-full">

        <!-- LEFT IMAGE / BRAND (hidden on mobile) -->
        <div
          class="hidden md:flex w-6 background-color-primary align-items-center justify-content-center"
        >
          <img
            src="@/assets/identity_logo/half_logo.png"
            alt="Brand"
            class="max-w-7rem"
          />
        </div>

        <!-- RIGHT FORM -->
        <div class="w-full md:w-6 p-5 flex flex-column justify-content-center">
          <h2 class="text-center mb-4">Log in</h2>

          <!-- Tabs -->
          <!-- <div class="flex justify-content-center gap-4 mb-4">
            <span class="font-semibold border-bottom-2 border-primary pb-2">
              Email address
            </span>
          </div> -->

          <!-- Email -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Email address</label>
            <InputText v-model="email" class="w-full" />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Password</label>
            <Password
              v-model="password"
              toggleMask
              :feedback="false"
              class="w-full"
            />
          </div>

          <!-- Reset -->
          <!-- <div class="text-sm mb-4">
            Forgot password or don’t have one?
            <a class="text-primary cursor-pointer">Reset Password</a>
          </div> -->

          <!-- Login Button -->
          <div class="grid flex justify-content-between m-3">
            <Button
              :loading="loading"
              label="Login"
              class="col-12 md:col-5"
              :disabled="!email || !password"
              @click="login()"
            />
            <Button
              :loading="loading"
              label="Cancel"
              class="col-12 md:col-5"
              @click="close()"
            />
          </div>

          <!-- Sign up -->
          <div class="text-center text-sm">
            <p v-if="errorMessage" class="text-color-red mt-2">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </div>
    </Dialog>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import { ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useAlert } from '@/composables/useAlert'
import { useToast } from 'primevue/usetoast'

const { showLogin, closeModal } = useLoginModal()

const toast = useToast()
const store = useStore()
const { error } = useAlert()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const close = () => {
  closeModal()
}

const login = async () => {
  loading.value = true

  try {
    const res = await axios.post(
      process.env.VUE_APP_APPOINTMENT_API + 'auth/login',
      {
        email: email.value,
        password: password.value
      },
    )

    // success response
    store.dispatch('login', res.data.data.user)
    localStorage.setItem('token', res.data.data.token)
    showLogin.value = false

    const res2 = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/my-transaction/' + res.data.id)
    store.dispatch('storeUserTransaction', res2.data.data)

    toast.add({
      severity: 'success',
      summary: 'Berhasil Login',
      detail: 'Selamat datang ' + res.data.data.user.name,
      life: 3000
    })
    loading.value = false
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Login failed'
    error('Gagal Login', errorMessage)
  }
}
</script>
