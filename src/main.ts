import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";

import App from "@/App.vue";

import { createRouter, createWebHistory } from "vue-router";
import Tres from '@tresjs/core';
import {mainRoutes} from "@/router";

const router = createRouter({
    history: createWebHistory(),
    routes: mainRoutes
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(Tres)
app.use(pinia)
app.mount('#app')
