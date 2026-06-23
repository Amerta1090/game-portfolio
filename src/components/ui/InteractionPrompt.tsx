import { useInteractionStore } from '../../game/stores/interactionStore';
import { useGameStore } from '../../game/stores/gameStore';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { audioManager } from '../../utils/audio';

const LOCK_MESSAGES: Record<string, string> = {
  'door-career': 'Complete 2 mini-games to unlock Career Hall',
  'door-achievements': 'Visit 4 rooms to unlock Achievement Gallery',
  'door-hidden': 'Collect all 5 key fragments to reveal the hidden room',
};

export function InteractionPrompt() {
  const activeObject = useInteractionStore((s) => s.activeObject);
  const isInteracting = useInteractionStore((s) => s.isInteracting);
  const setInteracting = useInteractionStore((s) => s.setInteracting);
  const screen = useGameStore((s) => s.screen);
  const isPaused = useGameStore((s) => s.isPaused);
  const [showLockMsg, setShowLockMsg] = useState<string | null>(null);

  useEffect(() => {
    if (activeObject?.isLocked && activeObject.id) {
      const msg = LOCK_MESSAGES[activeObject.id] ?? 'Locked';
      setShowLockMsg(msg);
      const timer = setTimeout(() => setShowLockMsg(null), 2500);
      return () => clearTimeout(timer);
    }
    setShowLockMsg(null);
    return;
  }, [activeObject?.id, activeObject?.isLocked]);

  useEffect(() => {
    function handleInteract(e: KeyboardEvent) {
      if (e.key === 'e' || e.key === 'E') {
        if (useGameStore.getState().isPaused) return;
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

  if (screen === 'title' || isPaused || !activeObject || isInteracting) return null;

  if (activeObject.isLocked && showLockMsg) {
    return (
      <motion.div
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        role="alert"
        aria-live="assertive"
      >
        <div className="bg-dark/80 border border-red-500/50 px-6 py-2 rounded font-mono text-xs text-red-400 text-center">
          ⬡ {showLockMsg}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none" role="status" aria-live="polite">
      <div className="bg-dark/80 border border-neon/50 px-6 py-2 rounded font-mono text-sm text-neon flex items-center gap-3">
        <span className="text-white bg-neon/20 px-2 py-0.5 rounded text-xs font-bold" aria-hidden="true">E</span>
        <span>Interact</span>
      </div>
    </div>
  );
}
