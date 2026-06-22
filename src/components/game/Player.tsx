import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { usePlayerStore } from '../../game/stores/playerStore';
import { getMovementInput, computeMovement } from '../../game/systems/MovementSystem';
import { useKeyboard } from '../../utils/keyboard';
import type { AABB } from '../../utils/collision';

const DEFAULT_BOUNDS: AABB = { minX: -12, maxX: 12, minZ: -12, maxZ: 12 };

interface PlayerProps {
  bounds?: AABB;
}

export function Player({ bounds = DEFAULT_BOUNDS }: PlayerProps) {
  useKeyboard();
  const meshRef = useRef<Mesh>(null);
  const position = usePlayerStore((s) => s.position);
  const rotation = usePlayerStore((s) => s.rotation);
  const moveTo = usePlayerStore((s) => s.moveTo);
  const rotateTo = usePlayerStore((s) => s.rotateTo);

  useFrame((_, delta) => {
    const input = getMovementInput();
    const result = computeMovement(input, rotation, Math.min(delta, 0.05), bounds, position.x, position.z);

    if (result.x !== position.x || result.z !== position.z) {
      position.x = result.x;
      position.z = result.z;
      moveTo(position.clone());
    }

    if (result.rotation !== rotation) {
      rotateTo(result.rotation);
    }

    if (meshRef.current) {
      meshRef.current.position.set(position.x, 0.5, position.z);
      meshRef.current.rotation.y = rotation;
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, 0.5, position.z]} visible={false}>
      <capsuleGeometry args={[0.3, 0.6, 4, 8]} />
      <meshStandardMaterial transparent opacity={0} />
    </mesh>
  );
}
