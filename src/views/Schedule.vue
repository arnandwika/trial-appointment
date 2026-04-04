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

      <div v-if="dateSchedule" class="flex flex-column gap-3">
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
                <Button :loading="loading" v-if="item.used_capacity < item.course_class.class_capacity" label="Book Now" rounded @click="validationBook(item)"/>
              </div>

            </div>
          </template>
        </Card>
      </div>

      <div v-if="!dateSchedule || dateSchedule.length === 0" class="flex flex-column align-items-center justify-content-center text-center p-6">

        <!-- Icon -->
        <i class="pi pi-book text-4xl text-300 mb-4"></i>

        <!-- Title -->
        <div class="text-xl font-semibold mb-2">
          No classes are available on {{ selectedDate }}
        </div>

        <!-- Description -->
        <div class="text-600 mb-4">
          New classes will be added soon.
        </div>
      </div>

    </div>
    <Footer />
  </div>
</template>

<script setup>
import { useLoginModal } from '@/composables/useLoginModal'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useStore } from 'vuex'
import axios from 'axios'
import dayjs from 'dayjs'
dayjs.locale('id')

const dates = ref([])
const loading = ref(true)
const schedule = ref([])
const dateSchedule = ref([])
const selectedDate = ref(null)
const ownSchedule = ref([])

const { openModal } = useLoginModal()
const store = useStore()
const toast = useToast()

const generateDates = () => {
  const start = dayjs()
  const end = start.add(1, 'month').endOf('month')

  const temp = []
  let current = start

  selectedDate.value = current.format('dddd, DD MMMM')

  dateSchedule.value = schedule.value.filter(item => dayjs(item.datetime_schedule).isSame(dayjs(selectedDate.value.iso), 'day'))

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    temp.push({
      iso: current.format('YYYY-MM-DD HH:mm:ss'),
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

const getOwnSchedule = async () => {
  loading.value = true
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'booking/mine', {
      params: {
        user_id: store.getters.user.id
      },
    })
    res.data.data.forEach(element => {
      element.schedule.datetime_schedule = dayjs(element.schedule.datetime_schedule).format('DD-MM-YYYY HH:mm')
    })
    ownSchedule.value = res.data.data
  } finally {
    loading.value = false
  }
}

const fetchSchedule = async () => {
  try {
    const res = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'schedule')
    schedule.value = res.data.data
  } finally {
    loading.value = false
  }
}

const validationBook = async (schedule) => {
  if (!store.getters.user) {
    openModal()
  } else {
    let canBook = false
    let alreadyBook = false
    let errorMessage = ''
    let orderDetailId = null
    loading.value = true

    if (ownSchedule.value && store.getters.user.role != 'admin') {
      ownSchedule.value.forEach(element => {
        if (element.schedule.id == schedule.id && alreadyBook == false) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'You already book this class',
            life: 4000
          })
          alreadyBook = true
        }
      })
    }

    if (alreadyBook) {
      loading.value = false
      return
    }

    try {
      const res = await axios.get(
        process.env.VUE_APP_APPOINTMENT_API + 'user',
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.token
          }
        },
      )

      store.dispatch('login', res.data)

      canBook = true
    } catch (error) {
      if (localStorage.token) {
        toast.add({
          severity: 'error',
          summary: 'Token Expired',
          detail: 'Please log in again',
          life: 4000
        })
      }
      canBook = false
      localStorage.removeItem('token')
      store.dispatch('logout')
      loading.value = false
      openModal()
    }

    if (canBook) {
      canBook = false

      try {
        const res2 = await axios.get(process.env.VUE_APP_APPOINTMENT_API + 'orders/my-transaction/' + store.getters.user.id)
        store.dispatch('storeUserTransaction', res2.data.data)

        store.getters.userTransaction.forEach(element1 => {
          element1.order_details.forEach(element2 => {
            if (element2.class_id == schedule.course_class.id && !canBook) {
              let expired = dayjs(element2.valid_until).format('YYYY-MM-DD')
              if (element1.status == 'active' && dayjs(expired).isAfter(dayjs().format('YYYY-MM-DD')) || dayjs(expired).isSame(dayjs().format('YYYY-MM-DD'))) {
                canBook = true
                orderDetailId = element2.id
              } else if (element1.status == 'inactive') {
                errorMessage = 'Your packages transaction not yet activated by Admin'
              } else if (element1.status == 'active' && dayjs(expired).isBefore(dayjs().format('YYYY-MM-DD'))) {
                errorMessage = 'Your packages is expired'
              }
            }
          })
        })

        if (!canBook) {
          toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage ? errorMessage : 'Class schedule not included in your Packages',
            life: 4000
          })
        }
      } catch (error) {
        console.log(error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'You do not have any Packages yet',
          life: 4000
        })
        canBook = false
      }

      if (canBook) book(schedule, orderDetailId)
    }
    loading.value = false
  }
}

const book = async (schedule, orderDetailId) => {
  if (store.getters.userTransaction) {
    try {
      await axios.post(
        process.env.VUE_APP_APPOINTMENT_API + 'booking',
        {
          user_id: store.getters.user.id,
          order_detail_id: orderDetailId,
          class_id: schedule.course_class.id,
          trainer_id: schedule.trainer.id,
          schedule_id: schedule.id,
          booking_date: schedule.datetime_schedule,
          status: 'active'
        }
      )
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Schedule booked',
        life: 4000
      })
      await fetchSchedule()
      if (store.getters.user) await getOwnSchedule()
      generateDates()
    } catch (e) {
      toast.add({
        severity: 'error',
        summary: 'Server Error',
        detail: 'Schedule book error',
        life: 4000
      })
    }
    loading.value = false
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
  }
  await fetchSchedule()
  if (store.getters.user) await getOwnSchedule()
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
