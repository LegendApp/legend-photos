import { EmptyLibrary } from '@/features/EmptyLibrary';
import { PhotosView } from '@/features/PhotosView';
import { getOpenFolder } from '@/plugin-system/FileSources';
import { PluginRenderer } from '@/plugin-system/registerDefaultPlugins';
import { settings$ } from '@/settings/SettingsFile';
import { state$ } from '@/systems/State';
import { useOnHotkeys } from '@/systems/keyboard/Keyboard';
import { KeyCodes } from '@/systems/keyboard/KeyboardManager';
import { Motion } from '@legendapp/motion';
import { useSelector } from '@legendapp/state/react';
import type React from 'react';

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
  const hasLibrary = useSelector(() => settings$.library.paths.length > 0);

  useOnHotkeys({
    [KeyCodes.KEY_S]: {
      action: () => {
        const selectedFolder = getOpenFolder();

        if (selectedFolder && !state$.fullscreenPhoto.get()) {
          settings$.state.isSidebarOpen.toggle();
        }
      },
      name: 'Sidebar',
      description: 'Toggle sidebar visibility',
      keyText: 'S',
    },
  });

  return (
    <Motion.View
      className="absolute top-0 bottom-0 right-0"
      initial={{ left: sidebarWidth }}
      animate={{ left: sidebarWidth }}
      transition={sidebarWidth > 0 ? SpringOpen : SpringClose}
    >
      {hasLibrary ? <PhotosView /> : <EmptyLibrary />}

      {/* Plugins for the photosGrid location */}
      <PluginRenderer location="photosGrid" className="absolute top-4 right-4" />
    </Motion.View>
  );
}
