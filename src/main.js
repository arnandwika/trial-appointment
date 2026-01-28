import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import AxiosPlugin from './plugins/axios'

import PrimeVue from 'primevue/config'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import ToastService from 'primevue/toastservice'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Divider from 'primevue/divider'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './assets/main.scss'

const app = createApp(App)

app.use(PrimeVue)
app.use(ToastService)
app.component('Button', Button)
app.component('Card', Card)
app.component('Skeleton', Skeleton)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Tag', Tag)
app.component('Badge', Badge)
app.component('Divider', Divider)

app.use(router)
app.use(store)
// app.use(AxiosPlugin)

app.mount('#app')
