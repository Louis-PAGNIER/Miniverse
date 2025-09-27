import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function login(username, password) {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await axios.post(`${API_BASE}/login`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  const token = response.data.access_token;

  localStorage.setItem("access_token", token);
  console.log("storage: ", localStorage.getItem("access_token"));
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return token;
}

export function logout() {
  localStorage.removeItem("access_token");
  delete axios.defaults.headers.common["Authorization"];
}

export function initAuth() {
  const token = localStorage.getItem("access_token");
  if (token) {
    console.log("token: ", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn("No access token found in localStorage.");
    console.log("Logging with default credentials...");
    login("Louis", "1234").then(() => {
      console.log("Default credentials logged in successfully.");
    }).catch(error => {
      console.error("Failed to log in with default credentials:", error);
    });
  }
}
