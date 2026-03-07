<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">{{ routingTo }} Course Class</h2>

    <div class="surface-card p-4 border-round shadow-2">
      <Form
        :initial-values="id ? initialValues : undefined"
        @submit="handleSubmit"
        validate-on-input
        v-slot="{ setFieldValue }"
      >
        <div class="grid formgrid p-fluid">

          <!-- Name -->
          <div class="field col-8">
            <label>Course Name</label>

            <Field name="name" rules="required" v-slot="{ field, errors }">
              <InputText v-bind="field" :class="{ 'p-invalid': errors.length }"/>
              <ErrorMessage name="name" class="p-error" />
            </Field>

          </div>

          <!-- Image -->
          <div class="field col-12">
            <label>Image</label>

            <!-- Preview -->
            <div
              v-if="initialValues.preview_url || initialValues.image_file"
              class="mb-3 border-round overflow-hidden"
              style="max-width: 300px"
            >
              <img
                :src="initialValues.image_name
                  ? initialValues.preview_url
                  : apiStorage + initialValues.image_file"
                class="w-full border-round"
                style="object-fit: cover; max-height: 200px"
              />
            </div>

            <Field name="image_file" rules="image" v-slot="{ errorMessage }">
              <div class="flex align-items-center gap-3 flex-wrap">
                <FileUpload
                  mode="basic"
                  accept="image/*"
                  :auto="false"
                  chooseLabel="Choose Image"
                  class="p-button-sm"
                  @select="(e) => onSelect(e, setFieldValue)"
                />

                <Button
                  v-if="initialValues.preview_url"
                  icon="pi pi-times"
                  severity="danger"
                  label="Remove"
                  class="col-2 ml-3"
                  @click="removeImage(setFieldValue)"
                />
              </div>

              <small class="text-500">
                Max size 2MB. JPG, PNG recommended.
              </small>

              <small v-if="errorMessage" class="p-error block">
                {{ errorMessage }}
              </small>
            </Field>
          </div>

          <!-- Capacity -->
          <div class="field col-8">
            <label>Class Capacity</label>

            <Field name="class_capacity" rules="required|numeric" v-slot="{ field, errors }">
              <InputNumber :modelValue="field.value"
                @update:modelValue="field.onChange"
                :class="{ 'p-invalid': errors.length }"
              />
              <ErrorMessage name="class_capacity" class="p-error" />
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
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
// import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
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
  image_file: null,
  image_name: null,
  preview_url: null,
  previous_image_url: null,
  class_capacity: null,
  description: null,
  is_active: false
})
const routingTo = ref(null)
const id = ref(null)
const isLoading = ref(true)
const apiStorage = ref(null)

const getCourseClass = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class/' + id.value)
    initialValues.value = res.data.data
    initialValues.value.image_file = initialValues.value.previous_image_url = initialValues.value.image_url
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  apiStorage.value = process.env.VUE_APP_APPOINTMENT_API_STORAGE
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
    await getCourseClass()
  } else {
    isLoading.value = false
  }
})

const onSelect = (event, setFieldValue) => {
  const file = event.files[0]
  if (!file) return

  initialValues.value.preview_url = URL.createObjectURL(file)
  initialValues.value.image_file = file
  initialValues.value.image_name = file.name

  setFieldValue('image_file', file)
}

const removeImage = (setFieldValue) => {
  initialValues.value.preview_url = null
  initialValues.value.image_file = null
  initialValues.value.image_name = null

  setFieldValue('image_file', null)
}

const handleSubmit = async (values) => {
  try {
    isLoading.value = true

    const formData = new FormData()

    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('class_capacity', values.class_capacity)

    if (values.image_file instanceof File) {
      formData.append('image_file', values.image_file)
    }

    if (id.value) {
      formData.append('image_url', initialValues.value.previous_image_url)
      formData.append('_method', 'PATCH')

      await axios.post(
        process.env.VUE_APP_APPOINTMENT_API + 'course-class/' + id.value,
        formData
      )
    } else {
      await axios.post(
        process.env.VUE_APP_APPOINTMENT_API + 'course-class',
        formData
      )
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: `Course class ${id.value ? 'updated' : 'created'} successfully`,
      life: 4000
    })

    router.push({ name: 'CourseList' })

  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Server Error',
      detail: 'Failed to save course class',
      life: 4000
    })
  } finally {
    isLoading.value = false
  }
}
</script>
