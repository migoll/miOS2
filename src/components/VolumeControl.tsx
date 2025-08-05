import React, { useState, useRef, useEffect } from "react";
import { useSystemStore } from "../stores/systemStore";
import { useSound } from "../utils/hooks";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";

export const VolumeControl: React.FC = () => {
  const [showSlider, setShowSlider] = useState(false);
  const settings = useSystemStore((state) => state.settings);
  const toggleMute = useSystemStore((state) => state.toggleMute);
  const setVolume = useSystemStore((state) => state.setVolume);
  const { playSound } = useSound();
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlRef.current &&
        !controlRef.current.contains(event.target as Node)
      ) {
        setShowSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleVolumeClick = () => {
    console.log("Volume button clicked, showSlider:", showSlider);
    console.log("Current settings:", settings);

    if (showSlider) {
      // If slider is open, clicking the button toggles mute
      console.log("Toggling mute, current state:", settings.isMuted);
      toggleMute();
      playSound("click");
    } else {
      // If slider is closed, clicking opens the slider
      console.log("Opening slider");
      setShowSlider(true);
      playSound("menu_open");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const getVolumeIcon = () => {
    if (settings.isMuted || settings.volume === 0) {
      return <HiVolumeOff className="w-4 h-4" />;
    } else {
      return <HiVolumeUp className="w-4 h-4" />;
    }
  };

  return (
    <div ref={controlRef} className="relative">
      {/* Volume Icon */}
      <button
        className="vercel-button p-1 text-xs transition-all duration-150 relative z-10"
        onClick={handleVolumeClick}
        title={
          showSlider
            ? settings.isMuted
              ? "Unmute"
              : "Mute"
            : "Click to adjust volume"
        }
      >
        {getVolumeIcon()}
      </button>

      {/* Volume Slider - appears beneath the icon on click */}
      {showSlider && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 vercel-panel p-3 rounded shadow-lg">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={settings.isMuted ? 0 : settings.volume}
            onChange={handleSliderChange}
            onInput={handleSliderChange}
            className="w-24"
            style={{
              height: "4px",
              background: settings.isMuted
                ? "rgba(153, 153, 153, 0.3)"
                : `linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) ${
                    settings.volume * 100
                  }%, rgba(153, 153, 153, 0.3) ${
                    settings.volume * 100
                  }%, rgba(153, 153, 153, 0.3) 100%)`,
              WebkitAppearance: "none",
              appearance: "none",
              outline: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          />
        </div>
      )}
    </div>
  );
};
