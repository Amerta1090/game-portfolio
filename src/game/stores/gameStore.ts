import { create } from 'zustand';
import type { GameState, Screen, RoomId } from '../../types/game';

export const useGameStore = create<GameState>((set) => ({
  screen: 'title' as Screen,
  activeRoom: null as RoomId | null,
  isPaused: false,
  previousScreen: 'title' as Screen,
  setScreen: (screen: Screen) => set({ screen }),
  setActiveRoom: (room: RoomId | null) => set({ activeRoom: room }),
  setPaused: (paused: boolean) =>
    set((state) => ({
      isPaused: paused,
      previousScreen: paused ? state.screen : state.previousScreen,
    })),
}));
