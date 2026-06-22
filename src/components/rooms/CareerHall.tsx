import { useMemo, useEffect } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { InteractableObject } from '../game/InteractableObject';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const experiences = gameData.experiences;
const volunteering = gameData.volunteering;

const ROOM_LENGTH = 36;

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
    for (let i = 0; i < 150; i++) {
      pos.push((Math.random() - 0.5) * 14);
      pos.push(Math.random() * 4 + 1);
      pos.push((Math.random() - 0.5) * ROOM_LENGTH);
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
      <pointsMaterial size={0.05} color="#FFD700" transparent opacity={0.2} />
    </points>
  );
}

function TimelineLight({ z, active }: { z: number; active: boolean }) {
  return (
    <mesh position={[0, 0.1, z]}>
      <boxGeometry args={[0.05, 0.05, 0.3]} />
      <meshBasicMaterial color={active ? '#FFD700' : '#444444'} transparent opacity={active ? 0.8 : 0.3} />
    </mesh>
  );
}

export function CareerHall() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);

  useEffect(() => {
    audioManager.playMusic('career');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handlePillarInteract(index: number) {
    const exp = experiences[index];
    if (!exp) return;
    const lines = [
      `Company: ${exp.company}`,
      `Role: ${exp.role}`,
      `Period: ${exp.start_date} — ${exp.end_date ?? 'Present'}`,
      `Location: ${exp.location}`,
      `Type: ${exp.type}`,
      '',
      'Highlights:',
      ...exp.highlights.map((h) => `  • ${h}`),
      '',
      'Technologies:',
      ...exp.technologies.map((t) => `  • ${t}`),
    ];
    setDialogData({
      type: 'info',
      title: `CAREER TIMELINE — ${exp.company.toUpperCase()}`,
      lines,
      animation: 'scroll',
    });
  }

  function handleVolunteerInteract() {
    if (volunteering.length === 0) return;
    const v = volunteering[0]!;
    const lines = [
      `Role: ${v.role}`,
      `Organization: ${v.organization}`,
      `Cause: ${v.cause}`,
      `Period: ${v.start_date} — ${v.end_date}`,
      '',
      'Highlights:',
      ...v.highlights.map((h) => `  • ${h}`),
    ];
    setDialogData({
      type: 'info',
      title: 'VOLUNTEERING — SIDE BRANCH',
      lines,
      animation: 'scroll',
    });
  }

  function handleMinigame() {
    setDialogData({
      type: 'minigame',
      gameId: 'timeline-order',
    });
  }

  const pillarPositions: [number, number, number][] = useMemo(() => {
    return experiences.map((_, i) => {
      const z = -ROOM_LENGTH / 2 + 4 + i * 4;
      return [-4, 1.25, z] as [number, number, number];
    });
  }, []);

  const volunteerPos: [number, number, number] = [4, 1.25, -ROOM_LENGTH / 2 + 4];

  return (
    <>
      <ambientLight intensity={0.3} color="#FFD700" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#FFD700" />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFA500" distance={20} />
      <pointLight position={[-4, 3, 0]} intensity={0.3} color="#FFD700" distance={18} />
      <pointLight position={[4, 3, 0]} intensity={0.3} color="#FFD700" distance={18} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, ROOM_LENGTH]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      <Wall position={[0, 3, -ROOM_LENGTH / 2]} size={[14, 6]} />
      <Wall position={[7, 3, 0]} size={[ROOM_LENGTH, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[0, 3, ROOM_LENGTH / 2]} size={[14, 6]} />
      <Wall position={[-7, 3, 0]} size={[ROOM_LENGTH, 6]} rotation={[0, Math.PI / 2, 0]} />

      {/* Trim */}
      {[[0, 6, -ROOM_LENGTH / 2, 14, 0.1, 0.1], [7, 6, 0, 0.1, 0.1, ROOM_LENGTH],
        [0, 6, ROOM_LENGTH / 2, 14, 0.1, 0.1], [-7, 6, 0, 0.1, 0.1, ROOM_LENGTH],
        [0, 0, -ROOM_LENGTH / 2, 14, 0.1, 0.1], [7, 0, 0, 0.1, 0.1, ROOM_LENGTH],
        [0, 0, ROOM_LENGTH / 2, 14, 0.1, 0.1], [-7, 0, 0, 0.1, 0.1, ROOM_LENGTH]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}

      {/* Center timeline strip */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, ROOM_LENGTH - 2]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>

      {/* Timeline lights */}
      {experiences.map((_, i) => {
        const z = -ROOM_LENGTH / 2 + 4 + i * 4;
        return <TimelineLight key={`light-${i}`} z={z} active={true} />;
      })}

      {/* Career pillars on left wall */}
      {experiences.map((exp, i) => {
        const pos = pillarPositions[i] ?? [0, 1.25, 0];
        return (
          <group key={`pillar-${i}`}>
            <mesh position={[pos[0], pos[1] - 0.6, pos[2]]}>
              <cylinderGeometry args={[0.2, 0.3, 1.2, 6]} />
              <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.12} />
            </mesh>
            <mesh position={[pos[0], pos[1] + 0.4, pos[2]]}>
              <sphereGeometry args={[0.12, 6, 6]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
            </mesh>
            <InteractableObject
              id={`career-pillar-${i}`}
              position={pos}
              type="pedestal"
              onInteract={() => handlePillarInteract(i)}
              label={exp.company}
            />
          </group>
        );
      })}

      {/* Volunteering side branch */}
      {volunteering.length > 0 && (
        <group>
          <mesh position={[volunteerPos[0], volunteerPos[1] - 0.6, volunteerPos[2]]}>
            <cylinderGeometry args={[0.25, 0.35, 1.0, 6]} />
            <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.08} />
          </mesh>
          <mesh position={[volunteerPos[0], volunteerPos[1] + 0.4, volunteerPos[2]]}>
            <sphereGeometry args={[0.1, 6, 6]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
          </mesh>
          <InteractableObject
            id="volunteer-pillar"
            position={volunteerPos}
            type="pedestal"
            onInteract={handleVolunteerInteract}
            label="Volunteering"
          />
          {/* Branch line connecting volunteer to main timeline */}
          <mesh position={[2, 0.05, volunteerPos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3, 0.1]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
          </mesh>
        </group>
      )}

      {/* Mini-game terminal at far end */}
      <group>
        <mesh position={[0, 1.25, ROOM_LENGTH / 2 - 3]}>
          <boxGeometry args={[0.9, 1.4, 0.9]} />
          <meshStandardMaterial color="#444444" emissive="#FFD700" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 1.8, ROOM_LENGTH / 2 - 2.59]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
        </mesh>
        <InteractableObject
          id="terminal-timeline"
          position={[0, 1.25, ROOM_LENGTH / 2 - 3]}
          type="terminal"
          onInteract={handleMinigame}
        />
      </group>

      {/* Exit door */}
      <group>
        <InteractableObject
          id="door-exit"
          position={[0, 1.25, -ROOM_LENGTH / 2]}
          type="door"
          onInteract={handleExit}
        />
        <mesh position={[0, 3.2, -ROOM_LENGTH / 2]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
        </mesh>
      </group>

      <AmbientParticles />
    </>
  );
}
