import axios from "axios";

const API_BASE = "http://localhost:5004";

export async function fetchMiniverses() {
  const response = await axios.get(`${API_BASE}/miniverses/`);
  return response.data;
}