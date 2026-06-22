import { useGameStore } from '../../game/stores/gameStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { ROOM_NAMES, TOTAL_FRAGMENTS } from '../../game/constants';

function FragmentDisplay() {
  const fragments = useProgressStore((s) => s.fragments);
  return (
    <div className="flex gap-1" aria-label={`${fragments.length} of ${TOTAL_FRAGMENTS} key fragments collected`}>
      {Array.from({ length: TOTAL_FRAGMENTS }).map((_, i) => (
        <span
          key={i}
          className={`text-lg ${i < fragments.length ? 'text-neon' : 'text-gray-700'}`}
        >
          ⬡
        </span>
      ))}
    </div>
  );
}

export function HUD() {
  const screen = useGameStore((s) => s.screen);
  const activeRoom = useGameStore((s) => s.activeRoom);

  if (screen === 'title') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-dark/80" role="status" aria-live="polite">
        <span className="text-neon font-game text-xs tracking-wider">RIDWAN.EXE</span>
        <span className="text-white font-mono text-sm">
          {activeRoom ? ROOM_NAMES[activeRoom] ?? activeRoom : 'Lobby'}
        </span>
        <FragmentDisplay />
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-dark/50 text-center">
        <span className="text-gray-500 font-mono text-xs">
          WASD Move | E Interact | ESC Pause
        </span>
      </div>
    </div>
  );
}
