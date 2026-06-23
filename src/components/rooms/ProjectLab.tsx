import { useMemo, useEffect } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { InteractableObject } from '../game/InteractableObject';
import { TerminalScreen } from '../game/TerminalScreen';
import { TexturedWall, TexturedFloor } from '../game/TexturedWall';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const projects = gameData.projects;
const featuredProjects = projects.projects.filter((p) => p.featured);
const NON_FEATURED_COUNT = Math.min(2, projects.projects.filter((p) => !p.featured).length);

function Wall({ position, size, rotation: rot }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  const rotation = rot ?? [0, 0, 0] as [number, number, number];
  return <TexturedWall position={position} size={size} rotation={rotation} />;
}

function MonitorScreen({ color = '#00ff88' }: { color?: string }) {
  return (
    <mesh>
      <planeGeometry args={[0.6, 0.4]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  );
}

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 100; i++) {
      pos.push((Math.random() - 0.5) * 24);
      pos.push(Math.random() * 4 + 1);
      pos.push((Math.random() - 0.5) * 24);
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
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.15} />
    </points>
  );
}

export function ProjectLab() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);

  useEffect(() => {
    audioManager.playMusic('projects');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handleProjectInteract(index: number) {
    const project = featuredProjects[index] ?? projects.projects[index];
    if (!project) return;
    const lines = [
      `Title: ${project.title}`,
      `Period: ${project.period}`,
      `Category: ${project.category}`,
      '',
      project.description,
      '',
      'Tech Stack:',
      ...project.skills.map((s) => `  • ${s}`),
      '',
      ...project.links.map((l) => `${l.label}: ${l.url}`),
    ];
    setDialogData({
      type: 'info',
      title: `PROJECT LAB — ${project.title.toUpperCase()}`,
      lines,
      animation: 'scroll',
    });
  }

  function handleMinigame() {
    setDialogData({
      type: 'minigame',
      gameId: 'code-debug',
    });
  }

  const stationPositions: [number, number, number][] = [
    [-6, 1.25, -5],
    [6, 1.25, -5],
    [-5, 1.25, 5],
    [5, 1.25, 5],
  ];

  return (
    <>
      <ambientLight intensity={0.4} color="#444444" />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#FFD700" />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#FFA500" distance={14} />
      <pointLight position={[-6, 3, -4]} intensity={0.3} color="#00ff88" distance={8} />
      <pointLight position={[6, 3, -4]} intensity={0.3} color="#00ff88" distance={8} />

      <TexturedFloor args={[24, 24]} />

      <Wall position={[0, 3, -12]} size={[24, 6]} />
      <Wall position={[12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[0, 3, 12]} size={[24, 6]} />
      <Wall position={[-12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />

      {[[0, 6, -12, 24, 0.1, 0.1], [12, 6, 0, 0.1, 0.1, 24], [0, 6, 12, 24, 0.1, 0.1], [-12, 6, 0, 0.1, 0.1, 24],
        [0, 0, -12, 24, 0.1, 0.1], [12, 0, 0, 0.1, 0.1, 24], [0, 0, 12, 24, 0.1, 0.1], [-12, 0, 0, 0.1, 0.1, 24]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}

      {featuredProjects.map((project, i) => {
        const pos = stationPositions[i] ?? [0, 1.25, 0];
        return (
          <group key={`featured-${i}`}>
            {/* Desk */}
            <mesh position={[pos[0], pos[1] - 0.7, pos[2]]}>
              <boxGeometry args={[1.6, 0.1, 1.2]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            {/* Monitor stand */}
            <mesh position={[pos[0], pos[1] - 0.2, pos[2]]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            {/* Monitor */}
            <mesh position={[pos[0], pos[1] + 0.4, pos[2]]}>
              <boxGeometry args={[0.8, 0.6, 0.05]} />
              <meshStandardMaterial color="#222222" emissive="#00ff88" emissiveIntensity={0.08} />
            </mesh>
            {/* Glowing screen */}
            <mesh position={[pos[0], pos[1] + 0.4, pos[2] + 0.03]}>
              <MonitorScreen color={project.category === 'ml' ? '#9B59B6' : '#00ff88'} />
            </mesh>
            <TerminalScreen
              position={[pos[0], pos[1] + 0.4, pos[2] + 0.06]}
              width={0.55}
              height={0.35}
            />
            <InteractableObject
              id={`project-station-${i}`}
              position={pos}
              type="terminal"
              onInteract={() => handleProjectInteract(i)}
              label={project.title}
            />
          </group>
        );
      })}

      {/* Non-featured project stations */}
      {projects.projects.filter((p) => !p.featured).slice(0, NON_FEATURED_COUNT).map((project, i) => {
        const pos = stationPositions[featuredProjects.length + i] ?? [0, 1.25, -5];
        return (
          <group key={`project-${i}`}>
            <mesh position={[pos[0], pos[1] - 0.7, pos[2]]}>
              <boxGeometry args={[1.4, 0.1, 1.0]} />
              <meshStandardMaterial color="#333333" />
            </mesh>
            <mesh position={[pos[0], pos[1] + 0.4, pos[2]]}>
              <boxGeometry args={[0.6, 0.4, 0.05]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            <InteractableObject
              id={`project-nonfeatured-${i}`}
              position={pos}
              type="terminal"
              onInteract={() => {
                const idx = featuredProjects.length + i;
                handleProjectInteract(idx);
              }}
              label={project.title}
            />
          </group>
        );
      })}

      {/* Central debug console */}
      <group>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, 0.9, 0.41]}>
          <planeGeometry args={[1.0, 0.6]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
        </mesh>
        <TerminalScreen
          position={[0, 0.9, 0.43]}
          width={0.95}
          height={0.55}
        />
        <InteractableObject
          id="console-debug"
          position={[0, 1.25, 0]}
          type="terminal"
          onInteract={handleMinigame}
        />
      </group>

      {/* Exit door */}
      <group>
        <InteractableObject
          id="door-exit"
          position={[0, 1.25, 12]}
          type="door"
          onInteract={handleExit}
        />
        <mesh position={[0, 3.2, 12]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
        </mesh>
      </group>

      <AmbientParticles />
    </>
  );
}
