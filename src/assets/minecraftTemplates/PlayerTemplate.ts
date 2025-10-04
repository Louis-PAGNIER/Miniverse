import {ModelTemplate} from "@/models/modelTemplate";
import {Vector3, Vector4} from "three";

export const PlayerTemplate: ModelTemplate = {
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
      id: "body-layer-2",
      position: new Vector3(0, 0, 0),
      rotationCenter: new Vector3(0, 0, 0),
      size: new Vector3(1.13, 1.63, 0.63),
      coords: [
        new Vector4(28, 36, 32, 48),
        new Vector4(16, 36, 20, 48),
        new Vector4(20, 48, 28, 36),
        new Vector4(28, 48, 36, 36),
        new Vector4(20, 36, 28, 48),
        new Vector4(32, 36, 40, 48),
      ],
      transparent: true
    },

    {
      id: "left-arm",
      position: new Vector3(0.75, 0, 0),
      rotationCenter: new Vector3(0, 0.5625, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(40, 52, 44, 64),
        new Vector4(32, 52, 36, 64),
        new Vector4(36, 48, 40, 52),
        new Vector4(40, 48, 44, 52),
        new Vector4(36, 52, 40, 64),
        new Vector4(44, 52, 48, 64),
      ],
      transparent: false,
      children: [
        {
          id: "left-arm-layer-2",
          position: new Vector3(0, 0, 0),
          rotationCenter: new Vector3(0, 0, 0),
          size: new Vector3(0.63, 1.63, 0.63),
          coords: [
            new Vector4(56, 52, 60, 64),
            new Vector4(48, 52, 52, 64),
            new Vector4(52, 48, 56, 52),
            new Vector4(56, 48, 60, 52),
            new Vector4(52, 52, 56, 64),
            new Vector4(60, 52, 64, 64),
          ],
          transparent: true
        }
      ]
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
      children: [
        {
          id: "right-arm-layer-2",
          position: new Vector3(0, 0, 0),
          rotationCenter: new Vector3(0, 0, 0),
          size: new Vector3(0.63, 1.63, 0.63),
          coords: [
            new Vector4(48, 36, 52, 48),
            new Vector4(40, 36, 44, 48),
            new Vector4(44, 32, 48, 36),
            new Vector4(48, 32, 52, 36),
            new Vector4(44, 36, 48, 48),
            new Vector4(52, 36, 56, 48),
          ],
          transparent: true
        }
      ]
    },

    {
      id: "left-leg",
      position: new Vector3(0.25, -1.5, 0),
      rotationCenter: new Vector3(0, 0.75, 0),
      size: new Vector3(0.5, 1.5, 0.5),
      coords: [
        new Vector4(24, 52, 28, 64),
        new Vector4(16, 52, 20, 64),
        new Vector4(20, 48, 24, 52),
        new Vector4(24, 48, 28, 52),
        new Vector4(20, 52, 24, 64),
        new Vector4(28, 52, 32, 64),
      ],
      transparent: false,
      children: [
        {
          id: "left-leg-layer-2",
          position: new Vector3(0, 0, 0),
          rotationCenter: new Vector3(0, 0, 0),
          size: new Vector3(0.63, 1.63, 0.63),
          coords: [
            new Vector4(8, 52, 12, 64),
            new Vector4(0, 52, 4, 64),
            new Vector4(4, 48, 8, 52),
            new Vector4(8, 48, 12, 52),
            new Vector4(4, 52, 8, 64),
            new Vector4(12, 52, 16, 64),
          ],
          transparent: true
        }
      ]
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
      transparent: false,
      children: [
        {
          id: "right-leg-layer-2",
          position: new Vector3(0, 0, 0),
          rotationCenter: new Vector3(0, 0, 0),
          size: new Vector3(0.63, 1.63, 0.63),
          coords: [
            new Vector4(8, 36, 12, 48),
            new Vector4(0, 36, 4, 48),
            new Vector4(4, 32, 8, 36),
            new Vector4(8, 32, 12, 36),
            new Vector4(4, 36, 8, 48),
            new Vector4(12, 36, 16, 48),
          ],
          transparent: true
        }
      ]
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
      transparent: false,
      children: [
        {
          id: "hat",
          position: new Vector3(0, 0, 0),
          rotationCenter: new Vector3(0, 0, 0),
          size: new Vector3(1.13, 1.13, 1.13),
          coords: [
            new Vector4(48, 8, 56, 16),
            new Vector4(32, 8, 40, 16),
            new Vector4(40, 0, 48, 8),
            new Vector4(48, 0, 56, 8),
            new Vector4(40, 8, 48, 16),
            new Vector4(56, 8, 64, 16),
          ],
          transparent: true
        }
      ]
    }
  ]
}