<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Trainer</h2>

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
            <label>Class Name</label>
            <Field name="class_id" rules="required" v-slot="{ field, errors }">
              <Dropdown
                :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
                :options="courseClasses"
                optionLabel="name"
                optionValue="id"
                placeholder="Select Course Class"
              />
              <ErrorMessage name="class_id" class="p-error" />
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
            type="submit"
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
  class_id: null,
  phone_number: null,
  email: null,
  gender: null,
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)
const courseClasses = ref(null)

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

const fetchCourseClasses = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = (values) => {
  if (id.value) {
    updateTrainer(values)
  } else {
    createTrainer(values)
  }
}

const getTrainer = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'trainer/' + id.value)
    res.data.data.class_id = parseInt(res.data.data.class_id)
    initialValues.value = res.data.data
    console.log(initialValues.value)
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

  await fetchCourseClasses()

  id.value = route.params.id
  routingTo.value = route.params.routingTo == 'create' ? 'Create' : 'Update'

  console.log(id.value)

  // Replace with API call
  if (id.value) {
    await getTrainer()
  } else {
    isLoading.value = false
  }
})

const updateTrainer = async (values) => {
  console.log('Update:', values)
  try {
    const formData = values

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'trainer/' + id.value, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Trainer updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'TrainerList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to update trainer',
      life: 4000
    })
    isLoading.value = false
  }
}

const createTrainer = async (values) => {
  console.log('Create:', values)
  try {
    const formData = values

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'trainer', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Trainer created successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'TrainerList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to create trainer',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
