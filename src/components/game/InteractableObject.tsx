import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, MeshStandardMaterial } from 'three';
import { usePlayerStore } from '../../game/stores/playerStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { INTERACTION_DISTANCE } from '../../game/constants';
import type { InteractableType } from '../../types/game';

interface InteractableObjectProps {
  id: string;
  position: [number, number, number];
  type: InteractableType;
  onInteract: () => void;
  isLocked?: boolean;
  label?: string;
}

export function InteractableObject({
  id,
  position,
  type,
  onInteract,
  isLocked = false,
}: InteractableObjectProps) {
  const [isNearby, setIsNearby] = useState(false);
  const meshRef = useRef<Mesh>(null);
  const playerPos = usePlayerStore((s) => s.position);
  const setActiveObject = useInteractionStore((s) => s.setActiveObject);
  const objPos = new Vector3(position[0], position[1], position[2]);

  useFrame(() => {
    const dist = playerPos.distanceTo(objPos);
    const nearby = dist < INTERACTION_DISTANCE;

    if (nearby !== isNearby) {
      setIsNearby(nearby);
      if (nearby) {
        setActiveObject({
          id,
          position: objPos,
          type,
          data: null,
          onInteract,
          isLocked,
        });
      } else {
        setActiveObject(null);
      }
    }

    if (meshRef.current) {
      const mat = meshRef.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = nearby ? (isLocked ? 0.3 : 0.6) : 0;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
    >
      <boxGeometry args={[1.5, 2.5, 0.3]} />
      <meshStandardMaterial
        color={type === 'door' ? (isLocked ? '#555555' : '#FFD700') : '#444444'}
        emissive={type === 'door' ? (isLocked ? '#ff4444' : '#FFD700') : '#444444'}
        emissiveIntensity={0}
      />
    </mesh>
  );
}
