import './assets/main.css'

import {createApp} from 'vue'
import {createPinia} from "pinia";

import App from "@/App.vue";
import Tres from '@tresjs/core';
import {router} from "@/router";
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
import {initKeycloak} from "@/services/keycloak";

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

initKeycloak().then(() => {
  app
    .component("FontAwesomeIcon", FontAwesomeIcon)
    .mount('#app')
});

