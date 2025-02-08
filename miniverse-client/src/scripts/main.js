import '../assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from "vue-router";
import Tres from '@tresjs/core'
import routes from "~pages";

import App from '../App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.use(Tres)
app.mount('#app')
