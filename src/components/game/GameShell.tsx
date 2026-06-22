import { HUD } from '../ui/HUD';
import { InteractionPrompt } from '../ui/InteractionPrompt';
import { DialogOverlay } from '../ui/DialogOverlay';
import { TransitionOverlay } from '../ui/TransitionOverlay';

export function GameShell() {
  return (
    <>
      <HUD />
      <InteractionPrompt />
      <DialogOverlay />
      <TransitionOverlay />
    </>
  );
}
