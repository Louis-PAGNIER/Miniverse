import {ModelAnimation} from "@/models/modelAnimation";
import {Vector3} from "three";
import {InterpolationType} from "@/composables/animations";

export const PlayerFloatAnimation: ModelAnimation = {
  duration: 10.0,
  offset: new Vector3(0.0, -2.25, 0.0),
  start: 0.0,
  keyframes: new Map<string, any[]>([
    ['body', [
      {time: 0.0, rotation: new Vector3(1.6, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.33, rotation: new Vector3(1.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.66, rotation: new Vector3(1.8, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['left-arm', [
      {time: 0.0, rotation: new Vector3(0.3, 0.0, 1.75), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.5, rotation: new Vector3(-0.2, 0.0, 0.7), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['right-arm', [
      {time: 0.0, rotation: new Vector3(0.0, 0.0, -1.04), interpolation: InterpolationType.LINEAR},
      {time: 0.3, rotation: new Vector3(0.3, 0.0, -1.8), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.7, rotation: new Vector3(-0.2, 0.0, -0.8), interpolation: InterpolationType.EASE_IN},
    ]],

    ['left-leg', [
      {time: 0.0, rotation: new Vector3(0.1, 0.0, 1.0), interpolation: InterpolationType.LINEAR},
      {time: 0.4, rotation: new Vector3(-0.1, 0.0, 0.2), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.8, rotation: new Vector3(0.1, 0.0, 0.4), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['right-leg', [
      {time: 0.0, rotation: new Vector3(0.35, 0.0, -0.9), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.6, rotation: new Vector3(0.45, 0.0, -0.1), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['head', [
      {time: 0.0, rotation: new Vector3(-0.7, -0.2, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.6, rotation: new Vector3(-0.6, 0.2, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],
  ])
};