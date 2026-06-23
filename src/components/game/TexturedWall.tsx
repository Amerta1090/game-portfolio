import { CanvasTexture } from 'three';
import { createGridTexture } from '../../utils/textures';

const wallTextures: Record<string, CanvasTexture> = {};
function getWallTexture(gridColor: string, bg: string): CanvasTexture {
  const key = `${gridColor}-${bg}`;
  if (!wallTextures[key]) {
    wallTextures[key] = new CanvasTexture(createGridTexture(gridColor, bg, 64, 0.06));
  }
  return wallTextures[key];
}

const floorTextures: Record<string, CanvasTexture> = {};
function getFloorTexture(color?: string): CanvasTexture {
  const key = color ?? '#FFD700';
  if (!floorTextures[key]) {
    floorTextures[key] = new CanvasTexture(createGridTexture(key, '#1A1A1A', 32, 0.12));
  }
  return floorTextures[key];
}

export function TexturedWall({
  position, size, rotation, gridColor = '#FFD700', baseColor = '#2A2A2A',
}: {
  position: [number, number, number];
  size: [number, number];
  rotation?: [number, number, number];
  gridColor?: string;
  baseColor?: string;
}) {
  const rot = rotation ?? [0, 0, 0] as [number, number, number];
  const tex = getWallTexture(gridColor, baseColor);
  return (
    <mesh position={position} rotation={rot}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}

export function TexturedFloor({ args, color }: { args: [number, number]; color?: string }) {
  const tex = getFloorTexture(color);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={args} />
      <meshStandardMaterial map={tex} />
    </mesh>
  );
}
