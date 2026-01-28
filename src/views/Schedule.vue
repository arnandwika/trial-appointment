<template>
  <div class="schedule min-h-screen flex flex-column">
    <Navbar />
    <div class="p-3 flex-1">

      <!-- HEADER -->
      <h2 class="mb-3">Schedule</h2>

      <!-- DATE SELECTOR -->
      <div class="date-wrapper mb-4">
        <!-- <Button
          icon="pi pi-chevron-left"
          text
          class="nav-btn"
        /> -->

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


        <!-- <Button
          icon="pi pi-chevron-right"
          text
          class="nav-btn"
        /> -->
      </div>


      <!-- FILTERS -->
      <!-- <div class="grid mb-4">
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
      </div> -->

      <!-- DAY TITLE -->
      <div class="flex justify-content-between align-items-center mb-2">
        <div>
          <strong>{{ selectedDate }}</strong>
          <small class="ml-2 text-500">{{ dateSchedule.length }} classes</small>
        </div>

        <!-- <div class="flex gap-2">
          <Tag severity="success" value="Booked" />
          <Tag severity="warning" value="Waitlisted" />
        </div> -->
      </div>

      <div class="flex flex-column gap-3">
        <Card
          v-for="item in dateSchedule"
          :key="item.id"
          class="schedule-card"
        >
          <template #content>
            <div class="grid align-items-center">

              <div class="col-12 md:col-2">
                <strong>{{ formattedTime(item.datetime_schedule) }}</strong>
                <!-- <small class="block text-500">{{ item.duration }}</small> -->
              </div>

              <div class="col-12 md:col-6">
                <div class="font-medium">{{ item.course_class.name }}</div>
                <small class="text-500">
                  Instructor: {{ item.trainer.name }}
                </small>
              </div>

              <div class="col-12 md:col-2">
                <small class="text-500">
                  {{ item.used_capacity }} / {{ item.course_class.class_capacity }}
                </small>
              </div>

              <div class="col-12 md:col-2 text-right">
                <Tag v-if="item.used_capacity == item.course_class.class_capacity" value="Booking Closed" severity="secondary" />
                <Button v-if="item.used_capacity < item.course_class.class_capacity" label="Book Now" rounded />
              </div>

            </div>
          </template>
        </Card>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
dayjs.locale('id')

const dates = ref([])
const loading = ref(true)
const schedule = ref([])
const dateSchedule = ref([])
const selectedDate = ref(null)

const generateDates = () => {
  const start = dayjs()
  const end = start.add(1, 'month').endOf('month')

  const temp = []
  let current = start
  selectedDate.value = current.format('ddd, DD MMMM')

  dateSchedule.value = schedule.value.filter(item => item.datetime_schedule == selectedDate.value.iso)

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    temp.push({
      iso: current.format('YYYY-MM-DD HH:MM:ss'),
      dayLabel: current.format('ddd'),
      dayNumber: current.format('DD'),
      dayMonth: current.format('ddd, DD MMMM'),
      active: current.isSame(start, 'day'),
    })

    current = current.add(1, 'day')
  }

  dates.value = temp
}

// const formattedDate = ((fullDate) => {
//   let dateObj = new Date(fullDate.replace(' ', 'T'))
//   dateObj.toLocaleDateString('en-US', {
//     weekday: 'short',
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric'
//   })
// })

const formattedTime = ((fullDate) => {
  let dateObj = new Date(fullDate.replace(' ', 'T'))
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})

const setActiveDate = (selected) => {
  dateSchedule.value = ref([])

  dates.value.forEach(d => (d.active = false))
  selected.active = true
  selectedDate.value = selected.dayMonth

  dateSchedule.value = schedule.value.filter(item => dayjs(item.datetime_schedule).isSame(dayjs(selected.iso), 'day'))

  // later: fetch timetable(selected.iso)
}

// const filters = ref([
//   {
//     label: 'All categories',
//     value: null,
//     options: [
//       { label: 'All', value: null },
//       { label: 'Barrel', value: 'barrel' },
//     ],
//   },
//   {
//     label: 'Location',
//     value: null,
//     options: [
//       { label: 'Sunter', value: 'sunter' },
//     ],
//   },
//   {
//     label: 'Classes',
//     value: null,
//     options: [
//       { label: 'Group Class', value: 'group' },
//     ],
//   },
//   {
//     label: 'Instructor',
//     value: null,
//     options: [
//       { label: 'Medina Ms', value: 'medina' },
//     ],
//   },
//   {
//     label: 'Level of difficulty',
//     value: null,
//     options: [
//       { label: 'Beginner', value: 'beginner' },
//     ],
//   },
// ])

const fetchSchedule = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'schedules')
    schedule.value = res.data.data
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSchedule()
  generateDates()
})
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

.schedule-card {
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
