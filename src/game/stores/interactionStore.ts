import { create } from 'zustand';
import type { InteractionState, InteractableObject } from '../../types/game';

export const useInteractionStore = create<InteractionState>((set) => ({
  activeObject: null as InteractableObject | null,
  isInteracting: false,
  setActiveObject: (obj: InteractableObject | null) => set({ activeObject: obj }),
  setInteracting: (interacting: boolean) => set({ isInteracting: interacting }),
}));
