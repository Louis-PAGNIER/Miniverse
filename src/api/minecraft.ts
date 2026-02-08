import {apiClient} from "@/api/api";
import {MinecraftVersion} from "@/models/minecraftVersion";

export async function apiGetMinecraftVersions(minVersion: string | null = null): Promise<MinecraftVersion[]> {
  const response = await apiClient.get(`/minecraft/versions/${minVersion ? `?min_version=${minVersion}` : ""}`);
  return response.data as MinecraftVersion[];
}