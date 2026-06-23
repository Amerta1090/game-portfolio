import { useMemo, useEffect } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { InteractableObject } from '../game/InteractableObject';
import { TerminalScreen } from '../game/TerminalScreen';
import { TexturedWall, TexturedFloor } from '../game/TexturedWall';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const certifications = gameData.certifications;
const honors = gameData.honors;

function Wall({ position, size, rotation: rot }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  const rotation = rot ?? [0, 0, 0] as [number, number, number];
  return <TexturedWall position={position} size={size} rotation={rotation} />;
}

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 200; i++) {
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
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.15} />
    </points>
  );
}

export function AchievementGallery() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);

  useEffect(() => {
    audioManager.playMusic('achievements');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handleCertInteract(index: number) {
    const cert = certifications[index];
    if (!cert) return;
    const lines = [
      `Title: ${cert.title}`,
      `Issuer: ${cert.issuer}`,
      `Date: ${cert.date ?? 'N/A'}`,
      ...(cert.credential_id ? [`Credential ID: ${cert.credential_id}`] : []),
      ...(cert.url ? [`URL: ${cert.url}`] : []),
    ];
    if (cert.skills.length > 0) {
      lines.push('', 'Skills:');
      cert.skills.forEach((s) => lines.push(`  • ${s}`));
    }
    setDialogData({
      type: 'info',
      title: `CERTIFICATION — ${cert.issuer.toUpperCase()}`,
      lines,
      animation: 'scroll',
    });
  }

  function handleHonorInteract(index: number) {
    const honor = honors[index];
    if (!honor) return;
    const lines = [
      `Title: ${honor.title}`,
      `Event: ${honor.event}`,
      `Date: ${honor.date}`,
      ...(honor.description ? [`Description: ${honor.description}`] : []),
    ];
    setDialogData({
      type: 'info',
      title: `HONOR — ${honor.event.toUpperCase()}`,
      lines,
      animation: 'glitch',
    });
  }

  function handleMinigame() {
    setDialogData({
      type: 'minigame',
      gameId: 'memory-match',
    });
  }

  const certDisplayCount = Math.min(8, certifications.length);

  const certPositions: [number, number, number][] = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < certDisplayCount; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const x = -6 + col * 4;
      const z = -8 + row * 5;
      positions.push([x, 2.5, z]);
    }
    return positions;
  }, []);

  const honorPositions: [number, number, number][] = [
    [-3, 1.25, 8],
    [0, 1.25, 8],
    [3, 1.25, 8],
  ];

  return (
    <>
      <ambientLight intensity={0.4} color="#FFD700" />
      <directionalLight position={[5, 10, 5]} intensity={0.5} color="#FFD700" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#FFA500" distance={16} />
      <pointLight position={[-6, 3, -6]} intensity={0.3} color="#FFD700" distance={10} />
      <pointLight position={[6, 3, -6]} intensity={0.3} color="#FFD700" distance={10} />

      <TexturedFloor args={[24, 24]} />

      <Wall position={[0, 3, -12]} size={[24, 6]} />
      <Wall position={[12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[0, 3, 12]} size={[24, 6]} />
      <Wall position={[-12, 3, 0]} size={[24, 6]} rotation={[0, Math.PI / 2, 0]} />

      {[[0, 6, -12, 24, 0.1, 0.1], [12, 6, 0, 0.1, 0.1, 24],
        [0, 6, 12, 24, 0.1, 0.1], [-12, 6, 0, 0.1, 0.1, 24],
        [0, 0, -12, 24, 0.1, 0.1], [12, 0, 0, 0.1, 0.1, 24],
        [0, 0, 12, 24, 0.1, 0.1], [-12, 0, 0, 0.1, 0.1, 24]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}

      {/* Certifications wall — framed panels */}
      {certifications.slice(0, certDisplayCount).map((cert, i) => {
        const pos = certPositions[i] ?? [0, 2.5, 0];
        return (
          <group key={`cert-${i}`}>
            <mesh position={[pos[0], pos[1] + 1.5, pos[2]]}>
              <boxGeometry args={[2.8, 2.0, 0.08]} />
              <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.06} />
            </mesh>
            <mesh position={[pos[0], pos[1] + 1.5, pos[2] + 0.05]}>
              <planeGeometry args={[2.4, 1.6]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
            </mesh>
            <InteractableObject
              id={`cert-frame-${i}`}
              position={[pos[0], pos[1] + 1.5, pos[2]]}
              type="pedestal"
              onInteract={() => handleCertInteract(i)}
              label={cert.issuer}
            />
          </group>
        );
      })}

      {/* Honors showcase — 3 pedestals */}
      {honors.slice(0, 3).map((honor, i) => {
        const pos = honorPositions[i] ?? [0, 1.25, 8];
        return (
          <group key={`honor-${i}`}>
            <mesh position={[pos[0], pos[1] - 0.6, pos[2]]}>
              <cylinderGeometry args={[0.3, 0.4, 1.0, 8]} />
              <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.1} />
            </mesh>
            <mesh position={[pos[0], pos[1] + 0.3, pos[2]]}>
              <boxGeometry args={[0.5, 0.1, 0.5]} />
              <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
            </mesh>
            <InteractableObject
              id={`honor-pedestal-${i}`}
              position={pos}
              type="pedestal"
              onInteract={() => handleHonorInteract(i)}
              label={honor.title}
            />
          </group>
        );
      })}

      {/* Mini-game terminal */}
      <group>
        <mesh position={[-5, 1.25, -5]}>
          <boxGeometry args={[0.9, 1.4, 0.9]} />
          <meshStandardMaterial color="#444444" emissive="#FFD700" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-5, 1.8, -4.59]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
        </mesh>
        <TerminalScreen
          position={[-5, 1.8, -4.58]}
          width={0.65}
          height={0.45}
        />
        <InteractableObject
          id="terminal-memory"
          position={[-5, 1.25, -5]}
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
