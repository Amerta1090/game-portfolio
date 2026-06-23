import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { CanvasTexture, NearestFilter } from 'three';

interface TerminalScreenProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
}

const CHAR_SET = '01ABCDEF<>/{}[]|&^%$#@!';
const COLS = 20;
const ROWS = 14;

function generateFrame(): string[] {
  const frame: string[] = [];
  for (let r = 0; r < ROWS; r++) {
    let row = '';
    for (let c = 0; c < COLS; c++) {
      if (Math.random() > 0.7) {
        row += CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
      } else {
        row += ' ';
      }
    }
    frame.push(row);
  }
  return frame;
}

export function TerminalScreen({
  position = [0, 0, 0],
  width = 0.6,
  height = 0.4,
}: TerminalScreenProps) {
  const offsetRef = useRef(0);

  const canvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 240;
    return c;
  }, []);

  const texture = useMemo(() => {
    const t = new CanvasTexture(canvas);
    t.minFilter = NearestFilter;
    t.magFilter = NearestFilter;
    return t;
  }, [canvas]);

  useFrame(() => {
    offsetRef.current += 0.02;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, 320, 240);

    const chars = generateFrame();
    ctx.font = '14px monospace';
    const alpha = 0.15 + Math.sin(offsetRef.current * 0.5) * 0.05;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const char = chars[r]?.[c];
        if (char && char !== ' ') {
          const flicker = Math.random() > 0.92 ? 0.05 : alpha;
          ctx.fillStyle = `rgba(255, 215, 0, ${flicker})`;
          ctx.fillText(char, c * 16 + 4, r * 16 + 14);
        }
      }
    }

    ctx.fillStyle = `rgba(255, 215, 0, 0.02)`;
    ctx.fillRect(0, 0, 320, 240);

    texture.needsUpdate = true;
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={0.85} />
    </mesh>
  );
}
