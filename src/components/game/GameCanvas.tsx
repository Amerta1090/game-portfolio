import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../game/stores/gameStore';
import { Player } from './Player';
import { CameraController } from './CameraController';
import { Lobby } from '../rooms/Lobby';
import type { AABB } from '../../utils/collision';

const LOBBY_BOUNDS: AABB = { minX: -11, maxX: 11, minZ: -11, maxZ: 11 };

function Scene() {
  const screen = useGameStore((s) => s.screen);
  const activeRoom = useGameStore((s) => s.activeRoom);

  if (screen === 'lobby') {
    return (
      <>
        <Lobby />
        <Player bounds={LOBBY_BOUNDS} />
        <CameraController />
      </>
    );
  }

  if (screen === 'room') {
    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#FFD700" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        <Player bounds={LOBBY_BOUNDS} />
        <CameraController />
      </>
    );
  }

  return null;
}

export function GameCanvas() {
  const screen = useGameStore((s) => s.screen);

  if (screen === 'title') return null;

  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
