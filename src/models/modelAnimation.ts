import {Vector3} from "three";
import {InterpolationType} from "@/scripts/animations";

export interface ModelAnimationKeyframe {
  time: number;
  rotation: Vector3;
  interpolation: InterpolationType;
}

export interface ModelAnimation {
  duration: number;
  offset: Vector3;
  start: number;
  keyframes: Map<string, ModelAnimationKeyframe[]>;
}