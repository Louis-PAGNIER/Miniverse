import axios from "axios";
import {useToastStore} from "@/stores/toastStore";
import {router} from "@/router";

export const API_BASE = "/api";
export const WS_BASE = "/ws";

export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const toastStore = useToastStore();

    let message = error.response?.data?.detail ||
      error.response?.data?.message ||
      "An request error occured";

    if (error.status >= 502) {
      message = "Server is currently unavailable, try again later.  ";
    }

    if (error.status === 403 && error.response?.data?.detail === "Inactive user") {
      router.replace("/request");
    } else {
      toastStore.addToast('Error', message, 'danger');
    }

    return Promise.reject(error);
  }
);