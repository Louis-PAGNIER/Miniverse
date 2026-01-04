import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";

import App from "@/App.vue";

import { createRouter, createWebHistory } from "vue-router";
import Tres from '@tresjs/core';
import {mainRoutes} from "@/router";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faBars,
    faTrash,
    faPlay,
    faRotateLeft,
    faStop,
    faArrowRightArrowLeft,
    faCheck, faArrowUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'

const router = createRouter({
    history: createWebHistory(),
    routes: mainRoutes
})

const app = createApp(App)
const pinia = createPinia()

library.add(
  faBars,
  faStop,
  faTrash,
  faPlay,
  faRotateLeft,
  faArrowRightArrowLeft,
  faCheck,
  faArrowUpRightFromSquare
)

app.use(router)
app.use(Tres)
app.use(pinia)
app.component("FontAwesomeIcon", FontAwesomeIcon)
  .mount('#app')
