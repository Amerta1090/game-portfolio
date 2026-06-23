import { useState, useEffect } from 'react';
import { isWebGLAvailable, isSmallViewport } from '../../utils/webgl';

export function EdgeCaseHandler({ children }: { children: React.ReactNode }) {
  const [webglOk, setWebglOk] = useState(true);
  const [viewportOk, setViewportOk] = useState(true);

  useEffect(() => {
    setWebglOk(isWebGLAvailable());
    setViewportOk(!isSmallViewport());

    function handleResize() {
      setViewportOk(!isSmallViewport());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!webglOk) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark p-8 text-center" role="alert">
        <h1 className="text-neon font-game text-xl tracking-wider mb-4">RIDWAN.EXE</h1>
        <p className="text-gray-400 font-mono text-sm mb-2">
          WebGL is not available in your browser.
        </p>
        <p className="text-gray-500 font-mono text-xs">
          This game requires WebGL to render 3D graphics.
        </p>
        <a href="/resume" className="mt-6 text-neon font-mono text-sm hover:text-white transition-colors underline">
          View text-based resume instead
        </a>
      </div>
    );
  }

  if (!viewportOk) {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark p-8 text-center" role="alert">
        <h1 className="text-neon font-game text-xl tracking-wider mb-4">RIDWAN.EXE</h1>
        <p className="text-gray-400 font-mono text-sm mb-2">
          Your viewport is too small.
        </p>
        <p className="text-gray-500 font-mono text-xs">
          Please use a larger screen or window (minimum 640x480).
        </p>
        <a href="/resume" className="mt-6 text-neon font-mono text-sm hover:text-white transition-colors underline">
          View text-based resume instead
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
