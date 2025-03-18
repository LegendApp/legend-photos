import { Motion } from '@legendapp/motion';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';
import { useRef } from 'react';
import { Animated } from 'react-native';
import { useOnHotkeys } from './Keyboard';
import { KeyCodes } from './KeyboardManager';
import { PhotosView } from './PhotosView';
import { state$ } from './State';
import { PluginRenderer } from './plugins';
import { settings$ } from './settings/SettingsFile';

const SpringOpen = {
  type: 'spring',
  bounciness: 3,
  speed: 36,
} as const;

const SpringClose = {
  type: 'spring',
  bounciness: 2,
  speed: 36,
} as const;

export function PhotosViewContainer() {
  const sidebarWidth = useSelector(
    () => (settings$.state.isSidebarOpen.get() && settings$.state.sidebarWidth.get()) || 0
  );

  useOnHotkeys({
    [KeyCodes.KEY_S]: () => {
      const selectedFolder = settings$.state.openFolder.get();

      if (selectedFolder && !state$.fullscreenPhoto.get()) {
        settings$.state.isSidebarOpen.toggle();
      }
    },
  });

  return (
    <Motion.View
      className="absolute top-0 bottom-0 right-0"
      initial={{ left: sidebarWidth }}
      animate={{ left: sidebarWidth }}
      transition={sidebarWidth > 0 ? SpringOpen : SpringClose}
    >
      <PhotosView />

      {/* Plugins for the photosGrid location */}
      <PluginRenderer location="photosGrid" className="absolute top-4 right-4" />
    </Motion.View>
  );
}
