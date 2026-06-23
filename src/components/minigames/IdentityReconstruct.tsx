import { useState, useCallback } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FragmentBurst } from '../ui/FragmentBurst';

interface IdentityReconstructProps {
  fragments: string[];
  onComplete: () => void;
  isCompleted: boolean;
}

function shuffleArray(arr: string[]): string[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp: string = shuffled[i] as string;
    shuffled[i] = shuffled[j] as string;
    shuffled[j] = tmp;
  }
  return shuffled;
}

export function IdentityReconstruct({ fragments, onComplete, isCompleted }: IdentityReconstructProps) {
  const [items, setItems] = useState(() => shuffleArray(fragments));
  const [attempts, setAttempts] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const correctOrder = fragments;

  const handleSubmit = useCallback(() => {
    const isCorrect = items.every((item, i) => item === correctOrder[i]);
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
      <FragmentBurst
        label="SYSTEM INTEGRITY RESTORED"
        subtitle="Identity fragment reconstructed successfully."
        fragmentNumber={1}
      />
    );
  }

  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">IDENTITY FRAGMENT RECONSTRUCT</h2>
        </div>
        <p className="text-gray-500 font-mono text-xs">
          System boot sequence corrupted. Drag fragments into the correct order to restore identity data.
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2"
      >
        {items.map((fragment, i) => (
          <Reorder.Item
            key={fragment}
            value={fragment}
            className={`bg-concrete/50 border border-gray-700 rounded px-4 py-3 cursor-grab active:cursor-grabbing select-none
              ${showError ? 'border-red-500/50' : 'hover:border-neon/30'}
              transition-colors`}
            whileDrag={{
              scale: 1.02,
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.15)',
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-neon/50 font-mono text-xs">{i + 1}</span>
              <span className="text-gray-300 font-mono text-sm leading-relaxed">
                {fragment}
              </span>
              <span className="ml-auto text-gray-600 text-xs">⠿</span>
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
          Sequence mismatch — fragments out of order. Verify and retry.
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
          [ Verify Sequence ]
        </motion.button>
      </div>
    </div>
  );
}
