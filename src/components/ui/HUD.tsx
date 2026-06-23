import { useGameStore } from '../../game/stores/gameStore';
import { useProgressStore } from '../../game/stores/progressStore';
import { ROOM_NAMES, TOTAL_FRAGMENTS } from '../../game/constants';

function FragmentDisplay() {
  const fragments = useProgressStore((s) => s.fragments);
  return (
    <div className="flex gap-1.5" aria-label={`${fragments.length} of ${TOTAL_FRAGMENTS} key fragments collected`}>
      {Array.from({ length: TOTAL_FRAGMENTS }).map((_, i) => (
        <span
          key={i}
          className={`text-base inline-flex items-center justify-center w-5 h-5 rounded-sm border ${
            i < fragments.length
              ? 'text-neon border-neon/50 bg-neon/10 shadow-[0_0_6px_rgba(255,215,0,0.2)]'
              : 'text-gray-700 border-gray-800'
          }`}
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
    <div className="fixed inset-0 pointer-events-none z-40" role="status" aria-label="Game HUD">
      {/* Top bar with yellow bottom border */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-dark/80 border-b-2 border-neon/30">
        <span className="text-neon font-game text-xs tracking-wider">RIDWAN.EXE</span>
        <span className="text-white font-mono text-sm" aria-label={`Current room: ${activeRoom ? ROOM_NAMES[activeRoom] ?? activeRoom : 'Lobby'}`}>
          {activeRoom ? ROOM_NAMES[activeRoom] ?? activeRoom : 'Lobby'}
        </span>
        <FragmentDisplay />
      </div>
      {/* Bottom bar with yellow top border */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-dark/50 border-t-2 border-neon/20 text-center">
        <span className="text-gray-500 font-mono text-xs" aria-label="Controls: WASD to move, E to interact, ESC to pause">
          WASD Move | E Interact | ESC Pause
        </span>
      </div>
    </div>
  );
}
