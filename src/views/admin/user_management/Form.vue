<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} User</h2>

    <Form @submit="handleSubmit" validate-on-input :initial-values="id ? initialValues : undefined">
      <div class="surface-card p-4 border-round shadow-2">
        <div class="grid formgrid p-fluid">

          <div class="field col-8">
            <label>Name</label>
            <Field name="name" rules="required|alpha" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="name" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Role</label>
            <Field name="role" rules="required" v-slot="{ field, errors }">
              <Dropdown
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :options="roles"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Role"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="role" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Phone Number</label>
            <Field name="phone_number" rules="required|numeric" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="phone_number" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Email</label>
            <Field name="email" rules="required|email" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="email" class="p-error" />
            </Field>
          </div>

          <!-- Description -->
          <div class="field col-8">
            <label>Gender</label>
            <Field name="gender" rules="required" v-slot="{ field, errors }">
              <Dropdown
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                :options="genders"
                optionLabel="name"
                optionValue="value"
                placeholder="Select Gender"
              />
              <ErrorMessage name="gender" class="p-error" />
            </Field>
          </div>

          <div v-if="!id" class="field col-8">
            <label>Password</label>
            <Field name="password" rules="required" v-slot="{ field, errors }">
              <Password
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                toggleMask
                :feedback="false"
                class="w-full"
              />
              <ErrorMessage name="password" class="p-error" />
            </Field>
          </div>

          <div v-if="!id" class="field col-8">
            <label>Confirm Password</label>
            <Field name="confirm_password" rules="required|confirmed:password" v-slot="{ field, errors }">
              <Password
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                toggleMask
                :feedback="false"
                class="w-full"
              />
              <ErrorMessage name="confirm_password" class="p-error" />
            </Field>
          </div>

          <!-- Active -->
          <!-- <div class="field col-12 md:col-6 flex align-items-center">
            <Checkbox v-model="courseClass.is_active" binary />
            <label class="ml-2">Active</label>
          </div> -->

        </div>

        <!-- Actions -->
        <div class="flex justify-content-end gap-2 mt-4">
          <Button
            size="small"
            label="Cancel"
            severity="secondary"
            @click="$router.back()"
          />
          <Button
            :loading="isLoading"
            type="submit"
            size="small"
            label="Save"
            icon="pi pi-check"
          />
          <Button
            v-if="id"
            :loading="isLoading"
            size="small"
            severity="warning"
            icon="pi pi-sync"
            label="Reset Password"
            @click="resetPassword"
          />
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useStore()

const initialValues = ref({
  id: null,
  name: null,
  role: null,
  phone_number: null,
  email: null,
  gender: null,
  password: null,
  confirm_password: null,
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const roles = ref([
  {
    value: 'member',
    name: 'Member'
  },
  {
    value: 'admin',
    name: 'Admin'
  }
])

const genders = ref([
  {
    value: 'male',
    name: 'Male'
  },
  {
    value: 'female',
    name: 'Female'
  }
])

const getUser = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + id.value)
    initialValues.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = (values) => {
  if (id.value) {
    updateUser(values)
  } else {
    createUser(values)
  }
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

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getUser()
  } else {
    isLoading.value = false
  }
})

const resetPassword = async () => {
  try {
    let formData = {}

    formData = {
      password: initialValues.value.phone_number
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + id.value, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Password reset to phone number successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'UserList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to reset password',
      life: 4000
    })
    isLoading.value = false
  }
}

const updateUser = async (values) => {
  console.log('Update:', values)
  try {
    let formData = {}
    formData = values

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + id.value, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'UserList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to update user',
      life: 4000
    })
    isLoading.value = false
  }
}

const createUser = async (values) => {
  console.log('Create:', values)
  try {
    const formData = values

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'user-management', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User created successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'UserList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to create user',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
