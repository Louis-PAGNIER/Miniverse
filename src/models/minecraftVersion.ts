import {MinecraftVersionType} from "@/models/enums/minecraftVersionType";

export interface MinecraftVersion {
  version: string;
  version_type: MinecraftVersionType;
  date: string;
  major: boolean;
}