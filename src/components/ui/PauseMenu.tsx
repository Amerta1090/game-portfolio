import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../game/stores/gameStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { audioManager } from '../../utils/audio';

export function PauseMenu() {
  const isPaused = useGameStore((s) => s.isPaused);
  const setPaused = useGameStore((s) => s.setPaused);
  const setScreen = useGameStore((s) => s.setScreen);
  const setActiveRoom = useGameStore((s) => s.setActiveRoom);
  const save = useProgressStore((s) => s.save);
  const hasCompletedGame = useProgressStore((s) => s.hasCompletedGame);
  const dialogData = useInteractionStore((s) => s.dialogData);
  const [showCredits, setShowCredits] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showCredits) {
          setShowCredits(false);
          return;
        }
        if (dialogData) return;
        setPaused(!useGameStore.getState().isPaused);
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setPaused, showCredits, dialogData]);

  useEffect(() => {
    if (!isPaused || !menuRef.current) return;
    const buttons = menuRef.current.querySelectorAll('button');
    const first = buttons[0] as HTMLButtonElement | undefined;
    const last = buttons[buttons.length - 1] as HTMLButtonElement | undefined;
    first?.focus();

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isPaused]);

  function handleResume() {
    setPaused(false);
  }

  function handleSave() {
    save();
    audioManager.playSfx('interact');
  }

  function handleReturnToTitle() {
    setPaused(false);
    setActiveRoom(null);
    setScreen('title');
    audioManager.playMusic('title');
  }

  function handleCredits() {
    setShowCredits(true);
  }

  function handleCloseCredits() {
    setShowCredits(false);
  }

  const buttonClass = "w-full text-left px-6 py-3 text-gray-300 font-mono text-sm hover:text-neon hover:bg-neon/5 transition-colors border-b border-gray-800 last:border-b-0";

  return (
    <AnimatePresence>
      {isPaused && !showCredits && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Pause menu"
        >
          <motion.div
            ref={menuRef}
            className="bg-dark/95 border border-neon/30 rounded-lg overflow-hidden w-72"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-neon font-game text-xs tracking-wider">PAUSED</h2>
            </div>

            <div className="py-2">
              <button className={buttonClass} onClick={handleResume}>
                &gt; Resume
              </button>
              <button className={buttonClass} onClick={handleSave}>
                &gt; Save Progress
              </button>
              {hasCompletedGame && (
                <button className={buttonClass} onClick={handleCredits}>
                  &gt; Credits
                </button>
              )}
              <button className={buttonClass} onClick={handleReturnToTitle}>
                &gt; Return to Title
              </button>
            </div>

            <div className="px-6 py-3 border-t border-gray-800">
              <p className="text-gray-600 font-mono text-[10px] text-center">ESC to resume</p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showCredits && (
        <CreditsScreen onClose={handleCloseCredits} />
      )}
    </AnimatePresence>
  );
}

function CreditsScreen({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-dark/95 border border-neon/20 rounded-lg p-8 max-w-md w-full mx-4 text-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-neon font-game text-xl tracking-wider mb-6">RIDWAN.EXE</h2>

        <div className="space-y-4 text-gray-400 font-mono text-sm leading-relaxed mb-8">
          <p>Thank you for exploring.</p>
          <p className="text-gray-500 text-xs">
            A pseudo-3D exploration game portfolio
          </p>
          <p className="text-gray-500 text-xs">
            Built with Astro + React + Three.js + Tailwind CSS + Framer Motion
          </p>
          <hr className="border-gray-800" />
          <p className="text-neon text-xs">
            All data sourced from actual profile, projects, skills, and experience.
          </p>
          <hr className="border-gray-800" />
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Abdul Majid Ridwan Tyastonoatmaja
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="text-neon font-mono text-sm hover:text-white transition-colors border border-neon/30 rounded px-6 py-2 hover:bg-neon/10"
            onClick={onClose}
          >
            [ Close ]
          </button>
          <button
            className="text-gray-500 font-mono text-xs hover:text-neon transition-colors"
            onClick={() => window.open('/resume', '_blank')}
          >
            Download Resume
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
