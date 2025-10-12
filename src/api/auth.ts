import axios from "axios";
import {API_BASE} from "@/api/api";

export async function apiLogin(username: string, password: string): Promise<any[]> {
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
  const decodedToken = atob(token.split(".")[1]);
  const user = JSON.parse(decodedToken)['extras']['user'];

  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(user));

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return [token, user];
}

export function apiLogout() {
  localStorage.removeItem("access_token");
  delete axios.defaults.headers.common["Authorization"];
}

/*
export function initAuth() {
  const token: string | null = localStorage.getItem("access_token");
  if (false && token) {
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
*/
