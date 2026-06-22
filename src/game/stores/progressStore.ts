import { create } from 'zustand';
import type { ProgressState, RoomId, SaveData } from '../../types/game';
import { SAVE_KEY, GAME_VERSION } from '../constants';

function loadSaveData(): Partial<SaveData> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

function persistSaveData(state: ProgressState): void {
  const data: SaveData = {
    version: GAME_VERSION,
    timestamp: new Date().toISOString(),
    completedRooms: state.completedRooms,
    visitedRooms: state.visitedRooms,
    collectedFragments: state.fragments,
    miniGameScores: state.miniGameScores,
    unlockedSecretRoom: state.unlockedSecretRoom,
    hasCompletedGame: state.hasCompletedGame,
    settings: { musicVolume: 0.5, sfxVolume: 0.5 },
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

export const useProgressStore = create<ProgressState>((set, get) => {
  const saved = loadSaveData();

  return {
    fragments: saved?.collectedFragments ?? [],
    completedRooms: saved?.completedRooms ?? [],
    visitedRooms: saved?.visitedRooms ?? [],
    miniGameScores: saved?.miniGameScores ?? {},
    unlockedSecretRoom: saved?.unlockedSecretRoom ?? false,
    hasCompletedGame: saved?.hasCompletedGame ?? false,

    addFragment: (id: string) => {
      set((state) => {
        if (state.fragments.includes(id)) return state;
        const fragments = [...state.fragments, id];
        return { fragments };
      });
      persistSaveData(get());
    },

    completeRoom: (id: RoomId) => {
      set((state) => {
        if (state.completedRooms.includes(id)) return state;
        const completedRooms = [...state.completedRooms, id];
        return { completedRooms };
      });
      persistSaveData(get());
    },

    completeGame: () => {
      set({ hasCompletedGame: true, unlockedSecretRoom: true });
      persistSaveData(get());
    },

    visitRoom: (id: RoomId) => {
      set((state) => {
        if (state.visitedRooms.includes(id)) return state;
        const visitedRooms = [...state.visitedRooms, id];
        return { visitedRooms };
      });
      persistSaveData(get());
    },

    setMiniGameScore: (id: string, score: number) => {
      set((state) => ({
        miniGameScores: { ...state.miniGameScores, [id]: score },
      }));
      persistSaveData(get());
    },

    save: () => persistSaveData(get()),
    load: () => {
      const saved = loadSaveData();
      if (saved) {
        set({
          fragments: saved.collectedFragments ?? [],
          completedRooms: saved.completedRooms ?? [],
          visitedRooms: saved.visitedRooms ?? [],
          miniGameScores: saved.miniGameScores ?? {},
          unlockedSecretRoom: saved.unlockedSecretRoom ?? false,
          hasCompletedGame: saved.hasCompletedGame ?? false,
        });
      }
    },
    reset: () => {
      set({
        fragments: [],
        completedRooms: [],
        visitedRooms: [],
        miniGameScores: {},
        unlockedSecretRoom: false,
        hasCompletedGame: false,
      });
      persistSaveData(get());
    },
  };
});
