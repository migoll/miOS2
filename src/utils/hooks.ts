import { useCallback } from 'react';
import { soundManager } from './soundManager';
import type { SoundName } from '../types/index.js';
import { useSystemStore } from '../stores/systemStore';

export const useSound = () => {
  const settings = useSystemStore((state) => state.settings);
  
  const playSound = useCallback((soundName: SoundName) => {
    if (settings.uiPreferences.soundsEnabled && !settings.isMuted) {
      soundManager.setVolume(settings.volume);
      soundManager.play(soundName);
    }
  }, [settings.uiPreferences.soundsEnabled, settings.isMuted, settings.volume]);

  return { playSound };
};

export const useDraggable = (onDrag: (delta: { x: number; y: number }) => void) => {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      onDrag({ x: deltaX, y: deltaY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDrag]);

  return { onMouseDown: handleMouseDown };
};