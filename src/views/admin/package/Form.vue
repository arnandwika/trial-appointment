<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Package</h2>

    <Form @submit="handleSubmit" validate-on-input :initial-values="id ? initialValues : undefined">
      <div class="surface-card p-4 border-round shadow-2">
        <div class="grid formgrid p-fluid">

          <div class="field col-8">
            <label>Package Title</label>
            <Field name="title" rules="required" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="title" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Course Class</label>
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
            <label>Price</label>
            <Field name="price" rules="required|numeric" v-slot="{ field, errors }">
              <InputNumber :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="price" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Quota</label>
            <Field name="quota" rules="required|numeric" v-slot="{ field, errors }">
              <InputNumber :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="quota" class="p-error" />
            </Field>
          </div>

          <div class="field col-8">
            <label>Valid Days</label>
            <Field name="valid_days" rules="required|numeric" v-slot="{ field, errors }">
              <InputNumber :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="valid_days" class="p-error" />
            </Field>
          </div>

          <!-- Description -->
          <div class="field col-12">
            <label>Description</label>
            <Field name="description" rules="required" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="description" class="p-error" />
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
import InputNumber from 'primevue/inputnumber'
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
  title: null,
  class_id: null,
  price: null,
  quota: null,
  description: null,
  is_active: false
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)

const courseClasses = ref(null)

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
    updatePackage(values)
  } else {
    createPackage(values)
  }
}

const getPackage = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'package/' + id.value)
    res.data.data.class_id = parseInt(res.data.data.class_id)
    initialValues.value = res.data.data
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
    await getPackage()
  } else {
    isLoading.value = false
  }
})

const updatePackage = async (values) => {
  console.log('Update:', values)
  try {
    const formData = values

    await axios.patch(process.env.VUE_APP_APPOINTMENT_API + 'package/' + id.value, formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Package updated successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'PackageList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to update package',
      life: 4000
    })
    isLoading.value = false
  }
}

const createPackage = async (values) => {
  console.log('Create:', values)
  try {
    const formData = values

    await axios.post(process.env.VUE_APP_APPOINTMENT_API + 'package', formData)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Package created successfully',
      life: 4000
    })
    isLoading.value = false
    router.push({ name: 'PackageList' })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to create package',
      life: 4000
    })
    isLoading.value = false
  }
}
</script>
