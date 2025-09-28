export interface Player {
  id: string;
  name: string;
}

export interface MiniversePlayerList {
  miniverseId: string;
  players: Player[];
}