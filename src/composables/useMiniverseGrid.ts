import {Ref} from 'vue';
import {InterpolationType, Vector3Animator} from "@/scripts/animations";
import {MiniverseAnimator} from "@/models/miniverse";
import {useMiniverseStore} from "@/stores/miniverseStore";
import {Vector3} from "three";

const GRID_WIDTH_FACTOR_DEFAULT: number = 22;
const GRID_WIDTH_FACTOR_FOCUS: number = 50;
const GRID_HORIZONTAL_SPACING: number = 10;
const GRID_VERTICAL_SPACING: number = 13;

const miniverseStore = useMiniverseStore();

export class MiniverseAnimatorManager {
  camera: Vector3Animator;
  focusedMiniverse: Ref<MiniverseAnimator | null>;
  gridRows: number;

  constructor(camera: Vector3Animator, focusedMiniverse: Ref<MiniverseAnimator | null>) {
    this.camera = camera;
    this.focusedMiniverse = focusedMiniverse;
    this.gridRows = 0;
  }

  setGridDistribution = (
      animators: MiniverseAnimator[],
      gridWidthFactor: number,
      animated: boolean = true
  ) => {
    const windowWidth: number = window.innerWidth;
    const windowHeight: number = window.innerHeight;
    const maxGridWidth: number = gridWidthFactor * windowWidth / windowHeight;

    const maxColumns: number = Math.max(1, Math.floor(maxGridWidth / GRID_HORIZONTAL_SPACING));
    const columns: number = Math.min(animators.length, maxColumns);
    const rows: number = Math.ceil(animators.length / columns);

    let startX: number = -((columns - 1) * GRID_HORIZONTAL_SPACING) / 2;
    const startY: number = 0;

    let i: number = 0;
    let col: number = 0;
    let row: number = 0;
    let even: boolean = true;

    while (i < animators.length) {
      const currentRow: number = Math.floor(i / columns);
      const isLastRow: boolean = currentRow === rows - 1;
      const spheresInLastRow: number = animators.length % columns;

      if (isLastRow && spheresInLastRow !== 0) {
        startX = -((spheresInLastRow - 1) * GRID_HORIZONTAL_SPACING) / 2;
        if (col > spheresInLastRow - 1)
          col = spheresInLastRow - 1;
      }

      const x: number = startX + col * GRID_HORIZONTAL_SPACING;
      const y: number = startY - row * GRID_VERTICAL_SPACING;

      const duration = animated ? 1000 + Math.random() * 700 : 0;

      animators[i].positionAnimator.setGoal(new Vector3(x, y, 0), duration, InterpolationType.EASE_IN_OUT);

      if (even) {
        if (++col === maxColumns) {
          row++;
          even = false;
          col--;
        }
      } else {
        if (--col === -1) {
          row++;
          even = true;
          col++;
        }
      }

      i++;
    }

    this.gridRows = rows;
    this.checkCameraBounds();
  }

  setDistribution = (
      animators: MiniverseAnimator[],
      animated: boolean = true
  ) => {
    const focusedMiniverseId = this.focusedMiniverse.value?.miniverse.id || null;
    if (focusedMiniverseId === null)
      return this.setGridDistribution(animators, GRID_WIDTH_FACTOR_DEFAULT, animated);

    const focusedIndex = animators.findIndex((a: MiniverseAnimator) => a.miniverse.id === focusedMiniverseId);
    if (focusedIndex === -1)
      return this.setGridDistribution(animators, GRID_WIDTH_FACTOR_DEFAULT, animated);

    const focusedAnimator = animators[focusedIndex];
    focusedAnimator.positionAnimator.setGoal(new Vector3(0, 25, 60), animated ? 1000 : 0, InterpolationType.EASE_IN_OUT);

    const others = animators.filter((a: MiniverseAnimator) => a.miniverse.id !== focusedMiniverseId);
    return this.setGridDistribution(others, GRID_WIDTH_FACTOR_FOCUS, animated);
  };

  checkCameraBounds = () => {
    if (!this.focusedMiniverse.value) {
      const y = this.camera.endValue.y;
      const minY = -GRID_VERTICAL_SPACING * (this.gridRows - 1);
      const maxY = 0;

      if (y > maxY) this.camera.setGoal(new Vector3(this.camera.value.x, maxY, this.camera.value.z), 0);
      else if (y < minY) this.camera.setGoal(new Vector3(this.camera.value.x, minY, this.camera.value.z), 0);
    }
  };

  distributeMiniverses = (animated: boolean = true) => {
    const miniverseAnimators: Map<string, MiniverseAnimator> = miniverseStore.miniverseAnimators;
    if (this.focusedMiniverse.value) {
      this.camera.setGoal(new Vector3(0, 20, 100), 1000, InterpolationType.EASE_IN_OUT);
    } else {
      this.camera.setGoal(new Vector3(0, 0, 40), 1000, InterpolationType.EASE_IN_OUT);
    }
    const sortedMiniverseAnimators: MiniverseAnimator[] = Array.from(miniverseAnimators.values()).sort((a, b) => {
      return a.miniverse.name.localeCompare(b.miniverse.name);
    });
    console.log(sortedMiniverseAnimators)
    this.setDistribution(sortedMiniverseAnimators, animated);
  };

  focusMiniverse = (miniverse: MiniverseAnimator | null, animated: boolean = true) => {
    if (miniverse === null)
    {
      this.focusedMiniverse.value?.scaleAnimator?.setGoal(1.0, 1000, InterpolationType.LINEAR);
    } else {
      miniverse.scaleAnimator.setGoal(1.2, 100, InterpolationType.LINEAR);
    }
    this.focusedMiniverse.value = miniverse ? miniverse : null;
    this.distributeMiniverses(animated);
  };

  handleResize = () => {
    this.distributeMiniverses();
  };

  handleScroll = (e: WheelEvent) => {
    if (!this.focusedMiniverse.value) {
      this.camera.setGoal(new Vector3(this.camera.value.x, this.camera.value.y - e.deltaY * 0.01, this.camera.value.z));
      this.checkCameraBounds();
    }
  };

  handleMouseEnter = (m: MiniverseAnimator) => {
    m.scaleAnimator.setGoal(1.2, 100, InterpolationType.LINEAR);
    document.body.style.cursor = "pointer";
  };

  handleMouseLeave = (m: MiniverseAnimator) => {
    m.scaleAnimator.setGoal(1.0, 100, InterpolationType.LINEAR);
    document.body.style.cursor = "default";
  };

  handleMiniverseClick = (miniverse: MiniverseAnimator) => {
    this.focusMiniverse(miniverse);
  };
}