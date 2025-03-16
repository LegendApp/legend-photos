import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { PhotosView } from './PhotosView';
import { state$ } from './State';

const SpringOpen = {
  bounciness: 3,
  speed: 36,
};

const SpringClose = {
  bounciness: 2,
  speed: 36,
};

export function PhotosViewContainer() {
  const selectedFolder = useSelector(state$.selectedFolder);
  const animatedWidth = useRef(new Animated.Value(160)).current;

  useOnHotkeys({
    [KeyCodes.KEY_S]: () => {
      if (state$.selectedFolder.get() && !state$.fullscreenPhoto.get()) {
        state$.isSidebarOpen.toggle();

        const isOpen = state$.isSidebarOpen.get();
        const width = state$.sidebarWidth.get();

        Animated.spring(animatedWidth, {
          toValue: isOpen ? width : 0,
          useNativeDriver: false,
          ...(isOpen ? SpringOpen : SpringClose),
        }).start();
      }
    },
  });

  return (
    <Animated.View style={[styles.mainContent, { left: animatedWidth }]}>
      <PhotosView selectedFolder={selectedFolder} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
});
