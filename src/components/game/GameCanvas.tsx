import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../game/stores/gameStore';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#FFD700" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>
    </>
  );
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
