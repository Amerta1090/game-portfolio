export interface AABB {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function checkAABB(
  x: number,
  z: number,
  radius: number,
  bounds: AABB,
): boolean {
  return (
    x - radius >= bounds.minX &&
    x + radius <= bounds.maxX &&
    z - radius >= bounds.minZ &&
    z + radius <= bounds.maxZ
  );
}

export function clampToBounds(
  x: number,
  z: number,
  radius: number,
  bounds: AABB,
): { x: number; z: number } {
  return {
    x: Math.min(Math.max(x, bounds.minX + radius), bounds.maxX - radius),
    z: Math.min(Math.max(z, bounds.minZ + radius), bounds.maxZ - radius),
  };
}
