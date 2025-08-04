import { computed, shallowRef, watch } from 'vue';
import { PositionAnimator } from '@/scripts/animations.js';

export function useMiniverseGrid({ cameraPos, focusedMiniverse, miniverses, miniversesRefs }) {
  const GRID_WIDTH_FACTOR_DEFAULT = 22;
  const GRID_WIDTH_FACTOR_FOCUS = 50;
  const GRID_HORIZONTAL_SPACING = 10;
  const GRID_VERTICAL_SPACING = 13;
  const gridRows = shallowRef(0);

  const wrapMiniverses = (raw, previous = []) => {
    const previousById = Object.fromEntries(previous.map(m => [m.id, m]));

    return raw.map(m => {
      const existing = previousById[m.id];

      return {
        ...m,
        position: existing?.position ?? new PositionAnimator(),
        scale: existing?.scale ?? 1,
      };
    });
  };

  const computeGridDistribution = (items, gridWidthFactor, horizontal_spacing, vertical_spacing) => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxGridWidth = gridWidthFactor * windowWidth / windowHeight;

    const maxColumns = Math.floor(maxGridWidth / horizontal_spacing);
    const columns = Math.min(items.length, maxColumns);
    const rows = Math.ceil(items.length / columns);

    let startX = -((columns - 1) * horizontal_spacing) / 2;
    const startY = 0;

    const newPositions = [];

    let i = 0;
    let col = 0;
    let row = 0;
    let even = true;

    while (i < items.length) {
      const currentRow = Math.floor(i / columns);
      const isLastRow = currentRow === rows - 1;
      const spheresInLastRow = items.length % columns;

      if (isLastRow && spheresInLastRow !== 0) {
        startX = -((spheresInLastRow - 1) * horizontal_spacing) / 2;
        if (col > spheresInLastRow - 1)
          col = spheresInLastRow - 1;
      }

      const x = startX + col * horizontal_spacing;
      const y = startY - row * vertical_spacing;

      newPositions.push([x, y, 0]);

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

    return [newPositions, rows];
  }

  const filteredMiniverses = computed(() => {
    const skipId = focusedMiniverse.value?.id;
    return skipId
      ? miniverses.value.filter((m) => m.id !== skipId)
      : miniverses.value;
  });

  const gridWidthFactor = computed(() =>
    focusedMiniverse.value ? GRID_WIDTH_FACTOR_FOCUS : GRID_WIDTH_FACTOR_DEFAULT
  );

  const distributeMiniverses = (animated = true) => {
    const [positions, rows] = computeGridDistribution(
      filteredMiniverses.value,
      gridWidthFactor.value,
      GRID_HORIZONTAL_SPACING,
      GRID_VERTICAL_SPACING
    );
    gridRows.value = rows;

    filteredMiniverses.value.forEach((m, i) => {
      const duration = animated ? 1000 + Math.random() * 700 : 0;
      m.position.setGoalPosition(...positions[i], duration, 'ease-out');
    });

    checkCameraBounds();
  };

  watch(miniverses, () => {
    distributeMiniverses();
  })

  const checkCameraBounds = () => {
    if (!focusedMiniverse.value) {
      const y = cameraPos.endY;
      const minY = -GRID_VERTICAL_SPACING * (gridRows.value - 1);
      const maxY = 0;

      if (y > maxY) cameraPos.setGoalPosition(cameraPos.value[0], maxY, cameraPos.value[2], 0);
      else if (y < minY) cameraPos.setGoalPosition(cameraPos.value[0], minY, cameraPos.value[2], 0);
    }
  };

  const focusMiniverse = (m) => {
    focusedMiniverse.value = m;
    if (!m) {
      cameraPos.setGoalPosition(0, 0, 40, 1000, 'ease-out');
    } else {
      cameraPos.setGoalPosition(0, 20, 100, 1000, 'ease-out');
      m.position.setGoalPosition(0, 25, 60, 1000, 'ease-out');
    }
    distributeMiniverses();
  };

  const setMiniversesRef = (el, index) => {
    miniversesRefs.value[index] = el;
  };

  const handleResize = () => distributeMiniverses();
  const handleScroll = (e) => {
    if (!focusedMiniverse.value) {
      cameraPos.setGoalPosition(cameraPos.value[0], cameraPos.value[1] - e.deltaY * 0.01, cameraPos.value[2]);
      checkCameraBounds();
    }
  };

  const handleMouseEnter = (m) => {
    m.scale = 1.2;
    document.body.style.cursor = "pointer";
  };

  const handleMouseLeave = (m) => {
    m.scale = 1;
    document.body.style.cursor = "default";
  };

  const handleMiniverseClick = (miniverse) => focusMiniverse(miniverse);

  return {
    gridRows,
    wrapMiniverses,
    distributeMiniverses,
    focusMiniverse,
    setMiniversesRef,
    handleResize,
    handleScroll,
    handleMouseEnter,
    handleMouseLeave,
    handleMiniverseClick,
  };
}