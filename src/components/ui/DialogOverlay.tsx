import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { InfoPanel } from './InfoPanel';
import { IdentityReconstruct } from '../minigames/IdentityReconstruct';
import { audioManager } from '../../utils/audio';
export function DialogOverlay() {
  const dialogData = useInteractionStore((s) => s.dialogData);
  const setDialogData = useInteractionStore((s) => s.setDialogData);
  const fragments = useProgressStore((s) => s.fragments);
  const addFragment = useProgressStore((s) => s.addFragment);
  const completeRoom = useProgressStore((s) => s.completeRoom);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && dialogData) {
        setDialogData(null);
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [dialogData, setDialogData]);

  function handleClose() {
    setDialogData(null);
  }

  function handleMiniGameComplete() {
    if (!fragments.includes('identity')) {
      addFragment('identity');
      completeRoom('identity');
      audioManager.playSfx('unlock');
    }
  }

  return (
    <AnimatePresence>
      {dialogData && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {dialogData.type === 'info' && (
              <InfoPanel
                title={dialogData.title}
                lines={dialogData.lines}
                animation={dialogData.animation}
                onClose={handleClose}
              />
            )}
            {dialogData.type === 'minigame' && dialogData.gameId === 'identity-reconstruct' && (
              <IdentityReconstruct
                fragments={[
                  'Computer science graduate focused on applied machine learning,',
                  'data science, and intelligent systems.',
                  'Background in electronics and IoT.',
                  'Builds AI-powered solutions at the intersection of data,',
                  'automation, and physical computing.',
                  'Emphasizes structured analysis, system-level thinking, and practical implementation.',
                ]}
                onComplete={handleMiniGameComplete}
                isCompleted={fragments.includes('identity')}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
