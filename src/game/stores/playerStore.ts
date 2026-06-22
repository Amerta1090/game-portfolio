import { create } from 'zustand';
import { Vector3 } from 'three';
import type { PlayerState } from '../../types/game';

export const usePlayerStore = create<PlayerState>((set) => ({
  position: new Vector3(0, 0, 0),
  rotation: 0,
  moveTo: (position: Vector3) => set({ position }),
  rotateTo: (rotation: number) => set({ rotation }),
}));
