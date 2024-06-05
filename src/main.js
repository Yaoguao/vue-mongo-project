
import './assets/main.css'


import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify.js'
import router from "@/plugins/router.js";

createApp(App)
    .use(vuetify)
    .use(router)
    .mount('#app')

