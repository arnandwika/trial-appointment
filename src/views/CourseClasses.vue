<template>
  <div class="classes min-h-screen flex flex-column">
    <Navbar />
    <section class="flex-1 surface-50 px-3 md:px-6 lg:px-8 py-5">

      <!-- Header -->
      <div class="mb-4">
        <h2 class="text-2xl font-semibold text-900 mb-2">Class</h2>

        <!-- <div class="flex gap-4 text-700">
          <span class="font-medium border-bottom-2 border-primary pb-2 cursor-pointer">
            All
          </span>
          <span class="cursor-pointer">
            Group Pilates Classes
          </span>
        </div> -->
      </div>

      <!-- Filters -->
      <!-- <div
        class="flex flex-column md:flex-row justify-content-end gap-2 mb-4"
      >
        <Dropdown
          v-model="filters.type"
          :options="classTypes"
          placeholder="All class types"
          class="w-full md:w-14rem"
        />
        <Dropdown
          v-model="filters.category"
          :options="subCategories"
          placeholder="All sub categories"
          class="w-full md:w-14rem"
        />
        <Dropdown
          v-model="filters.level"
          :options="levels"
          placeholder="All difficulty levels"
          class="w-full md:w-14rem"
        />
      </div> -->

      <!-- Cards Grid -->
      <div class="grid">
        <div
          v-for="item in courseClasses"
          :key="item.id"
          class="col-12 sm:col-6 lg:col-3"
        >
          <Card class="h-full">
            <template #header>
              <img
                :src="require(`@/assets/course_class/${item.image_url}`)"
                alt=""
                class="w-full h-12rem object-fit-cover border-round-top"
              />
            </template>

            <template #content>
              <h3 class="text-lg font-semibold text-900 mb-2">
                {{ item.name }}
              </h3>

              <p class="text-600 text-sm line-height-3 mb-3">
                {{ item.description }}
              </p>

              <Button label="Book a Class" rounded @click="routing('packages')" />
            </template>
          </Card>
        </div>
      </div>
    </section>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// const filters = ref({
//   type: null,
//   category: null,
//   level: null
// })

// const classTypes = ['Reformer', 'Chair', 'Tower', 'Padel']
// const subCategories = ['Strength', 'Flexibility', 'Core']
// const levels = ['Open to all', 'Beginner', 'Intermediate', 'Advanced']

const loading = ref(true)

const courseClasses = ref([])

const fetchCourseClasses = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'course-class')
    courseClasses.value = res.data.data
  } finally {
    loading.value = false
  }
}

const routing = (routeTo) => {
  router.push(routeTo)
}

onMounted(async () => {
  await fetchCourseClasses()
})
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
