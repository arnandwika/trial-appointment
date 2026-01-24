<template>
  <div class="classes">
    <Navbar />
  <section class="surface-50 px-3 md:px-6 lg:px-8 py-5">

    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-2xl font-semibold text-900 mb-2">Class</h2>

      <div class="flex gap-4 text-700">
        <span class="font-medium border-bottom-2 border-primary pb-2 cursor-pointer">
          All
        </span>
        <span class="cursor-pointer">
          Group Pilates Classes
        </span>
      </div>
    </div>

    <!-- Filters -->
    <div
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
    </div>

    <!-- Cards Grid -->
    <div class="grid">
      <div
        v-for="item in classes"
        :key="item.id"
        class="col-12 sm:col-6 lg:col-3"
      >
        <Card class="h-full">
          <template #header>
            <img
              :src="item.image"
              alt=""
              class="w-full h-12rem object-fit-cover border-round-top"
            />
          </template>

          <template #content>
            <h3 class="text-lg font-semibold text-900 mb-2">
              {{ item.title }}
            </h3>

            <!-- Rating -->
            <div class="flex align-items-center gap-2 mb-2">
              <Rating
                :modelValue="item.rating"
                readonly
                :cancel="false"
              />
              <small class="text-600">
                {{ item.reviews ? `${item.reviews} Reviews` : 'No ratings yet…' }}
              </small>
            </div>

            <!-- Meta -->
            <div class="flex gap-3 text-600 text-sm mb-3">
              <div class="flex align-items-center gap-1">
                <i class="pi pi-clock"></i>
                <span>{{ item.duration }}</span>
              </div>
              <div class="flex align-items-center gap-1">
                <i class="pi pi-chart-line"></i>
                <span>{{ item.level }}</span>
              </div>
            </div>

            <p class="text-600 text-sm line-height-3 mb-3">
              {{ item.description }}
            </p>

            <Button
              label="View More"
              class="p-button-sm p-button-rounded"
            />
          </template>
        </Card>
      </div>
    </div>
  </section>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import Rating from 'primevue/rating'

const filters = ref({
  type: null,
  category: null,
  level: null
})

const classTypes = ['Reformer', 'Chair', 'Tower', 'Padel']
const subCategories = ['Strength', 'Flexibility', 'Core']
const levels = ['Open to all', 'Beginner', 'Intermediate', 'Advanced']

const classes = ref([
  {
    id: 1,
    title: 'Reformer Group Class',
    image: 'https://picsum.photos/400/300?1',
    rating: 5,
    reviews: 30,
    duration: '50 mins',
    level: 'All Levels',
    description:
      'Experience the power of Pilates in a dynamic and supportive group setting.'
  },
  {
    id: 2,
    title: 'Pilates For Padel',
    image: 'https://picsum.photos/400/300?2',
    rating: 0,
    reviews: null,
    duration: '50 mins',
    level: 'Open to all',
    description:
      'Pilates for Padel Group Class'
  },
  {
    id: 3,
    title: 'Chair Group Class',
    image: 'https://picsum.photos/400/300?3',
    rating: 4,
    reviews: 3,
    duration: '50 mins',
    level: 'All Levels',
    description:
      'Strengthen, tone, and align your body using the Pilates Chair.'
  },
  {
    id: 4,
    title: 'Tower Group Class',
    image: 'https://picsum.photos/400/300?4',
    rating: 5,
    reviews: 2,
    duration: '50 mins',
    level: 'All Levels',
    description:
      'Full-body workout using resistance springs with the Pilates Tower.'
  }
])
</script>

<style scoped>
.object-fit-cover {
  object-fit: cover;
}
</style>
