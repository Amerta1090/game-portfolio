import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../game/stores/gameStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { audioManager } from '../../utils/audio';

export function TitleScreen() {
  const [showStart, setShowStart] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const setScreen = useGameStore((s) => s.setScreen);
  const hasSave = useProgressStore((s) => s.fragments.length > 0 || s.visitedRooms.length > 0);
  const load = useProgressStore((s) => s.load);

  useEffect(() => {
    const timer = setTimeout(() => setShowStart(true), 1500);
    audioManager.init();
    audioManager.playMusic('title');
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && showStart && !fadeOut) {
        setFadeOut(true);
        audioManager.playSfx('interact');
        setTimeout(() => {
          setScreen('lobby');
        }, 800);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showStart, fadeOut, setScreen]);

  function handleContinue() {
    load();
    setFadeOut(true);
    audioManager.playSfx('interact');
    setTimeout(() => setScreen('lobby'), 800);
  }

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="pointer-events-none fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" />

          <motion.h1
            className="text-neon text-5xl md:text-7xl font-game tracking-wider mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            RIDWAN.EXE
          </motion.h1>

          <motion.p
            className="text-gray-400 font-mono text-sm mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            A Pseudo-3D Exploration Game Portfolio
          </motion.p>

          <AnimatePresence>
            {showStart && (
              <motion.p
                className="text-neon font-game text-sm animate-blink"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Press ENTER to start
              </motion.p>
            )}
          </AnimatePresence>

          {hasSave && showStart && (
            <motion.button
              className="mt-8 text-gray-500 font-mono text-sm hover:text-neon transition-colors"
              onClick={handleContinue}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              [ Continue ]
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
