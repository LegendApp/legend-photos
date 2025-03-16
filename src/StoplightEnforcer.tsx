import React, { Pressable } from 'react-native';
import { state$ } from './State';

export function StoplightEnforcer() {
  const onHover = () => {
    state$.stoplightEnforcerHovered.set(true);
  };

  const onHoverLeave = () => {
    state$.stoplightEnforcerHovered.set(false);
  };

  return (
    <Pressable
      className="absolute top-0 left-0 right-0 h-[26px] z-[1000]"
      onPointerMove={onHover}
      onHoverIn={onHover}
      onHoverOut={onHoverLeave}
    />
  );
}
