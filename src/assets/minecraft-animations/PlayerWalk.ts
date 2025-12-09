import {ModelAnimation} from "@/models/modelAnimation";
import {Vector3} from "three";
import {InterpolationType} from "@/composables/animations";

export const PlayerWalkAnimation: ModelAnimation = {
  duration: 2.0,
  offset: new Vector3(0.0, 0.0, 0.0),
  start: 0.0,
  keyframes: new Map<string, any[]>([
    ['left-arm', [
      {time: 0.0, rotation: new Vector3(-0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.5, rotation: new Vector3(0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['right-arm', [
      {time: 0.0, rotation: new Vector3(0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.5, rotation: new Vector3(-0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['left-leg', [
      {time: 0.0, rotation: new Vector3(0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.5, rotation: new Vector3(-0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],

    ['right-leg', [
      {time: 0.0, rotation: new Vector3(-0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
      {time: 0.5, rotation: new Vector3(0.5, 0.0, 0.0), interpolation: InterpolationType.EASE_IN_OUT},
    ]],
  ])
};