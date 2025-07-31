import React from 'react';
import { useDesktopStore } from '../stores/desktopStore';

export const SelectionRectangle: React.FC = () => {
  const selectionRectangle = useDesktopStore((state) => state.selectionRectangle);

  if (!selectionRectangle.isActive) return null;

  const left = Math.min(selectionRectangle.startPosition.x, selectionRectangle.currentPosition.x);
  const top = Math.min(selectionRectangle.startPosition.y, selectionRectangle.currentPosition.y);
  const width = Math.abs(selectionRectangle.currentPosition.x - selectionRectangle.startPosition.x);
  const height = Math.abs(selectionRectangle.currentPosition.y - selectionRectangle.startPosition.y);

  return (
    <div
      className="fixed pointer-events-none border border-aqua-blue bg-aqua-light/10 z-50"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
};