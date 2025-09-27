import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function fetchMiniverses() {
  console.log(axios.defaults.headers.common["Authorization"])
  return (await axios.get(`${API_BASE}/miniverses/`)).data;
}

export async function fetchPlayers() {
  return (await axios.get(`${API_BASE}/miniverses/players/`)).data;
}

export async function createMiniverse(name, description, type, MCVersion, maxPlayers, subDomain) {
  const response = await axios.post(`${API_BASE}/miniverses/`, {
    name: name,
    server_type: type,
    mc_version: MCVersion,
    max_players: maxPlayers,
    description: description,
    subdomain: subDomain,
  });
  return response.data;
}