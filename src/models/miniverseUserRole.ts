import {Role} from "@/models/enums/role";

export interface MiniverseUserRole {
  user_id: string;
  miniverse_id: string;
  role: Role
}