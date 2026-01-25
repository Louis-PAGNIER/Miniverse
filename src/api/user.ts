import {apiClient} from "@/api/api";
import {User} from "@/models/user";

export async function apiGetMe(): Promise<User> {
  return (await apiClient.get(`/users/me`)).data;
}