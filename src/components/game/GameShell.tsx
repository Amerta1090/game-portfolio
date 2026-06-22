import { HUD } from '../ui/HUD';
import { InteractionPrompt } from '../ui/InteractionPrompt';
import { DialogOverlay } from '../ui/DialogOverlay';
import { TransitionOverlay } from '../ui/TransitionOverlay';
import { PauseMenu } from '../ui/PauseMenu';

export function GameShell() {
  return (
    <>
      <HUD />
      <InteractionPrompt />
      <DialogOverlay />
      <TransitionOverlay />
      <PauseMenu />
    </>
  );
}
