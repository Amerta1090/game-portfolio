import { useEffect } from 'react';
import { useGameStore } from '../../game/stores/gameStore';
import { audioManager } from '../../utils/audio';

export function GameBoot() {
  const setScreen = useGameStore((s) => s.setScreen);

  useEffect(() => {
    setScreen('lobby');
    audioManager.init();
    audioManager.playMusic('lobby');
  }, [setScreen]);

  return null;
}
