import {Miniverse} from "@/models/miniverse";
import {MSMPOperator, MSMPPlayer, MSMPPlayerBan} from "@/models/player";

export interface SyncEvent {
  type: 'sync';
  data: SyncEventItem[];
}

export interface SyncEventItem {
  miniverse: Miniverse;
  players: MSMPPlayer[];
  seen_players: MSMPPlayer[];
  operators: MSMPOperator[];
  banned_players: MSMPPlayerBan[];
}