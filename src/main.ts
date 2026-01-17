import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from "pinia";

import App from "@/App.vue";

import {createRouter, createWebHistory} from "vue-router";
import Tres from '@tresjs/core';
import {mainRoutes} from "@/router";
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {
    faArrowRightArrowLeft,
    faArrowUpRightFromSquare,
    faBars,
    faCheck,
    faPlay,
    faRotateLeft,
    faStop,
    faTrash
} from '@fortawesome/free-solid-svg-icons'

import {vueKeycloak} from '@josempgon/vue-keycloak'

const app = createApp(App)
const pinia = createPinia()

app.use(vueKeycloak, {
    init: {
        // Force le login au chargement
        onLoad: 'login-required',
        // IMPORTANT : Désactive l'iframe qui bug souvent en localhost (cookies tiers)
        checkLoginIframe: false,
        // IMPORTANT : Utilise le flux standard (moderne) qui supporte le refresh token
        flow: 'standard',
        pkceMethod: 'S256',
        enableLogging: true
    },
    config: {
        url: 'http://localhost:8080/',
        realm: 'miniverse',
        clientId: 'miniverse-client',
    }
    // config: {
    //     url: 'http://localhost:8080/', // TODO: change this url and make it in compile env vars
    //     realm: 'miniverse',
    //     clientId: 'miniverse-client',
    // }
})

const router = createRouter({
    history: createWebHistory(),
    routes: mainRoutes
})

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
