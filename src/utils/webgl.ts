export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const key = '__test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getViewportSize(): { width: number; height: number } {
  return { width: window.innerWidth, height: window.innerHeight };
}

export function isSmallViewport(): boolean {
  return window.innerWidth < 640 || window.innerHeight < 480;
}
