import {NumberAnimator, Vector3Animator} from "@/scripts/animations";
import {Vector3} from "three";
import {markRaw, reactive} from "vue";

export interface Player {
  id: string;
  name: string;
}

export class PlayerAnimator {
  player: Player;

  centerPositionAnimator: Vector3Animator;
  positionFrequency: number;
  positionPhase: number;

  rotationSpeed: Vector3;

  scale: NumberAnimator;

  animationStart: number;

  constructor(player: Player) {
    this.player = reactive(player);

    this.centerPositionAnimator = markRaw(new Vector3Animator());
    this.positionFrequency = 0.2 + Math.random() * 0.3;
    this.positionPhase = Math.random() * Math.PI * 2;
    this.rotationSpeed = markRaw(new Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ));
    this.scale = markRaw(new NumberAnimator(1));
    this.animationStart = Math.random();
  }
}

export function arePlayerListsEqual(a: PlayerAnimator[], b: PlayerAnimator[]): boolean {
  if (a.length !== b.length) return false;
  const aIds = new Set(a.map(p => p.player.id));
  for (const p of b) {
    if (!aIds.has(p.player.id)) return false;
  }
  return true;
}