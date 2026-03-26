import { Vector3 } from "three";
import { InterpolationType } from "@/composables/animations";
import type { Miniverse } from "@/models/miniverse";

export type ViewMode = 'home' | 'focus' | 'settings';

export const CAMERA_CONFIG = {
  home: { pos: new Vector3(0, 0, 40), duration: 1000, interpolation: InterpolationType.EASE_IN_OUT },
  focus: { pos: new Vector3(0, 20, 100), duration: 1000, interpolation: InterpolationType.EASE_IN_OUT },
  settings: { pos: new Vector3(36, 0, 40), duration: 1000, interpolation: InterpolationType.EASE_IN_OUT },
};

const GRID_CONFIG = {
  WIDTH_FACTOR_DEFAULT: 22,
  WIDTH_FACTOR_FOCUS: 50,
  HORIZONTAL_SPACING: 10,
  VERTICAL_SPACING: 13
};

export interface LayoutTarget {
  position: Vector3;
  scale: number;
}

export class MiniverseLayoutCalculator {
  gridRows: number = 0;

  calculate(miniverses: Miniverse[], mode: ViewMode, focusId: string | null): Map<string, LayoutTarget> {
    const targets = new Map<string, LayoutTarget>();

    const sorted = [...miniverses].sort((a, b) => {
      if (a.started !== b.started) return a.started ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    if (mode === 'focus' && focusId) {
      targets.set(focusId, {
        position: new Vector3(0, 25, 60),
        scale: 1.0
      });

      const others = sorted.filter(m => m.id !== focusId);
      this.fillGrid(others, targets, GRID_CONFIG.WIDTH_FACTOR_FOCUS);
    } else {
      this.fillGrid(sorted, targets, GRID_CONFIG.WIDTH_FACTOR_DEFAULT);
    }

    return targets;
  }


  private fillGrid(list: Miniverse[], map: Map<string, LayoutTarget>, widthFactor: number) {
    const windowRatio = window.innerWidth / window.innerHeight;
    const maxCols = Math.max(1, Math.floor((widthFactor * windowRatio) / GRID_CONFIG.HORIZONTAL_SPACING));
    const rows = Math.ceil(list.length / maxCols);
    this.gridRows = rows;

    list.forEach((m, i) => {
      const row = Math.floor(i / maxCols);

      const isLastRow = (row === rows - 1);
      const itemsInRow = isLastRow ? (list.length % maxCols || maxCols) : maxCols;

      const startX = -((itemsInRow - 1) * GRID_CONFIG.HORIZONTAL_SPACING) / 2;
      const col = i % maxCols;

      map.set(m.id, {
        position: new Vector3(
          startX + col * GRID_CONFIG.HORIZONTAL_SPACING,
          -row * GRID_CONFIG.VERTICAL_SPACING,
          0
        ),
        scale: 1.0
      });
    });
  }

  getMinY(): number {
    return -GRID_CONFIG.VERTICAL_SPACING * (this.gridRows - 1);
  }
}