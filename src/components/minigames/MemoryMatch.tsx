import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CardPair {
  id: string;
  front: string;
  back: string;
}

interface MemoryMatchProps {
  pairs: CardPair[];
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

interface CardState {
  pairId: string;
  side: 'front' | 'back';
  matched: boolean;
}

export function MemoryMatch({ pairs, onComplete, isCompleted }: MemoryMatchProps) {
  const [cards] = useState<CardState[]>(() => {
    const flat: CardState[] = [];
    pairs.forEach((p) => {
      flat.push({ pairId: p.id, side: 'front', matched: false });
      flat.push({ pairId: p.id, side: 'back', matched: false });
    });
    return shuffleArray(flat);
  });
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [locked, setLocked] = useState(false);

  const handleCardClick = useCallback((index: number) => {
    if (locked) return;
    if (flipped.length >= 2) return;
    const card = cards[index];
    if (!card || card.matched) return;
    if (flipped.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      const firstIdx = newFlipped[0];
      const secondIdx = newFlipped[1];
      if (firstIdx === undefined || secondIdx === undefined) return;
      const first = cards[firstIdx];
      const second = cards[secondIdx];
      if (!first || !second) return;

      if (first.pairId === second.pairId && first.side !== second.side) {
        const newMatched = new Set(matched);
        newMatched.add(first.pairId);
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);

        if (newMatched.size === pairs.length) {
          setShowSuccess(true);
          setTimeout(() => onComplete(), 1500);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 1000);
      }
    }
  }, [flipped, locked, cards, matched, pairs.length, onComplete]);

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
        <h2 className="text-neon font-game text-sm mb-3">GALLERY VERIFIED</h2>
        <p className="text-gray-400 font-mono text-xs">All credentials matched and verified.</p>
        <p className="text-neon font-mono text-xs mt-4">Key Fragment #5 acquired</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">MEMORY MATCH</h2>
        </div>
        <p className="text-gray-500 font-mono text-xs">
          Verify credentials. Match certification titles to their issuers.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-gray-500 font-mono text-xs">
          Matched: {matched.size}/{pairs.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || card.matched;
          const pair = pairs.find((p) => p.id === card.pairId);
          const label = card.side === 'front' ? pair?.front : pair?.back;
          return (
            <motion.button
              key={`${card.pairId}-${card.side}-${index}`}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded flex items-center justify-center text-center p-1 text-xs font-mono transition-colors border ${
                card.matched
                  ? 'bg-neon/10 border-neon/50 text-neon cursor-default'
                  : isFlipped
                    ? 'bg-dark/80 border-gray-600 text-gray-200'
                    : 'bg-concrete/50 border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
              whileHover={!isFlipped && !card.matched ? { scale: 1.05 } : {}}
              whileTap={!isFlipped && !card.matched ? { scale: 0.95 } : {}}
              disabled={card.matched}
            >
              {isFlipped || card.matched ? (
                <span className="leading-tight">{label}</span>
              ) : (
                <span className="text-lg">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-gray-600 font-mono text-xs text-center mt-4">
        Click two cards to find matching pairs
      </p>
    </div>
  );
}
