import { useMemo, useEffect } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { InteractableObject } from '../game/InteractableObject';
import { TerminalScreen } from '../game/TerminalScreen';
import { TexturedWall, TexturedFloor } from '../game/TexturedWall';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const skills = gameData.skills;

const CATEGORY_POSITIONS: [number, number, number][] = [
  [-5, 1.25, -6],
  [6, 1.25, -5],
  [-6, 1.25, 0],
  [6, 1.25, 0],
  [-6, 1.25, 5],
  [6, 1.25, 5],
  [-5, 1.25, 6],
  [0, 1.25, -6],
];

function ConstellationLines() {
  const positions = useMemo(() => {
    const pts: number[] = [];
    const nodes: [number, number, number][] = CATEGORY_POSITIONS;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.4) continue;
        const ni = nodes[i]!;
        const nj = nodes[j]!;
        pts.push(ni[0], ni[1], ni[2]);
        pts.push(nj[0], nj[1], nj[2]);
      }
    }
    return new Float32Array(pts);
  }, []);

  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4B0082" transparent opacity={0.3} />
    </lineSegments>
  );
}

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 300; i++) {
      pos.push((Math.random() - 0.5) * 24);
      pos.push(Math.random() * 5 + 1);
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
      <pointsMaterial size={0.05} color="#9B59B6" transparent opacity={0.3} />
    </points>
  );
}

export function SkillChamber() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);

  useEffect(() => {
    audioManager.playMusic('skills');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handleCategoryInteract(index: number) {
    const category = skills.categories[index];
    if (!category) return;
    const lines = category.skills.map(
      (s) => `${s.name} ${'⬡'.repeat(s.proficiency)}${'○'.repeat(5 - s.proficiency)}`
    );
    setDialogData({
      type: 'info',
      title: `${category.name.toUpperCase()} — SKILL NODES`,
      lines: [`Category: ${category.name}`, '', ...lines],
      animation: 'scroll',
    });
  }

  function handleMinigame() {
    setDialogData({
      type: 'minigame',
      gameId: 'skill-constellation',
    });
  }

  return (
    <>
      <ambientLight intensity={0.3} color="#4B0082" />
      <directionalLight position={[5, 10, 5]} intensity={0.3} color="#9B59B6" />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#8A2BE2" distance={14} />
      <pointLight position={[-6, 3, -5]} intensity={0.4} color="#9B59B6" distance={10} />
      <pointLight position={[6, 3, 5]} intensity={0.4} color="#9B59B6" distance={10} />

      <TexturedFloor args={[24, 24]} color="#9B59B6" />

      <TexturedWall position={[0, 3, -12]} size={[24, 6]} gridColor="#9B59B6" baseColor="#0D0D1A" />
      <TexturedWall position={[12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} gridColor="#9B59B6" baseColor="#0D0D1A" />
      <TexturedWall position={[0, 3, 12]} size={[24, 6]} gridColor="#9B59B6" baseColor="#0D0D1A" />
      <TexturedWall position={[-12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} gridColor="#9B59B6" baseColor="#0D0D1A" />

      {[[0, 6, -12, 24, 0.1, 0.1], [12, 6, 0, 0.1, 0.1, 24], [0, 6, 12, 24, 0.1, 0.1], [-12, 6, 0, 0.1, 0.1, 24],
        [0, 0, -12, 24, 0.1, 0.1], [12, 0, 0, 0.1, 0.1, 24], [0, 0, 12, 24, 0.1, 0.1], [-12, 0, 0, 0.1, 0.1, 24]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#9B59B6" />
        </mesh>
      ))}

      <ConstellationLines />

      {skills.categories.map((cat, i) => {
        const pos = CATEGORY_POSITIONS[i] ?? [0, 1.25, 0];
        return (
          <group key={cat.name}>
            <mesh position={[pos[0], pos[1] - 0.6, pos[2]]}>
              <cylinderGeometry args={[0.3, 0.4, 0.3, 6]} />
              <meshStandardMaterial color="#2A1A4A" emissive="#9B59B6" emissiveIntensity={0.15} />
            </mesh>
            <mesh position={[pos[0], pos[1] + 0.5, pos[2]]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="#9B59B6" emissive="#9B59B6" emissiveIntensity={0.3} />
            </mesh>
            <InteractableObject
              id={`skill-cat-${i}`}
              position={pos}
              type="node"
              onInteract={() => handleCategoryInteract(i)}
              label={cat.name}
            />
          </group>
        );
      })}

      <group>
        <mesh position={[-5, 1.25, 6]}>
          <boxGeometry args={[0.9, 1.4, 0.9]} />
          <meshStandardMaterial color="#2A1A4A" emissive="#9B59B6" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-5, 1.8, 6.41]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshBasicMaterial color="#9B59B6" transparent opacity={0.08} />
        </mesh>
        <TerminalScreen
          position={[-5, 1.8, 6.42]}
          width={0.65}
          height={0.45}
        />
        <InteractableObject
          id="terminal-constellation"
          position={[-5, 1.25, 6]}
          type="terminal"
          onInteract={handleMinigame}
        />
      </group>

      <group>
        <InteractableObject
          id="door-exit"
          position={[0, 1.25, 12]}
          type="door"
          onInteract={handleExit}
        />
        <mesh position={[0, 3.2, 12]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#9B59B6" transparent opacity={0.15} />
        </mesh>
      </group>

      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 0.5, 8]} />
        <meshStandardMaterial color="#1A1A2E" emissive="#9B59B6" emissiveIntensity={0.05} />
      </mesh>

      <AmbientParticles />
    </>
  );
}
