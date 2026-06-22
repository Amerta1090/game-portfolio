import { isKeyDown } from '../../utils/keyboard';
import { clampToBounds } from '../../utils/collision';
import type { AABB } from '../../utils/collision';
import { PLAYER_SPEED } from '../constants';

export interface MovementInput {
  forward: number;
  strafe: number;
}

export function getMovementInput(): MovementInput {
  let forward = 0;
  let strafe = 0;

  if (isKeyDown('KeyW') || isKeyDown('ArrowUp')) forward += 1;
  if (isKeyDown('KeyS') || isKeyDown('ArrowDown')) forward -= 1;
  if (isKeyDown('KeyA') || isKeyDown('ArrowLeft')) strafe -= 1;
  if (isKeyDown('KeyD') || isKeyDown('ArrowRight')) strafe += 1;

  return { forward, strafe };
}

export function computeMovement(
  input: MovementInput,
  rotation: number,
  delta: number,
  bounds: AABB,
  currentX: number,
  currentZ: number,
  radius = 0.5,
): { x: number; z: number; rotation: number } {
  if (input.forward === 0 && input.strafe === 0) {
    return { x: currentX, z: currentZ, rotation };
  }

  const len = Math.sqrt(input.forward * input.forward + input.strafe * input.strafe);
  const normF = input.forward / len;
  const normS = input.strafe / len;

  const angle = Math.atan2(normF, normS);
  const targetRotation = angle;

  const rot = Math.atan2(
    Math.sin(targetRotation) + Math.sin(rotation),
    Math.cos(targetRotation) + Math.cos(rotation),
  );

  const speed = PLAYER_SPEED * delta;
  const dx = Math.sin(rot) * speed;
  const dz = Math.cos(rot) * speed;

  const newX = currentX + dx;
  const newZ = currentZ + dz;

  const clamped = clampToBounds(newX, newZ, radius, bounds);

  return { x: clamped.x, z: clamped.z, rotation: rot };
}
