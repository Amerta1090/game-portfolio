import { useMemo } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { InteractableObject } from '../game/InteractableObject';
import type { RoomId } from '../../types/game';
import { audioManager } from '../../utils/audio';

interface DoorConfig {
  id: RoomId;
  position: [number, number, number];
  label: string;
  locked?: boolean;
  lockReason?: string;
}

const DOORS: DoorConfig[] = [
  { id: 'identity', position: [0, 1.25, -11], label: 'Identity Core' },
  { id: 'skills', position: [11, 1.25, 0], label: 'Skill Chamber' },
  { id: 'projects', position: [0, 1.25, 11], label: 'Project Lab' },
  { id: 'career', position: [-11, 1.25, 0], label: 'Career Hall', locked: true, lockReason: 'Complete 2 mini-games to unlock' },
  { id: 'achievements', position: [7.5, 1.25, -7.5], label: 'Achievement Gallery', locked: true, lockReason: 'Visit 4 rooms to unlock' },
  { id: 'hidden', position: [-7.5, 1.25, -7.5], label: '???', locked: true, lockReason: 'Collect all 5 key fragments to reveal the hidden room' },
];

function Wall({ position, size, rotation: rot }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  const rotation = rot ?? [0, 0, 0] as [number, number, number];
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial color="#2A2A2A" />
    </mesh>
  );
}

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 200; i++) {
      pos.push((Math.random() - 0.5) * 20);
      pos.push(Math.random() * 5 + 1);
      pos.push((Math.random() - 0.5) * 20);
    }
    return new Float32Array(pos);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#FFD700" transparent opacity={0.3} />
    </points>
  );
}

export function Lobby() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const fragments = useProgressStore((s) => s.fragments);
  const visitedRooms = useProgressStore((s) => s.visitedRooms);
  const visitRoom = useProgressStore((s) => s.visitRoom);

  const isCareerUnlocked = fragments.length >= 2;
  const isAchievementUnlocked = visitedRooms.length >= 4;
  const isHiddenUnlocked = fragments.length >= 5;

  function handleEnterRoom(roomId: RoomId, isLocked: boolean) {
    if (isLocked) return;
    return () => {
      visitRoom(roomId);
      setActiveRoom(roomId);
      setScreen('room');
      audioManager.playSfx('door');
    };
  }

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 5]} intensity={0.6} color="#FFD700" />
      <pointLight position={[0, 6, 0]} intensity={0.3} color="#FFD700" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Walls */}
      <Wall position={[0, 3, -12]} size={[24, 6]} />
      <Wall position={[12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[0, 3, 12]} size={[24, 6]} />
      <Wall position={[-12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />

      {/* Yellow trim borders */}
      {[[0, 6, -12, 24, 0.1, 0.1], [12, 6, 0, 0.1, 0.1, 24], [0, 6, 12, 24, 0.1, 0.1], [-12, 6, 0, 0.1, 0.1, 24],
        [0, 0, -12, 24, 0.1, 0.1], [12, 0, 0, 0.1, 0.1, 24], [0, 0, 12, 24, 0.1, 0.1], [-12, 0, 0, 0.1, 0.1, 24]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}

      {/* Doors */}
      {DOORS.map((door) => {
        const effectiveLocked = door.id === 'career'
          ? !isCareerUnlocked
          : door.id === 'achievements'
            ? !isAchievementUnlocked
            : door.id === 'hidden'
              ? !isHiddenUnlocked
              : door.locked ?? false;
        return (
          <group key={door.id}>
            <InteractableObject
              id={`door-${door.id}`}
              position={door.position}
              type="door"
              onInteract={handleEnterRoom(door.id, effectiveLocked) ?? (() => {})}
              isLocked={effectiveLocked}
            />
            <mesh position={[door.position[0], door.position[1] + 1.8, door.position[2]]}>
              <planeGeometry args={[3, 0.5]} />
              <meshBasicMaterial color={effectiveLocked ? '#ff4444' : '#FFD700'} transparent opacity={0.15} />
            </mesh>
          </group>
        );
      })}

      {/* Center pedestal */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.5, 8]} />
        <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.05} />
      </mesh>

      <AmbientParticles />
    </>
  );
}
