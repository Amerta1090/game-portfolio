import { Canvas } from '@react-three/fiber';
import { useGameStore } from '../../game/stores/gameStore';
import { Player } from './Player';
import { CameraController } from './CameraController';
import { Lobby } from '../rooms/Lobby';
import { IdentityCore } from '../rooms/IdentityCore';
import { SkillChamber } from '../rooms/SkillChamber';
import { ProjectLab } from '../rooms/ProjectLab';
import { CareerHall } from '../rooms/CareerHall';
import { AchievementGallery } from '../rooms/AchievementGallery';
import { HiddenRoom } from '../rooms/HiddenRoom';
import { qualitySettings } from '../../utils/performance';
import type { AABB } from '../../utils/collision';

const LOBBY_BOUNDS: AABB = { minX: -11, maxX: 11, minZ: -11, maxZ: 11 };
const ROOM_BOUNDS: AABB = { minX: -9, maxX: 9, minZ: -9, maxZ: 9 };
const CAREER_BOUNDS: AABB = { minX: -6, maxX: 6, minZ: -17, maxZ: 17 };
const HIDDEN_BOUNDS: AABB = { minX: -6, maxX: 6, minZ: -6, maxZ: 6 };

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
    if (activeRoom === 'identity') {
      return (
        <>
          <IdentityCore />
          <Player bounds={ROOM_BOUNDS} />
          <CameraController />
        </>
      );
    }

    if (activeRoom === 'skills') {
      return (
        <>
          <SkillChamber />
          <Player bounds={ROOM_BOUNDS} />
          <CameraController />
        </>
      );
    }

    if (activeRoom === 'projects') {
      return (
        <>
          <ProjectLab />
          <Player bounds={ROOM_BOUNDS} />
          <CameraController />
        </>
      );
    }

    if (activeRoom === 'career') {
      return (
        <>
          <CareerHall />
          <Player bounds={CAREER_BOUNDS} />
          <CameraController />
        </>
      );
    }

    if (activeRoom === 'achievements') {
      return (
        <>
          <AchievementGallery />
          <Player bounds={ROOM_BOUNDS} />
          <CameraController />
        </>
      );
    }

    if (activeRoom === 'hidden') {
      return (
        <>
          <HiddenRoom />
          <Player bounds={HIDDEN_BOUNDS} />
          <CameraController />
        </>
      );
    }

    return (
      <>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#FFD700" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        <Player bounds={ROOM_BOUNDS} />
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
        gl={{ antialias: qualitySettings.antialias, powerPreference: 'high-performance' }}
        dpr={qualitySettings.antialias ? [1, 2] : [1, 1]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
