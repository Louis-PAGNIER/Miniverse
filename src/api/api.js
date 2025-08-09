import axios from "axios";

const API_BASE = "http://localhost:5004";

export async function fetchMiniverses() {
  const response = await axios.get(`${API_BASE}/miniverses/`);
  return response.data.filter(miniverse => miniverse.infos.connected_players);
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