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