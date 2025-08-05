import { useCallback } from "react";
import type { SoundName } from "../types/index.js";

export const useSound = () => {
  const playSound = useCallback((_soundName: SoundName) => {
    // Temporarily disabled all sounds
    return;
  }, []);

  return { playSound };
};

export const useDraggable = (
  onDrag: (delta: { x: number; y: number }) => void
) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        onDrag({ x: deltaX, y: deltaY });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [onDrag]
  );

  return { onMouseDown: handleMouseDown };
};
