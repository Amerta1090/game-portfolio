import { useEffect, useRef } from 'react';

type KeyMap = Record<string, boolean>;

const keyState: KeyMap = {};

export function useKeyboard() {
  const keysRef = useRef<KeyMap>(keyState);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      keyState[e.code] = true;
    }

    function handleKeyUp(e: KeyboardEvent) {
      keyState[e.code] = false;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keysRef;
}

export function isKeyDown(code: string): boolean {
  return keyState[code] ?? false;
}
