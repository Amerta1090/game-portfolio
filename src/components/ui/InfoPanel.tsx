import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface InfoPanelProps {
  title: string;
  lines: string[];
  animation: 'boot' | 'scroll' | 'glitch';
  onClose: () => void;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-blink text-neon">_</span>}
    </span>
  );
}

function GlitchText({ text }: { text: string }) {
  return (
    <motion.p
      className="text-neon font-mono text-sm"
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ x: [0, -2, 2, -1, 0], transition: { duration: 0.2 } }}
    >
      {text}
    </motion.p>
  );
}

export function InfoPanel({ title, lines, animation, onClose }: InfoPanelProps) {
  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-neon transition-colors font-mono text-sm"
        >
          [X]
        </button>
      </div>

      <div className="space-y-3">
        {lines.map((line, i) => {
          if (animation === 'boot') {
            return (
              <motion.p
                key={i}
                className="text-gray-300 font-mono text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.5, duration: 0.3 }}
              >
                <TypewriterText text={line} />
              </motion.p>
            );
          }
          if (animation === 'scroll') {
            return (
              <motion.p
                key={i}
                className="text-gray-300 font-mono text-sm leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3, duration: 0.5 }}
              >
                {line}
              </motion.p>
            );
          }
          if (animation === 'glitch') {
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, filter: 'blur(4px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.4, duration: 0.6 }}
                className="overflow-hidden"
              >
                <GlitchText text={line} />
              </motion.div>
            );
          }
          return (
            <p key={i} className="text-gray-300 font-mono text-sm">
              {line}
            </p>
          );
        })}
      </div>

      <motion.button
        className="mt-6 text-neon font-mono text-xs hover:text-white transition-colors"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        [ Close ]
      </motion.button>
    </div>
  );
}
