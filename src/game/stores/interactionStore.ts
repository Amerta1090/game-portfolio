import { create } from 'zustand';
import type { InteractionState, InteractableObject, DialogData } from '../../types/game';

export const useInteractionStore = create<InteractionState>((set) => ({
  activeObject: null as InteractableObject | null,
  isInteracting: false,
  dialogData: null as DialogData,
  setActiveObject: (obj: InteractableObject | null) => set({ activeObject: obj }),
  setInteracting: (interacting: boolean) => set({ isInteracting: interacting }),
  setDialogData: (data: DialogData) => set({ dialogData: data, isInteracting: data !== null }),
}));
