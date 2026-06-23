import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FragmentBurst } from '../ui/FragmentBurst';

interface SkillNode {
  id: string;
  label: string;
  group: number;
}

interface Connection {
  from: string;
  to: string;
}

const NODES: SkillNode[] = [
  { id: 'ml', label: 'Machine Learning', group: 1 },
  { id: 'dl', label: 'Deep Learning', group: 1 },
  { id: 'python', label: 'Python', group: 2 },
  { id: 'ds', label: 'Data Science', group: 2 },
  { id: 'react', label: 'React.js', group: 3 },
  { id: 'js', label: 'JavaScript', group: 3 },
  { id: 'iot', label: 'IoT', group: 4 },
  { id: 'embedded', label: 'Embedded Systems', group: 4 },
];

const VALID_CONNECTIONS: Connection[] = [
  { from: 'ml', to: 'dl' },
  { from: 'python', to: 'ds' },
  { from: 'react', to: 'js' },
  { from: 'iot', to: 'embedded' },
];

interface SkillConstellationProps {
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

function nodeColor(group: number): string {
  const colors: Record<number, string> = {
    1: '#FFD700',
    2: '#4FC3F7',
    3: '#81C784',
    4: '#CE93D8',
  };
  return colors[group] ?? '#ffffff';
}

export function SkillConstellation({ onComplete, isCompleted }: SkillConstellationProps) {
  const [shuffledNodes] = useState(() => shuffleArray(NODES));
  const [selected, setSelected] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState('');

  const isValidConnection = useCallback((a: string, b: string): boolean => {
    return VALID_CONNECTIONS.some(
      (c) => (c.from === a && c.to === b) || (c.from === b && c.to === a)
    );
  }, []);

  function handleNodeClick(id: string) {
    if (connected.has(id)) return;

    if (selected === null) {
      setSelected(id);
      return;
    }

    if (selected === id) {
      setSelected(null);
      return;
    }

    if (isValidConnection(selected, id)) {
      const newConnected = new Set(connected);
      newConnected.add(selected);
      newConnected.add(id);
      setConnected(newConnected);
      setSelected(null);
      setShowError('');

      if (newConnected.size === NODES.length) {
        setShowSuccess(true);
        setTimeout(() => onComplete(), 1500);
      }
    } else {
      setShowError('Nodes are not related — no valid connection exists.');
      setSelected(null);
      setTimeout(() => setShowError(''), 1200);
    }
  }

  if (isCompleted || showSuccess) {
    return (
      <FragmentBurst
        label="CONSTELLATION ALIGNED"
        subtitle="All skill connections established."
        fragmentNumber={2}
      />
    );
  }

  const pairsConnected = connected.size / 2;
  const totalPairs = VALID_CONNECTIONS.length;

  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">SKILL CONSTELLATION</h2>
        </div>
        <p className="text-gray-500 font-mono text-xs">
          Connect related skill nodes to form valid constellations. Click two related nodes to connect them.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <span className="text-gray-500 font-mono text-xs">
          Connections: {pairsConnected}/{totalPairs}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {shuffledNodes.map((node) => {
          const isSelected = selected === node.id;
          const isConnected = connected.has(node.id);
          const color = nodeColor(node.group);
          return (
            <motion.button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              disabled={isConnected}
              className={`relative px-4 py-3 rounded font-mono text-xs transition-all border
                ${isConnected
                  ? 'border-neon/50 bg-neon/10 text-neon cursor-default'
                  : isSelected
                    ? 'border-white/70 bg-white/10 text-white'
                    : 'border-gray-700 bg-dark/50 text-gray-300 hover:border-gray-500'
                }`}
              whileHover={!isConnected ? { scale: 1.05 } : {}}
              whileTap={!isConnected ? { scale: 0.95 } : {}}
            >
              {isConnected && (
                <span className="absolute -top-1 -right-1 text-neon text-xs">⬡</span>
              )}
              <span style={{ color: isConnected ? color : undefined }}>
                {node.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {showError && (
        <motion.p
          className="text-red-400 font-mono text-xs text-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {showError}
        </motion.p>
      )}

      {selected && (
        <p className="text-gray-500 font-mono text-xs text-center">
          Selected: {shuffledNodes.find((n) => n.id === selected)?.label} — choose a matching node
        </p>
      )}
    </div>
  );
}
