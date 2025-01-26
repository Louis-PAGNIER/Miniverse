export function addScalar(arr, n) {
  return arr.map(x => x + n);
}

export function subScalar(arr, n) {
  return arr.map(x => x - n);
}

export function mulScalar(arr, n) {
  return arr.map(x => x * n);
}

export function divScalar(arr, n) {
  return arr.map(x => x / n);
}

export function addArray(arr1, arr2) {
  return arr1.map((x, i) => { return x + arr2[i] })
}

export function subArray(arr1, arr2) {
  return arr1.map((x, i) => { return x - arr2[i] })
}

export function mulArray(arr1, arr2) {
  return arr1.map((x, i) => { return x * arr2[i] })
}

export function divArray(arr1, arr2) {
  return arr1.map((x, i) => { return x / arr2[i] })
}

export function negArray(arr) {
  return arr.map(x => { return -x })
}

export const generateFibonacciSphere = (numPoints, radius) => {
  if (numPoints === 1) return [{x: 0, y: 0, z: 0}];
  const positions = [];
  const offset = 2 / numPoints;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numPoints; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r * radius;
    const z = Math.sin(phi) * r * radius;

    positions.push({x, y: y * radius, z});
  }

  return positions;
};