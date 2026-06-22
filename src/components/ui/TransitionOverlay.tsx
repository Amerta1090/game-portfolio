import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../game/stores/gameStore';
import { ROOM_NAMES } from '../../game/constants';
import { useState, useEffect } from 'react';

export function TransitionOverlay() {
  const activeRoom = useGameStore((s) => s.activeRoom);
  const screen = useGameStore((s) => s.screen);
  const [show, setShow] = useState(false);
  const [roomLabel, setRoomLabel] = useState('');

  useEffect(() => {
    if (screen === 'room' && activeRoom) {
      setRoomLabel(ROOM_NAMES[activeRoom] ?? activeRoom);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [screen, activeRoom]);

  const transitioning = screen === 'room' || (screen === 'lobby' && !show);

  return (
    <AnimatePresence>
      {(show || (screen === 'room' && show === false)) && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {show && (
            <motion.p
              className="text-neon font-game text-2xl tracking-wider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {roomLabel}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
