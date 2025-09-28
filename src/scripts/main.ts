import '../assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";

import App from "@/App.vue";

import { createRouter, createWebHistory } from "vue-router";
import Tres from '@tresjs/core';
import routes from "~pages";

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(Tres)
app.use(pinia)
app.mount('#app')
