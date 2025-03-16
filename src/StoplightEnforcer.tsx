import React, { Pressable, StyleSheet } from 'react-native';
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
      style={styles.stoplight}
      onPointerMove={onHover}
      onHoverIn={onHover}
      onHoverOut={onHoverLeave}
    />
  );
}

const styles = StyleSheet.create({
  stoplight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 26,
    zIndex: 1000,
  },
});
