import axios from "axios";

export function apiLogout() {
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
} // TODO : implement this with keycloak

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
