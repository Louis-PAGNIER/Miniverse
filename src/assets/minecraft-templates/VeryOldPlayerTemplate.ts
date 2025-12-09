import {ModelTemplate} from "@/models/modelTemplate";
import {Vector3, Vector4} from "three";

export const VeryOldPlayerTemplate: ModelTemplate = {
  id: "body",
  position: new Vector3(0, 2.25, 0),
  rotationCenter: new Vector3(0, 0, 0),
  size: new Vector3(1, 1.5, 0.5),
  coords: [
    new Vector4(28, 20, 32, 32),
    new Vector4(16, 20, 20, 32),
    new Vector4(20, 16, 28, 20),
    new Vector4(28, 16, 36, 20),
    new Vector4(20, 20, 28, 32),
    new Vector4(32, 20, 40, 32),
  ],
  transparent: false,
  children: [
    {
      id: "left-arm",
      position: new Vector3(0.75, 0, 0),
      rotationCenter: new Vector3(0, 0.5625, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(44, 20, 40, 32),
        new Vector4(52, 20, 48, 32),
        new Vector4(48, 16, 44, 20),
        new Vector4(52, 16, 48, 20),
        new Vector4(48, 20, 44, 32),
        new Vector4(56, 20, 52, 32),
      ],
      transparent: false,
    },

    {
      id: "right-arm",
      position: new Vector3(-0.75, 0, 0),
      rotationCenter: new Vector3(0, 0.5625, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(48, 20, 52, 32),
        new Vector4(40, 20, 44, 32),
        new Vector4(44, 16, 48, 20),
        new Vector4(48, 16, 52, 20),
        new Vector4(44, 20, 48, 32),
        new Vector4(52, 20, 56, 32),
      ],
      transparent: false,
    },

    {
      id: "left-leg",
      position: new Vector3(0.25, -1.5, 0),
      rotationCenter: new Vector3(0, 0.75, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(4, 20, 0, 32),
        new Vector4(12, 20, 8, 32),
        new Vector4(4, 16, 8, 20),
        new Vector4(8, 16, 12, 20),
        new Vector4(8, 20, 4, 32),
        new Vector4(16, 20, 12, 32),
      ],
      transparent: false,
    },

    {
      id: "right-leg",
      position: new Vector3(-0.25, -1.5, 0),
      rotationCenter: new Vector3(0, 0.75, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(8, 20, 12, 32),
        new Vector4(0, 20, 4, 32),
        new Vector4(4, 16, 8, 20),
        new Vector4(8, 16, 12, 20),
        new Vector4(4, 20, 8, 32),
        new Vector4(12, 20, 16, 32),
      ],
      transparent: false
    },

    {
      id: "head",
      position: new Vector3(0, 1.25, 0),
      rotationCenter: new Vector3(0, -0.5, 0),
      size: new Vector3(1, 1, 1),
      coords: [
        new Vector4(16, 8, 24, 16),
        new Vector4(0, 8, 8, 16),
        new Vector4(8, 0, 16, 8),
        new Vector4(16, 0, 24, 8),
        new Vector4(8, 8, 16, 16),
        new Vector4(24, 8, 32, 16),
      ],
      transparent: false
    }
  ]
}