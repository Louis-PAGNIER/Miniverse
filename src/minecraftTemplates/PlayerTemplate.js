// Left, Right, Top, Bottom, Front, Back
export const playerTemplate = {
  id: "body",
  position: [0, 2.25, 0],
  rotationCenter: [0, 0, 0],
  size: [1, 1.5, 0.5],
  coords: [
    [28, 20, 32, 32], [16, 20, 20, 32], [20, 16, 28, 20], [28, 16, 36, 20], [20, 20, 28, 32], [32, 20, 40, 32]
  ],
  transparent: false,
  children: [
    {
      id: "left-arm",
      position: [0.75, 0, 0],
      rotationCenter: [0, 0.5625, 0],
      size: [0.5, 1.5, 0.5],
      coords: [
        [44, 20, 40, 32], [52, 20, 48, 32], [48, 16, 44, 20], [52, 16, 48, 20], [48, 20, 44, 32], [56, 20, 52, 32]
      ],
      transparent: false,
    },
    {
      id: "right-arm",
      position: [-0.75, 0, 0],
      rotationCenter: [0, 0.5625, 0],
      size: [0.5, 1.5, 0.5],
      coords: [
        [48, 20, 52, 32], [40, 20, 44, 32], [44, 16, 48, 20], [48, 16, 52, 20], [44, 20, 48, 32], [52, 20, 56, 32]
      ],
      transparent: false
    },

    {
      id: "left-leg",
      position: [0.25, -1.5, 0],
      rotationCenter: [0, 0.75, 0],
      size: [0.5, 1.5, 0.5],
      coords: [
        [4, 20, 0, 32], [12, 20, 8, 32], [8, 16, 4, 20], [12, 16, 8, 20], [8, 20, 4, 32], [16, 20, 12, 32]
      ],
      transparent: false
    },

    {
      id: "right-leg",
      position: [-0.25, -1.5, 0],
      rotationCenter: [0, 0.75, 0],
      size: [0.5, 1.5, 0.5],
      coords: [
        [8, 20, 12, 32], [0, 20, 4, 32], [4, 16, 12, 20], [8, 16, 16, 20], [4, 20, 8, 32], [12, 20, 16, 32]
      ],
      transparent: false
    },

    {
      id: "head",
      position: [0, 1.25, 0],
      rotationCenter: [0, -0.5, 0],
      size: [1, 1, 1],
      coords: [
        [16, 8, 24, 16], [0, 8, 8, 16], [8, 0, 16, 8], [16, 0, 24, 8], [8, 8, 16, 16], [24, 8, 32, 16]
      ],
      transparent: false,
      children: [
        {
          id: "hat",
          position: [0, 0, 0],
          rotationCenter: [0, 0, 0],
          size: [1.13, 1.13, 1.13],
          coords: [
            [48, 8, 56, 16], [32, 8, 40, 16], [40, 0, 48, 8], [48, 0, 56, 8], [40, 8, 48, 16], [56, 8, 64, 16]
          ],
          transparent: true
        }
      ]
    }
  ]
}