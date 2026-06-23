import { useState, useMemo, useEffect } from 'react';
import { CanvasTexture } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../game/stores/gameStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { InteractableObject } from '../game/InteractableObject';
import { TerminalScreen } from '../game/TerminalScreen';
import { createGridTexture } from '../../utils/textures';
import { audioManager } from '../../utils/audio';
import { gameData } from '../../data/loader';

const profile = gameData.profile;
const additionalInfo = gameData.additionalInfo;

function AmbientParticles() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 60; i++) {
      pos.push((Math.random() - 0.5) * 10);
      pos.push(Math.random() * 3 + 1);
      pos.push((Math.random() - 0.5) * 10);
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
      <pointsMaterial size={0.04} color="#FFD700" transparent opacity={0.2} />
    </points>
  );
}

function DeskLamp() {
  const ref = useMemo(() => ({ current: null as any }), []);

  useFrame(({ clock }) => {
    if (ref.current) {
      const flicker = 0.95 + Math.sin(clock.elapsedTime * 3) * 0.03 + Math.sin(clock.elapsedTime * 7) * 0.02;
      ref.current.intensity = 0.8 * flicker;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#3A2A1A" />
      </mesh>
      <mesh position={[-1.2, -0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 6]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[1.2, -0.15, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 6]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <coneGeometry args={[0.4, 0.3, 8]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={0.3} />
      </mesh>
      <pointLight ref={ref} position={[0, 0.8, 0]} intensity={0.8} color="#FFD700" distance={6} />
    </group>
  );
}

interface LoreFragment {
  id: string;
  position: [number, number, number];
  title: string;
  lines: string[];
}

const LORE_FRAGMENTS: LoreFragment[] = [
  {
    id: 'lore-journal-1',
    position: [-4, 1.5, -4],
    title: 'Journal Entry #1 — On Language',
    lines: [
      'My journey began with two languages:',
      'English and Indonesian.',
      'Each opened different doors.',
      'English for the global stage of AI research,',
      'Indonesian for grounding in local impact.',
      'Every project is a translation',
      'between these worlds.',
    ],
  },
  {
    id: 'lore-journal-2',
    position: [4, 1.5, -4],
    title: 'Journal Entry #2 — On Building',
    lines: [
      'I believe in systems thinking.',
      'From sensor data to cloud deployment,',
      'every layer matters.',
      'The best solutions emerge',
      'when you understand the full stack,',
      'not just your piece of it.',
    ],
  },
  {
    id: 'lore-journal-3',
    position: [0, 1.5, 4],
    title: 'Journal Entry #3 — On Teaching',
    lines: additionalInfo.volunteering.map(
      (v) => `Speaker at ${v.organization}: ${v.description}`
    ),
  },
];

export function HiddenRoom() {
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const setDialogData = useInteractionStore((s) => s.setDialogData);
  const hasCompletedGame = useProgressStore((s) => s.hasCompletedGame);
  const completeGame = useProgressStore((s) => s.completeGame);
  const [terminalActivated, setTerminalActivated] = useState(hasCompletedGame);

  useEffect(() => {
    audioManager.playMusic('identity');
    return () => audioManager.playMusic('lobby');
  }, []);

  function handleExit() {
    setActiveRoom(null);
    setScreen('lobby');
    audioManager.playSfx('door');
  }

  function handleLoreInteract(id: string) {
    const frag = LORE_FRAGMENTS.find((f) => f.id === id);
    if (!frag) return;
    setDialogData({
      type: 'info',
      title: frag.title,
      lines: frag.lines,
      animation: 'scroll',
    });
  }

  function handleFinalTerminal() {
    setTerminalActivated(true);
    if (!hasCompletedGame) {
      completeGame();
    }
    setDialogData({
      type: 'info',
      title: 'FINAL TRANSMISSION — RIDWAN.EXE',
      lines: [
        'Thank you for exploring my world.',
        '',
        'Every room, every terminal, every puzzle',
        'was a piece of who I am.',
        '',
        `"${profile.tagline}"`,
        '',
        'If you\'d like to connect, reach out:',
        `Email  : ${profile.contact.email}`,
        `Phone  : ${profile.contact.phone}`,
        `GitHub : ${profile.contact.github}`,
        '',
        '— Abdul Majid Ridwan Tyastonoatmaja',
      ],
      animation: 'boot',
    });
  }

  return (
    <>
      <ambientLight intensity={0.25} color="#FFD700" />
      <directionalLight position={[5, 10, 5]} intensity={0.2} color="#FFD700" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          map={new CanvasTexture(createGridTexture('#FFD700', '#1A1A1A', 64, 0.08))}
        />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -7]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial
          map={new CanvasTexture(createGridTexture('#FFD700', '#2A2A2A', 64, 0.04))}
        />
      </mesh>
      <mesh position={[7, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial
          map={new CanvasTexture(createGridTexture('#FFD700', '#2A2A2A', 64, 0.04))}
        />
      </mesh>
      <mesh position={[0, 3, 7]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial
          map={new CanvasTexture(createGridTexture('#FFD700', '#2A2A2A', 64, 0.04))}
        />
      </mesh>
      <mesh position={[-7, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[14, 6]} />
        <meshStandardMaterial
          map={new CanvasTexture(createGridTexture('#FFD700', '#2A2A2A', 64, 0.04))}
        />
      </mesh>

      {/* Yellow trim */}
      {[[0, 6, -7, 14, 0.1, 0.1], [7, 6, 0, 0.1, 0.1, 14], [0, 6, 7, 14, 0.1, 0.1], [-7, 6, 0, 0.1, 0.1, 14],
        [0, 0, -7, 14, 0.1, 0.1], [7, 0, 0, 0.1, 0.1, 14], [0, 0, 7, 14, 0.1, 0.1], [-7, 0, 0, 0.1, 0.1, 14]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`trim-${i}`} position={[x as number, y as number, z as number]}>
          <boxGeometry args={[w as number, h as number, d as number]} />
          <meshStandardMaterial color="#FFD700" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Floor carpet accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[6, 6]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.05} />
      </mesh>

      {/* Desk + Lamp (center) */}
      <DeskLamp />

      {/* Lore fragments (journal panels) */}
      {LORE_FRAGMENTS.map((frag) => (
        <group key={frag.id}>
          <mesh position={[frag.position[0], frag.position[1] - 0.8, frag.position[2]]}>
            <boxGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial color="#333333" emissive="#FFD700" emissiveIntensity={0.08} />
          </mesh>
          <InteractableObject
            id={frag.id}
            position={frag.position}
            type="fragment"
            onInteract={() => handleLoreInteract(frag.id)}
          />
        </group>
      ))}

      {/* Final terminal */}
      <group>
        <mesh position={[0, 0.75, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.8]} />
          <meshStandardMaterial
            color={terminalActivated ? '#FFD700' : '#444444'}
            emissive="#FFD700"
            emissiveIntensity={terminalActivated ? 0.2 : 0.08}
          />
        </mesh>
        <mesh position={[0, 1.25, 0.41]}>
          <planeGeometry args={[0.5, 0.35]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={terminalActivated ? 0.3 : 0.08} />
        </mesh>
        <TerminalScreen
          position={[0, 1.25, 0.43]}
          width={0.45}
          height={0.3}
        />
        <InteractableObject
          id="terminal-final"
          position={[0, 1.25, 0]}
          type="terminal"
          onInteract={handleFinalTerminal}
        />
      </group>

      {/* Resume download button (appears after terminal activation) */}
      {terminalActivated && (
        <group>
          <mesh position={[0, -0.6, 1.2]}>
            <boxGeometry args={[1.8, 0.3, 0.1]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
          </mesh>
          <InteractableObject
            id="resume-download"
            position={[0, -0.6, 1.2]}
            type="terminal"
            onInteract={() => {
              window.open('/resume', '_blank');
            }}
          />
        </group>
      )}

      {/* Contact card (appears after terminal activation) */}
      {terminalActivated && (
        <mesh position={[3, 1.2, 3]}>
          <planeGeometry args={[2, 1.4]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.08} />
        </mesh>
      )}

      {/* Exit door */}
      <group>
        <InteractableObject
          id="door-exit"
          position={[0, 1.25, 7]}
          type="door"
          onInteract={handleExit}
        />
        <mesh position={[0, 3.2, 7]}>
          <planeGeometry args={[2, 0.4]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.15} />
        </mesh>
      </group>

      <AmbientParticles />
    </>
  );
}
