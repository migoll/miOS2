import React from "react";
import { useSystemStore } from "../stores/systemStore";

export const ConnectionIndicator: React.FC = () => {
  const isOnline = useSystemStore((state) => state.isOnline);

  // Only show when offline
  if (isOnline) return null;

  return (
    <div className="vercel-button p-1 text-xs" title="No internet connection">
      <span className="text-red-500 font-mono">⚠️</span>
    </div>
  );
};
