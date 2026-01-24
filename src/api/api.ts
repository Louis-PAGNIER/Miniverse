export const API_BASE = "/api";
export const WS_BASE = "/ws";

// import axios from 'axios'
// Intercepteur pour ajouter le token dynamiquement
// axios.interceptors.request.use(async (config) => {
//     // Optionnel : force un rafraîchissement avant chaque appel si nécessaire
//     await keycloak.updateToken(30);
//
//     config.headers.Authorization = `Bearer ${keycloak.token}`;
//     return config;
// });