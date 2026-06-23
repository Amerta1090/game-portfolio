import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, MeshStandardMaterial } from 'three';

interface DoorFrameProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  isLocked?: boolean;
  isExit?: boolean;
  color?: string;
}

export function DoorFrame({
  position,
  rotation = [0, 0, 0],
  isLocked = false,
  color = '#FFD700',
}: DoorFrameProps) {
  const glowRef = useRef<Mesh>(null);
  const trimColor = isLocked ? '#FF4444' : color;

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as MeshStandardMaterial;
      mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation as any}>
      {/* Top frame */}
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[2.2, 0.15, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Left frame */}
      <mesh position={[-1.05, 1.0, 0]}>
        <boxGeometry args={[0.15, 2.0, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Right frame */}
      <mesh position={[1.05, 1.0, 0]}>
        <boxGeometry args={[0.15, 2.0, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Bottom frame */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Yellow trim top */}
      <mesh position={[0, 2.1, 0.16]}>
        <boxGeometry args={[2.4, 0.08, 0.05]} />
        <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Yellow trim left */}
      <mesh position={[-1.12, 1.0, 0.16]}>
        <boxGeometry args={[0.08, 2.15, 0.05]} />
        <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={0.2} />
      </mesh>
      {/* Yellow trim right */}
      <mesh position={[1.12, 1.0, 0.16]}>
        <boxGeometry args={[0.08, 2.15, 0.05]} />
        <meshStandardMaterial color={trimColor} emissive={trimColor} emissiveIntensity={0.2} />
      </mesh>

      {/* Dark opening */}
      <mesh position={[0, 1.0, -0.05]}>
        <planeGeometry args={[1.9, 1.8]} />
        <meshBasicMaterial color="#0D0D0D" />
      </mesh>

      {/* Glow plane */}
      <mesh ref={glowRef} position={[0, 1.0, 0.05]}>
        <planeGeometry args={[1.9, 1.8]} />
        <meshStandardMaterial
          color={trimColor}
          transparent
          opacity={0.1}
          emissive={trimColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Lock indicator */}
      {isLocked && (
        <mesh position={[0, 1.0, 0.12]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial color="#FF4444" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
}
