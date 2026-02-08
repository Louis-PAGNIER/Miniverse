import {apiClient} from "@/api/api";

export function apiLogout() {
    localStorage.removeItem("access_token");
    delete apiClient.defaults.headers.common["Authorization"];
} // TODO : implement this with keycloak
