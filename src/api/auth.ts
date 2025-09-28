import axios from "axios";
import {API_BASE} from "@/api/api";

export async function apiLogin(username: string, password: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await axios.post(`${API_BASE}/login`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    withCredentials: true
  });
  const token = response.data.access_token;

  localStorage.setItem("access_token", token);
  console.log("storage: ", localStorage.getItem("access_token"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return token;
}

export function apiLogout() {
  localStorage.removeItem("access_token");
  delete axios.defaults.headers.common["Authorization"];
}

export function initAuth() {
  const token: string | null = localStorage.getItem("access_token");
  if (false && token) {
    console.log("token: ", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("No access token found in localStorage.");
    console.log("Logging with default credentials...");
    apiLogin("Louis", "1234").then(() => {
      console.log("Default credentials logged in successfully.");
    }).catch(error => {
      console.error("Failed to log in with default credentials:", error);
    });
  }
}
