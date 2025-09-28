import {Ref} from "vue";
import {Vector3} from "three";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (t: number) => t * t;
const easeOut = (t: number) => t * (2 - t);
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

export enum InterpolationType {
  LINEAR = 'linear',
  EASE_IN = 'ease-in',
  EASE_OUT = 'ease-out',
  EASE_IN_OUT = 'ease-in-out'
}

export const interpolate = (a: number, b: number, t: number, type: InterpolationType = InterpolationType.LINEAR) => {
  switch (type) {
    case InterpolationType.EASE_IN:
      t = easeIn(t);
      break;
    case InterpolationType.EASE_OUT:
      t = easeOut(t);
      break;
    case InterpolationType.EASE_IN_OUT:
      t = easeInOut(t);
      break;
    default:
      break;
  }
  return lerp(a, b, t);
};

export const interpolateRotation = (time: number, keyframes: any, currentIndex: Ref<number>) => {
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

  return startFrame.rotation.map((start: number, i: number) =>
    interpolate(
      start,
      endFrame.rotation[i],
      t,
      startFrame.interpolation || 'linear'
    )
  );
}

abstract class Animator<T> {
  finished: boolean = true;
  duration: number = 0;
  t: number = 0;
  type: InterpolationType = InterpolationType.LINEAR;

  startValue!: T;
  endValue!: T;
  currentValue!: T;

  constructor(initial: T) {
    this.setCurrent(initial);
    this.setGoal(initial);
  }

  abstract lerp(a: T, b: T, t: number, type: InterpolationType): T;

  setStart(value: T) {
    this.startValue = value;
  }

  setCurrent(value: T) {
    this.currentValue = value;
  }

  setGoal(value: T, duration: number = 0, type: InterpolationType = InterpolationType.LINEAR) {
    this.endValue = value;
    this.duration = duration;

    if (duration === 0) {
      return this.setCurrent(value);
    }

    this.type = type;
    this.setStart(this.currentValue);
    this.t = 0;
    this.finished = false;
  }

  update(delta: number) {
    if (this.finished) return true;

    this.t += (delta * 1000) / this.duration;
    if (this.t > 1) this.t = 1;

    this.currentValue = this.lerp(this.startValue, this.endValue, this.t, this.type);

    if (this.t === 1) {
      this.type = InterpolationType.LINEAR;
      this.finished = true;
    }

    return this.finished;
  }

  get value(): T {
    return this.currentValue;
  }
}

export class NumberAnimator extends Animator<number> {
  lerp(a: number, b: number, t: number, type: InterpolationType): number {
    return interpolate(a, b, t, type);
  }

  constructor(initial: number = 0) {
    super(initial);
  }
}

export class Vector3Animator extends Animator<Vector3> {
  lerp(a: Vector3, b: Vector3, t: number, type: InterpolationType): Vector3 {
    return new Vector3(interpolate(a.x, b.x, t, type), interpolate(a.y, b.y, t, type), interpolate(a.z, b.z, t, type));
  }

  constructor(initial: Vector3 = new Vector3(0, 0, 0)) {
    super(initial);
  }
}


/*

export class PositionAnimator {
  finished: boolean = true;
  x: number = 0
  y: number = 0
  z: number = 0
  startX: number = 0
  startY: number = 0
  startZ: number = 0
  endX: number = 0
  endY: number = 0
  endZ: number = 0
  duration: number = 0
  t: number = 0
  type: InterpolationType = InterpolationType.LINEAR

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.setCurrentPosition(x, y, z);
    this.setGoalPosition(x, y, z);
    this.finished = true;
  }

  get value() {
    return [this.x, this.y, this.z];
  }

  setStartPosition(x: number, y: number, z: number) {
    this.startX = x;
    this.startY = y;
    this.startZ = z;
  }

  setCurrentPosition(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setGoalPosition(x: number, y: number, z: number, duration: number = 0, type: InterpolationType = InterpolationType.LINEAR) {
    this.endX = x;
    this.endY = y;
    this.endZ = z;
    this.duration = duration;

    if (duration === 0)
      return this.setCurrentPosition(x, y, z);

    this.type = type;
    this.setStartPosition(this.x, this.y, this.z);
    this.t = 0;
    this.finished = false;
  }

  updatePosition(delta: number) {
    if (this.finished) return true;

    this.t += delta * 1000 / this.duration;
    if (this.t > 1) this.t = 1;

    this.x = interpolate(this.startX, this.endX, this.t, this.type);
    this.y = interpolate(this.startY, this.endY, this.t, this.type);
    this.z = interpolate(this.startZ, this.endZ, this.t, this.type);

    if (this.t === 1) {
      this.type = InterpolationType.LINEAR;
      this.finished = true;
    }

    return this.finished;
  }
}*/
