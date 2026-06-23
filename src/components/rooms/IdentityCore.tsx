import { useMemo, useEffect, useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { InteractableObject } from '../game/InteractableObject';
import { TerminalScreen } from '../game/TerminalScreen';
import { TexturedWall, TexturedFloor } from '../game/TexturedWall';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const profile = gameData.profile;

interface TerminalConfig {
  id: string;
  position: [number, number, number];
  label: string;
}

const INFO_TERMINALS: TerminalConfig[] = [
  { id: 'terminal-boot', position: [-5, 1.25, -5], label: 'Boot Sequence' },
  { id: 'terminal-bio', position: [5, 1.25, -5], label: 'Bio Archive' },
  { id: 'terminal-contact', position: [5, 1.25, 5], label: 'Contact Decrypt' },
];

function Wall({ position, size, rotation: rot }: { position: [number, number, number]; size: [number, number]; rotation?: [number, number, number] }) {
  const rotation = rot ?? [0, 0, 0] as [number, number, number];
  return <TexturedWall position={position} size={size} rotation={rotation} />;
}

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 100; i++) {
      pos.push((Math.random() - 0.5) * 16);
      pos.push(Math.random() * 4 + 1);
      pos.push((Math.random() - 0.5) * 16);
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
      <pointsMaterial size={0.06} color="#FFD700" transparent opacity={0.25} />
    </points>
  );
}

function Pedestal() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 0.25 + Math.sin(clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.6, 0.9, 0.5, 8]} />
      <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.08} />
    </mesh>
  );
}

export function IdentityCore() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);

  useEffect(() => {
    audioManager.playMusic('identity');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handleTerminalInteract(type: string) {
    if (type === 'boot') {
      setDialogData({
        type: 'info',
        title: 'BOOT SEQUENCE — IDENTITY CORE',
        lines: [
          `NAME: ${profile.name}`,
          `ROLE: ${profile.headline}`,
          `TAGLINE: ${profile.tagline}`,
          `LOCATION: ${profile.location}`,
          `TIMEZONE: ${profile.timezone}`,
          '...',
          'SYSTEM BOOT COMPLETE.',
        ],
        animation: 'boot',
      });
    } else if (type === 'bio') {
      setDialogData({
        type: 'info',
        title: 'BIO ARCHIVE — PERSONAL RECORD',
        lines: [
          profile.summary,
          '---',
          'METRICS:',
          `  Years of Experience  : ${profile.metrics.years_experience}`,
          `  Projects Shipped     : ${profile.metrics.projects_shipped}`,
          `  Certifications       : ${profile.metrics.certifications}`,
          `  Languages            : ${profile.metrics.languages.join(', ')}`,
        ],
        animation: 'scroll',
      });
    } else if (type === 'contact') {
      setDialogData({
        type: 'info',
        title: 'CONTACT DECRYPT — SECURE CHANNEL',
        lines: [
          `EMAIL    : ${profile.contact.email}`,
          `PHONE    : ${profile.contact.phone}`,
          `LINKEDIN : ${profile.contact.linkedin}`,
          `GITHUB   : ${profile.contact.github}`,
          '',
          'Decryption successful.',
        ],
        animation: 'glitch',
      });
    } else if (type === 'minigame') {
      setDialogData({
        type: 'minigame',
        gameId: 'identity-reconstruct',
      });
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} color="#FFD700" />
      <directionalLight position={[5, 12, 5]} intensity={0.4} color="#FFD700" />
      <pointLight position={[0, 4, 0]} intensity={0.6} color="#FFA500" distance={12} />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#FFD700" distance={8} />
      <pointLight position={[5, 3, -5]} intensity={0.3} color="#FFD700" distance={8} />

      <TexturedFloor args={[20, 20]} />

      {/* Walls */}
      <Wall position={[0, 3, -10]} size={[20, 6]} />
      <Wall position={[10, 3, 0]} size={[20, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[0, 3, 10]} size={[20, 6]} />
      <Wall position={[-10, 3, 0]} size={[20, 6]} rotation={[0, Math.PI / 2, 0]} />

      {/* Yellow trim borders */}
      {[[0, 6, -10, 20, 0.1, 0.1], [10, 6, 0, 0.1, 0.1, 20], [0, 6, 10, 20, 0.1, 0.1], [-10, 6, 0, 0.1, 0.1, 20],
        [0, 0, -10, 20, 0.1, 0.1], [10, 0, 0, 0.1, 0.1, 20], [0, 0, 10, 20, 0.1, 0.1], [-10, 0, 0, 0.1, 0.1, 20]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      ))}

      {/* Info Terminals */}
      {INFO_TERMINALS.map((terminal) => (
        <group key={terminal.id}>
          {/* Terminal body */}
          <mesh position={[terminal.position[0], terminal.position[1] - 0.8, terminal.position[2]]}>
            <boxGeometry args={[0.8, 1.2, 0.8]} />
            <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.1} />
          </mesh>
          {/* Terminal screen glow */}
          <mesh position={[terminal.position[0], terminal.position[1] + 0.3, terminal.position[2] + 0.41]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
          </mesh>
          <TerminalScreen
            position={[terminal.position[0], terminal.position[1] + 0.3, terminal.position[2] + 0.42]}
            width={0.55}
            height={0.35}
          />
          <InteractableObject
            id={terminal.id}
            position={terminal.position}
            type="terminal"
            onInteract={() => {
              const type = terminal.id.split('-')[1] ?? 'boot';
              handleTerminalInteract(type);
            }}
          />
        </group>
      ))}

      {/* Mini-game terminal */}
      <group>
        <mesh position={[-5, 1.25, 5]}>
          <boxGeometry args={[0.9, 1.4, 0.9]} />
          <meshStandardMaterial color="#444444" emissive="#FFD700" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[-5, 1.8, 5.41]}>
          <planeGeometry args={[0.7, 0.5]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
        </mesh>
        <mesh position={[-5, 1.25, 5]}>
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.4} />
        </mesh>
        <TerminalScreen
          position={[-5, 1.8, 5.42]}
          width={0.65}
          height={0.45}
        />
        <InteractableObject
          id="terminal-minigame"
          position={[-5, 1.25, 5]}
          type="terminal"
          onInteract={() => handleTerminalInteract('minigame')}
        />
      </group>

      {/* Exit door (facing back to lobby) */}
      <group>
        <InteractableObject
          id="door-exit"
          position={[0, 1.25, 10]}
          type="door"
          onInteract={handleExit}
        />
        <mesh position={[0, 3.2, 10]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Central pedestal */}
      <Pedestal />

      <AmbientParticles />
    </>
  );
}
