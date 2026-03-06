<template>
  <Dialog
    v-model:visible="showLogin"
    modal
    dismissableMask
    :showHeader="false"
    :style="{ width: '70vw', maxWidth: '900px' }"
    contentClass="p-0 overflow-hidden"
  >
    <Form @submit="login" validate-on-input>
      <div class="flex h-full">

        <!-- LEFT IMAGE -->
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

          <!-- EMAIL -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Email address</label>

            <Field name="email" rules="required|email" v-slot="{ field, errors }">
              <InputText
                v-bind="field"
                class="w-full"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="email" class="p-error" />
            </Field>
          </div>

          <!-- PASSWORD -->
          <div class="mb-3">
            <label class="block mb-1 font-medium">Password</label>

            <Field name="password" rules="required" v-slot="{ field, errors }">
              <Password
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                toggleMask
                :feedback="false"
                class="w-full"
                inputClass="w-full"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="password" class="p-error" />
            </Field>
          </div>

          <!-- BUTTONS -->
          <div class="grid flex justify-content-between m-3">
            <Button
              :loading="loading"
              type="submit"
              label="Login"
              class="col-12 md:col-5 mt-1 md:mt-0"
            />

            <Button
              severity="secondary"
              label="Cancel"
              class="col-12 md:col-5 mt-3 md:mt-0"
              @click="close"
            />
          </div>

          <div class="text-center text-sm">
            <p v-if="errorMessage" class="text-red-500 mt-2">
              {{ errorMessage }}
            </p>
          </div>

        </div>
      </div>
    </Form>
  </Dialog>
</template>

<script setup>
import { Form, Field } from "vee-validate"
import { defineRule } from "vee-validate"

import { useLoginModal } from '@/composables/useLoginModal'
import { ref } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

/* custom rules (since you don't use @vee-validate/rules) */

defineRule("required", value => {
  if (!value || !value.length) {
    return "This field is required"
  }
  return true
})

defineRule("email", value => {
  if (!value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address"
})

const { showLogin, closeModal } = useLoginModal()

const toast = useToast()
const store = useStore()

const loading = ref(false)
const errorMessage = ref("")

const close = () => {
  closeModal()
}

const login = async (values) => {
  loading.value = true
  errorMessage.value = ""

  try {

    const res = await axios.post(
      process.env.VUE_APP_APPOINTMENT_API + 'auth/login',
      values
    )

    store.dispatch('login', res.data.data.user)
    localStorage.setItem('token', res.data.data.token)

    showLogin.value = false

    toast.add({
      severity: 'success',
      summary: 'Log In Success',
      detail: 'Welcome ' + res.data.data.user.name,
      life: 4000
    })

    const res2 = await axios.get(
      process.env.VUE_APP_APPOINTMENT_API +
      'orders/my-transaction/' +
      res.data.data.user.id
    )

    store.dispatch('storeUserTransaction', res2.data.data)

  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Login failed"
  }

  loading.value = false
}
</script>
