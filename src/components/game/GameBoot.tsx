import { useEffect } from 'react';
import { Vector3 } from 'three';
import { useGameStore } from '../../game/stores/gameStore';
import { usePlayerStore } from '../../game/stores/playerStore';
import { audioManager } from '../../utils/audio';

export function GameBoot() {
  const setScreen = useGameStore((s) => s.setScreen);
  const moveTo = usePlayerStore((s) => s.moveTo);
  const rotateTo = usePlayerStore((s) => s.rotateTo);

  useEffect(() => {
    moveTo(new Vector3(0, 0, 0));
    rotateTo(0);
    setScreen('lobby');
    audioManager.init();
    audioManager.playMusic('lobby');
  }, [setScreen, moveTo, rotateTo]);

  return null;
}
