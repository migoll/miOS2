import React from 'react';
import { useWindowStore } from '../stores/windowStore';
import { Window } from './Window';

export const WindowManager: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);

  return (
    <>
      {windows
        .filter(window => window.isOpen && !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((window) => (
          <Window key={window.id} window={window} />
        ))}
    </>
  );
};