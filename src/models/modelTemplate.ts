import {Vector3, Vector4} from "three";

export interface ModelTemplate {
  id: string
  position: Vector3
  rotationCenter: Vector3
  size: Vector3
  coords: Vector4[]
  transparent: boolean
  children?: ModelTemplate[]
}