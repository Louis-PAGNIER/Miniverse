export function calculateGridDistribution(items, gridWidthFactor, spacing) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const maxGridWidth = gridWidthFactor * windowWidth / windowHeight;

  const maxColumns = Math.floor(maxGridWidth / spacing);
  const columns = Math.min(items.length, maxColumns);
  const rows = Math.ceil(items.length / columns);

  let startX = -((columns - 1) * spacing) / 2;
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
      startX = -((spheresInLastRow - 1) * spacing) / 2;
      if (col > spheresInLastRow - 1)
        col = spheresInLastRow - 1;
    }

    const x = startX + col * spacing;
    const y = startY - row * spacing;

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