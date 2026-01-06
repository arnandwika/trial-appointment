import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import PrimeVue from 'primevue/config'
import Button from 'primevue/button'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import './assets/main.scss'

const app = createApp(App)

app.use(PrimeVue)
app.component('Button', Button)

app.use(router)
app.use(store)

app.mount('#app')
