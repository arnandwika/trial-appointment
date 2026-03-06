import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Form, Field, ErrorMessage, defineRule } from "vee-validate"
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
import OverlayPanel from 'primevue/overlaypanel'
import Menu from 'primevue/menu'

import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import './assets/main.scss'

defineRule("required", value => {
  if (!value) return "This field is required"
  return true
})
defineRule("email", value => {
  if (!value) return true

  const regex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/

  return regex.test(value) || "Invalid email address"
})
defineRule("alpha", value => {
  if (!value) return true
  return /^[A-Za-z]+$/.test(value) || "Only alphabet allowed"
})
defineRule("numeric", value => {
  if (!value) return true
  return /^[0-9]+$/.test(value) || "Only numbers allowed"
})
defineRule('confirmed', (value, [target], ctx) => {
  if (value === ctx.form[target]) {
    return true
  }

  return 'Password confirmation does not match'
})

const app = createApp(App)

app.use(PrimeVue)
app.use(ToastService)
app.component('Form', Form);
app.component('Field', Field);
app.component('ErrorMessage', ErrorMessage);
app.component('Button', Button)
app.component('Card', Card)
app.component('Skeleton', Skeleton)
app.component('Dialog', Dialog)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Tag', Tag)
app.component('Badge', Badge)
app.component('Divider', Divider)
app.component('OverlayPanel', OverlayPanel)
app.component('Menu', Menu)

app.use(router)
app.use(store)
// app.use(AxiosPlugin)

app.mount('#app')
