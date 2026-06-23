import { HUD } from '../ui/HUD';
import { InteractionPrompt } from '../ui/InteractionPrompt';
import { DialogOverlay } from '../ui/DialogOverlay';
import { TransitionOverlay } from '../ui/TransitionOverlay';
import { PauseMenu } from '../ui/PauseMenu';
import { EdgeCaseHandler } from '../ui/EdgeCaseHandler';

export function GameShell() {
  return (
    <EdgeCaseHandler>
      <HUD />
      <InteractionPrompt />
      <DialogOverlay />
      <TransitionOverlay />
      <PauseMenu />
    </EdgeCaseHandler>
  );
}
