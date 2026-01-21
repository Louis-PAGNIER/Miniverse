import axios from "axios";
import {API_BASE} from "@/api/api";
import {User} from "@/models/user";

export async function apiGetMe(): Promise<User> {
  return (await axios.get(`${API_BASE}/users/me`)).data;
}