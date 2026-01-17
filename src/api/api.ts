export const API_BASE = "/api";
export const WS_BASE = "wss://localhost:5173/ws";

import axios from 'axios'
import {getToken, useKeycloak} from '@josempgon/vue-keycloak'

// Request interceptor for API calls
axios.interceptors.request.use(
    async config => {
        console.info("Get Token")
        const test = useKeycloak();
        console.log(test);
        const token = await getToken(10000000)
        console.info("Get Tokendqslkldqskm")
        config.headers['Authorization'] = `Bearer ${token}`
        return config
    },
    error => {
        console.info(error)
        Promise.reject(error)
    }
)