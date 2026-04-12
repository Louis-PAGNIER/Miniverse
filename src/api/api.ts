import axios, {AxiosError} from "axios";
import {useToastStore} from "@/stores/toastStore";
import {router} from "@/router";

export const API_BASE = "/api";
export const WS_BASE = "/ws";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});

export function showHTTPError(error: AxiosError) {
  const toastStore = useToastStore();
  let message = error.message || "A request error occurred";

  if (error.status && error.status >= 502) {
    message = "Server is currently unavailable, try again later.";
  }
  toastStore.addToast('Error', message, 'danger');
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.status === 403 && error.response?.data?.detail === "Inactive user") {
      router.replace("/request");
    } else if (error.status < 480 && error.status >= 500 ) {
      // We consider 480-499 errors as to handle by the client
      showHTTPError(error);
    }

    return Promise.reject(error);
  }
);