import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';

interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  start_date: string;
}

interface TimelineOrderProps {
  experiences: ExperienceEntry[];
  onComplete: () => void;
  isCompleted: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = shuffled[i] as T;
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = tmp;
  }
  return shuffled;
}

export function TimelineOrder({ experiences, onComplete, isCompleted }: TimelineOrderProps) {
  const [items, setItems] = useState(() => shuffleArray(experiences));
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const correctOrder = [...experiences].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  );

  const handleSubmit = useCallback(() => {
    const isCorrect = items.every((item, i) => {
      const correct = correctOrder[i];
      return correct && item.id === correct.id;
    });
    if (isCorrect) {
      setShowSuccess(true);
      setTimeout(() => onComplete(), 1500);
    } else {
      setShowError(true);
      setAttempts((a) => a + 1);
      setTimeout(() => setShowError(false), 800);
    }
  }, [items, correctOrder, onComplete]);

  if (isCompleted || showSuccess) {
    return (
      <motion.div
        className="bg-dark/95 border border-neon/50 rounded-lg p-8 max-w-lg w-full mx-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-6xl mb-4"
        >
          ⬡
        </motion.div>
        <h2 className="text-neon font-game text-sm mb-3">TIMELINE CALIBRATED</h2>
        <p className="text-gray-400 font-mono text-xs">Career chronology restored successfully.</p>
        <p className="text-neon font-mono text-xs mt-4">Key Fragment #4 acquired</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">TIMELINE ORDER</h2>
        </div>
        <p className="text-gray-500 font-mono text-xs">
          System timeline corrupted. Drag experiences into chronological order (oldest to newest).
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((item, i) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className={`bg-concrete/50 border border-gray-700 rounded px-4 py-3 cursor-grab active:cursor-grabbing select-none
              ${showError ? 'border-red-500/50' : 'hover:border-neon/30'}
              transition-colors`}
            whileDrag={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.15)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-neon/50 font-mono text-xs w-5">{i + 1}</span>
              <div className="flex-1">
                <p className="text-gray-300 font-mono text-sm">{item.role}</p>
                <p className="text-gray-500 font-mono text-xs">{item.company} — {item.start_date}</p>
              </div>
              <span className="text-gray-600 text-xs">⠿</span>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {showError && (
        <motion.p
          className="text-red-400 font-mono text-xs mt-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Sequence mismatch — timeline order incorrect. Verify and retry.
        </motion.p>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-gray-600 font-mono text-xs">
          Attempts: {attempts}
        </span>
        <motion.button
          className="bg-neon/20 border border-neon/50 text-neon px-6 py-2 rounded font-mono text-xs hover:bg-neon/30 transition-colors"
          onClick={handleSubmit}
          whileTap={{ scale: 0.97 }}
        >
          [ Verify Order ]
        </motion.button>
      </div>
    </div>
  );
}
