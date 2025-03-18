import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { useRef } from 'react';
import { Animated, View } from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { PhotosView } from './PhotosView';
import { state$ } from './State';
import { PluginRenderer } from './plugins';
import { settings$ } from './settings/SettingsFile';

const SpringOpen = {
  bounciness: 3,
  speed: 36,
};

const SpringClose = {
  bounciness: 2,
  speed: 36,
};

export function PhotosViewContainer() {
  const selectedFolder = useSelector(settings$.state.openFolder);
  const animatedWidth = useRef(new Animated.Value(160)).current;

  useOnHotkeys({
    [KeyCodes.KEY_S]: () => {
      if (selectedFolder && !state$.fullscreenPhoto.get()) {
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
    <Animated.View className="absolute top-0 bottom-0 right-0" style={{ left: animatedWidth }}>
      <PhotosView selectedFolder={selectedFolder} />

      {/* Plugins for the photosGrid location */}
      <PluginRenderer location="photosGrid" className="absolute top-4 right-4" />
    </Animated.View>
  );
}
