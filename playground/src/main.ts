import { createApp } from 'vue'
import { MotionPlugin } from '@vueuse/motion'
import NexaUI from 'nexa-ui'
import 'nexa-ui/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(MotionPlugin)
app.use(NexaUI)
app.mount('#app')
