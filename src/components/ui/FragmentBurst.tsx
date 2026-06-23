import { motion } from 'framer-motion';

interface FragmentBurstProps {
  label: string;
  subtitle: string;
  fragmentNumber: number;
}

const hexPositions = [
  { x: -60, y: -40, delay: 0.05 },
  { x: 60, y: -35, delay: 0.1 },
  { x: -50, y: 45, delay: 0.15 },
  { x: 55, y: 40, delay: 0.2 },
  { x: -70, y: 5, delay: 0.08 },
  { x: 70, y: 10, delay: 0.12 },
  { x: -20, y: -60, delay: 0.18 },
  { x: 25, y: -55, delay: 0.22 },
];

export function FragmentBurst({ label, subtitle, fragmentNumber }: FragmentBurstProps) {
  return (
    <motion.div
      className="bg-dark/95 border-2 border-neon/50 rounded p-8 max-w-lg w-full mx-4 text-center relative overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {/* Burst particles */}
      {hexPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute text-neon/40 text-xs"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: pos.x,
            y: pos.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{ delay: pos.delay, duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        >
          ⬡
        </motion.div>
      ))}

      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 border border-neon/20 rounded"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 1.2] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        aria-hidden="true"
      />

      {/* Main hex icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="text-6xl mb-4 relative"
      >
        <motion.span
          className="inline-block text-neon"
          animate={{
            filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'],
            textShadow: [
              '0 0 10px rgba(255,215,0,0.3)',
              '0 0 30px rgba(255,215,0,0.6)',
              '0 0 10px rgba(255,215,0,0.3)',
            ],
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          ⬡
        </motion.span>
      </motion.div>

      <motion.h2
        className="text-neon font-game text-sm mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {label}
      </motion.h2>

      <motion.p
        className="text-gray-400 font-mono text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {subtitle}
      </motion.p>

      <motion.p
        className="text-neon font-mono text-xs mt-4"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        Key Fragment #{fragmentNumber} acquired
      </motion.p>
    </motion.div>
  );
}
