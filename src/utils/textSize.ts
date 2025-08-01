import { useSystemStore } from '../stores/systemStore';

export const useTextSize = () => {
  const textSize = useSystemStore((state) => state.settings.uiPreferences.textSize);
  
  const getTextSizeClass = (baseSize?: string) => {
    const sizes = {
      small: 'text-xs',   // 12px
      medium: 'text-sm',  // 14px  
      large: 'text-base', // 16px
      giga: 'text-xl',    // 20px
    };
    return sizes[textSize];
  };
  
  const getIconTextSizeClass = () => {
    const sizes = {
      small: 'text-xs',   // 12px for icon labels
      medium: 'text-sm',  // 14px  
      large: 'text-base', // 16px
      giga: 'text-lg',    // 18px (slightly smaller for icons)
    };
    return sizes[textSize];
  };
  
  return { textSize, getTextSizeClass, getIconTextSizeClass };
};