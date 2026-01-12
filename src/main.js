import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import AxiosPlugin from './plugins/axios'

import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './assets/main.scss'

const app = createApp(App)

app.use(PrimeVue)
app.component('Button', Button)
app.component('Card', Card)
app.component('Skeleton', Skeleton)

app.use(router)
app.use(store)
// app.use(AxiosPlugin)

app.mount('#app')
