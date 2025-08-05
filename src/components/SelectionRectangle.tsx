import React from "react";
import { useDesktopStore } from "../stores/desktopStore";
import { useSystemStore } from "../stores/systemStore";

export const SelectionRectangle: React.FC = () => {
  const selectionRectangle = useDesktopStore(
    (state) => state.selectionRectangle
  );
  const theme = useSystemStore((state) => state.settings.theme);

  if (!selectionRectangle.isActive) return null;

  const left = Math.min(
    selectionRectangle.startPosition.x,
    selectionRectangle.currentPosition.x
  );
  const top = Math.min(
    selectionRectangle.startPosition.y,
    selectionRectangle.currentPosition.y
  );
  const width = Math.abs(
    selectionRectangle.currentPosition.x - selectionRectangle.startPosition.x
  );
  const height = Math.abs(
    selectionRectangle.currentPosition.y - selectionRectangle.startPosition.y
  );

  // Use darker colors for light mode
  const backgroundColor =
    theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
  const borderColor =
    theme === "light" ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.2)";

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left,
        top,
        width,
        height,
        backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "2px",
      }}
    />
  );
};
