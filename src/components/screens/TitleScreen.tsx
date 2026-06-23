import { useEffect, useState } from 'react';
import { Vector3 } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../game/stores/gameStore';
import { usePlayerStore } from '../../game/stores/playerStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { audioManager } from '../../utils/audio';

export function TitleScreen() {
  const [showStart, setShowStart] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const setScreen = useGameStore((s) => s.setScreen);
  const moveTo = usePlayerStore((s) => s.moveTo);
  const rotateTo = usePlayerStore((s) => s.rotateTo);
  const hasSave = useProgressStore((s) => s.fragments.length > 0 || s.visitedRooms.length > 0);
  const load = useProgressStore((s) => s.load);

  function startGame() {
    moveTo(new Vector3(0, 0, 0));
    rotateTo(0);
    setFadeOut(true);
    audioManager.playSfx('interact');
    setTimeout(() => setScreen('lobby'), 800);
  }

  useEffect(() => {
    document.getElementById('loading-screen')?.remove();
    const timer = setTimeout(() => setShowStart(true), 1500);
    audioManager.init();
    audioManager.playMusic('title');
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && showStart && !fadeOut) {
        startGame();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showStart, fadeOut, startGame]);

  function handleContinue() {
    load();
    startGame();
  }

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark cursor-pointer"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          role="main"
          aria-label="RIDWAN.EXE title screen"
        >
          <div className="pointer-events-none fixed inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]" aria-hidden="true" />

          <motion.h1
            className="text-neon text-5xl md:text-7xl font-game tracking-wider mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ textShadow: '2px 2px 0px rgba(255,215,0,0.3), -1px -1px 0px rgba(255,100,0,0.15)' }}
          >
            <span className="relative inline-block">
              RIDWAN.EXE
              {/* Glitch ghost layers */}
              <span
                className="absolute inset-0 text-orange-500/30 animate-glitch pointer-events-none"
                style={{ clipPath: 'inset(20% 0 30% 0)', transform: 'translateX(-2px)' }}
                aria-hidden="true"
              >
                RIDWAN.EXE
              </span>
              <span
                className="absolute inset-0 text-yellow-300/20 animate-glitch pointer-events-none"
                style={{ clipPath: 'inset(50% 0 10% 0)', transform: 'translateX(2px)', animationDelay: '0.1s' }}
                aria-hidden="true"
              >
                RIDWAN.EXE
              </span>
            </span>
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
                aria-live="polite"
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
              aria-label="Continue from saved game"
            >
              [ Continue ]
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
