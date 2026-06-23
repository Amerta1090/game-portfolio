export function createFloorTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.12;

  const gridSize = 32;
  for (let i = 0; i <= 512; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.04;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 512; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  return canvas;
}

export function createWallTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * 0.06;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.2;
  for (let i = 0; i < 512; i += 256) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  return canvas;
}

export function createScreenTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0D0D0D';
  ctx.fillRect(0, 0, 128, 96);

  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]|&^%$#@!';
  ctx.font = '8px monospace';
  for (let y = 0; y < 96; y += 10) {
    for (let x = 0; x < 128; x += 8) {
      if (Math.random() > 0.85) {
        const ch = chars[Math.floor(Math.random() * chars.length)]!;
        const alpha = 0.1 + Math.random() * 0.2;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.fillText(ch, x, y);
      }
    }
  }

  ctx.fillStyle = 'rgba(255, 215, 0, 0.03)';
  ctx.fillRect(0, 0, 128, 96);

  return canvas;
}

export function createGridTexture(
  color: string = '#FFD700',
  bg: string = '#1A1A1A',
  gridSize: number = 32,
  opacity: number = 0.12
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = opacity;

  for (let i = 0; i <= 512; i += gridSize) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  ctx.globalAlpha = opacity * 0.3;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 512; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  return canvas;
}

export function createNoiseTexture(
  baseColor: string = '#2A2A2A',
  _noiseColor: string = '#ffffff',
  noiseOpacity: number = 0.06
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const alpha = Math.random() * noiseOpacity;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }

  return canvas;
}
