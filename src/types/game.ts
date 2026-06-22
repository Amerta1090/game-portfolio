import type { Vector3 } from 'three';

export type Screen = 'title' | 'lobby' | 'room' | 'pause';

export type RoomId = 'identity' | 'skills' | 'projects' | 'career' | 'achievements' | 'hidden';

export interface GameState {
  screen: Screen;
  activeRoom: RoomId | null;
  isPaused: boolean;
  previousScreen: Screen;
  setScreen: (screen: Screen) => void;
  setActiveRoom: (room: RoomId | null) => void;
  setPaused: (paused: boolean) => void;
}

export interface PlayerState {
  position: Vector3;
  rotation: number;
  moveTo: (position: Vector3) => void;
  rotateTo: (rotation: number) => void;
}

export interface ProgressState {
  fragments: string[];
  completedRooms: RoomId[];
  visitedRooms: RoomId[];
  miniGameScores: Record<string, number>;
  unlockedSecretRoom: boolean;
  hasCompletedGame: boolean;
  addFragment: (id: string) => void;
  completeRoom: (id: RoomId) => void;
  completeGame: () => void;
  visitRoom: (id: RoomId) => void;
  setMiniGameScore: (id: string, score: number) => void;
  save: () => void;
  load: () => void;
  reset: () => void;
}

export type InteractableType = 'terminal' | 'door' | 'node' | 'pedestal' | 'fragment';

export interface InteractableObject {
  id: string;
  position: Vector3;
  type: InteractableType;
  data: unknown;
  onInteract: () => void;
  isLocked: boolean;
}

export interface InteractionState {
  activeObject: InteractableObject | null;
  isInteracting: boolean;
  dialogData: DialogData;
  setActiveObject: (obj: InteractableObject | null) => void;
  setInteracting: (interacting: boolean) => void;
  setDialogData: (data: DialogData) => void;
}

export type DialogData = 
  | { type: 'info'; title: string; lines: string[]; animation: 'boot' | 'scroll' | 'glitch' }
  | { type: 'minigame'; gameId: string }
  | null;

export type PerformanceTier = 'low' | 'medium' | 'high';

export interface SaveData {
  version: number;
  timestamp: string;
  completedRooms: RoomId[];
  visitedRooms: RoomId[];
  collectedFragments: string[];
  miniGameScores: Record<string, number>;
  unlockedSecretRoom: boolean;
  hasCompletedGame: boolean;
  settings: {
    musicVolume: number;
    sfxVolume: number;
  };
}
