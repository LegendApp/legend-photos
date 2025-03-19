import { useRef } from 'react';

interface UseOnDoubleClickParams {
  onClick?: () => void;
  onDoubleClick: () => void;
}

const DOUBLE_PRESS_DELAY = 300;

export function useOnDoubleClick({ onClick, onDoubleClick }: UseOnDoubleClickParams) {
  const refLastTap = useRef<number>(0);

  const handlePress = () => {
    const now = Date.now();

    if (now - refLastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap detected
      onDoubleClick();
    } else {
      onClick?.();
    }

    refLastTap.current = now;
  };

  return handlePress;
}
