import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPrismic } from "@prismicio/vue";
import App from './App.vue'

const prismic = createPrismic({
  endpoint: "tables-london",
});

const app = createApp(App)

app.use(createPinia())

app.mount('#app')
