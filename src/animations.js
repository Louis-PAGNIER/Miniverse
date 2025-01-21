const lerp = (a, b, t) => a + (b - a) * t;
const easeIn = (t) => t * t;
const easeOut = (t) => t * (2 - t);
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const cubicBezier = (t, p0, p1, p2, p3) => {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const ttt = tt * t;
  const uuu = uu * u;

  // Calcul du point sur la courbe
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
};


export const interpolate = (a, b, t, type = 'linear') => {
  switch (type) {
    case 'ease-in':
      t = easeIn(t);
      break;
    case 'ease-out':
      t = easeOut(t);
      break;
    case 'ease-in-out':
      t = easeInOut(t);
      break;
    case 'spring':
      t = cubicBezier(t, 0.27, 0.01, 0.73, 1.39)
      break;
    default:
      break;
  }
  return lerp(a, b, t);
};

export const interpolateRotation = (time, keyframes, currentIndex) => {
  if (!keyframes || keyframes.length === 0) return [0, 0, 0];
  if (keyframes.length === 1) return keyframes[0].rotation;

  while (currentIndex.value < keyframes.length - 1 && time > keyframes[currentIndex.value + 1].time)
    currentIndex.value++;

  while (currentIndex.value > 0 && time < keyframes[currentIndex.value].time)
    currentIndex.value--;

  const startFrame = keyframes[currentIndex.value];
  const endFrame = keyframes[currentIndex.value + 1] || keyframes[0];

  if (!startFrame || !endFrame) return [0, 0, 0];

  const startTime = startFrame.time
  const endTime = endFrame.time >= startTime ? endFrame.time : 1;

  const t = (time - startTime) / (endTime - startTime);

  return startFrame.rotation.map((start, i) =>
    interpolate(
      start,
      endFrame.rotation[i],
      t,
      startFrame.interpolation || 'linear'
    )
  );
}