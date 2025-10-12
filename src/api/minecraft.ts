import axios from "axios";
import {API_BASE} from "@/api/api";
import {MinecraftVersion} from "@/models/minecraftVersion";

export async function apiGetMinecraftVersions(minVersion: string | null = null): Promise<MinecraftVersion[]> {
  const response = await axios.get(`${API_BASE}/minecraft/versions/${minVersion ? `?min_version=${minVersion}` : ""}`);
  return response.data as MinecraftVersion[];
}