import {Vector3} from "three";

export function generateFibonacciSphere(numPoints: number, radius: number): Vector3[] {
  if (numPoints === 1) return [new Vector3(0, 0, 0)];

  const positions: Vector3[] = [];
  const offset: number = 2 / numPoints;
  const increment: number = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < numPoints; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;

    const x = Math.cos(phi) * r * radius;
    const z = Math.sin(phi) * r * radius;

    positions.push(new Vector3(x, y * radius, z));
  }

  return positions;
}

export function isReleaseVersion(version: string): boolean {
  const releasePattern = /^\d+(\.\d+){1,2}$/;
  return releasePattern.test(version);
}