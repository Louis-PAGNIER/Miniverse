import {apiClient} from "@/api/api";
import {User} from "@/models/user";
import {Role} from "@/models/enums/role";

export async function apiGetMe(): Promise<User> {
  return (await apiClient.get(`/users/me`)).data;
}

export async function apiListUsers(): Promise<User[]> {
  return (await apiClient.get(`/users/`)).data;
}

export async function apiDeleteUser(userId: string): Promise<void> {
  return (await apiClient.delete(`/users/${userId}`));
}

export async function apiSetRole(userId: string, role: Role): Promise<void> {
  return (await apiClient.put(`/users/${userId}/role`, {role}));
}