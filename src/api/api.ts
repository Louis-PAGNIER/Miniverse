import axios from "axios";
import {useToastStore} from "@/stores/toastStore";

export const API_BASE = "/api";
export const WS_BASE = "/ws";

export const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const toastStore = useToastStore();

    const message = error.response?.data?.detail ||
      error.response?.data?.message ||
      "An request error occured";

    toastStore.addToast('Error', message, 'danger');

    return Promise.reject(error);
  }
);