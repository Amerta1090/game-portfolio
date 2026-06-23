import type { PerformanceTier } from '../types/game';

export function detectPerformanceTier(): PerformanceTier {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'low';
  } catch {
    return 'low';
  }

  const concurrency = navigator.hardwareConcurrency ?? 0;
  const memory = (navigator as unknown as Record<string, unknown>).deviceMemory as number | undefined;
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

  if (isMobile || concurrency <= 4 || (memory !== undefined && memory <= 2)) {
    return 'low';
  }

  if (concurrency >= 8 && (memory === undefined || memory >= 4)) {
    return 'high';
  }

  return 'medium';
}

export const performanceTier = detectPerformanceTier();

export const qualitySettings = {
  shadows: performanceTier === 'high',
  antialias: performanceTier !== 'low',
  postProcessing: performanceTier === 'high',
  particleCount: performanceTier === 'high' ? 200 : performanceTier === 'medium' ? 100 : 50,
  textureSize: performanceTier === 'high' ? 1024 : 512,
};

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const reducedMotion = prefersReducedMotion();
