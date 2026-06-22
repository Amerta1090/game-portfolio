import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { usePlayerStore } from '../../game/stores/playerStore';
import { CAMERA_CONFIG } from '../../game/constants';

export function CameraController() {
  const { camera } = useThree();
  const position = usePlayerStore((s) => s.position);
  const rotation = usePlayerStore((s) => s.rotation);

  useFrame(() => {
    const targetPos = new Vector3(
      position.x - Math.sin(rotation) * CAMERA_CONFIG.distance,
      1.5 + CAMERA_CONFIG.height,
      position.z - Math.cos(rotation) * CAMERA_CONFIG.distance,
    );

    camera.position.lerp(targetPos, CAMERA_CONFIG.lerpSpeed);
    camera.lookAt(position.x, 1, position.z);
  });

  return null;
}
