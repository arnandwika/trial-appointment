<template>
  <div class="timetable">
    <Navbar />
    <div class="p-3">

      <!-- HEADER -->
      <h2 class="mb-3">Timetable</h2>

      <!-- DATE SELECTOR -->
      <div class="date-wrapper mb-4">
        <Button
          icon="pi pi-chevron-left"
          text
          class="nav-btn"
        />

        <div class="date-scroll">
          <div
            v-for="date in dates"
            :key="date.iso"
            class="date-item"
            :class="{ active: date.active }"
            @click="setActiveDate(date)"
          >
            <small class="day">{{ date.dayLabel }}</small>
            <span class="number">{{ date.dayNumber }}</span>
          </div>
        </div>


        <Button
          icon="pi pi-chevron-right"
          text
          class="nav-btn"
        />
      </div>


      <!-- FILTERS -->
      <div class="grid mb-4">
        <div class="col-12 md:col-2" v-for="filter in filters" :key="filter.label">
          <Dropdown
            v-model="filter.value"
            :options="filter.options"
            optionLabel="label"
            optionValue="value"
            :placeholder="filter.label"
            class="w-full"
          />
        </div>
      </div>

      <!-- DAY TITLE -->
      <div class="flex justify-content-between align-items-center mb-2">
        <div>
          <strong>Sun, 25 Jan</strong>
          <small class="ml-2 text-500">14 classes</small>
        </div>

        <div class="flex gap-2">
          <Tag severity="success" value="Booked" />
          <Tag severity="warning" value="Waitlisted" />
        </div>
      </div>

      <!-- CLASS LIST -->
      <div class="flex flex-column gap-3">
        <Card
          v-for="item in classes"
          :key="item.id"
          class="class-card"
        >
          <template #content>
            <div class="grid align-items-center">

              <div class="col-12 md:col-2">
                <strong>{{ item.time }}</strong>
                <small class="block text-500">{{ item.duration }}</small>
              </div>

              <div class="col-12 md:col-7">
                <div class="font-medium">{{ item.title }}</div>
                <small class="text-500">
                  {{ item.instructor }} · {{ item.location }}
                </small>
              </div>

              <div class="col-12 md:col-3 text-right">
                <Tag value="Booking Closed" severity="secondary" />
              </div>

            </div>
          </template>
        </Card>
      </div>

    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
dayjs.locale('id')

const dates = ref([])

const generateDates = () => {
  const start = dayjs()
  const end = start.add(1, 'month').endOf('month')

  const temp = []
  let current = start

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    temp.push({
      iso: current.format('YYYY-MM-DD'),
      dayLabel: current.format('ddd'),
      dayNumber: current.format('DD'),
      active: current.isSame(start, 'day'),
    })

    current = current.add(1, 'day')
  }

  dates.value = temp
}

const setActiveDate = (selected) => {
  dates.value.forEach(d => (d.active = false))
  selected.active = true

  // later: fetch timetable(selected.iso)
}

const filters = ref([
  {
    label: 'All categories',
    value: null,
    options: [
      { label: 'All', value: null },
      { label: 'Barrel', value: 'barrel' },
    ],
  },
  {
    label: 'Location',
    value: null,
    options: [
      { label: 'Sunter', value: 'sunter' },
    ],
  },
  {
    label: 'Classes',
    value: null,
    options: [
      { label: 'Group Class', value: 'group' },
    ],
  },
  {
    label: 'Instructor',
    value: null,
    options: [
      { label: 'Medina Ms', value: 'medina' },
    ],
  },
  {
    label: 'Level of difficulty',
    value: null,
    options: [
      { label: 'Beginner', value: 'beginner' },
    ],
  },
])

const classes = ref([
  {
    id: 1,
    time: '7:00am',
    duration: '50 mins',
    title: 'Chair Barrel Group Class',
    instructor: 'Medina Ms',
    location: 'Yoo-Na Pilates Sunter',
    status: 'closed',
    statusText: 'Booking Closed',
  },
  {
    id: 2,
    time: '7:00am',
    duration: '50 mins',
    title: 'Tower Group Class',
    instructor: 'Adrian Mr',
    location: 'Yoo-Na Pilates Sunter',
    status: 'closed',
    statusText: 'Booking Closed',
  },
])

onMounted(generateDates)
</script>

<style scoped>
.date-pill {
  min-width: 56px;
  padding: 0.5rem;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  background: #f2eee6;
}

.date-pill.active {
  background: #4b3b2a;
  color: white;
}

.class-card {
  background: #e5d8c8;
  border-radius: 12px;
}

.date-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.date-scroll::-webkit-scrollbar {
  display: none;
}

.date-item {
  min-width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #f3ede4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-item .day {
  font-size: 12px;
  color: #7a6a58;
}

.date-item .number {
  font-size: 16px;
  font-weight: 600;
  color: #3d3022;
}

.date-item.active {
  background: #4b3b2a;
}

.date-item.active .day,
.date-item.active .number {
  color: #ffffff;
}

</style>
