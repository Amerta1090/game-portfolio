import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface BugChallenge {
  code: string[];
  errorLine: number;
  fixLabel: string;
  explanation: string;
}

const CHALLENGES: BugChallenge[] = [
  {
    code: [
      'function calculateSum(a, b) {',
      '  const result = a + b',
      '  return result',
      '}',
      '',
      'console.log(calculateSum(3, 4))',
    ],
    errorLine: 1,
    fixLabel: 'Missing semicolon on line 2',
    explanation: 'SyntaxError: Missing semicolon after statement. Add ";" at the end of line 2.',
  },
  {
    code: [
      'const numbers = [1, 2, 3, 4, 5]',
      'const doubled = numbers.map((n) => {',
      '  return n * 2',
      '})',
      '',
      'console.log(doubled)',
    ],
    errorLine: -1,
    fixLabel: 'No error — code is correct',
    explanation: 'All checks pass. The code runs without errors.',
  },
  {
    code: [
      'const PI = 3.14',
      'PI = 3.14159',
      '',
      'function getArea(r) {',
      '  return PI * r * r',
      '}',
    ],
    errorLine: 1,
    fixLabel: 'Cannot reassign a const variable',
    explanation: 'TypeError: Assignment to constant variable. Use "let" instead of "const" for PI.',
  },
  {
    code: [
      'function greet(name) {',
      '  console.log("Hello, " + name)',
      '}',
      '',
      'greet("World")',
      'greet(42)',
    ],
    errorLine: -1,
    fixLabel: 'No error — code is correct',
    explanation: 'All checks pass. The code runs without errors (JS is loosely typed).',
  },
];

interface CodeDebugProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export function CodeDebug({ onComplete, isCompleted }: CodeDebugProps) {
  const [challenge] = useState<BugChallenge>(() => {
    const idx = Math.floor(Math.random() * CHALLENGES.length);
    return CHALLENGES[idx]!;
  });
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = useCallback(() => {
    if (selectedLine === null) return;
    setSubmitted(true);

    const isCorrect =
      (challenge.errorLine === -1 && selectedLine === -1) ||
      selectedLine === challenge.errorLine;

    if (isCorrect) {
      setShowSuccess(true);
      setTimeout(() => onComplete(), 1500);
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSubmitted(false);
        setSelectedLine(null);
      }, 1000);
    }
  }, [selectedLine, challenge, onComplete]);

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
        <h2 className="text-neon font-game text-sm mb-3">BUILD SUCCESSFUL</h2>
        <p className="text-gray-400 font-mono text-xs">System debug complete. All checks passed.</p>
        <p className="text-neon font-mono text-xs mt-4">Key Fragment #3 acquired</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-dark/95 border border-neon/30 rounded-lg p-6 max-w-lg w-full mx-4">
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-2 h-2 rounded-full bg-neon animate-blink" />
          <h2 className="text-neon font-game text-xs tracking-wider">CODE DEBUG — BUILD FAILURE</h2>
        </div>
        <p className="text-gray-500 font-mono text-xs">
          System build failed. Click the line containing the error (or "No error" if the code is correct).
        </p>
      </div>

      <div className="bg-black/60 border border-gray-700 rounded p-4 mb-4 font-mono text-xs leading-relaxed overflow-x-auto">
        {challenge.code.map((line, i) => {
          const lineNum = i;
          const isErrorLine = challenge.errorLine === lineNum;
          const isSelected = selectedLine === lineNum;
          return (
            <motion.div
              key={i}
              className={`flex cursor-pointer transition-colors rounded px-1 ${
                isSelected
                  ? 'bg-red-900/40 border-l-2 border-red-500'
                  : isErrorLine && submitted
                    ? 'bg-red-900/20'
                    : 'hover:bg-white/5'
              }`}
              onClick={() => !submitted && setSelectedLine(lineNum)}
              whileHover={!submitted ? { x: 2 } : {}}
            >
              <span className="text-gray-600 w-6 flex-shrink-0 select-none">{i + 1}</span>
              <span className={`whitespace-pre ${isErrorLine && submitted ? 'text-red-400' : 'text-gray-300'}`}>
                {line || ' '}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        className={`w-full px-4 py-2 rounded font-mono text-xs border transition-colors mb-3 ${
          selectedLine === -1
            ? 'bg-green-900/20 border-green-500/50 text-green-400'
            : selectedLine !== null
              ? 'bg-neon/20 border-neon/50 text-neon'
              : 'bg-dark/50 border-gray-700 text-gray-500 cursor-not-allowed'
        }`}
        onClick={() => !submitted && setSelectedLine(-1)}
        disabled={submitted}
        whileHover={!submitted && selectedLine !== -1 ? { scale: 1.01 } : {}}
      >
        No error — code is correct
      </motion.button>

      {showError && (
        <motion.p
          className="text-red-400 font-mono text-xs text-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Incorrect — try again.
        </motion.p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-gray-600 font-mono text-xs">
          {selectedLine !== null && selectedLine !== -1
            ? `Selected: Line ${selectedLine + 1}`
            : selectedLine === -1
              ? 'Selected: No error'
              : 'Click a line to mark the error'}
        </span>
        <motion.button
          className={`px-6 py-2 rounded font-mono text-xs transition-colors ${
            selectedLine === null
              ? 'bg-dark/50 border border-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-neon/20 border border-neon/50 text-neon hover:bg-neon/30'
          }`}
          onClick={handleSubmit}
          disabled={selectedLine === null || submitted}
          whileTap={selectedLine !== null && !submitted ? { scale: 0.97 } : {}}
        >
          [ Verify Fix ]
        </motion.button>
      </div>
    </div>
  );
}
