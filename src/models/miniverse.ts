import {NumberAnimator, Vector3Animator} from "@/composables/animations";
import {MiniverseType} from "@/models/enums/miniverseType";
import {MiniverseUserRole} from "@/models/miniverseUserRole";
import {Mod} from "@/models/mod";

export interface Miniverse {
  id: string;
  name: string;
  type: MiniverseType;
  description: string;
  mc_version: string;
  subdomain: string;
  is_on_lite_proxy: boolean;
  started: boolean;

  users_roles: MiniverseUserRole[];
  mods: Mod[];
}

export class MiniverseAnimator {
  miniverse: Miniverse;
  positionAnimator: Vector3Animator;
  scaleAnimator: NumberAnimator;

  constructor(miniverse: Miniverse) {
    this.miniverse = miniverse;
    this.positionAnimator = new Vector3Animator();
    this.scaleAnimator = new NumberAnimator(1.0);
  }
}