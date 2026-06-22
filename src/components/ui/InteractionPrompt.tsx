import { useInteractionStore } from '../../game/stores/interactionStore';
import { useGameStore } from '../../game/stores/gameStore';
import { useEffect } from 'react';
import { audioManager } from '../../utils/audio';

export function InteractionPrompt() {
  const activeObject = useInteractionStore((s) => s.activeObject);
  const isInteracting = useInteractionStore((s) => s.isInteracting);
  const setInteracting = useInteractionStore((s) => s.setInteracting);
  const screen = useGameStore((s) => s.screen);

  useEffect(() => {
    function handleInteract(e: KeyboardEvent) {
      if (e.key === 'e' || e.key === 'E') {
        const obj = useInteractionStore.getState().activeObject;
        if (obj && !obj.isLocked && !isInteracting) {
          setInteracting(true);
          audioManager.playSfx('interact');
          obj.onInteract();
        }
      }
    }
    window.addEventListener('keydown', handleInteract);
    return () => window.removeEventListener('keydown', handleInteract);
  }, [isInteracting, setInteracting]);

  if (screen === 'title' || !activeObject || activeObject.isLocked) return null;

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-dark/80 border border-neon/50 px-6 py-2 rounded font-mono text-sm text-neon flex items-center gap-3">
        <span className="text-white bg-neon/20 px-2 py-0.5 rounded text-xs font-bold">E</span>
        <span>Interact</span>
      </div>
    </div>
  );
}
