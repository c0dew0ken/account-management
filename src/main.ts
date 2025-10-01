import { createApp } from 'vue'
import { createPinia } from 'pinia'

import vuetify from '@/plugins/vuetify'
import App from '@/App.vue'

import '@/assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia).use(vuetify).mount('#app')
