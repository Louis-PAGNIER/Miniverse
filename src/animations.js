const lerp = (a, b, t) => a + (b - a) * t;
const easeIn = (t) => t * t;
const easeOut = (t) => t * (2 - t);
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const interpolate = (a, b, t, type = 'linear') => {
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