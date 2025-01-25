const lerp = (a, b, t) => a + (b - a) * t;
const easeIn = (t) => t * t;
const easeOut = (t) => t * (2 - t);
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const cubicBezier = (t, p1x, p1y, p2x, p2y) => {
  return 3 * (1 - t) * (1 - t) * t * p1y + 3 * (1 - t) * t * t * p2y + t * t * t;
}


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
      t = cubicBezier(t, 0.32, 0.97, 0.0, 1.16)
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

export class PositionAnimator {
  constructor(x = 0, y = 0, z = 0) {
    this.setCurrentPosition(x, y, z);
    this.setGoalPosition(x, y, z);
    this.finished = true;
  }

  get value() {
    return [this.x, this.y, this.z];
  }

  get realValue() {
    return [this.endX, this.endY, this.endZ];
  }

  setStartPosition(x, y, z) {
    this.startX = x;
    this.startY = y;
    this.startZ = z;
  }

  setCurrentPosition(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setGoalPosition(x, y, z, duration = 1000, type = 'linear') {
    if (duration === 0)
      return this.setCurrentPosition(x, y, z);

    this.type = type;
    this.endX = x;
    this.endY = y;
    this.endZ = z;
    this.duration = duration;
    this.setStartPosition(this.x, this.y, this.z);
    this.t = 0;
    this.finished = false;
  }

  updatePosition(delta) {
    if (this.finished) return true;

    this.t += delta * 1000 / this.duration;
    if (this.t > 1) this.t = 1;

    this.x = interpolate(this.startX, this.endX, this.t, this.type);
    this.y = interpolate(this.startY, this.endY, this.t, this.type);
    this.z = interpolate(this.startZ, this.endZ, this.t, this.type);

    if (this.t === 1) {
      this.type = 'linear';
      this.finished = true;
    }

    return this.finished;
  }
}