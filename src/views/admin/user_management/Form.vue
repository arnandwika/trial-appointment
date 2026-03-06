<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} User</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <div class="grid formgrid p-fluid">

        <div class="field col-8">
          <label>Name</label>
          <InputText v-model="user.name" />
        </div>

        <div class="field col-8">
          <label>Role</label>
          <Dropdown
            v-model="user.role"
            :options="roles"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Role"
          />
        </div>

        <div class="field col-8">
          <label>Phone Number</label>
          <InputText v-model="user.phone_number" />
        </div>

        <div class="field col-8">
          <label>Email</label>
          <InputText v-model="user.email" />
        </div>

        <!-- Description -->
        <div class="field col-8">
          <label>Gender</label>
          <Dropdown
            v-model="user.gender"
            :options="genders"
            optionLabel="name"
            optionValue="value"
            placeholder="Select Gender"
          />
        </div>

        <div v-if="!user.id" class="field col-8">
          <label>Password</label>
          <Password
            v-model="user.password"
            toggleMask
            :feedback="false"
            class="w-full"
          />
        </div>

        <div v-if="!user.id" class="field col-8">
          <label>Confirm Password</label>
          <Password
            v-model="user.confirm_password"
            toggleMask
            :feedback="false"
            class="w-full"
          />
          <small v-if="passwordMismatch" class="p-error">
            Password does not match
          </small>
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
          size="small"
          label="Save"
          icon="pi pi-check"
          @click="id ? updateUser(false) : createUser()"
        />
        <Button
          v-if="id"
          :loading="isLoading"
          size="small"
          severity="warning"
          label="Reset Password"
          @click="updateUser(true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

const user = ref({
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

const passwordMismatch = computed(() => {
  return (
    user.value.confirm_password &&
    user.value.password !== user.value.confirm_password
  )
})

const getUser = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + id.value)
    user.value = res.data.data
  } finally {
    isLoading.value = false
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

const updateUser = async (changePassword) => {
  console.log('Update:', user.value)
  if (passwordMismatch.value && changePassword) return
  try {
    let formData = {}
    if (changePassword) {
      formData = {
        password: user.value.phone_number
      }
    } else {
      formData = {
        name: user.value.name,
        role: user.value.role,
        phone_number: user.value.phone_number,
        gender: user.value.gender,
        email: user.value.email,
      }
    }

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'user-management/' + user.value.id, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: changePassword ? 'Password reset to phone number successfully' : 'User updated successfully',
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

const createUser = async () => {
  console.log('Create:', user.value)
  if (passwordMismatch.value) return
  try {
    const formData = {
      name: user.value.name,
      role: user.value.role,
      phone_number: user.value.phone_number,
      gender: user.value.gender,
      email: user.value.email,
      password: user.value.password
    }

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
