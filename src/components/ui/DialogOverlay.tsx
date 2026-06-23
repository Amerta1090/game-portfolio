import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInteractionStore } from '../../game/stores/interactionStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { InfoPanel } from './InfoPanel';
import { IdentityReconstruct } from '../minigames/IdentityReconstruct';
import { SkillConstellation } from '../minigames/SkillConstellation';
import { CodeDebug } from '../minigames/CodeDebug';
import { TimelineOrder } from '../minigames/TimelineOrder';
import { MemoryMatch } from '../minigames/MemoryMatch';
import { gameData } from '../../data/loader';
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

  function handleMiniGameComplete(room: string, fragmentId: string) {
    if (!fragments.includes(fragmentId)) {
      addFragment(fragmentId);
      completeRoom(room as any);
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
          role="dialog"
          aria-modal="true"
          aria-label={dialogData.type === 'info' ? dialogData.title : 'Mini-game'}
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
                onComplete={() => handleMiniGameComplete('identity', 'identity')}
                isCompleted={fragments.includes('identity')}
              />
            )}
            {dialogData.type === 'minigame' && dialogData.gameId === 'skill-constellation' && (
              <SkillConstellation
                onComplete={() => handleMiniGameComplete('skills', 'skills')}
                isCompleted={fragments.includes('skills')}
              />
            )}
            {dialogData.type === 'minigame' && dialogData.gameId === 'code-debug' && (
              <CodeDebug
                onComplete={() => handleMiniGameComplete('projects', 'projects')}
                isCompleted={fragments.includes('projects')}
              />
            )}
            {dialogData.type === 'minigame' && dialogData.gameId === 'timeline-order' && (
              <TimelineOrder
                experiences={gameData.experiences.map((e) => ({
                  id: e.id,
                  role: e.role,
                  company: e.company,
                  start_date: e.start_date,
                }))}
                onComplete={() => handleMiniGameComplete('career', 'career')}
                isCompleted={fragments.includes('career')}
              />
            )}
            {dialogData.type === 'minigame' && dialogData.gameId === 'memory-match' && (
              <MemoryMatch
                pairs={gameData.certifications.slice(0, 8).map((c, i) => ({
                  id: `cert-${i}`,
                  front: c.issuer,
                  back: c.title.length > 30 ? c.title.slice(0, 28) + '…' : c.title,
                }))}
                onComplete={() => handleMiniGameComplete('achievements', 'achievements')}
                isCompleted={fragments.includes('achievements')}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
